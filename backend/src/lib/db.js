import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(  "mongodb+srv://kashyapom9968:IeJsFDtNX2xg8Ywy@cluster0.h32leeu.mongodb.net/pingME");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error in connecting to MongoDB", error);
    process.exit(1); // 1 means failure
  }
};