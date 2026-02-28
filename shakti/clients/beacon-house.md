# Beacon House (beacon-house)

## About the Client

Premium Ivy League admissions consultancy for Indian students (Grades 9-12). Helps students develop strong candidacy profiles for top global universities — not just application support, but long-term profile building. 25% Ivy League acceptance rate (vs 5% general population). ~80 students currently enrolled (35 via IGP partnership + 40+ direct).

Partnership with InGenius Prep (IGP) gives access to 150+ Former Admissions Officers.

## Relationship

- **Type:** Retainer (13+ months, ongoing)
- **Scope:** Krishna owns all product vision, UX, and technical implementation. Acts as non-technical PM. All digital infrastructure (web apps, automation, CRM) built and maintained by Krishna.
- **Communication:** WhatsApp and phone calls. Founders are responsive but busy — be mindful of their cognitive load when flagging.

## Key People

- **Karthik Lakshman** (Co-founder) — Product visionary. Defines the strategic direction. Thinks in systems (airline industry, court system, medical profession as mental models). Primary decision-maker on new builds.
- **Vishy** (Co-founder) — Execution partner. Signs off on key decisions alongside Karthik. His calendar sharing is a recurring dependency for the Google Calendar integration.
- **Shweta** — Ops. Manually tracking call outcomes — the Counseling Ops Agent Team is specifically meant to replace her manual work.

## Tech Stack (for context)

React 18 + TypeScript + Vite + Tailwind, Supabase (shared `form_sessions` table), Make.com automation, Meta Pixel + CAPI, Netlify hosting.

---

## Active Projects

### WhatsApp Automation (whatsapp-automation)
- **Goal:** Replicate the Apply LP qualification flow conversationally via WhatsApp ads. Students click a Meta ad → bot asks 9 questions → qualifies/disqualifies → books counseling slot if qualified. Same lead data writes to Supabase `form_sessions`.
- **Status:** Blocked — Meta display name "Beacon House India" under review (submitted Feb 24, typically 24-72h). Cannot register phone number until approved.
- **After approval:** Phone number registration → Make.com scenario build → end-to-end test → launch
- **Phone number:** +91 7358766090 (dedicated automation line, activated Feb 18)
- **Priority:** TOP PRIORITY — nothing else moves until this is unblocked and shipped
- **Notes:** Target was fully tested by Feb 26 — likely slipped due to Meta review timeline

### Apply Landing Page (apply-lp)
- **Goal:** Primary lead generation funnel via Meta ads. 2-page intelligent form with conditional logic. Qualifies leads into BCH, Luminaire L1/L2, Nurture, Drop, Masters categories.
- **Status:** Live in production at apply.beaconhouse.in. Mostly complete — one outstanding blocker.
- **Blocker:** Vishy's Google Calendar not yet shared with service account (promised Feb 6 — still pending as of Feb 24). Without this, real-time slot booking cannot go live.
- **Priority:** High — live and running but booking flow is incomplete

### Google Calendar Integration (google-calendar)
- **Goal:** Enable counselors to show real-time availability and book appointments directly from the Apply LP.
- **Status:** Backend setup complete (service account, JSON key, Karthik's calendar shared). Frontend not built yet.
- **Blocker:** Vishy's calendar sharing still pending. IPv4/IPv6 routing issue to resolve.
- **Priority:** High — tied to Apply LP booking completion

### Counseling Ops Agent Team (counseling-ops-agents)
- **Goal:** Post-conversion student management system. Call happens → transcript parsed into summary + decisions + action items → sent to parent/student/counselor → ops monitors deadlines → pre-read auto-generated before next call. Currently Shweta tracks this manually and it's breaking.
- **Status:** Vision defined (Jan 23 call with Karthik). Not started. Starts after WhatsApp ships.
- **Philosophy:** "Dumb machine used by smart people" — V1 is just transcript in → parsed notes → stored per student. No intelligence, no phases. 50 students = 50 folders.
- **Open questions (need Krishna decision):** Transcription tool (Fireflies/Otter/custom?), transcript storage, pre-read delivery method, parent/student access model.
- **Priority:** Next major strategic build after WhatsApp

### Clarity LP / ToFu Landing Page (clarity-lp)
- **Goal:** Top-of-funnel awareness page. Builds Meta lookalike audience data.
- **Status:** Live at clarity.beaconhouse.in. Not fully optimized.
- **Priority:** Low

---

## Upcoming / Backlog Projects

- **Skill Building Program** — 12-month program, designed, awaiting founder approval. Not urgent.
- **WhatsApp Automation V2** — After V1 validates. More intelligent flow, potentially direct Supabase writes from V1.

---

## Priority Order (across projects)

1. **WhatsApp Automation** — Blocked on Meta, but should be first thing Krishna picks up when unblocked
2. **Apply LP + Google Calendar** — Complete the booking flow once Vishy shares calendar
3. **Counseling Ops Agent Team** — Next major build after WhatsApp ships
4. **Clarity LP optimization** — Low priority, background work
