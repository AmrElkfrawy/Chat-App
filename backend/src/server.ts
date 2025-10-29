import express from "express";
import dotenv from "dotenv";

import apiRouter from "./routes/index.js";
import { connectDB } from "./lib/db.js";
import globalErrorHandler from "./middlewares/error.middleware.js";
import AppError from "./lib/AppError.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
  connectDB();
});
