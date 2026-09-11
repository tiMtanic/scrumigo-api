import express from "express";
import authRoutes from "./auth.routes.js";
import sprintRoutes from "./sprint.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/sprints", sprintRoutes);

export default router;
