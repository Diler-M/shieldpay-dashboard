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
  const customerId = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(customerId) || customerId <= 0) {
    return res.status(400).json({ message: "Invalid customer id" });
  }

  const customer = db.prepare("SELECT * FROM customers WHERE id = ? AND merchant_id = ?").get(customerId, req.user.merchant_id);
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
  const customerId = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(customerId) || customerId <= 0) {
    return res.status(400).json({ message: "Invalid customer id" });
  }

  db.prepare("UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ? AND merchant_id = ?")
    .run(name, email, phone, customerId, req.user.merchant_id);
  return res.json({ ok: true });
});

router.delete("/:id", (req, res) => {
  const customerId = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(customerId) || customerId <= 0) {
    return res.status(400).json({ message: "Invalid customer id" });
  }

  db.prepare("DELETE FROM customers WHERE id = ? AND merchant_id = ?").run(customerId, req.user.merchant_id);
  return res.json({ ok: true });
});

export default router;
