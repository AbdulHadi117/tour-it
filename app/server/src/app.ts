import express from "express";
import cors from "cors";
import { corsOrigins } from "./config/env";
import { checkDbConnection } from "./config/db";
import authRoutes from "./modules/auth/auth.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export const app = express();

app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "ok", data: null });
});

app.get("/ready", async (_req, res) => {
  const dbOk = await checkDbConnection();
  if (!dbOk) {
    return res.status(503).json({ success: false, message: "database unavailable", data: null });
  }
  return res.json({ success: true, message: "ready", data: null });
});

// Mounted at root to match what the frontend already calls:
// fetch(`${API_URL}/auth/register`) in app/client/src/app/auth.ts — not /api/v1/auth.
// If other modules move to a versioned prefix later, update auth.ts's calls alongside it.
app.use("/auth", authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
