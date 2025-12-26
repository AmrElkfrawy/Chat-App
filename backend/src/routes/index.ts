import { Router } from "express";

// routes
import authRouter from "./auth.routes.js";
import messageRouter from "./message.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/messages", messageRouter);

export default router;
