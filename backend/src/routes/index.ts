import { Router } from "express";

// routes
import authRouter from "./auth.routes.js";
import userRouter from "./message.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);

export default router;
