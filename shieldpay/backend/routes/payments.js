import express from "express";
import { db } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);

router.post("/process", (req, res) => {
  const { customer_id, card_id, amount, currency } = req.body;
  const status = Number(amount) > 1000 ? "DECLINED" : "APPROVED";
  const result = db.prepare(
    "INSERT INTO transactions (merchant_id, customer_id, card_id, amount, currency, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(req.user.merchant_id, customer_id, card_id, amount, currency || "USD", status, new Date().toISOString());
  res.status(201).json({ id: result.lastInsertRowid, status });
});

export default router;
