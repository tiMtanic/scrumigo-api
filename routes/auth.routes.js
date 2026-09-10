import express from "express";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import User from "../models/User.model.js";
import { verifyToken } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  try {
    const { name, surname, email, password } = req.body;

    if (!name.trim() || !surname.trim() || !email.trim() || !password) {
      res.status(400).json({ errorMessage: "All fields are required" });
      return;
    }

    if (
      !/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g.test(
        email.trim(),
      )
    ) {
      res.status(400).json({
        errorMessage: "Your email address is not in the right format",
      });
      return;
    }

    if (await User.findOne({ email: email.trim() })) {
      res
        .status(400)
        .json({ errorMessage: "A user with this email is registered already" });
      return;
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    await User.create({
      name,
      surname,
      email,
      passwordHash: hashedPassword,
    });

    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email.trim() || !password) {
    res
      .status(400)
      .json({ errorMessage: "Both email and password are mandatory" });
    return;
  }

  try {
    const foundUser = await User.findOne({ email: email.trim() });
    if (!foundUser) {
      res.status(400).json({ errorMessage: "User not found" });
      return;
    }

    const passwordCorrect = await bcryptjs.compare(password, foundUser.passwordHash);
    if (!passwordCorrect) {
      res.status(400).json({ errorMessage: "Invalid password" });
      return;
    }

    // generate JWT
    const payload = {
      _id: foundUser._id,
      name: foundUser.name,
      surname: foundUser.surname,
      email: foundUser.email,
    };

    const authToken = jsonwebtoken.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ authToken, payload });
  } catch (error) {
    next(error);
  }
});

router.get("/verify", verifyToken, (req, res, next) => {
  try {
    res.status(200).json({ payload: req.payload });
  } catch (error) {
    next(error);
  }
});

export default router;
