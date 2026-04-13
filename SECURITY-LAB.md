# ShieldPay Security Lab

This document tracks the security assessment and remediation of ShieldPay using ARKO inside Cursor.

## Baseline

* Initial hackable score: **80%**
* Current hackable score: **78%**
* Initial ARKO findings: **19 open vulnerabilities**

  * **9 Critical**
  * **10 High**

## Remediation Tracker

| #  | Finding                                                                    | Severity | Location                                                    | Status | Notes                                                  |
| -- | -------------------------------------------------------------------------- | -------- | ----------------------------------------------------------- | ------ | ------------------------------------------------------ |
| 1  | SQL Injection in Customer Search                                           | Critical | `shieldpay/backend/routes/customers.js:12`                  | Fixed  | Replaced string concatenation with parameterized query |
| 2  | CORS Misconfiguration - Wildcard Origin with Credentials                   | Critical | `shieldpay/backend/server.js:25`                            | Open   | Restrict allowed origins explicitly                    |
| 3  | Missing role-based access control on `/admin/users`                        | Critical | `shieldpay/backend/routes/admin.js:8`                       | Open   | Require admin role before returning user data          |
| 4  | Missing role-based access control on `/admin/merchants`                    | Critical | `shieldpay/backend/routes/admin.js:14`                      | Open   | Require admin role before returning merchant data      |
| 5  | Missing authorization check on impersonate endpoint                        | Critical | `shieldpay/backend/routes/auth.js:52`                       | Open   | Restrict impersonation to admin users only             |
| 6  | Full payment card data stored in plaintext                                 | Critical | `shieldpay/backend/db.js:98`                                | Open   | Remove CVV storage and mask/tokenise PAN               |
| 7  | Sensitive payment card data exposure in frontend                           | Critical | `shieldpay/frontend/src/pages/TransactionDetailPage.jsx:20` | Open   | Remove CVV display and mask PAN                        |
| 8  | IDOR - Missing merchant ownership check on GET card details                | Critical | `shieldpay/backend/routes/cards.js:14`                      | Open   | Add `merchant_id` ownership validation                 |
| 9  | IDOR - Missing merchant ownership check on PUT card update                 | Critical | `shieldpay/backend/routes/cards.js:31`                      | Open   | Add `merchant_id` ownership validation                 |
| 10 | JWT token stored in localStorage                                           | High     | `shieldpay/frontend/src/pages/LoginPage.jsx:16`             | Open   | Move toward httpOnly cookie-based session handling     |
| 11 | Sensitive payment card data exposure in DOM                                | High     | `shieldpay/frontend/src/pages/CardsPage.jsx:35`             | Open   | Mask PAN and never expose CVV                          |
| 12 | Stack trace and request body exposure in error responses                   | High     | `shieldpay/backend/server.js:76`                            | Open   | Return generic client-safe error responses             |
| 13 | Sensitive data exposure in request logging                                 | High     | `shieldpay/backend/server.js:37`                            | Open   | Redact secrets, passwords, and payment data            |
| 14 | Weak default JWT secret                                                    | High     | `shieldpay/backend/middleware/auth.js:4`                    | Open   | Remove fallback secret and require env var             |
| 15 | IDOR - Missing merchant ownership check on DELETE card                     | High     | `shieldpay/backend/routes/cards.js:40`                      | Open   | Add `merchant_id` ownership validation                 |
| 16 | IDOR - Customer retrieval without ownership check                          | High     | `shieldpay/backend/routes/customers.js:18`                  | Open   | Add `merchant_id` ownership validation                 |
| 17 | IDOR - Customer update without ownership check                             | High     | `shieldpay/backend/routes/customers.js:33`                  | Open   | Add `merchant_id` ownership validation                 |
| 18 | IDOR - Customer deletion without ownership check                           | High     | `shieldpay/backend/routes/customers.js:41`                  | Open   | Add `merchant_id` ownership validation                 |
| 19 | IDOR - Missing merchant authorization check on transaction detail endpoint | High     | `shieldpay/backend/routes/transactions.js:15`               | Open   | Add `merchant_id` ownership validation                 |

## Current Focus

The next remediation batch focuses on **broken access control**:

* admin RBAC
* impersonation authorization
* merchant ownership checks across cards, customers, and transactions

## Method

Each issue is addressed using the same workflow:

1. Review ARKO finding in Cursor
2. Apply remediation
3. Re-scan
4. Record score change
5. Commit fix with clear history
