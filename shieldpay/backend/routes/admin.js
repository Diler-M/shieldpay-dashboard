import express from "express";
import { db } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);
router.use((req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  return next();
});

router.get("/users", (req, res) => {
  const users = db.prepare("SELECT id, email, role, merchant_id FROM users ORDER BY id DESC").all();
  res.json(users);
});

router.get("/merchants", (req, res) => {
  const merchants = db.prepare("SELECT * FROM merchants ORDER BY id DESC").all();
  res.json(merchants);
});

export default router;
