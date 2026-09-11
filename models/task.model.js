import { Schema, model } from "mongoose";

const taskSchema = new Schema(
  {
    taskNumber: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
    },
    position: {
      type: Number,
      required: true,
      min: 0,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxLength: 5000,
    },
    status: {
      type: String,
      required: true,
      enum: ["todo", "in_progress", "done"],
      default: "todo",
    },
    userStoryId: {
      type: Schema.Types.ObjectId,
      ref: "UserStory",
      required: true,
    },
    assigneeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default model("Task", taskSchema);
