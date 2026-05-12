# GTM.md - Go-To-Market Strategy

## 1. Target Audience
- **Startup Founders & CTOs:** Looking to extend runway and optimize their engineering, design, and content teams' software costs without sacrificing capability.
- **IT Managers / CFOs / Procurement:** Battling "Shadow AI Spend" where employees expense multiple, overlapping AI subscriptions (e.g., an org paying for ChatGPT Team, GitHub Copilot, and Midjourney without centralized oversight).
- **Agencies & Freelancers:** Solopreneurs wanting the absolute best feature set (guided by Gemini's dynamic feature-matching) for the lowest absolute cost.

## 2. Product-Led Growth (PLG) Engine
The product is built to be inherently viral and self-sustaining:
- **The "Shock" Factor:** The UI is designed to create an emotional trigger. It contrasts current wasted spend (red) against a perfectly optimized "Perfect Stack" (green).
- **Stateless Shareable Reports:** This is the core viral loop. Users are gated to enter their email to "Save & Share" their report. The system encodes the savings metrics into a URL-safe Base64 string, generating a permanent, database-free link (`/share/[id]`). 
- **Social Proof / Open Graph:** When users share their audit link on Twitter/X or LinkedIn (e.g., "I just saved $1,200/yr on AI tools using Less Spend AI"), the link dynamically generates meta images boasting their specific savings percentage, driving their network to run their own audits.

## 3. Acquisition Channels
- **SEO (Search Engine Optimization):** Creating programmatic landing pages answering high-intent searches (e.g., "Cursor vs GitHub Copilot Cost Comparison", "Is Claude Team worth it?").
- **Product Hunt & Tech Launches:** Highlighting the meta narrative: "Using AI to optimize how much you spend on AI." Developers and tech enthusiasts heavily engage with cost-saving micro-SaaS tools.
- **Community Outbound:** Sharing organic case studies on HackerNews, Reddit (r/SaaS, r/Entrepreneur), and IndieHackers demonstrating how much money companies waste on redundant AI.
- **Direct LinkedIn Outreach:** Targeting CFOs and IT Directors with the message: "Your team is likely overpaying by 30% for AI seats due to feature overlap. Run our 60-second audit to see exact numbers."

## 4. Phased Rollout Plan
- **Phase 1: Free Lead Magnet (Current MVP)** - Launch the web app. Focus solely on collecting emails, capturing B2B leads, and stress-testing the Gemini feature-matching algorithm.
- **Phase 2: The Consulting Funnel** - Polish the automated booking flow for teams showing >$500 in monthly savings.
- **Phase 3: Continuous Dashboard** - Pivot from a one-off calculator to a recurring dashboard that plugs into corporate credit cards via Plaid/Stripe to auto-flag new AI subscriptions.
