# ShieldPay – DevSecOps Security

A full-stack payment platform built using AI (Cursor), then secured using ARKO through an iterative DevSecOps workflow.

This project demonstrates how AI-generated applications can introduce real-world vulnerabilities — and how those risks can be systematically identified, prioritised, and remediated.

---

## 🔐 DevSecOps Security Case Study

### 🚀 What This Project Demonstrates

* Identified and remediated **SQL Injection, IDOR, and RBAC vulnerabilities**
* Secured **sensitive financial data** (PCI-aligned practices)
* Hardened **authentication, token handling, and API security**
* Performed multiple **Build → Scan → Fix → Re-scan cycles**
* Analysed **system-level risks including payment logic and impersonation design**

---

## 📊 Results

* Initial vulnerabilities: **19 (9 Critical, 10 High)**
* Peak findings after re-scan: **32 (expanded attack surface)**
* Vulnerabilities remediated: **14+**
* Final state: Major risks eliminated, remaining issues at architectural level

👉 Full breakdown: [SECURITY-LAB.md](./SECURITY-LAB.md)

---

## 🏗️ Architecture

* **Frontend:** React (Vite)
* **Backend:** Node.js (Express)
* **Database:** SQLite
* **Authentication:** JWT
* **Security Tooling:** ARKO (DevSecAI)

**Flow:**
Browser → API → Database

---

## ⚙️ Features

* User authentication (JWT-based)
* Customer and card management
* Payment processing (demo logic)
* Admin dashboard and analytics
* REST API with shared origin

---

## 🛑 Initial Security Findings

The AI-generated baseline application contained multiple critical vulnerabilities:

* SQL Injection in API queries
* Broken access control and IDOR vulnerabilities
* Missing role-based access control on admin routes
* Sensitive data exposure (PAN, CVV)
* Weak secret management
* Verbose error handling and sensitive logging
* Plaintext storage of financial data

---

## 🔐 Security Remediation Overview

The application was secured through multiple iterative phases:

### Phase 1–2: Core Security Fixes

* Eliminated SQL injection
* Implemented RBAC across admin endpoints
* Resolved IDOR vulnerabilities using tenant isolation

### Phase 3: Sensitive Data Protection

* Removed CVV storage
* Masked PAN values
* Secured API responses and frontend rendering

### Phase 4–5: Authentication & Secrets Hardening

* Removed token exposure from auth flows
* Secured API key handling
* Eliminated hardcoded secrets
* Enforced authorization in payment processing

### Phase 6: Security Maturity

* Identified architectural and business logic risks
* Analysed impersonation design and payment logic weaknesses
* Applied risk-based prioritisation

---

## 🧠 Key Learning

Security is not about eliminating vulnerabilities — it is about **reducing risk through continuous iteration and prioritisation**.

This project demonstrates how vulnerabilities evolve from:

* simple code issues
  to
* complex system-level risks

---

## 📄 Security Evidence

* Full ARKO report: [`security-report-2026-04-07.html`](./security-report-2026-04-07.html)
* Detailed remediation log: [`SECURITY-LAB.md`](./SECURITY-LAB.md)

---

## 🚀 Run Locally

```bash
cd shieldpay
npm install
npm run dev
```

Open in browser:
http://127.0.0.1:8788

Login:
[merchant@demo.com](mailto:merchant@demo.com)
Demo1234!

---

## 📖 Disclaimer

This project is for educational purposes only.
All payment data is simulated.

---

## 👤 Author

Diler Mehmet
DevSecOps / Cloud Security Engineer
