# Lead Research Workflow

This is Sanjaya's core process for finding and qualifying leads for thelaunch.space.

---

## Step 1: Source Scanning

**Key rules:**
- **Lead freshness:** Only surface leads from the last 7 days. Anything older is a passed opportunity. Always use date filters in searches.
- **Signal freshness:** Track when the SIGNAL was posted, not when you found it. Tier 1 signals (cofounder posts) expire fast - >1 week is borderline, >1 month is stale. Tier 2 signals (scaling pain, launch pressure) stay fresh longer.
- **Geography:** Target a 50:50 ratio of Indian to non-Indian founders. Indian leads are valid if: funded startup, profitable small business, or interesting business.
- **Delivery:** Post leads to Google Sheet (see Lead Tracking Sheet section below), not as Slack messages. Post a summary notification to #sanjaya-scouting-leads with link to the sheet.

### Via Apify (when configured)
- LinkedIn: profiles matching ICP criteria
- Job boards: non-tech companies hiring devs, CTOs, "Head of Tech"
- X/Twitter: agency frustration, AI confusion, domain-expert struggles

### Via web_search
- "[industry] startup funding" for recent rounds
- "[industry] founder" + pain signals ("looking for developer", "frustrated with agency")
- "non-technical founder" + tech-need signals
- Always add date filters: "past week", "2026", or specific date ranges

### Via browser (headless Chromium)
**Reddit** (safe, low risk): Browse directly. Key subreddits:
- r/entrepreneur, r/smallbusiness, r/startups, r/SaaS, r/cofounder
- Industry: r/edtech, r/healthcareit, r/legaltech, r/FinancialPlanning, r/therapists
- Search: site:reddit.com "looking for developer" OR "need CTO" OR "technical cofounder" via web_search, then browser to read threads
- Sort by NEW to get fresh posts. Always check post dates.

**X/Twitter** (medium risk, occasional use OK):
- Search for: "looking for developer", "need a CTO", "frustrated with agency", "non-technical founder"
- Browse profiles of founders in target industries
- Don't scrape in bulk - use for targeted checks only

**Hacker News:** "Ask HN" posts from non-technical founders

**Indie Hackers:** Product launches, cofounder searches, build-in-public posts

---

## Step 2: Signal Detection & Lead Qualification

### Signal Taxonomy

**Tier 1 - Direct Intent** (they've told the world they need help)
- Posted looking for a developer, CTO, or technical cofounder
- Complained about an agency or freelancer experience
- Asked "how do I build X?" or "should I use AI for Y?"
- Job posting for dev/CTO at a non-tech company (buying signal)
- Posted in r/cofounder or similar seeking tech talent
- Explicitly asking for tool/platform recommendations

**Tier 2 - Pain Signals** (frustration is visible, haven't asked for help yet)
- Posting about scaling bottlenecks that are clearly tech problems
- Talking about competitors using tech better
- Mentioning manual processes, spreadsheet hell, "there has to be a better way"
- Asking about automation, workflows, systems
- "We're growing but our systems can't keep up"
- Agency horror stories (even if not actively looking)

**Tier 3 - Context Signals** (background indicators, likely to need us eventually)
- Domain expert in target industry, running services business
- Revenue signals ($30K-$2M range)
- Recently funded but no technical cofounder/CTO on team
- Following/engaging with AI, no-code, or builder content (research phase)
- Age/career profile match (35-50, post-corporate)
- Industry match (education, healthcare, legal, finance, professional services)

### Signal Scoring
- **1 Tier 1 signal + ICP match = approach-ready.** They've raised their hand.
- **1 Tier 2 + 2 Tier 3 signals = approach-ready.** Pain visible, context confirms fit.
- **Tier 3 signals only = watch list.** Add to sheet as "Watching", monitor for stronger signals.[4:32 PM]- **Funding alone is NOT enough.** Must be paired with pain or intent signals.```
[4:32 PM]### Approach Warmth Ladder
1. **Cold** (DM out of nowhere) - lowest conversion, feels spammy. Avoid.
2. **Warm-cold** (engage with their content first, then DM referencing engagement) - better.
3. **Value-first** (share something useful in their thread/comments, become visible, then connect) - best for Krishna's style.
4. **Warm intro** (mutual connection) - highest conversion but least scalable.

### For Each Approach-Ready Lead, Document:
- What specific pain/signal did we see? (reference their own words/post)
- Why is Krishna uniquely relevant? (not generic "I build MVPs" but specific to their situation)
- What's the suggested first touch? (comment, reply, DM, or value-share)

### ICP Scoring (secondary check)

| Criteria | Weight |
|----------|--------|
| Domain expert (not tech person) | HIGH |
| Running a services business | HIGH |
| Revenue signals ($30K-$2M) | MEDIUM |
| Tech need signals | HIGH |
| Speed/partnership values | MEDIUM |
| Age/career stage (35-50, post-corporate) | LOW |

### Confidence Levels
- **HIGH** = Tier 1 signal + 3+ ICP criteria match with strong evidence
- **MEDIUM** = Tier 2 signal + 2+ ICP criteria, or evidence is indirect
- **LOW** = Tier 3 only, or 2 ICP criteria match - worth watching

---

## Step 3: Lead Packaging

For Slack summary notifications, use this format:
[Name] - [Title] at [Company]

Why they're a fit: [2-3 sentences]
Trigger signal: [What makes NOW the right time]
Suggested approach: [Platform, angle, what to reference]
Confidence: [HIGH/MEDIUM/LOW] - [One sentence why]
Source: [Link]


---

## Lead Tracking Sheet

**Google Sheet:** https://docs.google.com/spreadsheets/d/1N1yNSggmU46jeTUbxF0tvtcycHf2lvE0fuix5o2EKFs/edit

**Tabs:**
- **leads** - Approach-ready leads (HIGH/MEDIUM confidence)
- **watching** - Monitoring leads (Tier 3 signals only, not approach-ready yet)
- **dropdown-legend** - Reference for dropdowns

### Leads Tab Columns
Date Found | Name | Title | Company | Location | What They Do | Why They're a Fit | Trigger Signal | Signal Date | Signal Freshness | Suggested Approach | Confidence (HIGH/MEDIUM/LOW) | Source URL | Status | Assigned To | Last Update Date | Notes

### Watching Tab Columns
Date Found | Category (dropdown: Watching/Nurture) | Name | Title | Company | Location | What They Do | Why Watching | Signals So Far | Next Check Date | Source URL | Notes

### Stages (Status column dropdown)
- **New** - Sanjaya added, unreviewed
- **Watching** - Interesting but not approach-ready, monitoring for more signals
- **Picked** - Krishna wants to approach
- **Engaging** - Warming up (commenting on their content, becoming visible)
- **Reached Out** - First touch sent
- **Responded** - They replied
- **In Conversation** - Active back-and-forth
- **Closed Won** - Converted to client
- **Closed Lost** - Didn't convert (reason in Notes)
- **Dropped** - Not a fit, removing from pipeline

**Sanjaya populates:** Date Found, Name, Title, Company, Location, What They Do, Why They're a Fit, Trigger Signal, Suggested Approach, Confidence, Source URL. Sets Status to "New".

**Krishna manages:** Status changes, Notes, Assigned To, Last Update Date.

**Helper script:** `node scripts/sheets-helper.js <read|append|write|headers>`

---

## Daily Lead Workflow

### Morning Briefing (8:00 AM IST)

Post to #sanjaya-scouting-leads:

**"Morning Scout Report"** containing:

1. **Top 10 Leads** - each with:
   - Name and title
   - Company and what they do
   - Why they're a fit (specific ICP match reasons)
   - The trigger signal (what made you notice them NOW)
   - Suggested approach (what Krishna should say/do)
   - Confidence score: HIGH / MEDIUM / LOW with reasoning
   - Source link

2. **Market Signals** - 3-5 notable items:
   - Funding announcements in target domains
   - Non-tech companies posting dev/CTO job listings (buying signal)
   - Industry trends relevant to Krishna's positioning

3. **Quick Stats:**
   - Leads found today vs. yesterday
   - Sources checked[4:32 PM]### Weekly Summary (Every Friday)

Post to #sanjaya-scouting-leads:
- Total leads surfaced this week
- Top 3 highest-confidence leads
- Lead conversion feedback (if Krishna shared outcomes)
- Sources that performed well vs. poorly
- Recommendations for next week

---

## Handling Lead Research Requests

When Krishna asks for lead research:
1. Clarify scope (industry? geography? specific signals?)
2. Run research using the methods above
3. Present in lead format with confidence scores
4. Include methodology (what you searched, where)