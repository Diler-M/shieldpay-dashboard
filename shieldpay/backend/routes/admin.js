import express from "express";
import { db } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);

router.get("/users", (req, res) => {
  // ARKO-LAB-03: Missing role gate. Should verify req.user.role === "admin".
  const users = db.prepare("SELECT id, email, role, merchant_id FROM users ORDER BY id DESC").all();
  res.json(users);
});

router.get("/merchants", (req, res) => {
  // ARKO-LAB-03: Missing role gate. Any authenticated user can access.
  const merchants = db.prepare("SELECT * FROM merchants ORDER BY id DESC").all();
  res.json(merchants);
});

export default router;
