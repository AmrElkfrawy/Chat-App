import express from "express";
import AppError from "./lib/AppError.js";
import { connectDB } from "./lib/db.js";
import globalErrorHandler from "./middlewares/error.middleware.js";
import apiRouter from "./routes/index.js";
import { ENV } from "./lib/env.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = ENV.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

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
