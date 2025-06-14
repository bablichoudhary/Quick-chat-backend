import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECT, {});
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error(" MongoDB connection failed:", error.message);
  }
};

export default dbConnect;
