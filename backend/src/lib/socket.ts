import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middlewares/socketAuth.middleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ENV.CLIENT_URL,
    credentials: true,
  },
});

// Apply the middleware we fixed in the last step
io.use(socketAuthMiddleware);

// 1. Corrected Naming: userSocketMap
// Using Record<string, string> for TypeScript safety
const userSocketMap: Record<string, string> = {};

/**
 * Helper to get all unique online user IDs
 */
export const getOnlineUsers = () => Object.keys(userSocketMap);

/**
 * Helper to get a specific user's socket ID (used for private messages)
 */
export const getReceiverSocketId = (userId: string) => userSocketMap[userId];

io.on("connection", (socket: any) => {
  // Use AuthenticatedSocket type here
  const userId = socket.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", getOnlineUsers());

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", getOnlineUsers());
  });
});

export { io, server, app };
