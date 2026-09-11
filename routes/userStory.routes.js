import express from "express";
import { verifyToken } from "../middlewares/auth.middlewares.js";
import {
  createUserStory,
  deleteUserStory,
  getUserStories,
  getUserStory,
  updateUserStory,
} from "../controllers/userStory.controller.js";

const router = express.Router();

// Get userStories
// GET /api/userStories
router.get("/", verifyToken, getUserStories);

// Get userStory
// GET /api/userStories/:userStoryId
router.get("/:userStoryId", verifyToken, getUserStory);

// Create userStory
// POST /api/userStories
router.post("/", verifyToken, createUserStory);

// Update userStory
// PATCH /api/userStories/:userStoryId
router.patch("/:userStoryId", verifyToken, updateUserStory);

// Delete userStory
// DELETE /api/userStories/:userStoryId
router.delete("/:userStoryId", verifyToken, deleteUserStory);

export default router;
