import { Schema, model } from "mongoose";

const userStorySchema = new Schema(
  {
    userStoryNumber: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
    },
    // position: {
    //   type: Number,
    //   required: true,
    //   min: 0,
    // },
    sprintId: {
      type: Schema.Types.ObjectId,
      ref: "Sprint",
      default: null,
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
      enum: ["draft", "planned", "in_progress", "done"],
      default: "draft",
    },
    storyPoints: {
      type: Number,
      min: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tasks: {
      type: [Schema.Types.ObjectId],
      ref: "Task",
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export default model("UserStory", userStorySchema);
