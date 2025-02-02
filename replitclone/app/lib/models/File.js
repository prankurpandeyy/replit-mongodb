import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // MongoDB default _id
    name: { type: String, required: true }, // Removed unique constraint
    content: { type: String, required: true },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

export default mongoose.models.File || mongoose.model("File", fileSchema);
