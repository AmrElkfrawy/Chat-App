import express from "express";
import type { Request, Response, NextFunction } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "success" });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
