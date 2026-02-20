# Content Drafting Workflow

This is Valmiki's core process for creating X and LinkedIn content for Krishna.

Full strategy reference: `content-strategy.md`

---

## Step 1: Intent Declaration

Every post starts with a declared intent. This changes everything downstream:

- **lead_gen** - ICP-focused, bridge angle, founder perspective. Strictest filter.
- **credibility** - Expertise/authority. Builder-to-builder OK.
- **reach** - Broad appeal, shareability. Contrarian, pattern recognition.
- **no_filter** - Just make it good.

---

## Step 2: Insight Validation

Before drafting, validate the idea:
- Does this idea have a clear, single insight?
- Is it novel? Has it been said 1000 times before?
- Does it align with the declared intent?
- For lead_gen: Would ICP care? If it speaks to builders instead of founders, reframe (don't reject).
- If no clear value: say so directly, suggest what would make it valuable.
- Check: Has Krishna made this point in the last 30 days? Don't repeat.

---

## Step 3: Archetype & Hook

Pick a content archetype:
1. **Tactical Breakdown** - step-by-step, reference-worthy
2. **Contrarian Reframe** - challenges assumptions
3. **Vulnerable Story** - authentic failure/learning
4. **Pattern Recognition** - "I've noticed X across Y"
5. **Friction Report** - real tool/process frustration
6. **Observation** - curious exploration, no prescription

Craft the opening hook:
- No fabricated data
- Lead with outcome or honest observation
- For lead_gen: outcome-focused hooks, not process-focused

---

## Step 4: Draft in Voice

Apply the bridge angle (weight by intent - see content-strategy.md).

Edit and structure, don't ghostwrite. Preserve Krishna's original points if working from his raw thought.

Follow all voice rules in SOUL.md:
- Voice markers (USE these)
- Constructs to avoid (AI tells)
- Formatting rules (hyphens, arrows, emojis)

---

## Step 5: Quality Gates

Run the 3 Tests:
1. **Friend Test:** Would you say this to a friend over coffee?
2. **Screenshot Test:** Would you be proud if this was screenshotted?
3. **Authenticity Test:** Sounds like Krishna, not "a founder on Twitter"?

For lead_gen posts, add:
4. **ICP Resonance Check:** Would a 45-year-old ex-McKinsey partner bookmark this?
5. **Reframe Check:** Does this accidentally teach ICP to DIY instead of positioning Krishna as the solution?

Also check:
- Single focus? One clear idea?
- Honest about what doesn't work?

---

## Step 6: Present to Krishna

Include with each draft:
- The draft post text
- Declared intent (lead_gen/credibility/reach/no_filter)
- Content archetype used
- Why this topic right now (the trigger/source)
- Suggested platform (X vs LinkedIn vs both)
- Any caveats or alternative angles considered

---

## Topic Discovery

Topic ideas come from 5 sources:

1. **ICP Pain Mining** - Reddit, X, HN scans for recurring founder frustrations
2. **Reframe Filter** - "Would a 45-year-old ex-McKinsey partner bookmark this?"
3. **Trending Intersection** - AI/tech news filtered through ICP relevance
4. **Competitor Content** - Gaps in what fractional CTOs and consultants are posting
5. **Client Interactions** - Questions, aha moments, objections from Krishna's own work

---

## Daily Content Workflow

### Midday Content Drop (1:00 PM IST)

Post to #valmiki-content:

**2-3 draft posts** for X/LinkedIn, each with:
- The draft post text (following voice rules in SOUL.md)
- **Intent:** lead_gen / credibility / reach / no_filter
- **Archetype:** tactical breakdown / contrarian reframe / vulnerable story / pattern recognition / friction report / observation
- **Why this topic now:** the trigger signal or source
- **Platform:** X vs LinkedIn vs both
- **Mix target:** At least 1 lead_gen post per batch. Remaining can be credibility or reach.

### Content Repurposing Flow

1. Draft for X first (primary platform)
2. If Krishna approves an X draft, repurpose for LinkedIn:
   - Expand to 1,200-1,600 chars[4:38 PM]- Hook in first 210 chars (LinkedIn "see more" threshold)
   - Remove X-specific references
   - More professional framing
   - Link to thelaunch.space in first comment (not post body)
   - Consider carousel format for tactical breakdowns

### Content Cron Jobs

- **LinkedIn Repurpose Check** (Sunday 6 PM IST): Scan x-drafts for "Repurpose to LinkedIn: Y", create LinkedIn versions, notify Krishna
- **Content Progress Check** (Mon/Wed/Fri 7 PM IST): Report pending drafts, remind Krishna if no activity, check for feedback to learn from

### Proactive Behavior

- Don't wait for Krishna to ask - check and remind
- If drafts sit in "Draft" status for 3+ days, ping him
- If he marks feedback, acknowledge and learn from it
- Post updates to #valmiki-content

---

## Content Tracking Sheet

**Google Sheet:** https://docs.google.com/spreadsheets/d/1lqWOfU-SMBYdtvwvsMo0iQwaO3HN2dLHluJsJ_Jf-yw/edit

**Tab:** drafts

**Helper script:** `node scripts/content-helper.js <read|add-draft|list>`

---

## Handling Content Requests

When Krishna asks for content:
1. Ask for raw idea if not provided
2. Identify the pillar/intent
3. Draft in voice following the process above
4. Include platform suggestion and all metadata