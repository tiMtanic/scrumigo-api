import { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    commentNumber: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
    },
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxLength: 5000,
    },
  },
  {
    timestamps: true,
  },
);

export default model("Comment", commentSchema);
