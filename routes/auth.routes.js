import express from "express";
import { verifyToken } from "../middlewares/auth.middlewares.js";
import { logIn, signUp, verify } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.get("/verify", verifyToken, verify);

export default router;
