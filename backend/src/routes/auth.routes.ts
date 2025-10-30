import { Router } from "express";

import { login, register, logout } from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

const router = Router();

router.post("/login", validateRequest(loginSchema), login);

router.post("/register", validateRequest(registerSchema), register);

router.post("/logout", logout);

export default router;
