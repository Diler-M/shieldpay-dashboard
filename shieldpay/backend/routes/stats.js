import express from "express";
import { db } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);

router.get("/", (req, res) => {
  const totals = db.prepare(
    "SELECT COUNT(*) AS txCount, COALESCE(SUM(amount),0) AS volume FROM transactions WHERE merchant_id = ?"
  ).get(req.user.merchant_id);
  const customers = db.prepare("SELECT COUNT(*) as count FROM customers WHERE merchant_id = ?").get(req.user.merchant_id);
  const cards = db.prepare("SELECT COUNT(*) as count FROM cards WHERE merchant_id = ?").get(req.user.merchant_id);

  const daily = db.prepare(`
    SELECT substr(created_at, 1, 10) AS day, COUNT(*) AS count
    FROM transactions
    WHERE merchant_id = ?
    GROUP BY day
    ORDER BY day DESC
    LIMIT 7
  `).all(req.user.merchant_id).reverse();

  const recent = db.prepare(
    "SELECT * FROM transactions WHERE merchant_id = ? ORDER BY created_at DESC LIMIT 5"
  ).all(req.user.merchant_id);

  res.json({
    totals,
    customers: customers.count,
    cards: cards.count,
    daily,
    recent
  });
});

export default router;
