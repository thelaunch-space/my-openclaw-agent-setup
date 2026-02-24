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
- **IndeCollective** - Private community for consultants/coaches building independent practices
- **Founders Network EdTech Initiative** - 600+ global EdTech founders
- **Future of Higher Education Slack** - 3.5k+ members, EdTech innovation
- **Early Stage Founders Discord** - 2k members, SaaS/service solopreneurs
- **No Code Founders Slack** - 30k+ members, world's largest no-code community, non-technical founders hitting tool limits (added 2026-02-23)
- **Health Tech Nerds Slack** - 6k members, healthcare founders/innovators, vetted $20/mo (added 2026-02-23)
- **This Week in Fintech Slack** - 10k+ members, fintech operators, VCs restricted from some channels (added 2026-02-23)
- **No-Code Exits Newsletter** - "Build to Exit" framework, 91% readers stuck in idea/build phase (added 2026-02-23)

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
