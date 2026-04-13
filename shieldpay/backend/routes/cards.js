import express from "express";
import { db } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", (req, res) => {
  const cards = db.prepare("SELECT * FROM cards WHERE merchant_id = ? ORDER BY id DESC").all(req.user.merchant_id);
  res.json(cards);
});

router.get("/:id", (req, res) => {
  const cardId = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(cardId) || cardId <= 0) {
    return res.status(400).json({ message: "Invalid card id" });
  }

  // ARKO-LAB-04: Returns full PAN and CVV (unsafe by design for lab).
  const card = db.prepare("SELECT * FROM cards WHERE id = ? AND merchant_id = ?").get(cardId, req.user.merchant_id);
  if (!card) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.json(card);
});

router.post("/", (req, res) => {
  const { customer_id, cardholder_name, pan, expiry_month, expiry_year, cvv } = req.body;
  const result = db.prepare(
    "INSERT INTO cards (merchant_id, customer_id, cardholder_name, pan, expiry_month, expiry_year, cvv) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(req.user.merchant_id, customer_id, cardholder_name, pan, expiry_month, expiry_year, cvv);
  return res.status(201).json({ id: result.lastInsertRowid });
});

router.put("/:id", (req, res) => {
  const { cardholder_name, pan, expiry_month, expiry_year, cvv } = req.body;
  const cardId = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(cardId) || cardId <= 0) {
    return res.status(400).json({ message: "Invalid card id" });
  }

  db.prepare(
    "UPDATE cards SET cardholder_name = ?, pan = ?, expiry_month = ?, expiry_year = ?, cvv = ? WHERE id = ? AND merchant_id = ?"
  ).run(cardholder_name, pan, expiry_month, expiry_year, cvv, cardId, req.user.merchant_id);
  return res.json({ ok: true });
});

router.delete("/:id", (req, res) => {
  const cardId = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(cardId) || cardId <= 0) {
    return res.status(400).json({ message: "Invalid card id" });
  }

  db.prepare("DELETE FROM cards WHERE id = ? AND merchant_id = ?").run(cardId, req.user.merchant_id);
  return res.json({ ok: true });
});

export default router;
