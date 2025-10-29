import { Router } from "express";

import type { Request, Response, NextFunction } from "express";
import { register } from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { registerSchema } from "../validators/auth.validator.js";

const router = Router();

router.get("/login", (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({ message: "login" });
});

router.post("/register", validateRequest(registerSchema), register);

export default router;
