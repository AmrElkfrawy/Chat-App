import asyncHandler from "../lib/asyncHandler.js";
import type { Request, Response } from "express";

export const getAll = (Model: any) =>
  asyncHandler(async (req: Request, res: Response) => {
    const documents = await Model.find();
    return res.status(200).json({
      status: "success",
      length: documents.length,
      data: documents,
    });
  });
