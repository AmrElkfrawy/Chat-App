import asyncHandler from "../lib/asyncHandler.js";
import type { Request, Response, NextFunction } from "express";
import type { Secret } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AppError from "../lib/AppError.js";
import { ENV } from "../lib/env.js";

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    // Check for token in cookies
    if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    // If no token, return error
    if (!token) {
      return next(new AppError("You are not logged in", 401));
    }

    // Verify token
    const decoded = jwt.verify(token, ENV.JWT_SECRET as Secret) as JwtPayload;
    if (!decoded) {
      return next(new AppError("Invalid token", 401));
    }

    // Find user by ID
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Attach user to request
    req.user = user;
    next();
  }
);
