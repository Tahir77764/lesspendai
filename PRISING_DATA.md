# AI Spend Audit Pricing Dataset (Verified - May 2026)

> **Project:** Credex AI Spend Audit  
> **Last Updated:** 2026-05-06  
> **Status:** Build Week Final Baseline

---

## 1. IDE & Developer Tools

| Vendor | Plan | Monthly | Annual (Pre-paid) | Audit Logic / Savings Signal |
| :--- | :--- | :--- | :--- | :--- |
| **Cursor** | Pro | $20/user | $192 ($16/mo) | Standard for solo/small teams. |
| | Teams | $40/user | $432 ($36/mo) | **Overspend Signal:** 1-2 users on Team (use Pro instead). |
| **GitHub Copilot** | Individual | $10 | $100 | Best for solo devs. |
| | Business | $19/user | $204 | Required for IP protection/policy controls. |
| **Windsurf** | Pro | $20 | $192 | **Redundancy Alert:** Overlaps 100% with Cursor Pro. |
| | Teams | $30/user | $324 | Check seat minimums (often 3-seat floor). |

## 2. General Purpose LLMs

| Vendor | Plan | Monthly | Annual | Audit Logic / Savings Signal |
| :--- | :--- | :--- | :--- | :--- |
| **ChatGPT** | Plus | $20 | N/A | Individual power users. |
| | Team | $30/user | $300 ($25/mo) | **Critical:** 2-seat minimum. Avoid for solo users. |
| **Claude** | Pro | $20 | N/A | Best for heavy reasoning/coding tasks. |
| | Power | $125 | $1,350 | **Overspend Signal:** Only for 24/7 "Claude Code" users. |
| | Team | $30/user | $300 | **Overspend Signal:** 5-seat minimum ($150/mo floor). |
| **Gemini** | Business | $20/user | $216 ($18/mo) | Best for Workspace/Drive integration. |
| | Enterprise | $30/user | $324 | Only for advanced security/AI recording. |

---

## 3. Core Audit Heuristics (2026 Edition)

### A. The "Seat Floor" Trap
Many vendors have shifted to seat minimums for "Team" tiers.
* **Claude Team:** 5-seat minimum ($150/mo). If an org has 2 users, they are overpaying by $90/mo.
* **ChatGPT Team:** 2-seat minimum. 

### B. Functional Redundancy (The "Stack" Audit)
Verify if users are paying for multiple tools that perform the same function.
* **The Coding Double-Dip:** Cursor + Copilot + Windsurf. *Recommendation: Consolidate to one IDE AI.*
* **The Model Double-Dip:** ChatGPT Plus + Claude Pro. *Recommendation: Use a model aggregator (Perplexity Pro / Poe) at $20/mo to access both.*

### C. Tier Right-Sizing
* **Teams vs. Pro:** Only move to "Team" if Admin Controls, Shared Billing, or SSO are mandatory. For 1-2 person startups, "Individual/Pro" plans usually save $10-$20 per user/mo.
* **Monthly vs. Annual:** Most 2026 AI tools offer 15-20% discounts for annual commitments.

---

## 4. Savings Formulas

**Scenario 1: Consolidation Savings**
`Annual Savings = (Redundant Tool Cost * 12)`

**Scenario 2: Tier Optimization**
`Annual Savings = (Current Seat Price - Optimized Seat Price) * Seats * 12`

**Scenario 3: Billing Cycle Optimization**
`Annual Savings = (Monthly Price * 12) - Annual Pre-pay Price`