import express from "express";
import { verifyToken } from "../middlewares/auth.middlewares.js";
import { getUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/:userId", verifyToken, getUser);

export default router;
