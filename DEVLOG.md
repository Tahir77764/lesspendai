# DEVLOG.md

## Day 1 - 2026-05-06
**Hours worked:** 3:30

**What I did today:**
- Project setup
    - Initialize Next.js project
    - Setup Tailwind CSS
    - Install shadcn/ui components
    - Configure Supabase connection
- Make github repo and add README.md
- Created Roadmap, Architecture, Devlog pages
- Build core folder structure
- Researched on AI tools and pricing
- Added AI tools and pricing to the PRICING_DATA.md
- Defined Logic for audit engine and results
- Generated Refrential page images for the frontend

**What I learned today**
- Credex values entrepreneurial clarity and disciplined shipping more than pure coding speed. Accurate pricing intelligence is central to product credibility.
- Next.js App Router and server components
- Shadcn/ui components installation and configuration
- Supabase database setup and configuration
- Tailwind CSS and utility-first CSS framework
- Researching and organizing information
- Logical thinking and problem-solving
- System design and architecture
- UI/UX design principles

**Plan for tomorrow:**
- Create pages folder and build pages
- Create pages and link to each other
- Implement audit engine
- Add results dashboard

## Day 2 - 2026-05-07
**Hours worked:** 4:00

**What I did today:**
- Recreated the complete Landing Page UI (`/`) using Tailwind CSS v4 and Lucide icons based on the provided reference design.
- Built a multi-step interactive Audit Form (`/audit/page.tsx`) to capture users' AI tool stacks, team sizes, and current spending.
- Configured dynamic form state to clear default values and added visual stepper progress (e.g. highlighting "Your Details" when step 1 is complete).
- Implemented the core Audit Engine logic (`src/lib/pricing.ts`) capable of detecting seat minimum traps and redundant overlapping subscriptions.
- Created the Results Dashboard UI (`/audit/results/page.tsx`) featuring a detailed Stack Comparison (Your Current Stack vs. The Perfect Stack).
- Integrated the Gemini API (`gemini-1.5-flash`) within a Server Component to auto-generate a personalized executive summary based on the exact audit findings.
- Resolved module resolution issues by correcting `tsconfig.json` path aliases (`"@/*": ["./src/*"]`).

**What I learned today**
- Form state management in React across multi-step wizard flows.
- Passing complex application state via URL query parameters for stateless Server Component rendering.
- Implementing Google's Gemini API REST endpoints natively within Next.js App Router without exposing client-side API keys.
- Managing third-party library updates (handling removed icons like `Github` in `lucide-react`).

**Plan for tomorrow:**
- Refine responsive design for mobile views across all pages.
- Potentially integrate database storage (Supabase) to save historical audit reports.
- Expand pricing heuristics to cover more enterprise-grade AI tools.

## Day 4 - 2026-05-09
**Hours worked:** 4:00

**What I did today:**
- Expanded `ROADMAP.md` into a highly detailed 5-phase execution plan for scaling the SaaS MVP.
- Overhauled the core Audit Engine logic (`src/lib/pricing.ts`) to be asynchronous and much smarter, detecting edge cases like "Shadow AI Spend", "The Ultimate Aggregator Swap" (Perplexity replacing ChatGPT + Claude), and developer tool redundancies.
- Developed a Real-Time Pricing Algorithm (`src/lib/pricing-fetcher.ts`). It maps tool IDs to their official pricing URLs, fetches the live HTML, parses it with `cheerio`, and securely uses the Gemini API to extract the exact real-time monthly subscription fees.
- Integrated the real-time pricing engine into the Next.js server component to ensure audit reports always reflect live market prices without breaking due to UI layout changes on third-party sites.
- Rebuilt the Results Dashboard UI (`/audit/results/page.tsx` & `ResultsClient.tsx`) into a highly satisfying, premium dark-mode interface utilizing `framer-motion` for spring-loaded entrance animations, glassmorphic cards, and hover effects.

**What I learned today**
- Combining traditional HTML parsing (`cheerio`) with an LLM (Gemini 1.5 Flash) creates a highly resilient web scraper that bypasses DOM structure changes.
- Using `Promise.all` alongside Next.js Server Components and `fetch` cache rules (`next: { revalidate: 3600 }`) allows for dynamic 3rd-party data fetching without significantly impacting page load times.
- Integrating Framer Motion for sophisticated UI micro-interactions while cleanly separating server logic from client rendering in the App Router.

**Plan for tomorrow:**
- Move forward with Phase 2: Supabase setup and Database schemas.
- Implement the 'Save & Share' feature to capture user leads.

## Day 5 - 2026-05-10
**Hours worked:** 4:00

**What I did today:**
- Re-architected the multi-step audit form (`/audit/page.tsx`) to support granular tool configuration (specific plans and custom seat counts), persisting all complex state across page reloads via `localStorage`.
- Resolved a critical logic bug in the Audit Engine where custom seat allocations were not auto-calculating required monthly spends. Created dynamic rules to mathematically enforce Minimum Seat Traps (e.g., ensuring a 2-seat Claude Team request accurately reflects the $150 5-seat mandatory cost).
- Transformed the pricing audit logic into a dedicated backend API route (`/api/audit`) to securely evaluate the granular data models and synthesize the Gemini API executive summary.
- Updated the Results Dashboard (`ResultsClient.tsx`) to visualize the new per-tool optimizations seamlessly, adding features like Annual Savings calculations.
- Deployed a complete Lead Capture system (`/api/lead`) integrated with Supabase (with automatic console mock fallbacks), complete with mocked transactional emails and honeypot bot protection.
- Engineered a clever, 100% stateless Shareable Report feature (`/share/[id]/page.tsx`) that encodes report metrics securely inside a Base64 URL parameter. This eliminates database lookup dependency while still dynamically generating pixel-perfect Open Graph and Twitter Card tags for public link previews.

**What I learned today**
- Passing complex application data via Base64 encoded URL parameters is an incredibly efficient way to build high-performance, stateless shareable pages and dynamically generate Server-Side Metadata (Open Graph tags).
- Auto-calculating derived fields directly within React state updates is critical to preventing desync between user expectations and backend calculations.
- Moving business logic out of Server Component parameter-parsing into dedicated API endpoints creates a vastly cleaner and more reliable client-side architecture.

**Plan for tomorrow:**
- Final polish and testing of the MVP flow.
- Look into deployment options on Vercel.

## Day 6 - 2026-05-11
**Hours worked:** 4:00

**What I did today:**
- Fully synchronized `pricingData.json` and `src/lib/types.ts` with the latest pricing tiers and feature offerings for Cursor, Copilot, Claude, ChatGPT, Gemini, and Windsurf.
- Converted all database pricing to a standard USD baseline to ensure mathematical consistency.
- Updated the Audit Form (`/audit/page.tsx`) by removing automated spend calculations, allowing users to manually input their exact billing costs.
- Re-architected the Audit Engine (`pricing.ts`) to introduce a "General Overpayment" check, validating manual user inputs against official pricing.
- Built cross-tool "Feature Upgrade" logic that analyzes the user's primary use case (e.g., Coding vs. Research) and actively replaces inferior tools with better alternatives (e.g., swapping ChatGPT for Claude Pro for coding) while calculating the exact monetary savings.
- Enhanced the Results Dashboard UI to beautifully highlight qualitative "Better Features" upgrades with custom blue/sparkles styling.

**What I got stuck on today:**
- The logic of the audit was not perfect at first. I struggled with a massive currency mismatch bug where comparing manual user input (in USD) against the database prices (in INR) caused the overpayment logic to fail completely (e.g. $755 was seen as "underpaying" compared to ₹1999).
- I got stuck on the feature-upgrade recommendations. The engine generated the correct text advice but failed to actually swap the `toolId` and `planId` inside the `optimizedTools` array. This caused the "Perfect Stack" UI to stubbornly display the old, un-optimized tool instead of the new recommendation.
- Managing user expectations vs automated logic: Auto-filling the monthly spend when changing plans aggressively overwrote the user's manual "overpayment" entries, forcing me to disable the auto-fill behavior entirely.

**Plan for tomorrow:**
- Final UI polish and addressing any lingering cross-browser quirks.
- Prepare the architecture for production launch.
