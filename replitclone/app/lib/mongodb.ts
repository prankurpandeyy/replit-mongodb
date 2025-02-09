import mongoose, { Schema, Model, Connection } from "mongoose";
import { IFile } from "../types";

// Define mongoose connection URI
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached: {
  conn: Connection | null;
  promise: Promise<Connection> | null;
} = { conn: null, promise: null };

export async function connectDB(): Promise<Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!).then((mongoose) => {
      return mongoose.connection;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Define the schema for the file model
const fileSchema = new Schema<IFile>(
  {
    name: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Export the File model with type safety
export const File = (mongoose.models.File ||
mongoose.model<IFile>("File", fileSchema)) as Model<IFile>;
