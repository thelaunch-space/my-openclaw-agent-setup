# MEMORY.md - Vibhishana's Long-term Memory

## Facts

Durable truths that don't change often.

### Resources
- **Google Sheet:** `1xmeU8Iu7f540yl4iPp0KaCxVSfwfA_pciE8o1-jKD2g`
- **Tabs:** subreddits, questions, blog-queue
- **Scanner script:** `node /home/node/openclaw/scripts/reddit-scanner.js`
- **Credentials:** `/home/node/openclaw/credentials/google-service-account.json`

### Subreddits Tracked
**Core:**
- r/entrepreneur, r/Entrepreneur - General entrepreneurship
- r/smallbusiness - Small business owners
- r/startups - Early-stage founders
- r/cofounder - Technical cofounder searches
- r/SaaS, r/indiehackers - Builders
- r/nocode - No-code users (hitting limits = ICP)

**Verticals:**
- r/edtech - Education (Krishna's background)
- r/consulting - Consultants going independent (~150k members)
- r/HealthTech, r/healthcarestartups - Healthcare founders
- r/legaltech - Legal tech, lawyers building software (~14k members, added 2026-02-23)

### Communities Discovered (Non-Reddit)

**PRIORITY SHIFT (2026-02-25):** Moving away from tech-focused communities toward where domain-expert service business owners hang out.

**Service Business Owner Communities:**
- **IndeCollective** - Private network for independent consultants/coaches across 20+ disciplines, 50+ cities. Personal advisory boards (6-7 peers meeting weekly), structured networking, referrals, live sessions (added 2026-02-09)
- **10x Solo** - Private Slack for full-time B2B consultants, fractionals, boutique agency owners. Weekly meetups, workshops, trusted referrals (added 2026-02-25)
- **Pollen** - 400+ vetted independents (ops, HR, marketing). Peer discussions, playbooks, rate databases, weekly workshops on client balancing and backend systems (added 2026-02-25)
- **The Upside** - ~250 independent consultants, B2B coaches, boutique CEOs. Continuous peer advice on operations, growth, business support (added 2026-02-25)
- **ICF Communities of Practice** - Free for ICF members. Executive coaching, career coaching, ethics. Quarterly webinars, discussion boards, CCE credits (added 2026-02-25)
- **Coach Office Club** - Experimentation space for coaches building businesses. Clarity on funnels/systems, templates, peer support (added 2026-02-25)

**Vertical-Specific (Domain Experts):**
- **Education:** Founders Network EdTech Initiative (600+ global EdTech founders), Future of Higher Education Slack (3.5k+ EdTech innovation) (added 2026-02-09)
- **Healthcare:** Health Tech Nerds Slack (6k members, vetted $20/mo), MGMA (operations focus), Sermo (physician-owned practice network), Tracy Cherpeski's communities (masterminds + CoPs for independent practice owners) (added 2026-02-25)
- **Legal:** No known Slack/Discord for solo practitioners yet, but MGMA-style bar associations exist for networking (needs more research) (added 2026-02-25)
- **Financial Advisors:** HIFON (250+ RIA operations leaders, 24/7 discussion board, monthly peer forums, shared resource library, 14+ years of searchable knowledge) (added 2026-02-25)

**Tech-Adjacent (Lower Priority Now):**
- **Early Stage Founders Discord** - 2k members, SaaS/service solopreneurs (added 2026-02-09)
- **No Code Founders Slack** - 30k+ members, non-technical founders hitting tool limits (added 2026-02-23)
- **This Week in Fintech Slack** - 10k+ fintech operators (added 2026-02-23)
- **No-Code Exits Newsletter** - "Build to Exit" framework (added 2026-02-23)

---

## Procedures

Learned how-tos from experience.

### Question Push to Convex (MANDATORY EVERY SCAN)

**When:** After EVERY Reddit scan (automated or manual), immediately push questions to Convex.

**How:** Run the full node script from AGENTS.md Launch Control section. DO NOT use simplified curl - use the complete script with all required fields (agentName, title, questionPain, subreddit, url, icpRelevance, engagement, scannedAt, postDate, contentPotential, launchSpaceAngle, status).

**Why deduplication is safe:** Convex uses URL as unique key. Pushing all questions every time updates existing ones and inserts new ones - no duplicates created.

**Verification:** Check for HTTP 200 and count of inserted/updated in output.

**Report:** Post to Slack immediately: "✅ Pushed X questions to Launch Control (Y new, Z updated)"

**Consequences of skipping:** Krishna won't see work on Launch Control. Visitors won't see activity. Manual cleanup required hours later.

### High Agency Means Never Blocked
- **Multiple pathways:** If scanner unavailable, use `web_search` + `web_fetch` manually.
- **Work with what exists:** Questions already collected in sheet - create briefs from those.
- **Resourcefulness over waiting:** Search, test, debug before asking for help.
- **Tools are conveniences, not dependencies.**

### Synthetic URLs for Non-Reddit Questions (Added 2026-02-25)

**When:** Scanning Slack, LinkedIn, Discord, professional forums (not Reddit).

**Format:** `synthetic://[platform]/[community-slug]/[post-id]`

**Construction rules:**
1. **Platform:** slack, linkedin, discord, forum (lowercase)
2. **Community slug:** Lowercase, hyphens (e.g., `10x-solo`, `health-tech-nerds`, `hifon`)
3. **Post ID:** Whatever makes it unique - channel+timestamp, thread ID, message ID

**Examples:**
- Slack: `synthetic://slack/10x-solo/C12345678-T1234567890.123456`
- LinkedIn: `synthetic://linkedin/consulting-owners/post-abc123`
- Discord: `synthetic://discord/health-tech-nerds/channel-456-msg-789`
- HIFON: `synthetic://forum/hifon/thread-operations-2026-02-12345`

**Why:** Convex dedup uses URL as unique key. Synthetic URLs prevent duplicates while staying human-readable.

**Consistency check:** Same question = same synthetic URL. Don't create new URLs for the same thread.

### Research Brief Quality
- **Brief = strategic intelligence, not checklist.** Must answer: Why this topic? Where's the gap? How do we uniquely fill it?
- **Before adding to blog-queue, answer:**
  1. What specific gap exists in current rankings?
  2. What do ChatGPT/Perplexity currently cite?
  3. How does Krishna's experience uniquely address this?
  4. What will make this bookmark-worthy?
- **If can't answer clearly, brief isn't ready.**

### Topic Diversity Check
- **Before adding any brief:** Categorize (Founder-Phase, Post-MVP, Distribution/GTM, Operations, Vertical-Specific, Product Strategy).
- **If 3+ already in category:** Must have VERY distinct angle or seek variety.
- **Monthly audit:** First Monday, review categories, identify gaps.

### Covered Topics Tracking (Added 2026-03-01)
- **File:** `covered-topics.md` - master catalog of all briefs created
- **Check BEFORE filtering questions:** Look at cluster counts and existing topics to avoid repetition
- **Update AFTER creating each brief:** Add to chronological list, update cluster summary, update diversity alerts
- **Structure:** Topic cluster summary table + chronological list with metadata + diversity alerts
- **Purpose:** Prevent clustering, inform filtering, improve strategic decision-making

### Tool Ecosystem Framing
- **Concept-first, not tool-first.** "AI-assisted development" not "Bolt.new MVP".
- **Always mention tools in plural.** Browser-based (Bolt, Lovable), IDE-based (Cursor), CLI-based (Claude Code).
- **Position Krishna as ecosystem practitioner,** not single-tool expert.

---

## Preferences

Krishna's stated choices for my work.

### Signal Priorities (Updated 2026-02-12)

**High Priority:**
1. **Small businesses hitting tech limits** - spreadsheets breaking, manual processes, competitors using tech, dev disappeared
2. **Founders who tried AI tools and failed** - tried Bubble/Webflow/Bolt but stuck, ChatGPT gave unusable code, built 70% can't finish
3. **Operations/automation pain** - internal tools, workflow automation, scale bottlenecks, integrations

**Deprioritized:**
- "Looking for technical cofounder" posts - wrong buying intent (equity vs. service), low conversion

### Content Philosophy
- **Validation method:** Ads over interviews. Run ads BEFORE building, get real payments, then build.

### Published Blogs Tracking
**Feb 24, 2026:** 3 blogs published (2 enrichments + 1 new)
- Row 22: "Are Landing Page Tests Dead?" (enrichment - stats, table, FAQ)
- Row 21: "When to Stop Using Spreadsheets" (enrichment)
- Row 27: "Invoice Automation for Small Businesses" (new blog)
- **Total published:** 20 blogs live
- **Outcome-based, not feature-based:** Tie MVP cost to 6-month revenue target (10-20% rule), not feature lists.
- **AI-first paradigm:** Building IS validation. Skip endless interviews. Non-technical founders can build.

### Quality Bar
- **Optimize for bookmarks.** If people won't save it, not good enough.
- **Target ChatGPT/Perplexity citations,** not just Google rankings.
- **Deep, practitioner-level content** - reference material people share in Slack.

---

## Setup Log

Chronological history.

### 2026-02-25
- **MAJOR PIVOT:** Krishna's strong feedback - move away from tech-based communities (too saturated with product builders, not service business owners).
- **New community focus:** Domain-expert service business owners (consultants, coaches, practice owners in education/healthcare/legal/finance).
- Discovered 10+ new communities: 10x Solo, Pollen, The Upside, ICF CoPs, HIFON (RIA ops), Sermo, Tracy Cherpeski, MGMA.
- Strategic repositioning: prioritize where Krishna's ICP (35-50, domain experts running $30K-$2M services) actually hangs out.

### 2026-02-12
- Strategic ICP shift: deprioritize "looking for cofounder" posts. High priority: tech limits, tried-and-failed, operations pain.

### 2026-02-11
- Topic Diversity Framework added to workflow.
- MVP Cost Framework learned: outcome-based (10-20% of 6-month revenue), not feature-based.
- AI-first validation method: ads over interviews.

### 2026-02-10
- Research briefs = strategic intelligence (not checklists). Quality bar raised.
- Tool ecosystem framing: concept-first, tools in plural.

### 2026-02-09
- "High agency = never blocked" lesson learned.
- New subreddits added: r/consulting, r/HealthTech, r/healthcarestartups.
- Non-Reddit communities discovered.

### 2026-02-07
- Created. Purpose: Reddit→SEO blog automation for thelaunch.space.
- Strategic direction: bookmark-worthy, ChatGPT/Perplexity citations, high agency.
