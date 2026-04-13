import express from "express";
import bcrypt from "bcrypt";
import { db } from "../db.js";
import { signToken, requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const ok = bcrypt.compareSync(password, user.password_hash);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = signToken(user);
  return res.json({
    token,
    user: { id: user.id, email: user.email, role: user.role, merchant_id: user.merchant_id }
  });
});

router.post("/register", (req, res) => {
  const { email, password, merchantName } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  const merchant = db.prepare("INSERT INTO merchants (name) VALUES (?)").run(merchantName || "New Merchant");
  const result = db.prepare(
    "INSERT INTO users (email, password_hash, role, merchant_id) VALUES (?, ?, 'merchant', ?)"
  ).run(email, hash, merchant.lastInsertRowid);
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);
  const token = signToken(user);
  return res.status(201).json({ token, user });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

router.post("/reset-password", (req, res) => {
  const { email } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  // ARKO-LAB-08: Insecure learning example returning reset token directly in JSON.
  const resetToken = signToken(user);
  return res.json({ resetToken, note: "Unsafe pattern: token should not be returned directly." });
});

router.post("/impersonate/:id", requireAuth, (req, res) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const targetId = Number.parseInt(req.params.id, 10);
  if (!Number.isInteger(targetId) || targetId <= 0) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  const target = db.prepare("SELECT * FROM users WHERE id = ?").get(targetId);
  if (!target) {
    return res.status(404).json({ message: "User not found" });
  }
  // ARKO-LAB-08: Insecure impersonation token handoff in API response.
  const token = signToken(target);
  return res.json({ impersonationToken: token, target: { id: target.id, email: target.email } });
});

export default router;
