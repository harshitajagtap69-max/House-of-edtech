import mongoose, { Document, Schema } from "mongoose";

export interface INote extends Document {
  title: string;
  content: string;
  subject: string;
  userId: mongoose.Types.ObjectId;
  tags: string[];
  aiSummary?: string;
  aiKeyPoints?: string[];
  aiQuestions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      maxlength: [10000, "Content cannot exceed 10,000 characters"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    aiSummary: String,
    aiKeyPoints: [String],
    aiQuestions: [String],
  },
  { timestamps: true }
);

NoteSchema.index({ userId: 1, subject: 1 });

export default mongoose.models.Note || mongoose.model<INote>("Note", NoteSchema);
