import { Schema, model } from "mongoose";

const sprintSchema = new Schema(
  {
    sprintNumber: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
    },
    name: {
      type: String,
      trim: true,
      maxLength: 100,
    },
    goal: {
      type: String,
      trim: true,
      maxLength: 5000,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["draft", "planned", "active", "completed"],
      default: "draft",
    },
    userStories: {
      type: [Schema.Types.ObjectId],
      ref: "UserStory",
      default: []
    }
  },
  {
    timestamps: true,
  },
);

export default  model("Sprint", sprintSchema);
