import { Router } from "express";
import {
  getAllContacts,
  getChatPartners,
  getMessagesByUserId,
  sendMessage,
} from "../controllers/message.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../lib/multer.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { sendMessageSchema } from "../validators/message.validator.js";

const router = Router();

router.use(protect);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMessagesByUserId);
router.post(
  "/send/:id",
  upload.single("image"),
  validateRequest(sendMessageSchema),
  sendMessage
);

export default router;
