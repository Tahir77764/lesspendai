# ARCHITECTURE.md — AI Spend Optimizer

## Overview
AI Spend Optimizer is a SaaS-style web application that audits a user’s AI software stack (ChatGPT, Claude, Cursor, Copilot, Gemini, etc.), analyzes spending inefficiencies, and recommends optimized alternatives to reduce monthly costs while improving productivity.

---

# 1. Why Next.js

## Chosen Framework:
**Next.js (App Router + TypeScript + Tailwind CSS)**

## Reasons:

### A. Full-Stack Capability
Next.js allows frontend + backend in one codebase:
- Landing pages
- Audit form
- Results dashboard
- API routes for audit logic
- Email/report generation

This reduces deployment complexity and speeds development.

---

### B. SEO + Marketing Advantage
Landing pages need organic traffic for:
- “AI tool cost calculator”
- “ChatGPT vs Claude pricing”
- “Save money on AI subscriptions”

Next.js provides:
- Server-side rendering (SSR)
- Static generation (SSG)
- Metadata optimization

---

### C. Performance
Fast page loads are critical for conversions:
- Edge rendering
- Optimized assets
- Built-in routing
- Image optimization

---

### D. Scalability
Supports:
- Middleware
- Authentication
- API integrations
- Vercel deployment
- Serverless scaling

---

# 2. Why Supabase

## Chosen Backend:
**Supabase (Postgres + Auth + Edge Functions + Storage)**

## Reasons:

### A. Fast MVP Build
Supabase provides:
- PostgreSQL database
- Authentication
- Row-level security
- API generation
- Realtime capabilities

This avoids building backend infrastructure from scratch.

---

### B. Structured Audit Data
Audit reports are relational:
- Users
- Tool stacks
- Team size
- Spend
- Recommendations
- Saved reports

PostgreSQL is ideal for this structured data model.

---

### C. Cost Effective
For early-stage startup:
- Lower operational cost
- Quick iteration
- Easy deployment

---

### D. Future Ready
Can scale with:
- Edge Functions
- Analytics pipelines
- Stripe subscriptions
- CRM integrations

---

# 3. User Flow

## Step-by-Step Journey:

### Landing Page
User arrives → Understands value proposition → Clicks “Analyze My Stack”

---

### Spend Form
User inputs:
- AI tools used
- Monthly spend
- Team size
- Primary use case

---

### Audit Engine
System:
- Evaluates rules
- Detects overlap
- Calculates savings
- Generates recommendations

---

### Results Dashboard
User sees:
- Monthly savings
- Tool-by-tool optimization
- Better plan suggestions
- Email capture
- Shareable report link

---

### Retention Loop
Optional:
- Save report
- Email report
- Upgrade to premium team insights

---

# 4. Data Flow

## Frontend Layer
Next.js UI captures form data

↓

## API Layer
Next.js Route Handler:
`/api/audit`

Processes:
- Rule engine
- Spend analysis
- Recommendation scoring

↓

## Database Layer (Supabase)
Stores:
- Audit sessions
- User submissions
- Recommendation history
- Email leads

↓

## Response Layer
Returns:
- Savings estimate
- Breakdown
- Share URL
- Report metadata

---

# Example Audit Request:
```json
{
  "team_size": 5,
  "monthly_spend": 120,
  "tools": ["ChatGPT Team", "Cursor Business", "Claude Pro"],
  "primary_use_case": "Coding"
}