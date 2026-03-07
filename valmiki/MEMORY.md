# MEMORY.md - Valmiki's Long-term Memory

## Setup

- **Created:** 2026-02-07
- **Reactivated:** 2026-02-18
- **Major workflow change:** 2026-03-01
- **Role:** LinkedIn Content Curator (quality over quantity)
- **Channel:** #valmiki-content (C0AD3SHGV2A)
- **Model:** Sonnet 4.5

---

## Workflow Change Log

### 2026-03-01: Two-Phase Content Flow

**Old approach (deprecated):** Extract 3-5 full LinkedIn posts per blog → most went unused.

**New approach:**
- **Phase 1:** Extract 2-3 bookmark-worthy angles → create post-briefs with hook/CTA options → push as `pending_review`
- **Phase 2:** Krishna approves angles in Kanban → write full post ONLY for approved angles → push as `draft_ready`

**New payload fields:**
- `insightText` - core insight in 1-2 sentences
- `rationale` - why ICP would bookmark
- `hookOptions` - 4 hook line options
- `ctaOptions` - 3 CTA options

**Cron priority:** needs_revision → approved → new work

**Key shift:** No full posts until Krishna approves the angle. Quality over quantity.

### 2026-03-03: Hook/CTA Selection

Krishna now selects a specific hook and CTA on the Kanban card before approving. When querying approved briefs, check for `selectedHook` and `selectedCta` fields. If present, use them exactly — do not pick independently.

The `/query/linkedin-posts` endpoint now returns these two new fields.

---

## Post Performance Log

Track every post's performance here after Saturday reviews.

| Date | Post Topic | Intent | Likes | Impressions | Comments | Profile Views | Lead Signal? | Notes |
|------|------------|--------|-------|-------------|----------|---------------|--------------|-------|
| | | | | | | | | |

---

## Voice Calibration

Feedback from Krishna on drafts. What he changed, what he loved.

### Things Krishna Changed
(track patterns in his edits)

### Things Krishna Loved
(track what landed well)

---

## Hooks That Work

Track opening lines that drove engagement.

| Hook | Post Date | Engagement | Why It Worked |
|------|-----------|------------|---------------|
| | | | |

---

## Formats That Work

| Format | Description | Performance | Notes |
|--------|-------------|-------------|-------|
| | | | |

---

## Topics That Resonate

| Topic Area | ICP Response | Builder Response | Best Intent |
|------------|--------------|------------------|-------------|
| | | | |

---

## Experiments Log

| Week | Experiment | Hypothesis | Result | Learning |
|------|------------|------------|--------|----------|
| | | | | |

---

## Competitive Insights

What others in the AI services / SMB space are doing on LinkedIn.

### Profiles to Watch
(added when Krishna shares inspiration)

### Tactics That Work
(patterns from research)

---

## Monthly Playbooks

### Month 1 (Starting Feb 2026)
- TBD after first week of data

---

## Learnings Archive

### Week of Feb 15-21, 2026

**Posting Consistency:**
- Only 3 posts published this week (Feb 14, 17, 19)
- Two-day gap on Feb 15-16 hurt momentum
- Lesson: Consistency > perfection. Daily presence matters even if engagement varies.

**Format Observations (limited data):**
- Best performer to date: Feb 10 announcement (656 imp, 15 likes)
- Lower: Feb 12 agent story scoreboard (290 imp, 8 likes)
- Pattern: Announcements and lessons outperform daily scoreboards
- "Day X/30" format may be losing steam (Krishna's observation from earlier)

**Process Learnings:**
- I ran observation loops on Feb 19 and Feb 20
- Proposed angles both days based on team output
- Krishna approved drafts but didn't post them immediately
- Gap: Need to propose angles faster and earlier in the day

**Team Output This Week:**
- Vyasa: 2 blogs published, 3 enrichments completed
- Vibhishana: 92 new Reddit questions, 3 SEO briefs
- Vidura: 3 tool opportunities identified, evening reviews running
- **Insight:** Strong raw material for LinkedIn content - need to bridge this to ICP pain points

**What to Test Next Week:**
1. Drop "Day X/30" counting format
2. Focus on outcome stories over activity reports
3. Bridge agent output to founder problems (not just "here's what happened")
4. Maintain daily posting cadence

**What I Still Need:**
- Full metrics for Feb 14-21 posts (impressions, likes, comments, profile views)
- ICP engagement signals (who's commenting? saves? DMs?)
- Krishna's feedback on which angles resonate vs. which fall flat

### Week of Feb 24-28, 2026

**Major Voice Feedback (Feb 25):**
> "The hook is 60% of the post virality or not."

This is the new filter. Not "is this insight interesting?" but "does this insight have a hook that stops an ICP founder mid-scroll?"

**Voice violations caught:**
1. **Negation-to-pivot overuse** - "it isn't X, it's Y" / "these aren't X, they're Y"
   - Krishna: "I HATE it when negation is used just for the drama"
   - Rule: Only use negation if it adds value, not to create false pivots
   
2. **Non-conversational guru phrases** - "That's the unlock"
   - Krishna: "Nobody says 'that's the unlock'"
   - Test: Would Krishna say this exact sentence over coffee?

**Docs updated:**
- SOUL.md: Negation-to-pivot now marked as "Krishna HATES this"
- writing-guide.md: Added "Krishna's Voice Constraints" section

**Draft iterations:**
- "The Specification Skill Shift" v1: Had 2 negation-to-pivots + "that's the unlock"
- v2: Removed both violations
- v3 (Krishna's final edit): Added bullets, CAPS emphasis, "already", time-context, conversational CTA
- Lesson: Run the Friend Test on EVERY sentence before presenting

**Krishna's editing patterns captured:**
1. Bullet points (•) for scannable lists
2. CAPS for emphasis ("THEY need to answer")
3. "already" adds urgency ("clock is already running")
4. Time-context makes insights feel current ("relevant NOW")
5. "that one X" more conversational than "the first X"
6. Scare quotes for casualness ("feature")
7. Past + present tense in CTAs ("struggle, or had to struggle")
8. Cleaner CTAs (just ask, don't promise value exchange)

**Scheduled:** Feb 26, 2026 at 8:30 AM IST (first LinkedIn post from blog extraction)

### Week of March 1-7, 2026: First Week of Two-Phase Flow

**Pipeline Performance:**
- 14 post-briefs extracted across 4 blogs
- 5 dropped (36%) - "too builder-focused"
- 3 moved to draft_ready (21% approval rate)
- 5 pending review
- 0 posts published on LinkedIn (no metrics available)

**Major ICP Filter Calibration:**

**What Krishna dropped (5 post-briefs):**
1. No-code migration angles → "Not for ICP - too builder focused"
2. Agency structural misalignment → "Not interesting"
3. Validation-before-building paradigm shift → "Too builder focused. Not for the right ICP"

**Pattern in drops:**
- Talking TO founders building products
- Technical migration paths
- Generic startup advice (MVP validation playbooks)

**What Krishna approved (3 post-briefs → full posts written):**
- "The Over-Validation Trap" (domain experts stuck in research)
- "Two Types of Validation" (market vs execution validation)
- "5 Peers Not 50 Strangers" (leverage industry networks)

**Pattern in approvals:**
- Talking TO established service business founders (35-50, $100K-$2M)
- Recognition-first framing ("the skill that made you successful is now the obstacle")
- Permission-giving ("you already validated, stop researching")
- Empowering reframes (domain expertise IS the advantage)

**Hook Krishna Loved:**
> "Here is the red flag most founders miss: if your MVP takes longer to build than it takes to test your core assumption, the timeline is backwards."

**Why it worked:** Pattern diagnosis + makes timeline itself an evaluation criterion (actionable filter)

**CTA Direction from Krishna:**
> "CTA should be something which triggers the ICP to WANT to either DM me or comment their pain point, or to look for some validation in terms of how quickly it could be built out in todays world."

**Shift from value-exchange to validation offer:**
- Old: "What's the one assumption you need to test?"
- New: "Drop your situation - I'll tell you if you need 6 months or 6 weeks"

**Voice Learnings This Week:**

**Recognition-first beats diagnosis:**
- ✅ "Your domain expertise is now your advantage" (empowering)
- ❌ "Here's what you're doing wrong" (judgmental)

**Permission-giving beats prescriptive:**
- ✅ "Stop researching what you already know"
- ✅ "You built a $500K business solo, why need a cofounder?"

**Rationale field is the approval gate:**
- Must answer: "Why would a 45-50yo service business owner BOOKMARK this?"
- Bad: "This is useful for founders"
- Good: "A 45yo consultancy founder thinks they need 50 interviews. This gives them permission to leverage their 200+ peer network instead."

**Process Learnings:**

**Cron Priority System Working:**
1. needs_revision (feedback-first)
2. approved (write full posts)
3. new work (extract angles)

**ICP Filter Needs Tightening:**
- 21% approval rate means I'm still extracting too many builder-focused angles
- New filter: Before extracting, ask "Is this blog about RUNNING a service business or BUILDING a product?"
- If product-focused, reframe harder OR skip

**Experiment for Next Week:**
Extract ONLY from blogs about service business operations/automation. Skip MVP/startup/cofounder blogs unless can reframe for established founders productizing expertise.

**Hypothesis:** >50% approval rate when source material is inherently ICP-aligned.

**Outstanding Questions:**
1. Are the 3 draft-ready posts from "Validate Domain Expert" ready to publish?
2. When will we get LinkedIn metrics for published posts?
3. Should I continue extracting from startup/MVP blogs or focus on service business ops?
