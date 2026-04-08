import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

// Remove Express NextFunction, use Socket's type or just define it
export const socketAuthMiddleware = async (
  socket: any,
  next: (err?: Error) => void,
) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;

    if (!cookieHeader) {
      return next(new Error("Authentication error: No cookies found"));
    }

    const token = cookieHeader
      .split("; ")
      .find((row: string) => row.trim().startsWith("jwt="))
      ?.split("=")[1];

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    // Verify token
    const decoded = jwt.verify(token, ENV.JWT_SECRET as string) as {
      id: string;
    };

    if (!decoded || !decoded.id) {
      return next(new Error("Authentication error: Invalid token"));
    }

    // Find user by ID
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }

    // Attach user to socket
    socket.user = user;
    socket.userId = user._id.toString();

    next(); // Move to io.on("connection")
  } catch (error) {
    console.error("❌ Socket Auth Error:", error);
    next(new Error("Authentication error: Token verification failed"));
  }
};
