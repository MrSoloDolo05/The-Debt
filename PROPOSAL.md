# Project Proposal: The Debt

## 1. Executive Summary
"The Debt" is a secure, multi-tenant dashboard designed for underground brokers to manage high-stakes collateral, leverage, and informal currency ("Favors" and "Markers"). The application provides full ledger tracking, client management, and real-time portfolio analytics to assess risk distribution and outstanding obligations.

## 2. Core Entities & Data Architecture
- **Entity 1: Clients (`clients`)**
  - Represents high-profile debtors or counterparties holding active obligations.
  - Fields: `id`, `user_id`, `name`, `influence_tier` ('Local', 'Federal', 'Global Syndicate'), `status` ('Active', 'Settled', 'In Default'), `created_at`.
  - Operations: Full CRUD (Create, Read, Update, Delete) via Next.js Server Actions and Zod validation.

- **Entity 2: Markers (`markers`)**
  - Represents specific IOUs or favors issued to a client, linked via foreign key (`client_id`).
  - Fields: `id`, `user_id`, `client_id`, `favor_type`, `leverage_value` (1–10 scale), `status` ('Outstanding', 'Called In', 'Defaulted'), `created_at`.
  - Operations: Full CRUD. Creating or updating a marker restricts selection exclusively to active clients owned by the authenticated broker.

## 3. Analytics & Visualization
- **Chart 1 (Bar Chart - Growth Tracker):**
  - *Title:* "Is our leverage growing? Total Markers issued per month."
  - *Function:* SVG/flex-based visual tracking monthly volume starting at a zero baseline to demonstrate portfolio expansion or contraction.
- **Chart 2 (Donut Chart - Risk Distribution):**
  - *Title:* "Where is our power concentrated? Favor category market share."
  - *Function:* Interactive breakdown showing market share and counts per favor type (e.g., Alibis, Smuggling, Pardons).

## 4. Security & Multi-Tenancy Architecture
- Built on Next.js App Router with Supabase SSR Authentication.
- Enforces strict Row Level Security (RLS) policies tied directly to `auth.uid() = user_id` across all database operations.
- Cross-tenant data access attempts are blocked at the PostgreSQL layer (returning SQL error code `42501`).

## 5. Phased Roadmap
1. **Phase 1 (Infrastructure & Schema):** Database migrations, RLS policy enforcement, Vercel deployment setup.
2. **Phase 2 (Core Logic & Data Flow):** Server actions, Zod schemas, basic form validation, entity relationships.
3. **Phase 3 (Analytics & RLS Audit):** Visual charts, two-user proof validation, error boundary implementation.
4. **Phase 4 (UI Refinement):** Layout polishing, deferred styling enhancements, and final smoke testing.