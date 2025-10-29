import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUri = process.env?.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URL is not defined in environment variables");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB successfully connected");
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
    process.exit(1);
  }
};
