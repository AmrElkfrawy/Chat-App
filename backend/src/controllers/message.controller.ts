import Message from "../models/Message.js";
import User from "../models/User.js";
import AppError from "../lib/AppError.js";

import type { Request, Response, NextFunction } from "express";
import { uploadSingleToCloudinary } from "../lib/cloudinary.js";
import asyncHandler from "../lib/asyncHandler.js";
import APIFeatures from "../lib/ApiFeatures.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

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
      { sort: "createdAt" },
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
    if (receiverId === loggedInUserId) {
      return next(new AppError("Cannot send message to yourself", 400));
    }

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

    const recieverSocketId = getReceiverSocketId(receiverId);
    if (recieverSocketId) {
      io.to(recieverSocketId).emit("newMessage", {
        ...newMessage.toObject(),
      });
    }

    return res.status(201).json({ status: "success", data: newMessage });
  },
);

// export const getChatPartners = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const loggedInUserId = req.user?._id;

//     // Let MongoDB find unique IDs, never loading message content into memory
//     const [senderIds, receiverIds] = await Promise.all([
//       Message.distinct("sender", { receiver: loggedInUserId }),
//       Message.distinct("receiver", { sender: loggedInUserId }),
//     ]);

//     // Merge and deduplicate
//     const partnerIds = [...new Set([...senderIds, ...receiverIds])];

//     const chatPartners = await User.find({
//       _id: { $in: partnerIds },
//     }).select("-password");

//     return res.status(200).json({
//       status: "success",
//       length: chatPartners.length,
//       data: chatPartners,
//     });
//   },
// );

export const getChatPartners = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUserId = req.user?._id;

    const [senderIds, receiverIds] = await Promise.all([
      Message.distinct("sender", { receiver: loggedInUserId }),
      Message.distinct("receiver", { sender: loggedInUserId }),
    ]);

    const partnerIds = [...new Set([...senderIds, ...receiverIds])];

    // For each partner, find the latest message between them and the logged-in user
    const lastMessages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: loggedInUserId, receiver: { $in: partnerIds } },
            { sender: { $in: partnerIds }, receiver: loggedInUserId },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            // Normalize the pair so sender/receiver order doesn't matter
            partner: {
              $cond: [
                { $eq: ["$sender", loggedInUserId] },
                "$receiver",
                "$sender",
              ],
            },
          },
          lastMessage: { $first: "$text" },
          lastMessageAt: { $first: "$createdAt" },
        },
      },
    ]);

    // Build a lookup map for O(1) access
    const lastMessageMap = new Map(
      lastMessages.map((m) => [m._id.partner.toString(), m]),
    );

    const chatPartners = await User.find({
      _id: { $in: partnerIds },
    }).select("-password");

    const data = chatPartners.map((partner) => {
      const meta = lastMessageMap.get(partner._id.toString());
      return {
        ...partner.toObject(),
        lastMessage: meta?.lastMessage ?? null,
        lastMessageAt: meta?.lastMessageAt ?? null,
      };
    });

    // Sort by most recent conversation first
    data.sort((a, b) => {
      if (!a.lastMessageAt) return 1;
      if (!b.lastMessageAt) return -1;
      return (
        new Date(b.lastMessageAt).getTime() -
        new Date(a.lastMessageAt).getTime()
      );
    });

    return res.status(200).json({
      status: "success",
      length: data.length,
      data,
    });
  },
);
