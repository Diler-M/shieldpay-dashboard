# ShieldPay Security Lab

This document tracks the security assessment and remediation of ShieldPay using ARKO inside Cursor.

## ⚠️ Phase 4 Re-Scan Regression

### Overview

After the initial platform-hardening changes, a deeper ARKO re-scan surfaced additional issues related to token exposure, secret handling, frontend configuration exposure, and payment authorization.

### Key Finding

Earlier remediation work remains valid and is still marked as resolved, but the latest scan identified newly introduced or newly surfaced issues in authentication flows, settings management, and payment processing.

### New Critical Issues Identified

* API keys exposed in frontend code
* Hardcoded API key in database seeding
* Admin impersonation token exposed in API response
* Password reset token exposed in API response
* Missing authorization check on payment processing

### Response Plan

Next remediation batch will focus on:

1. removing token exposure from auth flows
2. masking or removing API keys from frontend state and UI
3. removing hardcoded seeded credentials
4. enforcing ownership checks in payment processing

---

## ✅ Remediation Phase 5 – Token, Secrets & Authorization Hardening

### Overview

Following the Phase 4 re-scan, a new set of critical vulnerabilities was identified relating to token exposure, API key handling, and missing authorization checks in key application flows.

This phase focused on securing authentication mechanisms, protecting sensitive credentials, and enforcing proper authorization across critical endpoints.

---

### 🔐 Issues Addressed

* API keys exposed in frontend code and UI
* Hardcoded API keys in database seeding
* Admin impersonation token exposed in API responses
* Password reset token exposed in API responses
* Missing authorization checks on payment processing endpoint

---

### 🛠️ Fix Implementation

#### 1. Removed Token Exposure in Auth Flows

* Stopped returning JWT tokens in JSON responses
* Ensured tokens are only stored in secure httpOnly cookies
* Refactored password reset flow to avoid exposing reset tokens in responses

---

#### 2. Secured API Key Handling

* Removed full API keys from frontend state and UI
* Implemented masking for API keys (e.g. `sk_live_****abcd`)
* Ensured full API keys are only accessible server-side

---

#### 3. Removed Hardcoded Secrets

* Eliminated hardcoded API keys from database seed data
* Introduced dynamic or environment-based key generation
* Ensured no sensitive credentials are embedded in source code

---

#### 4. Enforced Authorization on Payment Processing

* Added ownership validation for:

  * customer_id
  * card_id
* Ensured all payment operations are scoped to `req.user.merchant_id`
* Prevented unauthorized transaction execution across tenants

---

### 📊 Impact

* Eliminated multiple Critical vulnerabilities related to token and credential exposure
* Strengthened authentication and authorization boundaries
* Reduced risk of account takeover and API abuse
* Improved overall platform security posture

---

### 🧠 Security Insight

This phase highlights a critical principle:

> Sensitive tokens and credentials should never be exposed to the client.

Even temporary exposure (e.g. password reset tokens) can lead to:

* account takeover
* privilege escalation
* API abuse

Secure systems must ensure:

* secrets remain server-side
* access is strictly controlled
* authorization is enforced at every layer

---

### 📈 Result

* Significant reduction in Critical and High severity findings
* Improved ARKO security score
* Transition from surface-level vulnerabilities to deeper system-level concerns

---

### 📌 Notes

At this stage, the nature of vulnerabilities began to shift from implementation issues to architectural and design considerations, indicating increased system maturity.


## ✅ Remediation Phase 3 – Sensitive Data Protection

### Overview

This phase focused on securing sensitive financial data across the platform, including how payment card information is stored, processed, and exposed.

---

### 🔐 Issues Addressed

* Plaintext storage of payment card data (PAN + CVV)
* Exposure of sensitive card data in API responses
* Exposure of full card details in frontend UI and DOM

---

### 🛠️ Fix Implementation

#### 1. Removed CVV Storage

* CVV field completely removed from database schema
* No longer stored, processed, or returned by any API

#### 2. Implemented PAN Masking

* Full card numbers replaced with masked values
* Only last 4 digits retained for display purposes

#### 3. Secured API Responses

* Removed sensitive fields from all responses
* Introduced safe response objects (last4, brand only)

#### 4. Updated Frontend Rendering

* Replaced full PAN display with masked format
* Removed all CVV references from UI
* Ensured no sensitive data is rendered in DOM

---

### 📊 Impact

* Eliminated exposure of financial data
* Reduced multiple Critical and High severity findings
* Improved compliance with PCI DSS principles
* Significantly reduced breach risk

---

### 🧠 Security Insight

Sensitive data should follow strict handling rules:

* Never store what you don’t need
* Never expose what users shouldn’t see
* Always minimise data at rest and in transit

Failure to do so can lead to:

* Financial data breaches
* Regulatory violations
* Loss of user trust

---

### 📈 Result

* Further reduction in vulnerability count
* Improved hackable score
* All sensitive data exposure issues resolved

---

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
