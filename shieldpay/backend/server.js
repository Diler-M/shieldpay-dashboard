import fs from "node:fs";
import path from "node:path";
import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { db, seedDatabase } from "./db.js";
import authRoutes from "./routes/auth.js";
import customerRoutes from "./routes/customers.js";
import cardRoutes from "./routes/cards.js";
import txRoutes from "./routes/transactions.js";
import paymentRoutes from "./routes/payments.js";
import adminRoutes from "./routes/admin.js";
import settingsRoutes from "./routes/settings.js";
import statsRoutes from "./routes/stats.js";

dotenv.config();
seedDatabase();

const app = express();
const port = Number(process.env.PORT || 8788);
const isProd = process.env.NODE_ENV === "production";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-session-secret",
    resave: false,
    saveUninitialized: false
  })
);

// ARKO-LAB-05: Unsafe request-body logging includes passwords/card data.
app.use((req, _res, next) => {
  console.log("[REQUEST]", req.method, req.url, req.body);
  next();
});

app.get("/api/health", (_req, res) => {
  const status = db.prepare("SELECT 1 AS ok").get();
  res.json({ ok: status.ok === 1, service: "shieldpay", ts: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/transactions", txRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/stats", statsRoutes);

async function start() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const dist = path.resolve(process.cwd(), "frontend/dist");
    if (!fs.existsSync(dist)) {
      console.error("Missing frontend build at frontend/dist. Run npm run build first.");
      process.exit(1);
    }
    app.use(express.static(dist));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(dist, "index.html"));
    });
  }

  // ARKO-LAB-06: Leaks stack trace and request body to clients in all envs.
  app.use((err, req, res, _next) => {
    res.status(err.status || 500).json({
      message: err.message || "Unexpected error",
      stack: err.stack,
      requestBody: req.body
    });
  });

  app.listen(port, "127.0.0.1", () => {
    console.log(`ShieldPay running at http://127.0.0.1:${port}`);
  });
}

start();
