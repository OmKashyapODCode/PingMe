import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected:`);
  } catch (error) {
    console.log("Error in connecting to MongoDB", error);
    process.exit(1); // 1 means failure
  }
};