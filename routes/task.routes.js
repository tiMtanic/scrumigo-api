import express from "express";
import { verifyToken } from "../middlewares/auth.middlewares.js";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "../controllers/task.controller.js";

const router = express.Router();

// Get tasks
// GET /api/tasks
router.get("/", verifyToken, getTasks);

// Get task
// GET /api/tasks/:taskId
router.get("/:taskId", verifyToken, getTask);

// Create task
// POST /api/tasks
router.post("/", verifyToken, createTask);

// Update task
// PATCH /api/tasks/:taskId
router.patch("/:taskId", verifyToken, updateTask);

// Delete task
// DELETE /api/tasks/:taskId
router.delete("/:taskId", verifyToken, deleteTask);

export default router;
