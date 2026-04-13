# ShieldPay – AI-Built Payment Platform (DevSecOps Security Lab)

A full-stack payment dashboard built using AI (Cursor), intentionally deployed with security vulnerabilities, and currently being secured using ARKO inside Cursor.

This project demonstrates a real-world DevSecOps workflow:

**Build → Scan → Fix → Re-scan**

---

## 🚨 Project Purpose

Modern teams are increasingly shipping AI-generated code — often without proper security validation.

This project simulates that real-world scenario:

* Build a working application using AI
* Identify real vulnerabilities using ARKO
* Remediate issues iteratively using secure coding practices

> ⚠️ Note: The initial version of this application intentionally contains insecure patterns for learning and demonstration purposes.

---

## 📊 Current Metrics

* Initial hackable score: **80%**
* Current hackable score: **78%**
* ARKO findings at baseline: **19**

  * **9 Critical**
  * **10 High**
* First remediation completed: **SQL Injection in customer search**

---

## 📄 Security Evidence

* Full ARKO export: [`security-report-2026-04-07.html`](./security-report-2026-04-07.html)
* Detailed remediation tracker: [`SECURITY-LAB.md`](./SECURITY-LAB.md)

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
* Customer management
* Card storage and transaction processing (demo data only)
* Admin dashboard
* Revenue analytics
* REST API with shared origin (no proxy)

---

## 🛑 Initial Security Findings (ARKO)

The AI-generated baseline application contains multiple real-world vulnerabilities identified by ARKO:

* SQL Injection vulnerabilities in API endpoints
* Broken access control (missing ownership checks)
* Admin routes missing role-based access control
* Sensitive data exposure (full card details & CVV)
* Weak secret management (JWT fallback secret)
* Logging of sensitive information
* Verbose error handling exposing internal details
* Plaintext storage of sensitive financial data

These reflect common issues found in AI-generated and poorly secured applications.

---

## 🔐 Current Remediation Progress

### ✅ Fixed

* **SQL Injection (customers endpoint)**

  * Replaced string concatenation with parameterized queries using `better-sqlite3`
  * Prevents attacker-controlled input from altering SQL execution

### 🚧 In Progress

The following vulnerabilities are currently being addressed using ARKO:

* Broken access control (resource ownership validation)
* Missing admin role checks
* Sensitive data exposure in API responses
* Insecure logging of request data
* Weak secret handling
* Verbose error leakage
* Plaintext storage of card data

---

## 📊 ARKO Scan Status

* Initial scan identified multiple **Critical and High severity vulnerabilities**
* First remediation completed (SQL Injection)
* Further fixes ongoing using ARKO-guided workflow

---

## 🚀 Run Locally

```bash
cd shieldpay
npm install
npm run dev
```

Open in browser:

http://127.0.0.1:8788

Login (demo account):

[merchant@demo.com](mailto:merchant@demo.com)
Demo1234!

---

## 🧠 What This Project Demonstrates

* Building full-stack applications using AI tooling (Cursor)
* Identifying real security vulnerabilities in generated code
* Using ARKO inside Cursor for security analysis
* Applying secure coding practices in Node.js applications
* Iterative DevSecOps workflow (Build → Scan → Fix)

---

## 📌 Next Steps

* Continue remediation of all ARKO-LAB vulnerabilities
* Re-scan after each fix to measure improvement
* Document each vulnerability and fix in detail
* Improve overall security posture and reduce hackable score

---

## 📖 Disclaimer

This project is for educational purposes only.
All payment data is simulated and does not represent real financial information.

---

## 👤 Author

Diler Mehmet
DevSecOps / Cloud Security Engineer
