import express from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.route.js";
import sprintRoutes from "./sprint.routes.js";
import userStoryRoutes from "./userStory.routes.js";
import taskRoutes from "./task.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/sprints", sprintRoutes);
router.use("/userStories", userStoryRoutes);
router.use("/tasks", taskRoutes);

export default router;
