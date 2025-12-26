import express from "express";
import AppError from "./lib/AppError.js";
import { connectDB } from "./lib/db.js";
import globalErrorHandler from "./middlewares/error.middleware.js";
import apiRouter from "./routes/index.js";
import { ENV } from "./lib/env.js";
import cookieParser from "cookie-parser";
import winston from "winston";
import rateLimit from "express-rate-limit";

const app = express();
const PORT = ENV.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// add rate limiting
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: {
    status: "fail",
    message: "Too many requests from this IP, please try again after an hour",
  },
});
app.use("/api/", limiter);

// server static files
app.use(express.static("public"));

// add file logs with winston
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.File({ filename: "logs/logs.log" })],
});
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Mounting routes
app.use("/api/", apiRouter);

// Fallback
app.all("/{*any}", (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
});

// Error Middleware
app.use(globalErrorHandler);

// Connect to DB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
