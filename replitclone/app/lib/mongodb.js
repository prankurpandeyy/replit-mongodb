import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI; // Use the correct variable

if (!MONGODB_URI) {
  throw new Error("⚠️ MONGODB_URI is not defined in .env.local");
}

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return; // Already connected

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;
