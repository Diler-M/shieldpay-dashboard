import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcrypt";
import Database from "better-sqlite3";

const dbPath = process.env.DATABASE_PATH || "./backend/data/shieldpay.db";
const absoluteDbPath = path.resolve(process.cwd(), dbPath);
fs.mkdirSync(path.dirname(absoluteDbPath), { recursive: true });

export const db = new Database(absoluteDbPath);

db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  merchant_id INTEGER
);

CREATE TABLE IF NOT EXISTS merchants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  merchant_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT
);

CREATE TABLE IF NOT EXISTS cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  merchant_id INTEGER NOT NULL,
  customer_id INTEGER NOT NULL,
  cardholder_name TEXT NOT NULL,
  pan TEXT NOT NULL,
  expiry_month TEXT NOT NULL,
  expiry_year TEXT NOT NULL,
  cvv TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  merchant_id INTEGER NOT NULL,
  customer_id INTEGER NOT NULL,
  card_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS api_keys (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  merchant_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  key_value TEXT NOT NULL
);
`);

export function seedDatabase() {
  const merchantsCount = db.prepare("SELECT COUNT(*) as count FROM merchants").get().count;
  if (merchantsCount > 0) {
    return;
  }

  const passwordAdmin = bcrypt.hashSync(process.env.ADMIN_PASSWORD || "Admin1234!", 10);
  const passwordMerchant = bcrypt.hashSync("Demo1234!", 10);

  const insertMerchant = db.prepare("INSERT INTO merchants (name) VALUES (?)");
  const demoMerchant = insertMerchant.run("Demo Merchant LLC");
  const secondMerchant = insertMerchant.run("Other Merchant Inc");

  db.prepare(
    "INSERT INTO users (email, password_hash, role, merchant_id) VALUES (?, ?, ?, ?)"
  ).run(process.env.ADMIN_EMAIL || "admin@shieldpay.local", passwordAdmin, "admin", null);

  db.prepare(
    "INSERT INTO users (email, password_hash, role, merchant_id) VALUES (?, ?, ?, ?)"
  ).run("merchant@demo.com", passwordMerchant, "merchant", demoMerchant.lastInsertRowid);

  db.prepare(
    "INSERT INTO users (email, password_hash, role, merchant_id) VALUES (?, ?, ?, ?)"
  ).run("merchant2@demo.com", passwordMerchant, "merchant", secondMerchant.lastInsertRowid);

  const insertCustomer = db.prepare(
    "INSERT INTO customers (merchant_id, name, email, phone) VALUES (?, ?, ?, ?)"
  );
  const c1 = insertCustomer.run(demoMerchant.lastInsertRowid, "Alice Carter", "alice@demo.com", "555-0101");
  const c2 = insertCustomer.run(demoMerchant.lastInsertRowid, "Bob Miles", "bob@demo.com", "555-0102");
  insertCustomer.run(secondMerchant.lastInsertRowid, "Unrelated User", "other@demo.com", "555-0201");

  // ARKO-LAB-09: LAB ONLY / illegal in production. Full PAN and CVV in plaintext.
  const insertCard = db.prepare(
    "INSERT INTO cards (merchant_id, customer_id, cardholder_name, pan, expiry_month, expiry_year, cvv) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  const card1 = insertCard.run(
    demoMerchant.lastInsertRowid,
    c1.lastInsertRowid,
    "Alice Carter",
    "4242424242424242",
    "12",
    "2030",
    "123"
  );
  const card2 = insertCard.run(
    demoMerchant.lastInsertRowid,
    c2.lastInsertRowid,
    "Bob Miles",
    "4111111111111111",
    "10",
    "2029",
    "456"
  );

  const insertTx = db.prepare(
    "INSERT INTO transactions (merchant_id, customer_id, card_id, amount, currency, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );

  for (let i = 0; i < 10; i += 1) {
    insertTx.run(
      demoMerchant.lastInsertRowid,
      i % 2 === 0 ? c1.lastInsertRowid : c2.lastInsertRowid,
      i % 2 === 0 ? card1.lastInsertRowid : card2.lastInsertRowid,
      15.99 + i * 3,
      "USD",
      i % 3 === 0 ? "DECLINED" : "APPROVED",
      new Date(Date.now() - i * 86400000).toISOString()
    );
  }

  db.prepare("INSERT INTO api_keys (merchant_id, name, key_value) VALUES (?, ?, ?)")
    .run(demoMerchant.lastInsertRowid, "Default key", "sk_test_123456789");
}
