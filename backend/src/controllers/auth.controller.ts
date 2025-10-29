import type { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import asyncHandler from "../lib/asyncHandler.js";
import AppError from "../lib/AppError.js";
import jwt from "jsonwebtoken";

function generateToken(userId: string, res: Response): void {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN as string,
  });

  const cookieOptions = {
    maxAge:
      parseInt(process.env.JWT_COOKIE_EXPIRES_IN as string) *
      24 *
      60 *
      60 *
      1000,
    httpOnly: true, // prevent client-side JS from reading the cookie XSS
    sameSite: "strict" as const, // CSRF protection

    // secure: process.env.NODE_ENV === "production", // send cookie only over HTTPS
  };

  res.cookie("jwt", token, cookieOptions);
}

export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, email, password } = req.body;
    const newUser = await User.create({ fullName, email, password });
    if (!newUser) {
      return next(new AppError("User registration failed", 500));
    }

    generateToken(newUser._id, res);

    return res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  }
);
