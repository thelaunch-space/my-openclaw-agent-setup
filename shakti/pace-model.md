# Pace Model

Last updated: 2026-03-10

## By Task Type (All Clients)

| Task Type | Observed Count | Avg Actual Hours | Last 3 Actuals |
|--------------|---------------|-----------------|----------------|
| build | 18 | 1.71 | 6.0, 8.0, 1.0 |
| review | 0 | TBD | — |
| debug | 2 | 1.5 | 2.0, 1.0 |
| strategy | 0 | TBD | — |
| client-comms | 0 | TBD | — |
| admin | 0 | TBD | — |

## By Client (build tasks only — highest variability)

| Client | Observed Count | Avg Actual Hours |
|-----------------|---------------|-----------------|
| beacon-house | 0 | TBD |
| edutechplus | 14 | 0.55 |
| thelaunch-space | 4 | 5.75 |

## Observations

**2026-03-01:** First logged task. FTUE Ask a Doubt (edutechplus, build) — estimated 2h, actual 0.75h. Simple UI change (replacing free-form input with 2 tap buttons). Came in 63% under estimate. Note: This was a straightforward component swap, not a complex feature build.

**2026-03-02:** Ask a Doubt full feature build — 10 tasks completed in 3h batch. Estimated 16.5h total, actual 3h (5.5x faster). Tasks included: UI foundation (persistent button, FTUE), knowledge base writing, tier-aware prompt redesign, context wiring, Tier 1/2/3 response behaviors, session management (resume, turn limits). Pattern: When scope is clear and implementation is in existing codebase with familiar patterns, Krishna ships at extreme velocity. Initial estimates were too conservative for well-structured work.

**2026-03-03:** Completed 3 EduTechPlus tasks (4h total) + 1 Launch Control debug task (2h, actually done March 2). EduTechPlus: (1) Ask a Doubt tier-based intelligence (1.5h), (2) alternative input methods with tappable chips + typing field (1.5h), (3) bug fixes + deployment (1h debug). Launch Control: mobile UI modal dismiss fix (2h debug). Pattern shift: These EduTechPlus build tasks took significantly longer (1.5h each) vs the 0.3h batch tasks from March 2 — reflects more complex feature work vs simple UI adjustments. First debug tasks logged — debug averages 1.5h across both clients so far.

**2026-03-06:** First thelaunch.space build tasks logged. (1) Move Slack conversations to Launch Control web UI — estimated 6h, actual 6h (perfect estimate). (2) Add OpenClaw HTTP endpoint to Launch Control — estimated 2h, actual 3h (50% over, additional wiring complexity). Pattern emerging: thelaunch.space infrastructure builds average 4.5h vs edutechplus feature work at 0.52h. Major scope difference — Launch Control is full-stack platform work, EduTechPlus V5 was mostly config/UI tweaks in existing system.

**2026-03-08:** Two completions logged. (1) EduTechPlus: "Push Max inside applets" — estimated 3h, actual 1h (3x faster). Familiar React applet integration. (2) thelaunch.space: "Launch Control landing page revamped" — estimated 8h, actual 8h (perfect match). Full-scope work including brainstorm, research, build, testing, iterations. Pattern reinforcement: EduTechPlus feature work continues to come in under conservative estimates when working in familiar codebase. thelaunch.space builds track closer to estimates when properly scoped with discovery time included.

**2026-03-10:** thelaunch.space: "/your-ai-team landing page revamp" — estimated 3h, actual 6h (2x overrun). Messaging + design work more involved than initial estimate suggested. Pattern: When estimates don't include discovery/messaging iteration time, thelaunch.space marketing pages run over. Compare to March 8 Launch Control landing page (8h est, 8h actual) which included full scope upfront.
