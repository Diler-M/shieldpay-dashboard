# ShieldPay Security Diary

> A full DevSecOps case study demonstrating iterative security remediation of an AI-generated application using ARKO (Build → Scan → Fix → Re-scan).

This document tracks the security assessment and remediation of ShieldPay using ARKO inside Cursor.

---

## ✅ Remediation Phase 1 – Baseline

* Initial hackable score: **80%**
* Initial ARKO findings: **19 open vulnerabilities**

  * **9 Critical**
  * **10 High**

---

## ✅ Remediation Phase 2 – Access Control (RBAC + IDOR)

### Overview

This phase focused on resolving critical authorization vulnerabilities across the platform, including missing role-based access control and insecure direct object reference (IDOR) issues.

---

### 🔐 Issues Addressed

#### Role-Based Access Control (RBAC)

* Missing RBAC on `/admin/users`
* Missing RBAC on `/admin/merchants`
* Missing authorisation on `/impersonate/:id`

#### Insecure Direct Object References (IDOR)

* Cards (GET, PUT, DELETE)
* Customers (GET, PUT, DELETE)
* Transactions (GET)

---

### 🛠️ Fix Implementation

* Enforced `req.user.role === 'admin'` for admin endpoints
* Restricted impersonation to admin users only
* Implemented `merchant_id` ownership checks across all queries
* Updated all SQL queries to include tenant scoping

---

### 📊 Impact

* Eliminated all IDOR vulnerabilities
* Prevented cross-tenant data access
* Secured admin endpoints

---

### 🧠 Security Insight

> Authentication does not equal authorisation.

---

## ✅ Remediation Phase 3 – Sensitive Data Protection

### Overview

Focused on securing sensitive financial data across storage, API responses, and frontend rendering.

---

### 🔐 Issues Addressed

* Plaintext storage of payment card data
* Exposure of PAN and CVV in API responses
* Exposure of full card details in frontend UI

---

### 🛠️ Fix Implementation

* Removed CVV storage entirely
* Masked PAN values (last 4 digits only)
* Sanitised API responses
* Updated frontend to prevent sensitive data exposure

---

### 📊 Impact

* Eliminated financial data exposure
* Improved PCI DSS alignment

---

### 🧠 Security Insight

> Never store or expose sensitive data unnecessarily.

---

## ⚠️ Phase 4 – Re-Scan Regression

### Overview

A deeper ARKO re-scan surfaced additional vulnerabilities after initial fixes.

---

### 🔍 Why This Happened

* Increased application functionality (payments, impersonation, settings)
* Expanded attack surface
* Deeper analysis by ARKO

---

### 🚨 New Critical Issues Identified

* API keys exposed in frontend
* Hardcoded API keys in database
* Token exposure in auth flows
* Missing authorisation in payment processing

---

## ✅ Remediation Phase 5 – Token, Secrets & Authorisation Hardening

### Overview

Focused on securing authentication, secrets, and critical authorisation flows.

---

### 🔐 Issues Addressed

* API key exposure
* Hardcoded credentials
* Token exposure in responses
* Missing authorisation on payment processing

---

### 🛠️ Fix Implementation

* Removed token exposure from API responses
* Implemented httpOnly cookie-based token handling
* Masked API keys in frontend
* Removed hardcoded secrets from codebase
* Enforced ownership validation in payment flows

---

### 📊 Impact

* Eliminated multiple Critical vulnerabilities
* Strengthened authentication and authorisation boundaries

---

### 🧠 Security Insight

> Secrets should never be exposed to the client.

---

## 🔁 Phase 6 – Security Maturity & System-Level Findings

### Overview

Final re-scan revealed a higher number of vulnerabilities due to deeper system analysis.

---

### 🧠 Key Insight

Security issues evolved from:

* Code-level flaws (SQL injection, IDOR)

To:

* System-level risks (payment logic, impersonation design, compliance gaps)

---

### ⚠️ Nature of Remaining Vulnerabilities

* Business logic flaws
* Architectural limitations
* Compliance gaps (PCI DSS)
* Missing advanced controls (MFA, fraud detection)

---

### 🎯 Security Maturity Demonstrated

* Iterative remediation approach
* Risk-based prioritisation
* Understanding of real-world system constraints

---

### 🚀 Conclusion

This project demonstrates a full DevSecOps lifecycle:

**Build → Scan → Fix → Re-scan → Discover deeper risks → Prioritise**

Security is an ongoing process of **risk reduction, not elimination**.

---

## 📊 Overall Progress Summary

* Initial vulnerabilities: **19 (9 Critical, 10 High)**
* Peak vulnerabilities after re-scan: **32 (expanded attack surface)**
* Vulnerabilities remediated: **14+**
* Final state: Reduced surface-level risks, remaining issues are architectural

---

## 🧠 Key Outcome

The project evolved from fixing basic vulnerabilities to identifying complex system-level risks, demonstrating real-world DevSecOps practices.
