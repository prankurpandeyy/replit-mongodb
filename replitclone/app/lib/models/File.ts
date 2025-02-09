// import mongoose from "mongoose";

// const fileSchema = new mongoose.Schema(
//   {
//     _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // MongoDB default _id
//     name: { type: String, required: true }, // Removed unique constraint
//     content: { type: String, required: true },
//   },
//   { timestamps: true } // Automatically adds createdAt & updatedAt
// );

// export default mongoose.models.File || mongoose.model("File", fileSchema);
import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for the file document
interface IFile extends Document {
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema for the file model
const fileSchema = new Schema<IFile>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true }, // MongoDB default _id
    name: { type: String, required: true }, // Removed unique constraint
    content: { type: String, required: true },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

// Export the File model with type safety
const File: Model<IFile> =
  mongoose.models.File || mongoose.model<IFile>("File", fileSchema);

export default File;
