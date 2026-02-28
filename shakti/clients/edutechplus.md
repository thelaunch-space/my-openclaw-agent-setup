# EduTechPlus (edutechplus)

## About the Client

Indonesian EdTech company with a B2G content library (math videos + applets for school curricula). Now building a B2C mobile app with an AI voice companion layer. The core problem: students (Grade 4, ages 9-10, Indonesian, ESL) won't stay engaged for 15-25 minutes without a teacher present. Krishna is building the engagement layer — an AI teaching companion that guides them through existing content.

## Relationship

- **Type:** Retainer
- **Scope:** Krishna owns all technical implementation. EdtechPlus provides product vision, content assets, and design direction. Iteration cadence: client expects observable progress every ~2 days.
- **History:** Vinay is a former boss of Krishna's — relationship is warm and high-trust. Communication is direct and opinionated (Vinay plays the student role during reviews).
- **Communication:** Video calls for reviews. Feedback is detailed and design-forward.

## Key People

- **Vinay Ravindra** — Product decision-maker. All feedback goes through him. Opinionated and specific. Defines what the product should feel and act like.
- **Nishant** — Design. Responsible for UI assets and visual design direction.

## Tech Stack (for context)

React 19 + Vite 7 + TypeScript, Deepgram STT, Claude Haiku 4.5 LLM, ElevenLabs TTS, Zustand state management. Netlify hosting, auto-deploy on push to main.

## 25 Design Principles (non-negotiable)

These emerged from 6 iterations of client feedback and apply to all EdtechPlus work. Never violate without explicit client sign-off. Key ones:

- AI is teacher, not traffic controller — every utterance must be pedagogically purposeful
- Multi-turn Socratic scaffolding — when student answers wrong: probe → hint → reveal, never just move on
- Scripted backbone, LLM only at the joints (for cost and reliability)
- Voice OR click — never both simultaneously
- Content is the star, AI steps back for immersion
- Cost-conscious as a feature — not every interaction needs an LLM call
- "Are you ready?" micro-prompts before transitions
- Characters need purpose, not just presence

---

## Active Projects

### Voice Interaction Learning Journey (voice-interaction-learning-journey)
- **Goal:** Grade 4 fractions module with AI voice tutor (Max) + goofy robot sidekick (Spark). Students move through a 27-node learning journey via push-to-talk voice interaction. Multi-turn Socratic scaffolding when students answer incorrectly.
- **Status:** Functionally complete. Live-tested with Vinay on Feb 24, 2026. All 27 nodes reachable with zero dead ends. Race conditions fixed.
- **Remaining work:**
  - Test scaffolding progression with new generous correctness prompts
  - Edge case: rapid navigation doesn't cause overlapping speech (cancellation)
  - Spark sprite animation cleanup (appears/disappears cleanly)
  - No error recovery UI if APIs fail mid-lesson (known gap)
  - API keys exposed in browser — acceptable for demo, needs proxy for production
- **Priority:** TOP PRIORITY — this is the main deliverable. Polish and final testing before client sign-off.
- **Notes:** Previous codebase (v4-demo) accumulated architectural debt after 6 iterations and was superseded by this clean rebuild starting Feb 20. The 25 design principles above emerged from those iterations.

---

## Upcoming / Backlog Projects

### Content Ingestion Platform (content-ingestion)
- **Goal:** Content team picks assets (videos, applets), AI auto-generates the full learning journey from those assets. An ingestion tool that transforms raw content into structured learning paths.
- **Status:** Not started.
- **Priority:** Deprioritized — starts only after Voice Interaction Learning Journey is signed off by client.

### Content Review Agent Team (content-review-agents)
- **Goal:** An OpenClaw agent team for EduTechPlus that handles content review.
- **Status:** Not started.
- **Priority:** Deprioritized — starts only after Voice Interaction Learning Journey is signed off by client.

---

## Priority Order (across projects)

1. **Voice Interaction Learning Journey** — Final testing + polish → client sign-off → production-ready
2. **Content Ingestion Platform** — Only after Voice Interaction Learning Journey is complete and approved
3. **Content Review Agent Team** — Only after Voice Interaction Learning Journey is complete and approved
