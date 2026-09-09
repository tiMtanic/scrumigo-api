import express from "express";
import morgan from "morgan";
import cors from "cors";

// Middleware configuration
function config(app) {
  app.set("trust proxy", 1);

  app.use(
    cors({
      origin: [process.env.ORIGIN],
    }),
  );

  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
}

export default config;
