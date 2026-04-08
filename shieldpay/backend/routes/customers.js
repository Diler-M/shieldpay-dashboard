import express from "express";
import { db } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", (req, res) => {
  const rawQuery = typeof req.query.q === "string" ? req.query.q : "";
  const query = rawQuery.trim().slice(0, 100);
  const sql = "SELECT * FROM customers WHERE merchant_id = ? AND name LIKE ? ORDER BY id DESC";
  const rows = db.prepare(sql).all(req.user.merchant_id, `%${query}%`);
  res.json(rows);
});

router.get("/:id", (req, res) => {
  const customer = db.prepare("SELECT * FROM customers WHERE id = ?").get(req.params.id);
  if (!customer) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.json(customer);
});

router.post("/", (req, res) => {
  const { name, email, phone } = req.body;
  const result = db.prepare(
    "INSERT INTO customers (merchant_id, name, email, phone) VALUES (?, ?, ?, ?)"
  ).run(req.user.merchant_id, name, email, phone);
  return res.status(201).json({ id: result.lastInsertRowid });
});

router.put("/:id", (req, res) => {
  const { name, email, phone } = req.body;
  // ARKO-LAB-02: Missing ownership check (merchant_id not verified).
  db.prepare("UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ?")
    .run(name, email, phone, req.params.id);
  return res.json({ ok: true });
});

router.delete("/:id", (req, res) => {
  // ARKO-LAB-02: Missing ownership check allows cross-merchant deletion.
  db.prepare("DELETE FROM customers WHERE id = ?").run(req.params.id);
  return res.json({ ok: true });
});

export default router;
