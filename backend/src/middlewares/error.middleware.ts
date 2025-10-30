import type { Request, Response, NextFunction } from "express";
import AppError from "../lib/AppError.js";
import { ENV } from "../lib/env.js";

/**
 * Handles Mongoose CastError (invalid _id or similar)
 * @param err
 * @returns new AppError
 */
const handleCastErrorDB = (err: any): AppError => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

/**
 * Handles duplicate field error (e.g., email already exists)
 * @param err
 * @returns new AppError
 */
const handleDuplicateFieldsDB = (err: any): AppError => {
  try {
    const duplicatedFields: string[] = [];

    for (const key in err.keyValue) {
      if (err.keyPattern?.hasOwnProperty(key)) {
        duplicatedFields.push(key);
      }
    }

    let message = "";
    if (duplicatedFields.length === 1) {
      message = `This ${duplicatedFields[0]} already exists.`;
    } else if (duplicatedFields.length > 1) {
      message = "You already posted a review for this entity.";
    }

    return new AppError(message, 409);
  } catch {
    return new AppError("Something went wrong", 500);
  }
};

/**
 * Handles Mongoose validation errors
 * @param err
 * @returns new AppError
 */
const handleValidationErrorDB = (err: any): AppError => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

/**
 * Handles JWT errors
 * @returns new AppError
 */
const handleJWTError = (): AppError =>
  new AppError("Invalid token. Please log in again.", 401);

const handleJWTExpiredError = (): AppError =>
  new AppError("Your token has expired! Please log in again.", 401);

/**
 * Handles errors in development
 * @param err
 * @param req
 * @param res
 * @returns Detailed error response in development
 */
const sendErrorDev = (err: any, req: Request, res: Response) => {
  return res.status(err.statusCode || 500).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

/** Handles errors in production
 * @param err
 * @param req
 * @param res
 * @returns Minimal error response in production
 */
const sendErrorProd = (err: any, req: Request, res: Response) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Unexpected / programming errors
  console.error("Unknown Error:", err);

  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
};

/**
 * Global error handler middleware orchestrating error handling
 * @param err
 * @param req
 * @param res
 * @param next
 */
const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (ENV.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (ENV.NODE_ENV === "production") {
    let error = { ...err, message: err.message };

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (
      error._message === "User validation failed" ||
      error.name === "ValidationError"
    )
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};

export default globalErrorHandler;
