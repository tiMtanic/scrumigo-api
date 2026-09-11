import express from "express";
import { verifyToken } from "../middlewares/auth.middlewares.js";
import { createSprint, deleteSprint, getSprint, getSprints, updateSprint } from "../controllers/sprint.controller.js";

const router = express.Router();

// Get all sprints
// GET /api/sprints
router.get("/", verifyToken, getSprints);

// Get sprint by ID
// GET /api/sprints/:sprintId
router.get("/:sprintId", verifyToken, getSprint);

// Create sprint
// POST /api/sprints
router.post("/", verifyToken, createSprint);

// Update sprint
// PATCH /api/sprints/:sprintId
router.patch("/:sprintId", verifyToken, updateSprint);

// Delete sprint
// DELETE /api/sprints/:sprintId
router.delete("/:sprintId", verifyToken, deleteSprint);

export default router;