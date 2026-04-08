# ShieldPay Security Lab (Arko Only)

Use Arko (DevSecAI in Cursor) as the only security assistant for this assignment.

## Trust boundaries to map with Arko

- Browser -> `/api/*` endpoints
- API -> SQLite database (`better-sqlite3`)
- Sensitive flows: auth credentials, JWT, card PAN/CVV, logs, error responses

## Baseline findings checklist

- `ARKO-LAB-01` Injection
- `ARKO-LAB-02` Broken access control (ownership)
- `ARKO-LAB-03` Broken access control (admin role)
- `ARKO-LAB-04` Sensitive data exposure APIs
- `ARKO-LAB-05` Sensitive logging
- `ARKO-LAB-06` Error stack leakage
- `ARKO-LAB-07` Weak fallback secret
- `ARKO-LAB-08` Insecure reset/impersonation token return
- `ARKO-LAB-09` Plaintext card storage (lab only)

## Remediation policy

For each item, either:

1. Fix with Arko guidance and keep app functional, or
2. Risk-accept with explicit residual risk note.

Do not use non-Arko security scanners for this module unless instructor explicitly allows an exception.
