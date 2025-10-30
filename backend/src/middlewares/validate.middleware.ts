import type { Request, Response, NextFunction } from "express";
import type { Schema } from "joi";
import AppError from "../lib/AppError.js";

export const validateRequest = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.body) req.body = {};
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      presence: "required",
    });

    if (error) {
      const message = error.details
        .map((d) => d.message.replace(/"/g, ""))
        .join(", ");
      return next(new AppError(message, 400));
    }
    next();
  };
};
