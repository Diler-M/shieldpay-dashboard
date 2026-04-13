# ShieldPay Security Lab

This document tracks the security assessment and remediation of ShieldPay using ARKO inside Cursor.

## ✅ Remediation Phase 2 – Access Control (RBAC + IDOR)

### Current Status

- Phase 1: Injection ✅
- Phase 2: Access Control (RBAC + IDOR) ✅
- Phase 3: Sensitive Data Protection 🚧 (in progress)

### Overview

This phase focused on resolving critical authorization vulnerabilities across the platform, including missing role-based access control and insecure direct object reference (IDOR) issues.

These vulnerabilities allowed authenticated users to access or modify data outside of their intended scope, including administrative data and resources belonging to other merchants.

---

### 🔐 Issues Addressed

#### Role-Based Access Control (RBAC)

* Missing RBAC on `/admin/users`
* Missing RBAC on `/admin/merchants`
* Missing authorization on `/impersonate/:id`

#### Insecure Direct Object References (IDOR)

* Cards:

  * GET card details
  * PUT card update
  * DELETE card
* Customers:

  * GET customer
  * PUT customer update
  * DELETE customer
* Transactions:

  * GET transaction detail

---

### 🛠️ Fix Implementation

#### 1. Enforced Role-Based Access Control

* Added role validation for all admin routes:

  * `req.user.role === 'admin'`
* Restricted impersonation functionality to admin users only
* Returned `403 Forbidden` for unauthorized access attempts

#### 2. Implemented Ownership Validation (Tenant Isolation)

* Introduced `merchant_id` checks across all resource queries
* Ensured all database operations are scoped to the authenticated user:

  * `SELECT`, `UPDATE`, `DELETE` queries updated to include `merchant_id`
* Used `req.user.merchant_id` as the source of truth for access control

#### 3. Secure Query Patterns

* Updated all resource queries to enforce ownership:

```sql
SELECT * FROM cards WHERE id = ? AND merchant_id = ?
UPDATE customers SET ... WHERE id = ? AND merchant_id = ?
DELETE FROM transactions WHERE id = ? AND merchant_id = ?
```

---

### 📊 Impact

* Eliminated all identified IDOR vulnerabilities across the platform
* Prevented cross-tenant data access between merchants
* Secured administrative endpoints from unauthorized users
* Reduced multiple Critical and High severity findings

---

### 🧠 Security Insight

This phase highlights a common real-world issue in web applications:

> Authentication does not equal authorization.

Even with valid JWT authentication, users must be explicitly restricted to only the resources they are permitted to access.

Failure to enforce this leads to:

* Data leakage
* Privilege escalation
* Cross-tenant access violations

---

### 📈 Result

* Significant reduction in vulnerability count
* Hackable score improved from ~76% → 72%
* All access control and IDOR-related findings resolved

---

### 📌 Notes

All fixes were implemented iteratively using ARKO inside Cursor, following a consistent:

**Build → Scan → Fix → Re-scan**

workflow to validate remediation effectiveness.



## ✅ Remediation Phase 1 - Baseline

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
