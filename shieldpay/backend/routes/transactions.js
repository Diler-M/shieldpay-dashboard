import express from "express";
import { db } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);

router.get("/", (req, res) => {
  const tx = db.prepare(
    "SELECT t.*, c.name AS customer_name FROM transactions t JOIN customers c ON c.id = t.customer_id WHERE t.merchant_id = ? ORDER BY t.created_at DESC"
  ).all(req.user.merchant_id);
  res.json(tx);
});

router.get("/:id", (req, res) => {
  // ARKO-LAB-04: Includes full card PAN/CVV on transaction detail response.
  const tx = db.prepare(
    "SELECT t.*, cards.pan, cards.cvv FROM transactions t JOIN cards ON cards.id = t.card_id WHERE t.id = ?"
  ).get(req.params.id);
  if (!tx) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.json(tx);
});

export default router;
