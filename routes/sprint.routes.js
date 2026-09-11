import express from "express";
import { verifyToken } from "../middlewares/auth.middlewares.js";
import { createSprint, deleteSprint, getSprint, getSprints, updateSprint } from "../controllers/sprint.controller.js";

const router = express.Router();

// Get all sprints
// /api/sprints
router.get("/", verifyToken, getSprints);

// Get sprint by ID
// /api/sprints/:sprintId
router.get("/:sprintId", verifyToken, getSprint);

// Create sprint
// /api/sprints
router.post("/", verifyToken, createSprint);

// Update sprint
// /api/sprints/:sprintId
router.patch("/:sprintId", verifyToken, updateSprint);

// Delete sprint
// /api/sprints/:sprintId
router.delete("/:sprintId", verifyToken, deleteSprint);

export default router;