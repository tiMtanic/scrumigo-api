import express from "express";
import authRoutes from "./auth.routes.js";
import sprintRoutes from "./sprint.routes.js";
import userStoryRoutes from "./userStory.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/sprints", sprintRoutes);
router.use("/userStories", userStoryRoutes);

export default router;
