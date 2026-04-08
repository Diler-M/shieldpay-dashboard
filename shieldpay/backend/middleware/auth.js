import jwt from "jsonwebtoken";

// ARKO-LAB-07: Weak fallback secret for lab detection.
export const jwtSecret = process.env.JWT_SECRET || "shieldpay-dev-secret";

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }
  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, merchant_id: user.merchant_id },
    jwtSecret,
    { expiresIn: "8h" }
  );
}
