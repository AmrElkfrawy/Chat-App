import jwt from "jsonwebtoken";
import AppError from "../lib/AppError.js";
import asyncHandler from "../lib/asyncHandler.js";
import User from "../models/User.js";

import type { NextFunction, Request, Response } from "express";
import type { Secret, SignOptions } from "jsonwebtoken";

import { ENV } from "../lib/env.js";

/**
 * Generate a JWT token and set it as a cookie
 * @param userId
 * @param res
 * @returns void
 */
function generateToken(userId: String, res: Response): void {
  const token = jwt.sign(
    { id: userId },
    ENV.JWT_SECRET as Secret,
    { expiresIn: ENV.JWT_EXPIRES_IN } as SignOptions
  );

  const cookieOptions = {
    maxAge: parseInt(ENV.JWT_COOKIE_EXPIRES_IN as string) * 24 * 60 * 60 * 1000,
    httpOnly: true, // prevent client-side JS from reading the cookie XSS
    sameSite: "strict" as const, // CSRF protection

    // secure: ENV.NODE_ENV === "production", // send cookie only over HTTPS
  };

  res.cookie("jwt", token, cookieOptions);
}

/**
 * User registration controller
 * @param req
 * @param res
 * @param next
 * @return Newly created user data along with JWT token in cookie
 */
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, email, password } = req.body;
    const newUser = await User.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password: password,
    });
    if (!newUser) {
      return next(new AppError("User registration failed", 500));
    }

    generateToken(newUser._id.toString(), res);

    return res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  }
);

/**
 * User login controller
 * @param req
 * @param res
 * @param next
 * @return Logged in user data along with JWT token in cookie
 */
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    generateToken(user._id.toString(), res);

    return res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }
);

/**
 * User logout controller
 * @param req
 * @param res
 * @param next
 * @return Success message
 */
export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
    });

    return res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  }
);
