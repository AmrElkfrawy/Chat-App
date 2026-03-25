import Message from "../models/Message.js";
import User from "../models/User.js";
import AppError from "../lib/AppError.js";

import type { Request, Response, NextFunction } from "express";
import { uploadSingleToCloudinary } from "../lib/cloudinary.js";
import asyncHandler from "../lib/asyncHandler.js";
import APIFeatures from "../lib/ApiFeatures.js";

export const getAllContacts = asyncHandler(
  async (req: Request, res: Response) => {
    const loggedInUserId = req.user?._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password ");

    return res.status(200).json({
      status: "success",
      length: filteredUsers.length,
      data: filteredUsers,
    });
  },
);

export const getMessagesByUserId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = req.user?._id;
    const otherUserId = req.params.id;

    // check if other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return next(new AppError("User not found", 404));
    }

    let query = new APIFeatures(
      Message.find({
        $or: [
          { sender: loggedInUserId, receiver: otherUserId },
          { sender: otherUserId, receiver: loggedInUserId },
        ],
      }).populate("receiver", "fullName profilePic"),
      req.query,
    );

    const messages = await query.filter().sort().paginate().query;

    return res
      .status(200)
      .json({ status: "success", length: messages.length, data: messages });
  },
);

export const sendMessage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = req.user?._id;
    const receiverId = req.params.id;
    const { text = null } = req.body;

    if (!text && !req.file) {
      return next(new AppError("Message text or image is required", 400));
    }
    let image: string | null = null;
    if (req.file) {
      const uploadResult = await uploadSingleToCloudinary(req.file.buffer, {
        public_id: `${loggedInUserId}_to_${receiverId}_${Date.now()}`,
        folder: "messages",
        transformation: [{ quality: 80 }],
      });
      image = uploadResult.secure_url;
    }
    // check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return next(new AppError("Receiver not found", 404));
    }

    const newMessage = await Message.create({
      sender: loggedInUserId,
      receiver: receiverId,
      text,
      image,
    });
    return res.status(201).json({ status: "success", data: newMessage });
  },
);

export const getChatPartners = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = req.user?._id;

    // Let MongoDB find unique IDs, never loading message content into memory
    const [senderIds, receiverIds] = await Promise.all([
      Message.distinct("sender", { receiver: loggedInUserId }),
      Message.distinct("receiver", { sender: loggedInUserId }),
    ]);

    // Merge and deduplicate
    const partnerIds = [...new Set([...senderIds, ...receiverIds])];

    const chatPartners = await User.find({
      _id: { $in: partnerIds },
    }).select("-password");

    return res.status(200).json({
      status: "success",
      length: chatPartners.length,
      data: chatPartners,
    });
  },
);
