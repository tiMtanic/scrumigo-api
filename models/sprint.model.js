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
  },
  {
    timestamps: true,
  },
);

const Sprint = model("Sprint", userSchema);
export default Sprint;
