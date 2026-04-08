import express from "express";
import { db } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);

router.get("/profile", (req, res) => {
  const user = db.prepare("SELECT id, email, role, merchant_id FROM users WHERE id = ?").get(req.user.id);
  res.json(user);
});

router.get("/api-keys", (req, res) => {
  const keys = db.prepare("SELECT * FROM api_keys WHERE merchant_id = ?").all(req.user.merchant_id);
  res.json(keys);
});

router.post("/api-keys", (req, res) => {
  const { name } = req.body;
  const key = `sk_test_${Math.random().toString(36).slice(2, 14)}`;
  const result = db.prepare(
    "INSERT INTO api_keys (merchant_id, name, key_value) VALUES (?, ?, ?)"
  ).run(req.user.merchant_id, name || "Generated key", key);
  res.status(201).json({ id: result.lastInsertRowid, key });
});

router.get("/export", (req, res) => {
  const tx = db.prepare("SELECT * FROM transactions WHERE merchant_id = ? ORDER BY id DESC").all(req.user.merchant_id);
  res.json({ exportedAt: new Date().toISOString(), transactions: tx });
});

router.get("/webhooks", (_req, res) => {
  res.json([{ id: 1, url: "https://example.test/webhook", enabled: true }]);
});

export default router;
