import { Router } from "express";

import {
  login,
  logout,
  register,
  updateProfile,
  updateProfilePicture,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from "../validators/auth.validator.js";

import upload from "../lib/multer.js";

const router = Router();

router.post("/login", validateRequest(loginSchema), login);

router.post("/register", validateRequest(registerSchema), register);

router.post("/logout", logout);

router.patch(
  "/update-profile",
  protect,
  validateRequest(updateProfileSchema),
  updateProfile
);

router.use(protect);

router.patch(
  "/update-profile-picture",
  upload.single("profilePic"),
  updateProfilePicture
);

router.get("/check", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "User is authenticated",
    data: { user: req.user },
  });
});

export default router;
