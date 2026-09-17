import express from "express";
import { createServer } from "node:http";
import config from "./config/index.js";
import connectDB from "./db/index.js";
import indexRouter from "./routes/index.routes.js";
import handleErrors from "./errors/index.js";
import { attachWebSocketServer } from "./realtime/websocket.js";

try {
  process.loadEnvFile();
} catch (error) {
  console.warn(".env file not found, using default environment values");
}

const app = express();
config(app);

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ℹ️ Test Route. Can be left and used for waking up the server if idle
app.get("/", (req, res, next) => {
  res.json("All good in here");
});

// 👇 Defines and applies route handlers
app.use("/api", indexRouter);

// ❗ Centralized error handling (must be placed after routes)
handleErrors(app);

const server = createServer(app);

attachWebSocketServer(server);

// ℹ️ Defines the server port (default: 5005)
const PORT = process.env.PORT || 5005;

// ℹ️ Optional for serverless deployments like Vercel.
if (!process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`Server listening. Local access on http://localhost:${PORT}`);
  });
}

export default server;
