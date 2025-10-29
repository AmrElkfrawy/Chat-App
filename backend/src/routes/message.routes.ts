import { Router } from "express";

import type { Request, Response, NextFunction } from "express";

const router = Router();
router.get("/send", (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({ message: "send" });
});

export default router;
