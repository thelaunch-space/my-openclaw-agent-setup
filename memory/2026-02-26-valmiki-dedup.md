# Session: 2026-02-26 12:12:47 UTC

- **Session Key**: agent:main:main
- **Session ID**: 8f0d4324-b606-429f-8880-e54327fdd6ea
- **Source**: webchat

## Conversation Summary

assistant: ---

## ✅ I UNDERSTAND THE ISSUE

Looking at the linkedin-pipeline tab:

**Rows 2-6:** "How to Find a Technical Cofounder (Without Getting Ghosted)" — 5 insights
**Rows 7-11:** "How to Find a Technical Cofounder **as a Non-Technical Founder** (Without Getting Ghosted)" — 5 insights

**Same blog extracted TWICE** — same slug (`how-to-find-technical-cofounder`), same URL, but processed in two separate runs.

---

## The Problem

The current workflow has **no dedup check at the blog level**:
1. Valmiki's cron fires
2. Valmiki checks blog-queue for "Published" blogs
3. Valmiki extracts from the first one found
4. **BUT** there's no flag saying "I already extracted from this blog"

When the cron fires again (or if there was an error/retry), the same blog gets processed again.

---

## Your Proposed Fix (Correct)

**Add a column to `blog-queue` tab:**

| Column Name | Purpose | Values |
|-------------|---------|--------|
| `linkedin-extracted` | Has Valmiki already processed this blog? | `Yes` / (empty) |

**Valmiki's workflow becomes:**
1. Check blog-queue for Status = "Published" **AND** `linkedin-extracted` = empty
2. Before extracting: Set `linkedin-extracted` = "Yes"
3. Then proceed with extraction

This is **better than tracking in linkedin-pipeline** because:
- It's at the SOURCE (blog-queue) where Valmiki checks for work
- Prevents the query from even returning already-processed blogs
- Single source of truth

---

## Implementation

1. **Add column to blog-queue** (new column, probably column T or after Status)
2. **Update Valmiki's workflow** to check AND set this column
3. **Backfill for already-extracted blogs** — set "Yes" for the one blog already done

**Want me to add this column now?**
user: [media attached: /home/node/.openclaw/media/inbound/d038afd7-31d2-4c55-a2be-4f09b75dccdc.md (text/markdown) | /home/node/.openclaw/media/inbound/d038afd7-31d2-4c55-a2be-4f09b75dccdc.md]
To send an image back, prefer the message tool (media/path/filePath). If you must inline, use MEDIA:https://example.com/image.jpg (spaces ok, quote if needed) or a safe relative path like MEDIA:./image.jpg. Avoid absolute paths (MEDIA:/...) and ~ paths — they are blocked for security. Keep caption in the text body.
System: [2026-02-25 17:16:04 UTC] Slack message edited in #D0AD3R8FC14.
System: [2026-02-25 17:45:19 UTC] Slack DM from Krishna: I'm attaching a writing guide I put together for Valmiki. It covers two things: 1. *No fabricated experiences* — I've noticed Valmiki writes things like "I had

Conversation info (untrusted metadata):
```json
{
  "message_id": "1772041518.768389",
  "sender": "U0AD3QLN32S"
}
```

[Slack Krishna +16m Wed 2026-02-25 17:45 UTC] I'm attaching a writing guide I put together for Valmiki. It covers two things: 1. *No fabricated experiences* — I've noticed Valmiki writes things like "I had a chat with a legal founder yesterday" or "I've been talking to hundreds of founders" even when that isn't true. This needs to stop. Posts should be grounded in real observations and general intelligence, not invented anecdotes. The goal isn't to make Krishna sound experienced through fake stories — it's to deliver genuinely useful advice that earns outreach naturally. 2. *Writing mechanics* — Patterns extracted from Matt Gray's newsletter that make writing feel human and earned, not AI-recycled. Things like how to open a post, how to frame an insight, sentence rhythm, naming frameworks, using specific numbers. Please review the attached `writing-guide.md` and decide the best place to integrate this into Valmiki's workspace — whether that's SOUL.md, a referenced doc, or however you think makes most sense given how Valmiki reads context each session. Ideally - you should write one line to SOUL.md, AGENTS.md or whatever doc for Valmiki to refer to this guide. Upload this doc to VPS and then commit this also. Don't guess - please confirm with me if you understood what I'm asking for. [Slack file: writing-guide.md] [slack message id: 1772041518.768389 channel: D0AD3R8FC14] <file name="d038afd7-31d2-4c55-a2be-4f09b75dccdc.md" mime="text/markdown"> # Valmiki Writing Guide: Matt Gray Patterns > Read this before drafting every LinkedIn post. > These are mechanics extracted from Matt Gray's actual emails — sentence structures, framing patterns, and post architectures that make writing feel human and earned, not AI-recycled. --- ## 1. The Opening Line Rule Matt never wastes the first sentence. Every email opener is a standalone provocation designed to create a gap the reader needs to close. **Patterns he uses:** - **Subverted expectation**: State something that contradicts conventional wisdom. - "10x goals are actually easier than 2x goals." - "It's easier to become a millionaire than to earn $100K per year." - **Blunt diagnosis**: Name the problem directly, no warm-up. - "Most founders get this backwards..." - "Your LinkedIn is probably broken." - "Authority isn't about time served — it's about value delivered." - **Quiet challenge**: Address the reader directly with something that stings a little. - "I challenge you that your goals are too small." - "Boring industries are goldmines." - **Scene-setting in one line**: Drop the reader into a moment. - "I just spent 2 days in London showing a $750M wealth management firm how to build a real media company." - "March 2020. Economy shifts overnight." **What to avoid**: Starting with "In today's post..." or "I want to talk about..." or any variation of announcing what you're about to say instead of just saying it. --- ## 2. The Two-Founder Setup Matt uses a comparison structure constantly — two people, same inputs, different outputs. It creates instant tension and makes the insight feel earned. **Template:** ``` Two [type of person]. Same [variable 1]. Same [variable 2]. Same [variable 3]. [Person A] gets [mediocre outcome]. [Person B] gets [exceptional outcome]. The difference? [The insight you're about to teach.] ``` **Real examples:** - "Two founders. Same expertise. Same content quality. Same posting frequency. Founder A builds 10,000 passive followers. Founder B builds 1,000 activated champions." - "Two executive coaches. Same credentials. Same experience. Same city. Coach A struggles to differentiate. Coach B is recognized as a thought leader." **Why it works**: It removes defensiveness. The reader doesn't feel attacked — they're watching two other people, and they self-select which one they are. **Use this when**: The insight hinges on a mindset or approach shift, not just a tactic. --- ## 3. The Personal Confession Opener When Matt shares a habit, mistake, or realization, he leads with self-implication before giving the lesson. This is what stops it from sounding like advice from above. **Structure:** 1. "I used to [wrong behavior / mistaken belief]." 2. "Then [something happened / I realized something]." 3. "Here's what I learned." **Real example:** - "I used to think aiming for something realistic was smart. Until years ago, I sat down to set my revenue goals for Founder OS. And something weird happened. I couldn't shake the feeling that I was playing it safe. So I sat down… And wrote something that scared me. $10,000,000." **The mechanics to copy:** - Use short, punchy sentences after the setup — the rhythm slows down to mark importance. - The ellipsis or line break before the scary number/realization is deliberate. It creates a pause. - Never explain why you were wrong before showing you were wrong. Show first, explain second. --- ## 4. The "Here's a realization that cost me X" Frame Matt regularly frames insights by attaching a price to them — time, money, or pain. This signals the insight is real, not theoretical. **Templates:** - "Here's a realization that cost me 3 years:" - "I was working 80-hour weeks… Burned out and depressed… Convinced that if I just worked harder, we'd break through... I was wrong." - "The breakthrough came when I stopped asking 'how do I do more?' And started asking 'what would have to be true to 10x this?'" **Applied to thelaunch.space context**: When Krishna's blog insights translate to Valmiki posts, use this frame to attach real cost to the insight — not fake dramatic cost, but the actual time or money the wrong approach costs founders. Example: "I've seen founders spend $30K on an agency before realizing..." is better than "Many founders make the mistake of..." --- ## 5. Named Frameworks (Give Everything a Name) Matt almost never leaves a concept unnamed. Every system, sequence, and approach gets a proper noun. This does two things: it's memorable, and it signals that this is a developed methodology, not an opinion. **Examples from his emails:** - Trust Acceleration Sequence - Content GPS (Generate, Produce, Systematize) - 10-3-1-90 Vision System - The Movement Framework - Industry Authority Playbook - Community Leverage Secret - Human-Centered Operations **How to apply**: When Valmiki extracts an insight from a blog post, if the blog describes a process or framework — even informally — give it a name in the LinkedIn post. Don't say: "There are three steps to validating your idea." Say: "I call this the Domain Validation Loop — three steps that let you test demand before writing a line of code." --- ## 6. Anchor Numbers for Credibility Matt uses specific numbers, not round ones. Specific numbers read as real; round numbers read as estimated. **Pattern examples:** - "3.7 seconds" (not "a few seconds") - "$15,000 for a 47-page positioning document" (not "a lot of money for a long doc") - "500,000+ people trying to make $100K/year. Maybe 50,000 trying to hit $1M. Less than 5,000 pursuing $10M." - "Over 1,400 founders" (not "over a thousand founders") - "15 years of experience" (not "decades of experience") **Rule**: If you can cite a number from the original blog post (cost, time, percentage, user count), use the exact number in the LinkedIn post. It elevates the post from opinion to evidence. --- ## 7. The Highway / Metaphor Insert Matt regularly inserts one concrete metaphor mid-argument to make the abstract visceral. He doesn't over-explain it — he lands it and moves on. **Examples:** - "Think about highway traffic for a second. Everyone merges into the same 2 lanes. The 'safe' lanes. The ones that look like they're moving. Meanwhile, the fast lane is wide open. Nobody believes they belong there. So nobody even tries." - "Your brain is running at 3% battery." (from the evening checklist email) **How to use this**: Pick one moment in the post where the core tension is highest, and insert a one-sentence scene or comparison. Don't explain the metaphor — just place it and let it land. Then return immediately to the argument. --- ## 8. The "Most Founders Do X. Here's the Trap." Structure Matt has a recurring pattern for revealing a widespread mistake. The structure is: describe the behavior in a way that's familiar and relatable → label it as the trap → pivot to the correct approach. **Template:** ``` Most [people] aim for [safe/comfortable thing]. They want [specific example of safe goal]. [These] feel "realistic." Safe. Achievable. But here's the trap: [Why the safe thing is actually harder / more costly] [The correct reframe] ``` **Key mechanics**: - The short stacked lines after "They want..." build a rhythm that feels like nodding agreement — then the pivot is a pattern interrupt. - "But here's the trap:" is a near-literal construction he uses. It signals the frame shift clearly. - The middle is where you validate the reader before correcting them. Never correct without validating first. --- ## 9. Case Study Format (The James/Sandra/Kyle Structure) When Matt illustrates with a person, he follows a consistent arc: 1. **Setup**: "[Name] was a [role] with [surface-level success/problem]." 2. **The hidden gap**: "Despite [credentials/effort], [the actual problem they couldn't see]." 3. **The systematic fix**: Numbered phases or steps, each with a name. 4. **The outcome**: Described in terms of behavior change, not just results. (Not "he made more money" — "prospects began reaching out, conversations shifted...") 5. **The principle extracted**: One clean sentence that turns the case study into a universal lesson. **Key detail**: Matt ends case studies with behavioral change, not revenue claims. This makes them feel credible and avoids the "success story" cliché. Model this: describe what changed in how people behaved toward the person, not what the person earned. --- ## 10. The Closing Challenge (Not a CTA) Matt's posts rarely end with "follow me for more" or "drop a comment." They end with a directive that puts the ball in the reader's hand. **Examples:** - "Take your biggest goal right now. The one you've been telling yourself is the 'stretch' goal. Now 10x it. Write it down. Look at it every morning. And ask yourself: 'What would have to be true for this to happen?'" - "Here's my challenge to you..." - "The results will surprise you." **Structure**: Verb → small concrete action → payoff promise. For Valmiki, the closing should connect back to the specific blog the post was extracted from, offering the full depth as the natural next step — not as a "click here" pitch, but as a genuine "if this resonated, the full framework is at [URL]." --- ## 11. Sentence Rhythm Mechanics Matt writes in a specific rhythm that alternates between long complex sentences and very short ones. The short sentences carry the emotional weight. **Pattern:** - Long setup sentence (provides context, builds tension). - Short sentence. (lands the insight) - Very short. (emphasis) - Then slightly longer again to explain or expand. **Example from his emails:** > "I was working 80-hour weeks… Burned out and depressed… Convinced that if I just worked harder, we'd break through... > > I was wrong. > > The breakthrough came when I stopped asking 'how do I do more?'" **For LinkedIn specifically**: The short sentences belong at the start of new lines / new visual breaks. On LinkedIn, a three-word sentence on its own line reads like a headline. Use this for the single most important line in the post. --- ## 12. What Makes Writing Feel AI-Recycled (Avoid These) Based on what Matt consistently avoids: - **Filler transitions**: "In today's newsletter...", "Let's dive in", "Without further ado", "As I mentioned above" - **Hedge stacking**: "It's important to note that", "Generally speaking", "In many cases" - **Generic superlatives**: "game-changing", "revolutionary", "transformative" — these are noise. Use the specific outcome instead. - **Passive voice for failure**: "Mistakes were made" → Matt says "I was wrong." Own it in first person. - **Telling instead of showing the insight**: Don't say "this is a counterintuitive idea." Just state the counterintuitive idea. Let the reader feel the friction themselves. - **Symmetrical lists**: Real humans don't give you exactly 5 things every time. Uneven lists (3 items, or 7 items) feel more honest than perfectly round numbers. --- ## Quick Reference: Post Anatomy For a standard Valmiki LinkedIn post extracted from a blog: | Section | Matt Gray Pattern | Notes | |---------|-------------------|-------| | Line 1 | Subverted expectation OR blunt diagnosis | No warm-up, no preamble | | Lines 2–4 | Two-founder setup OR personal confession | Create tension before teaching | | Middle | Named framework + anchor numbers + one metaphor | Give the insight a name; use real numbers from the blog | | Pre-close | "Here's the trap" or case study outcome | Validate before correcting | | Close | Challenge / directive | Specific action, not vague encouragement | | Link (if any) | Natural reference to blog | "The full framework is at [URL]" — not "click here" | </file>
assistant: **Confirmed — I understand exactly what you're asking:**

1. **Save** `writing-guide.md` to `/home/node/openclaw/valmiki/writing-guide.md`
2. **Add one line** to Valmiki's SOUL.md (or AGENTS.md) that says something like: "Before drafting any LinkedIn post, read `writing-guide.md` for mechanics and patterns."
3. **Commit and push** to the GitHub backup

**My recommendation on where to put the reference:**

**SOUL.md** — because this is about *how* Valmiki writes (voice, mechanics, authenticity), not *what* Valmiki does (workflow). SOUL.md is about identity and voice; AGENTS.md is about tasks and schedules.

I'll add it to the "Personality" or voice section of SOUL.md.

**Shall I proceed?**
user: System: [2026-02-25 17:45:38 UTC] Slack message edited in #D0AD3R8FC14.
System: [2026-02-25 18:22:08 UTC] Slack DM from Krishna: there are some agent folder updates for valmiki. pls check and update GitHub

Conversation info (untrusted metadata):
```json
{
  "message_id": "1772043727.131709",
  "sender": "U0AD3QLN32S"
}
```

there are some agent folder updates for valmiki. pls check and update GitHub
assistant: ✅ **Pushed to GitHub**

**Files updated:**
- `valmiki/SOUL.md` — Voice rules updated
- `valmiki/MEMORY.md` — Memory updates
- `valmiki/memory/2026-02-25.md` — Today's log
- `valmiki/writing-guide.md` — Matt Gray patterns guide
- `scripts/linkedin-pipeline-helper.js` — Helper script updates
- `vibhishana/AGENTS.md` — Dedup fixes
- `vibhishana/MEMORY.md` — Memory updates

**Commit:** `7f8fbf5`
user: System: [2026-02-25 18:22:35 UTC] Slack message edited in #D0AD3R8FC14.
System: [2026-02-26 06:15:54 UTC] Slack DM from Krishna: I'm only brainstorming with you. Please do not make any changes to the workflow or anything yet. This is only a brainstorm, clearly. What does it take for us to

Conversation info (untrusted metadata):
```json
{
  "message_id": "1772086553.474379",
  "sender": "U0AD3QLN32S"
}
```

I'm only brainstorming with you. Please do not make any changes to the workflow or anything yet. This is only a brainstorm, clearly. What does it take for us to move away from Google spreadsheets, maybe do a little bit of a re-architecture of launch control itself. What if I do the communication on Slack here, like we're doing. What all the tasks and workflows, documents, etc. move to convex. For example, Vibhishana, when he does the brief, it goes and sits into the task board. imagine there is a trilogue board equivalent where we have to-do progress blog, or something like that, and under the to-do, all the tasks are put up and allocated to either an agent or to me. Similarly, put it in block. this, I think this might give me like a much, much better view of how and what is actually happening, where is my review needed, what is blocked, etc. Right now, everything is all over the place. Also, I'm thinking instead of writing to Google Sheets and to convex and having two sources of truth, what if we just do one source of truth which is convex. for example, agent can go through, can do a pull from convex or a read from convex about the status, and then pick from there. That also should be possible, right? I mean, I'm just brainstorming. Think about it and let me know what you think.
assistant: This is a great direction. Let me think through it with you.

---

## 📋 CURRENT STATE (The Problem)

| Layer | What It Does | Issues |
|-------|-------------|--------|
| **Google Sheets** | Source of truth for work tracking | Field mismatches, sync delays, URL drift, no real-time updates |
| **Convex** | Display layer (Launch Control) | Write-only — agents can't READ from it |
| **Slack** | Communication | Works well, keep this |

**Pain points:**
- Agents write to BOTH Sheets and Convex (double work, sync bugs)
- You review in Sheets but visitors see Launch Control (different views)
- No unified "what needs my attention" view
- When something breaks (like the URL mismatch), it's hard to trace

---

## 🎯 YOUR VISION (Single Source of Truth)

```
┌─────────────────────────────────────────┐
│           CONVEX (Single SOT)           │
│  ┌─────────────────────────────────┐    │
│  │  Kanban Board in Launch Control │    │
│  │  ┌───────┬───────┬───────┬────┐│    │
│  │  │To Do  │In Prog│Review │Done││    │
│  │  ├───────┼───────┼───────┼────┤│    │
│  │  │Brief 1│Blog 2 │Brief 3│    ││    │
│  │  │Brief 2│       │       │    ││    │
│  │  └───────┴───────┴───────┴────┘│    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
         ▲                    │
         │ WRITE              │ READ
         │                    ▼
    ┌────────────┐      ┌────────────┐
    │ Vibhishana │      │   Vyasa    │
    │ creates    │      │  queries   │
    │ brief      │      │ "Brief     │
    │            │      │  Ready"    │
    └────────────┘      └────────────┘
```

---

## ✅ YES, THIS IS POSSIBLE

**What Convex can already do:**
- Store all the data (it already does for Launch Control)
- Real-time subscriptions (UI updates instantly when data changes)
- HTTP endpoints for agents to write (already have these)

**What needs to be ADDED:**

### 1. Query Endpoints (Agents READ from Convex)

```typescript
// NEW: Agents can pull their work queue
GET /getBriefs?status=pending_review
GET /getBriefs?status=brief_ready&assignee=Vyasa
GET /getTasks?assignee=Krishna&status=needs_review
```

### 2. Kanban-Compatible Schema

```typescript
// Enhanced brief schema
{
  title: string,
  slug: string,
  status: "todo" | "in_progress" | "review" | "blocked" | "done",
  assignee: "Vibhishana" | "Vyasa" | "Krishna",
  priority: "high" | "medium" | "low",
  blockedReason?: string,
  dueDate?: string,
  // ... existing fields
}
```

### 3. Kanban UI in Launch Control

- **Columns:** To Do → In Progress → Review → Done (+ Blocked)
- **Cards:** Brief/Blog/Task with title, assignee, age
- **Drag-drop:** Krishna moves cards between columns (updates status)
- **Filters:** By agent, by type, by priority

---

## 🔄 MIGRATION PATH

| Phase | What Changes | Effort |
|-------|-------------|--------|
| **Phase 0** | Add query endpoints to Convex | Claude Code, 1-2 hours |
| **Phase 1** | Build Kanban UI in Launch Control | Claude Code, 1-2 days |
| **Phase 2** | Migrate agent workflows (read/write Convex only) | Me + you, 1-2 days |
| **Phase 3** | Deprecate Google Sheets | Just stop writing to it |

**You don't have to do it all at once.** You could:
1. Build the Kanban UI that reads from Convex (Phase 1)
2. Keep agents writing to BOTH for now
3. Once Kanban works, migrate agents one by one

---

## 💡 WHAT THIS UNLOCKS

| Feature | Current | After Migration |
|---------|---------|-----------------|
| **"What needs my review?"** | Check Sheets manually | One Kanban column |
| **"What's blocked?"** | Ask agents in Slack | Blocked column + reason |
| **"Which agent is working on what?"** | Check multiple channels | Filter by assignee |
| **"Did the brief push work?"** | Cross-check Sheets vs Convex | Only one place to check |
| **Real-time updates** | Refresh Sheets | Auto-updates in Convex |

---

## 🤔 CONSIDERATIONS

**Convex free tier:** Still fine. You'd be doing ~50-100 queries/day from agents instead of 0. Well within limits.

**Offline risk:** If Convex is down, agents can't work. (With Sheets, same risk exists for the Sheets API.) Could add a local cache/fallback if paranoid.

**Learning curve:** Agents currently know Sheets. Switching to Convex queries is straightforward but needs doc updates.

---

## MY TAKE

**This is the right direction.** The current dual-write system is the source of most sync bugs. Single source of truth is cleaner.

The Kanban view specifically solves your "everything is all over the place" problem — you'd have ONE screen that shows:
- What's waiting for you (Review column)
- What's blocked (Blocked column)
- What's in progress (who's working on what)

**When you're ready, the path is:**
1. Tell Claude Code to add query endpoints
2. Tell Claude Code to build the Kanban UI
3. I'll migrate the agent workflows

Want me to draft the exact spec for Claude Code?
user: System: [2026-02-26 06:16:45 UTC] Slack message edited in #D0AD3R8FC14.
System: [2026-02-26 06:45:01 UTC] Slack DM from Krishna: I want to flag two issues - one inconsistency, and one error, out here. Go through the conversations I've had with Vibhishana yesterday. I've clearly told that

Conversation info (untrusted metadata):
```json
{
  "message_id": "1772088299.902039",
  "sender": "U0AD3QLN32S"
}
```

I want to flag two issues - one inconsistency, and one error, out here. Go through the conversations I've had with Vibhishana yesterday. I've clearly told that we need to rethink our ICP because, like, we've been over-indexing on the same similar kind of questions about MVP, building, shipping, etc. which is not really what my ICP is looking for. They are looking for business intelligence, they're looking for business growth, they're looking for how do we think about AI in their business and workflows. those are some important things that we should talk about. These blogs are fine so far, but they're all addressing the same persona which is not likely my ICP so far. I've had this discussion already yesterday. Now, the error - this is what Vibhishana said - ":warning: *Convex push failed* - /upsertQuestion returning 404. Questions saved to Google Sheet only. May need endpoint update." This is most likely because something else may not be available. I've asked Vibheshana to find non-reddit communities also. We also decided that we will probably create a synthetic URL because the convex endpoint asks or checks deduplication based on the URL. This possibly could be the reason. Can you explore both these things and let me know what you think. Do not make any changes yet. Just report back with your findings. Let us discuss and then we will take a call.
assistant: Let me investigate both issues.
assistant: ---

## 📋 FINDINGS

### Issue 1: ICP Content Focus Drift

**What I found in Vibhishana's channel:**

Krishna had a conversation about pivoting the content focus. The current briefs are over-indexing on:
- MVP building
- Technical cofounder alternatives
- Shipping/launching

**What the ICP actually cares about:**
- Business intelligence (how do I understand my business better?)
- Business growth (how do I scale my services business?)
- AI in workflows (how do I use AI in my existing operations?)

**The mismatch:** We've been writing for "non-technical founder who wants to build" when the ICP is "domain expert who runs a services business and wants to grow/optimize."

**This is a strategic content pivot** — not a bug, but a deliberate shift you discussed with Vibhishana. Needs to be documented in:
- Vibhishana's SOUL.md (ICP lens for question filtering)
- The topic categories/priorities

---

### Issue 2: Convex Endpoint Error

**Root cause found:** Endpoint name mismatch

| Vibhishana Called | Actual Endpoint |
|-------------------|-----------------|
| `/upsertQuestion` (singular) | **Does not exist** → 404 |
| | `/upsertQuestions` (plural) ✓ |
| | `/ingestQuestions` (plural) ✓ |

**Test results:**
```
/upsertQuestion  → "No matching routes found" (404)
/ingestQuestions → {"success":true,"inserted":0,"updated":0} ✓
/upsertQuestions → Exists in http.ts ✓
```

**The fix:** Vibhishana needs to use `/upsertQuestions` (plural) not `/upsertQuestion` (singular).

---

### Issue 2b: Synthetic URLs for Non-Reddit Sources

**The context:** You asked Vibhishana to find non-Reddit communities (LinkedIn, Quora, X, etc.). These sources may not have clean URLs like Reddit does.

**The dedup problem:** Convex uses URL as the unique key. For non-Reddit sources:
- LinkedIn posts may have weird URLs or require auth
- Quora URLs may be long/unstable
- X/Twitter posts have `twitter.com/user/status/ID` format

**Synthetic URL approach:**
```
Format: synthetic://{source}/{date}/{slug}
Example: synthetic://linkedin/2026-02-25/founder-asks-about-crm
Example: synthetic://quora/2026-02-25/best-tools-for-consultants
```

This gives a unique identifier for dedup while marking it's not a real URL.

**Needs:**
1. Convex schema to accept synthetic URLs (probably already works since URL is just a string)
2. Vibhishana's workflow to generate synthetic URLs for non-Reddit sources
3. Launch Control UI to handle synthetic URLs gracefully (don't show as clickable link)

---

## 📝 SUMMARY

| Issue | Root Cause | Fix Needed |
|-------|-----------|------------|
| **ICP drift** | Over-indexing on "building" topics vs "business growth" topics | Update Vibhishana's ICP lens + topic priorities |
| **Convex 404** | Wrong endpoint name (singular vs plural) | Change `/upsertQuestion` → `/upsertQuestions` |
| **Synthetic URLs** | Non-Reddit sources need identifiers | Define format, update Vibhishana workflow |

**No changes made yet** — awaiting your decision on how to proceed.
user: System: [2026-02-26 06:45:57 UTC] Slack message edited in #D0AD3R8FC14.
System: [2026-02-26 07:06:11 UTC] Slack DM from Krishna: Okay. This is now regarding the Convex as the single source of truth, with Google sheets as a fallback, when Convex push fails. I was iterating with Claude Code

Conversation info (untrusted metadata):
```json
{
  "message_id": "1772089570.716219",
  "sender": "U0AD3QLN32S"
}
```

Okay. This is now regarding the Convex as the single source of truth, with Google sheets as a fallback, when Convex push fails. I was iterating with Claude Code, I shared our previous chat. Here is my conversation with Claude Code. Please read through this, with the context of the previous conversation that we had. &lt;chat-with-claude-code&gt; I want you to gather enough context about the agent setup that we've done, the current live projects that are out there, active projects as part of launch space, how they connect with each other. Once you gather this basic knowledge about what's happening, I want you to understand launch control and what we've built there. Now I'm having a conversation with Parthasarathi on Slack. Here is our conversation for your reference. This is exactly what we are going to brainstorm about. Remember, we are brainstorming, we are not takin any actions as yet. &lt;pasted our previous conversation from slack here - skipping it because you will have context about it anyway&gt; &lt;claude-response&gt; Good. I've now read the actual schema and all 12 endpoints. Let me give you the full architectural picture. This is going to be thorough because you asked for it — but I'll keep it structured. --- The Honest State of What Exists Schema: Solid foundation, but 4 specific problems: 1. topicClusters uses "brief-ready" (kebab-case). Everything else uses "brief_ready" (underscore). Silent inconsistency. 2. questions has BOTH a status: "brief_created" AND a briefCreated: boolean field. These are redundant — one drives the other. Should be one. 3. No linkedinPosts table. Valmiki's output is invisible to Convex. 4. No manualTasks table for Krishna's ad-hoc tasks. Endpoints: This is the real mess. You have 12 routes but they grew organically with no naming convention: - /ingestQuestions (plural) vs /ingestBrief (singular) vs /ingestBlog (singular) - /ingestBrief and /upsertBrief point to different mutations (briefs.ingest vs briefs.upsert) - /ingestBlog and /upsertBlog point to the same mutation — so the route duplication is pointless - There's no convention. Some routes use ingest, some use upsert, with no clear rule for which is which What's missing entirely: There are zero GET endpoints. Agents can only push to Convex. They can't read from it. That's why Partha still reads from Sheets. --- Architectural Verdict: Extend, Not Rebuild The data layer is sound. briefs, questions, blogs, agentActivity — these tables have the right shape. The problem is not the foundation — it's two missing layers on top of it: 1. Read layer (agents querying their work queue from Convex) 2. Work layer (the Kanban that makes artifact statuses actionable) A rebuild would mean losing 800+ live records, breaking 23 active cron jobs, and rebuilding things that already work. The case for extending is much stronger. --- The Data vs. Kanban Question You asked whether the schema should separate the data view from the Kanban view. My answer: no — and this is actually the elegant part. The schema doesn't need a separate "Kanban layer." The status field on each artifact IS the Kanban card. Here's why that's clean: - A brief with pending_review IS a task for Krishna. That IS the card. - When you change it to brief_ready, the card moves. Automatically. Because the status changed. - There's no sync problem. There's no second table to keep in line. The brief's status is the single truth. The Kanban is a computed view over artifact statuses. Not a separate data structure. The only exception — and this is important — is manual tasks: things Krishna creates himself, not tied to any agent artifact. Those need their own table (manualTasks) because they have no source artifact to hang off of. That's the only new table strictly needed for the Kanban to work. --- The Interlinkage You Described (This Is the Key UX Idea) What you described — brief card → open brief → review → approve → moves to Vyasa — is exactly the right mental model. Let me make it concrete for each artifact type: Brief (Vibhishana → Krishna → Vyasa pipeline): - Card in To Do: [Brief] Review: "How to Find a CTO" — owner: Krishna - Click "Review Brief" → BriefReaderModal opens (already built) - Inside modal: Approve / Needs Revision / Drop buttons - Approve → status becomes brief_ready → card moves to In Progress, owner becomes Vyasa - Vyasa's cron reads GET /briefs?status=brief_ready → picks it up → writes the blog - Vyasa pushes pr_created → new card appears: [Blog] Review PR: "..." — owner: Krishna - Click "View PR" → opens GitHub PR in new tab LinkedIn Post (Valmiki → Krishna): - Valmiki pushes a drafted post → card in To Do: [LinkedIn] Review Post — owner: Krishna - Click "Review Post" → opens the post content inline - Schedule / Skip → status changes, card resolves Lead / Booking: - Form submits → card in To Do: [Lead] New booking — Nikhil, Bureau - Click → slide-out panel showing time slot, email, company - Mark Contacted → In Progress → Mark Scheduled → In Progress → Complete → Done Tool Opportunity (Vidura → Krishna → future Vishwakarma): - Vidura proposes a tool → card in Backlog - Click → opens the tool proposal document - Approve → moves to To Do (waiting for Vishwakarma eventually) The pattern is: every card has one primary action, that action opens the source artifact, the artifact viewer has the status-change buttons. The card itself is lightweight — just a pointer. The substance lives in the artifact. --- The Sheets-as-Fallback Mechanism You said: Convex is primary, Sheets is fallback (data loss prevention only). This is simpler than what exists today. Today: Agent runs two independent writes — Sheets (always) AND Convex (always). Both succeed or fail independently. New: Agent tries Convex. If HTTP response is anything other than 200 → write to Sheets as a safety net. Slack message: "Convex push failed, fell back to Sheets for [brief/blog/etc]." This is a Partha job — it lives in the agent skill files on VPS. The change is a curl with an if/else around the HTTP status code. Not complicated. But it means Sheets goes from "always written" to "written only on failure." --- Endpoint Cleanup Plan (Without Breaking Agents) The naming mess can be fixed without breaking a single agent cron. Here's the approach: Keep all 12 existing endpoints alive — Partha's skill files point at them. Don't touch those paths. Add a clean canonical set alongside them: - All writes → POST /push/{resource} (plural, always) - /push/questions, /push/briefs, /push/blogs, /push/activity, /push/topic-clusters, /push/tool-opportunities, /push/documents, /push/linkedin-posts - All reads → GET /query/{resource} - /query/briefs (with ?status=brief_ready), /query/topic-clusters, /query/tool-opportunities - Specific updates → POST /update/{resource} - /update/brief-status, /update/blog-enrichment Partha migrates agent scripts to the canonical set at his own pace. The old endpoints stay forever (or until all agents are verified migrated). No flag days. --- The Sequence That Doesn't Break Anything Here's the order that guarantees zero disruption to live agent output: Phase 0 — Backend only. Agents untouched. 1. Schema additions (additive only): add manualTasks, linkedinPosts, fix topicClusters status typo, remove redundant briefCreated boolean from questions 2. Add canonical GET read endpoints for agents 3. Add canonical write endpoints (old ones stay as aliases) 4. Deploy to dev → test → deploy to prod Agents keep running. Nothing changes for them. All their existing endpoint paths still work. Phase 1 — Tell Partha (happens in parallel with Phase 2) 5. Share new read endpoints with Partha: "Here's how to read your work queue from Convex" 6. Partha updates helper scripts: read from Convex instead of Sheets 7. Partha updates push logic: Convex first, Sheets fallback 8. This is ~2-3 days of Partha's work, can happen while we build the Kanban Phase 2 — Frontend Kanban (can start immediately after Phase 0) 9. convex/workboard.ts — getBoard query + updateArtifactStatus mutation 10. Work Mode toggle in HeaderBar (admin-only) 11. WorkBoard.tsx, WorkBoardColumn.tsx, WorkBoardCard.tsx 12. Artifact viewer binding (brief → BriefReaderModal, blog → GitHub URL, post → inline, lead → panel) 13. Deploy Phase 3 — After Partha's migration is stable (2 weeks of observation) 14. Verify agents are consistently reading from and writing to Convex 15. Confirm Sheets is only getting entries on failure 16. Declare Sheets as archive — stop maintaining it, keep for historical reference --- What This Is and Isn't This is: - A clean operational layer on top of an existing solid data layer - A tight loop between task cards and artifact viewers - A real-time board that auto-updates as agents push new data - A clear, one-screen answer to "what needs my attention right now?" This is not: - A rebuild — existing data, endpoints, and Demo mode are untouched - A new data architecture — the schema additions are purely additive - A big bang migration — each phase is independently shippable --- The existing Kanban spec we wrote is ~90% still correct. The main things this conversation added: 1. Sheets as fallback (not dual-write — that's a meaningful difference) 2. Endpoint canonical cleanup alongside the old aliases (you were right about the inconsistency) 3. Artifact viewer binding for each card type (the tight link you described) 4. Minor schema fixes (the kebab/underscore inconsistency, the redundant briefCreated boolean) &lt;/claude-response&gt; &lt;/chat-with-claude-code&gt;
assistant: I've read through the Claude Code conversation carefully. This is a solid architectural plan. Let me give you my perspective as the one who'll be implementing the agent-side changes.

---

## 📋 MY UNDERSTANDING

### The Core Shift

| Current | New |
|---------|-----|
| Agents write to Sheets AND Convex (dual-write) | Agents write to Convex first, Sheets only on failure |
| Agents read from Sheets | Agents read from Convex via new GET endpoints |
| Two sources of truth (sync bugs) | One source of truth + fallback |

### What Claude Code Will Build

1. **Schema fixes:** kebab→underscore, remove redundant fields, add `linkedinPosts` + `manualTasks` tables
2. **GET endpoints:** `/query/briefs?status=brief_ready`, `/query/questions`, etc.
3. **Canonical write endpoints:** `/push/briefs`, `/push/questions` (old endpoints stay as aliases)
4. **Kanban UI:** Work Mode toggle, cards linked to artifact viewers

### What I'll Do (Phase 1)

1. **Update helper scripts:** Read from Convex instead of Sheets
2. **Update push logic:** Convex first → if fail → Sheets fallback + Slack alert
3. **Update all agent AGENTS.md files:** New endpoint URLs, new workflow

---

## ✅ WHAT I LIKE ABOUT THIS PLAN

**1. No big bang migration** — Existing endpoints stay, I migrate at my own pace. No risk of breaking all 23 crons at once.

**2. Sheets becomes safety net, not primary** — This eliminates the sync bugs we've been fighting (URL drift, field mismatches, etc.)

**3. Status field IS the Kanban** — Elegant. No extra "task" layer to maintain. A brief with `pending_review` IS your task.

**4. The artifact viewer model** — This is exactly how it should work:
   - See card: "[Brief] Review: How to Find a CTO"
   - Click → Opens BriefReaderModal
   - Approve → Status changes → Card moves → Vyasa sees it in their queue

---

## 🤔 QUESTIONS / CONSIDERATIONS

### 1. Read Endpoint Caching

When I query `/query/briefs?status=brief_ready`, how fresh is the data? If Vibhishana pushes a brief at 11:00 AM and Vyasa queries at 11:01 AM, will Vyasa see it?

**Convex is real-time, so probably yes** — but worth confirming.

### 2. Fallback Alert Mechanism

When Convex push fails and I fall back to Sheets, should I:
- Just post to Slack ("⚠️ Convex push failed, fell back to Sheets")
- Also create a retry task for my next health check?
- Or should there be an auto-retry mechanism?

**My suggestion:** Slack alert + add to a retry queue that my 7 PM due diligence processes.

### 3. Valmiki's linkedinPosts Table

This is new. What fields does it need? My guess:
```typescript
{
  title: string,           // Insight name
  content: string,         // Full post draft
  sourceBlogSlug: string,  // Which blog it came from
  status: "drafted" | "review" | "approved" | "posted" | "skipped",
  hookStrategy: string,
  ctaType: string,
  postedDate?: string,
  linkedinUrl?: string,
  agentName: "Valmiki"
}
```

### 4. Migration Timing

Claude Code says Phase 1 (my work) is "2-3 days." That's accurate IF:
- The GET endpoints are documented with exact response shapes
- I don't hit unexpected edge cases

**I'd estimate:** 3-4 days to be safe, including testing.

### 5. What About the linkedin-pipeline Tab?

We just created this yesterday. Once `linkedinPosts` table exists in Convex:
- Does Valmiki write to Convex instead?
- Or both (like current dual-write)?
- The tab has columns Convex might not have (ICP Pass, Hook Strategy, etc.)

**My suggestion:** Valmiki writes to Convex. The linkedin-pipeline tab becomes the Sheets fallback, same as other artifacts.

---

## 📝 SUMMARY

| Aspect | My Assessment |
|--------|---------------|
| **Overall plan** | ✅ Sound, well-sequenced |
| **Risk to live agents** | Low (old endpoints stay) |
| **My migration effort** | 3-4 days |
| **Biggest win** | Single source of truth eliminates sync bugs |
| **Biggest concern** | Making sure GET endpoints return exactly what agents need |

**I'm ready to start Phase 1 whenever Claude Code completes Phase 0.**

Want me to draft the exact spec for what I need from the GET endpoints?
user: [media attached: /home/node/.openclaw/media/inbound/737a02b1-7f25-4b7a-b446-eb7b79690f12.md (text/markdown) | /home/node/.openclaw/media/inbound/737a02b1-7f25-4b7a-b446-eb7b79690f12.md]
To send an image back, prefer the message tool (media/path/filePath). If you must inline, use MEDIA:https://example.com/image.jpg (spaces ok, quote if needed) or a safe relative path like MEDIA:./image.jpg. Avoid absolute paths (MEDIA:/...) and ~ paths — they are blocked for security. Keep caption in the text body.
System: [2026-02-26 07:06:56 UTC] Slack message edited in #D0AD3R8FC14.
System: [2026-02-26 07:58:03 UTC] Slack DM from Krishna: Parthasarathi — I'm sharing a canonical reference doc for all Convex write endpoints and schemas. This is the single source of truth going forward. Please revie

Conversation info (untrusted metadata):
```json
{
  "message_id": "1772092681.522239",
  "sender": "U0AD3QLN32S"
}
```

[Slack Krishna +51m Thu 2026-02-26 07:58 UTC] Parthasarathi — I'm sharing a canonical reference doc for all Convex write endpoints and schemas. This is the single source of truth going forward. Please review Section 6 (the audit checklist) and report back on whether your agent skill files and helper scripts are aligned. The most urgent item: check whether Vibhishana is using /ingestBrief — that endpoint has a dedup bug and creates duplicates. Once I have your audit back, I'll share a second doc on the read (GET) endpoints for you to spec out. No rush on implementation yet — audit first. This is picked from Convex schemas and stufff already implemented. I am super TIRED of all the inconsistencies and mismatches arising from something as SIMPLE as mismatched names - so please review ALL and every steps of your agents, including yours. Treat this doc as the final one - and please find out if there are deviations. Report back with your findings, and let's fix it proactively. Put your max focus on this please. DEtailed check. [Slack file: CONVEX-API-REFERENCE.md] [slack message id: 1772092681.522239 channel: D0AD3R8FC14] <file name="737a02b1-7f25-4b7a-b446-eb7b79690f12.md" mime="text/markdown"> # Convex Write API Reference — Canonical Single Source of Truth **Version:** 2026-02-26 **Status:** AUTHORITATIVE — All agents must align their docs to this file. **Companion doc:** `CONVEX-GET-REFERENCE.md` — GET (read) endpoints spec. To be shared after this audit is complete. **Purpose:** This document defines the exact, final Convex write API surface: POST endpoint paths, request schemas, response shapes, and allowed status values for every table. It eliminates the naming inconsistencies and redundancies that have caused sync bugs. --- ## How to Use This Document (Parthasarathi) 1. **Read Section 2** — understand the naming problems being fixed and why. 2. **Read Section 3** — the canonical endpoint paths going forward. 3. **Read Section 4** — the exact field names and allowed values for each table. 4. **Check your agent skill files and helper scripts** against this reference. 5. **Report back:** For each endpoint your agents currently call, confirm whether they're using the canonical path or an old alias. Flag any field name mismatches. 6. **After review**, draft the GET endpoint response shapes (Section 6 — stub left for you). --- ## 1. Base URL and Authentication | Environment | Base URL | |-------------|----------| | **Production** | `https://curious-iguana-738.convex.site` | | **Dev** | `https://impartial-pelican-672.convex.site` | **Auth:** All write endpoints require a Bearer token header. ``` Authorization: Bearer <AGENT_API_KEY> ``` The API key is stored on VPS at: `/home/node/openclaw/credentials/convex-api-key.txt` Read it in shell scripts with: ```bash CONVEX_KEY=$(cat /home/node/openclaw/credentials/convex-api-key.txt) ``` --- ## 2. The Naming Problem (Read This First) The current endpoint set grew organically and has three problems: **Problem 1 — Singular vs. plural inconsistency** - `/ingestQuestions` (plural) vs. `/ingestBrief` (singular) vs. `/ingestBlog` (singular) - No consistent rule. **Problem 2 — `ingest` vs. `upsert` with no clear rule** - Some things use `ingest`, some use `upsert`, with no semantic difference to agents. - Worse: `/ingestBrief` and `/upsertBrief` call **different mutations** with **different behavior**. - `/ingestBrief` → always INSERTs (no dedup). Running twice = duplicate records. **This is a bug.** - `/upsertBrief` → checks for existing slug first, updates if found. This is correct behavior. **Problem 3 — Redundant aliases with no clear winner** - `/ingestBlog` and `/upsertBlog` call the **exact same mutation** — they're identical. One is redundant. - `/ingestQuestions` and `/upsertQuestions` also call the **exact same mutation**. One is redundant. **The fix:** A single consistent convention, documented here. Old endpoints stay alive as aliases forever (zero broken agents) but agents should migrate to canonical paths. --- ## 3. Canonical Endpoint Reference ### Convention Rules - All resource names in paths are **plural** (questions, briefs, blogs, not question/brief/blog) - All resource names use **kebab-case** for multi-word names (topic-clusters, tool-opportunities, linkedin-posts) - Write new/upsert operations use prefix **`/push/`** - Partial update operations use prefix **`/update/`** - Read operations use prefix **`/query/`** (GET method) --- ### 3a. Write Endpoints (POST) — Currently Live All require `Authorization: Bearer <AGENT_API_KEY>`. All return: `{ "success": true, ... }` on success, `{ "success": false, "error": "..." }` on failure. --- #### `POST /push/questions` **Purpose:** Upsert one or more Reddit questions. Deduplicates by `url` field. **Called by:** Vibhishana **Old aliases (still work):** `/ingestQuestions`, `/upsertQuestions` **Request body:** Array of question objects (preferred) or single object. ```json [ { "title": "How do I hire my first employee?", "subreddit": "r/smallbusiness", "url": "https://reddit.com/r/smallbusiness/comments/...", "questionPain": "Doesn't know where to start with hiring", "icpRelevance": "HIGH", "launchSpaceAngle": "AI can handle initial candidate screening", "contentPotential": "Strong blog candidate", "engagement": "45 upvotes, 67 comments", "notes": "Multiple replies mention cost as blocker", "postDate": "2026-02-20", "scannedAt": "2026-02-26T09:00:00.000Z", "status": "new", "agentName": "Vibhishana", "batchId": "scan-2026-02-26-morning" } ] ``` **Response:** ```json { "success": true, "inserted": 12, "updated": 3 } ``` **Dedup behavior:** Matches on `url`. If found, updates `scannedAt`, `engagement`, `icpRelevance`, `contentPotential`, `notes`. All other fields preserved. --- #### `POST /push/briefs` **Purpose:** Upsert a research brief. Deduplicates by `slug` field. **Called by:** Vibhishana **Old aliases (still work):** `/upsertBrief` **⚠️ Do NOT use:** `/ingestBrief` — this is the broken alias that always inserts without dedup and can create duplicates. Agents must migrate away from this. **Request body:** ```json { "title": "How to Hire Your First Employee as a Small Business Owner", "slug": "how-to-hire-first-employee-small-business", "primaryKeyword": "how to hire first employee", "longTailKeywords": ["hiring first employee checklist", "small business first hire"], "finalKeywords": ["how to hire first employee", "first employee small business"], "icpProblem": "Owner is doing everything themselves, burning out", "competitiveGap": "Most articles focus on compliance, not the emotional/operational shift", "launchSpaceAngle": "AI can handle candidate screening, saving owners 10+ hours", "suggestedStructure": "## Why Your First Hire Feels Impossible\n## The 5-Step Framework\n...", "researchNotes": "Reddit threads show cost anxiety is primary blocker", "rankingNotes": null, "contentMarkdown": "# Full brief content here...", "sourceQuestionId": "<convex_id_of_source_question>", "sourceUrls": ["https://reddit.com/r/smallbusiness/comments/..."], "blogUrl": null, "category": "Operations", "status": "pending_review", "createdAt": "2026-02-26T11:00:00.000Z", "agentName": "Vibhishana" } ``` **Response:** ```json { "success": true, "id": "<convex_id>", "action": "inserted" } // or { "success": true, "id": "<convex_id>", "action": "updated" } ``` **Dedup behavior:** Matches on `slug`. If found, patches all provided fields including `updatedAt`. --- #### `POST /push/blogs` **Purpose:** Upsert a blog entry. Deduplicates by `slug` field. **Called by:** Vyasa **Old aliases (still work):** `/ingestBlog`, `/upsertBlog` **Request body:** ```json { "title": "How to Hire Your First Employee as a Small Business Owner", "slug": "how-to-hire-first-employee-small-business", "url": "https://thelaunch.space/blogs/how-to-hire-first-employee-small-business", "keyword": "how to hire first employee", "status": "pr_created", "agentName": "Vyasa", "wordCount": 2400, "publishedAt": null, "createdAt": "2026-02-26T11:30:00.000Z", "briefId": "<convex_id_of_source_brief>" } ``` **Response:** ```json { "success": true, "id": "<convex_id>", "action": "inserted" } ``` **Dedup behavior:** Matches on `slug`. If found, updates `title`, `url`, `keyword`, `status`, `wordCount`, `publishedAt`, `briefId`. --- #### `POST /push/activity` **Purpose:** Log an agent milestone event. Deduplicates by `dedupKey` to prevent duplicate entries. **Called by:** All agents (Parthasarathi, Vibhishana, Vyasa, Vidura, Valmiki) **Old aliases (still work):** `/ingestActivity` **Request body:** ```json { "agentName": "Vibhishana", "action": "scan_complete", "status": "completed", "message": "Scanned r/smallbusiness, r/entrepreneur and found 18 new questions", "timestamp": "2026-02-26T09:15:00.000Z", "dedupKey": "scan_complete:2026-02-26:r/smallbusiness,r/entrepreneur", "metadata": { "subreddits": ["r/smallbusiness", "r/entrepreneur"], "inserted": 18, "updated": 4 } } ``` **Response:** ```json { "success": true, "id": "<convex_id>", "deduplicated": false } // or if duplicate: { "success": true, "id": "<existing_id>", "deduplicated": true } ``` **Dedup behavior:** If `dedupKey` is provided, checks for existing entry with same key. If found, returns existing ID and does NOT insert. **`dedupKey` naming convention:** `{action}:{date}:{context}` — e.g., `scan_complete:2026-02-26:r/smallbusiness` --- #### `POST /push/topic-clusters` **Purpose:** Upsert a topic cluster. Deduplicates by `pillarName` + `clusterTopic` composite. **Called by:** Vidura **Old aliases (still work):** `/ingestTopicCluster` **Request body:** ```json { "pillarName": "AI for Small Business Operations", "clusterTopic": "Hiring and HR automation for small teams", "status": "planned", "targetKeyword": "AI hiring tools small business", "intentType": "informational", "agentName": "Vidura", "createdAt": "2026-02-26T14:00:00.000Z" } ``` **Response:** ```json { "success": true, "id": "<convex_id>", "action": "inserted" } ``` --- #### `POST /push/tool-opportunities` **Purpose:** Upsert a free tool proposal. Deduplicates by `toolName`. **Called by:** Vidura **Old aliases (still work):** `/ingestToolOpportunity` **Request body:** ```json { "sourceQuestion": "How do I calculate if I can afford to hire someone?", "whyTool": "High-intent calculator query — users want to run the numbers themselves", "toolName": "Hiring Cost Calculator", "toolSolution": "Interactive calculator: salary + benefits + tax + training vs. productivity gain", "targetKeyword": "cost to hire an employee calculator", "complexity": "simple", "status": "proposed", "agentName": "Vidura", "createdAt": "2026-02-26T15:00:00.000Z" } ``` **Response:** ```json { "success": true, "id": "<convex_id>", "action": "inserted" } ``` --- #### `POST /push/documents` **Purpose:** Upsert a research or strategy document. Deduplicates by `slug`. **Called by:** Any agent (Vidura primarily) **Old aliases (still work):** `/upsertDocument` **Request body:** ```json { "title": "Weekly SEO Strategy — Feb Week 4", "slug": "vidura-seo-strategy-2026-w09", "content": "# Full markdown content here...", "summary": "Topic clusters for Q1, keyword opportunities in AI hiring space", "category": "strategy", "tags": ["seo", "weekly", "vidura"], "agentName": "Vidura", "filePath": "/home/node/openclaw/workspace/vidura/strategy-2026-w09.md", "createdAt": "2026-02-26T16:00:00.000Z" } ``` **Response:** ```json { "success": true, "id": "<convex_id>", "action": "inserted" } ``` --- #### `POST /push/linkedin-posts` **Purpose:** Upsert a LinkedIn post draft from Valmiki's pipeline. **Called by:** Valmiki **Status:** ⚠️ NOT YET BUILT — endpoint does not exist yet. Planned for Phase 0. **Old aliases:** None (new endpoint). **Planned request body:** ```json { "insightName": "The Invisible Labor Trap", "draftText": "Full post draft here (1,200-1,600 chars)...", "sourceBlogSlug": "how-to-hire-first-employee-small-business", "sourceBlogTitle": "How to Hire Your First Employee as a Small Business Owner", "insightNumber": 2, "source": "blog", "icpPass": true, "icpFailReason": null, "hookStrategy": "loss-aversion", "ctaType": "question", "status": "draft_ready", "agentName": "Valmiki", "createdAt": "2026-02-26T19:00:00.000Z" } ``` --- ### 3b. Partial Update Endpoints (POST) — Currently Live --- #### `POST /update/brief-status` **Purpose:** Update the status of an existing brief, identified by slug. **Called by:** Vidura (after Vyasa publishes a blog, Vidura marks the brief as published) **Old aliases (still work):** `/updateBriefStatus` **Request body:** ```json { "slug": "how-to-hire-first-employee-small-business", "status": "published", "updatedAt": "2026-02-26T12:00:00.000Z" } ``` **Response:** ```json { "success": true, "id": "<convex_id>", "slug": "...", "newStatus": "published" } // or if not found: { "success": false, "error": "Brief not found", "slug": "..." } ``` --- #### `POST /update/blog-enrichment` **Purpose:** Update enrichment metadata on a blog after Vyasa's enrichment runs. **Called by:** Vyasa **Old aliases (still work):** `/updateBlogEnrichment` **Request body:** ```json { "slug": "how-to-hire-first-employee-small-business", "enrichmentCount": 2, "lastEnrichmentDate": "2026-02-26T15:00:00.000Z", "enrichmentLog": "Added 3 internal links, expanded FAQ section, added schema markup" } ``` **Response:** ```json { "success": true } ``` --- ### 3c. Deprecated / Do Not Use | Endpoint | Problem | Use Instead | |----------|---------|-------------| | `POST /ingestBrief` | **BUG: always inserts, no dedup. Creates duplicate records if called twice for same slug.** | `POST /push/briefs` | | `POST /ingestQuestions` | Redundant alias for `/upsertQuestions` | `POST /push/questions` | | `POST /ingestBlog` | Redundant alias for `/upsertBlog` | `POST /push/blogs` | | `POST /ingestActivity` | Old name | `POST /push/activity` | | `POST /ingestTopicCluster` | Old name, singular | `POST /push/topic-clusters` | | `POST /ingestToolOpportunity` | Old name, singular | `POST /push/tool-opportunities` | | `POST /upsertQuestions` | Redundant alias | `POST /push/questions` | | `POST /upsertBlog` | Redundant alias | `POST /push/blogs` | | `POST /upsertBrief` | Old name | `POST /push/briefs` | | `POST /upsertDocument` | Old name | `POST /push/documents` | | `POST /updateBriefStatus` | Old name | `POST /update/brief-status` | | `POST /updateBlogEnrichment` | Old name | `POST /update/blog-enrichment` | **Important:** All deprecated endpoints remain active in production. They are NOT being deleted. This is a migration — agents can update at their own pace. Nothing will break if agents keep using old paths. But `/ingestBrief` should be prioritized for migration because of the dedup bug. --- ## 4. Table Schemas and Allowed Values ### Table: `questions` | Field | Type | Required | Notes | |-------|------|----------|-------| | `title` | string | yes | Reddit post title | | `subreddit` | string | yes | Include `r/` prefix e.g. `"r/smallbusiness"` | | `url` | string | yes | Full Reddit thread URL. **Dedup key.** | | `questionPain` | string | yes | 1-2 sentence pain point extraction | | `icpRelevance` | string | yes | See allowed values below | | `launchSpaceAngle` | string | yes | How thelaunch.space addresses this | | `contentPotential` | string | yes | See allowed values below | | `engagement` | string | yes | Free text e.g. `"45 upvotes, 67 comments"` | | `notes` | string | optional | Any additional scanner notes | | `postDate` | string | optional | ISO date when Reddit post was made | | `scannedAt` | string | yes | ISO timestamp when Vibhishana scanned | | `status` | string | yes | See allowed values below | | `agentName` | string | yes | Always `"Vibhishana"` | | `batchId` | string | optional | Groups questions from same scan run | **⚠️ Redundant field (do not populate going forward):** - `briefCreated: boolean` — This duplicates `status: "brief_created"`. Ignored by new logic. Will be removed in next schema cleanup. **Allowed values — `icpRelevance`:** `"HIGH"` · `"MEDIUM"` · `"LOW"` **Allowed values — `contentPotential`:** `"Strong blog candidate"` · `"Blog candidate"` · `"Watch"` **Allowed values — `status`:** | Value | Meaning | Who Sets It | |-------|---------|-------------| | `new` | Just scanned, not acted on | Vibhishana (on push) | | `brief_created` | A brief was created from this question | Vibhishana (after pushing brief) | | `skipped` | Not actionable / not relevant | Vibhishana | --- ### Table: `briefs` | Field | Type | Required | Notes | |-------|------|----------|-------| | `title` | string | yes | Blog title | | `slug` | string | yes | URL-safe slug. **Dedup key.** | | `primaryKeyword` | string | yes | Main SEO target keyword | | `longTailKeywords` | string[] | optional | Supporting keywords | | `finalKeywords` | string[] | optional | Final keyword list after research | | `icpProblem` | string | optional | ICP pain point this addresses | | `competitiveGap` | string | optional | What's missing in top search results | | `launchSpaceAngle` | string | optional | Our unique angle | | `suggestedStructure` | string | optional | H2/H3 outline as markdown | | `researchNotes` | string | optional | Research context and sources | | `rankingNotes` | string | optional | Post-publish ranking notes (filled later) | | `contentMarkdown` | string | optional | Full brief content as markdown (~500 lines) | | `sourceQuestionId` | string | optional | Convex `_id` of source question | | `sourceUrls` | string[] | optional | Reddit URLs used in research | | `blogUrl` | string | optional | Published URL (filled after publish) | | `category` | string | optional | Topic category | | `status` | string | yes | See allowed values below | | `createdAt` | string | yes | ISO timestamp | | `updatedAt` | string | optional | ISO timestamp of last update | | `agentName` | string | yes | Always `"Vibhishana"` | **Allowed values — `status`:** | Value | Meaning | Who Sets It | Kanban Column | |-------|---------|-------------|---------------| | `pending_review` | Vibhishana created brief, Krishna must review | Vibhishana (on push) | To Do → Krishna | | `needs_revision` | Brief has issues, sent back to Vibhishana | Krishna (Kanban action) | Blocked → Vibhishana | | `brief_ready` | Krishna approved, Vyasa to pick up | Krishna (Kanban action) | In Progress → Vyasa | | `writing` | Vyasa is actively writing the blog | Vyasa (on push — **Parthasarathi: add this to Vyasa's push skill**) | In Progress → Vyasa | | `pr_created` | Vyasa submitted PR, Krishna must review + merge | Vyasa (on push) | To Do → Krishna | | `published` | Blog merged and live on site | Krishna (Kanban action after merge) | Done | | `dropped` | Topic rejected, will not be written | Krishna (Kanban action) | Done | --- ### Table: `blogs` | Field | Type | Required | Notes | |-------|------|----------|-------| | `title` | string | yes | Blog post title | | `slug` | string | yes | URL slug. **Dedup key.** | | `url` | string | optional | Full published URL | | `keyword` | string | yes | Primary keyword | | `status` | string | yes | See allowed values below | | `agentName` | string | yes | Always `"Vyasa"` | | `wordCount` | number | yes | Word count at time of push | | `publishedAt` | string | optional | ISO timestamp of publish | | `createdAt` | string | yes | ISO timestamp | | `briefId` | string | optional | Convex `_id` of source brief | | `enrichmentCount` | number | optional | How many enrichment passes done | | `lastEnrichmentDate` | string | optional | ISO timestamp of last enrichment | | `enrichmentLog` | string | optional | What was changed in last enrichment | **Allowed values — `status`:** | Value | Meaning | Who Sets It | Kanban Column | |-------|---------|-------------|---------------| | `writing` | Vyasa started writing (**Parthasarathi: add this to Vyasa's skill**) | Vyasa (on start) | In Progress → Vyasa | | `pr_created` | PR submitted to GitHub | Vyasa (on push) | To Do → Krishna | | `published` | Blog merged and live | Krishna (Kanban action) | Done | --- ### Table: `topicClusters` | Field | Type | Required | Notes | |-------|------|----------|-------| | `pillarName` | string | yes | Pillar topic name | | `clusterTopic` | string | yes | Sub-topic within pillar. **Dedup key with `pillarName`.** | | `status` | string | yes | See allowed values below | | `blogUrl` | string | optional | Published blog URL (filled after publish) | | `targetKeyword` | string | yes | SEO keyword for this cluster | | `intentType` | string | yes | See allowed values below | | `agentName` | string | yes | Always `"Vidura"` | | `createdAt` | string | yes | ISO timestamp | | `updatedAt` | string | optional | ISO timestamp of last update | **Allowed values — `status`:** | Value | Meaning | Who Sets It | |-------|---------|-------------| | `planned` | Cluster identified, no content yet | Vidura (on push) | | `in_progress` | At least one cluster topic has a published blog | Vidura (update) | | `complete` | All core subtopics have published blogs | Vidura (update) | **⚠️ Schema inconsistency to fix:** Current schema comment lists `"brief-ready"` as a status value. This is wrong. The correct value set is `planned · in_progress · complete` as listed above. Vidura only ever pushes `"planned"` — the other values are not yet used but will be after the Kanban is built. **Allowed values — `intentType`:** `"informational"` · `"comparison"` · `"decision"` --- ### Table: `toolOpportunities` | Field | Type | Required | Notes | |-------|------|----------|-------| | `sourceQuestion` | string | yes | The Reddit question that inspired this | | `whyTool` | string | yes | Why a tool is better than a blog for this query | | `toolName` | string | yes | Short name for the tool. **Dedup key.** | | `toolSolution` | string | yes | What the tool does | | `targetKeyword` | string | yes | Primary SEO keyword | | `complexity` | string | yes | See allowed values below | | `status` | string | yes | See allowed values below | | `krishnaNotes` | string | optional | Krishna's review notes | | `agentName` | string | yes | Always `"Vidura"` | | `createdAt` | string | yes | ISO timestamp | **Allowed values — `complexity`:** `"simple"` · `"medium"` **Allowed values — `status`:** | Value | Meaning | Who Sets It | Kanban Column | |-------|---------|-------------|---------------| | `proposed` | Vidura identified opportunity, not yet reviewed | Vidura (on push) | Backlog | | `approved` | Krishna approved for building | Krishna (Kanban) | To Do | | `rejected` | Krishna rejected the idea | Krishna (Kanban) | Done | | `building` | Being actively built | Vishwakarma/future (on push) | In Progress | | `built` | Live on thelaunch.space | Krishna (Kanban) | Done | **⚠️ Schema inconsistency to fix:** Current schema comment includes `"live"` as a status value alongside `"built"`. These mean the same thing. `"built"` is the canonical value. `"live"` is deprecated. --- ### Table: `agentActivity` | Field | Type | Required | Notes | |-------|------|----------|-------| | `agentName` | string | yes | See allowed values below | | `action` | string | yes | See allowed values below | | `status` | string | yes | See allowed values below | | `message` | string | yes | One-line human-readable description | | `timestamp` | string | yes | ISO timestamp | | `metadata` | any | optional | Flexible extra context (subreddits scanned, counts, etc.) | | `dedupKey` | string | optional | Unique key to prevent duplicate entries | **Allowed values — `agentName`:** `"Parthasarathi"` · `"Vibhishana"` · `"Vyasa"` · `"Vidura"` · `"Valmiki"` **Allowed values — `action`:** | Value | Who Uses It | |-------|------------| | `health_check` | Parthasarathi | | `scan_complete` | Vibhishana | | `brief_created` | Vibhishana | | `blog_published` | Vyasa | | `blog_enriched` | Vyasa | | `cluster_mapping` | Vidura | | `tool_scan` | Vidura | | `document_created` | Any agent | | `blog_writing_started` | Vyasa (**Parthasarathi: add when implementing `writing` status**) | **Allowed values — `status`:** `"active"` · `"completed"` · `"error"` --- ### Table: `documents` | Field | Type | Required | Notes | |-------|------|----------|-------| | `title` | string | yes | Document title | | `slug` | string | yes | Unique identifier. **Dedup key.** | | `content` | string | yes | Full markdown content | | `summary` | string | optional | Short 1-2 sentence description | | `category` | string | yes | See allowed values below | | `tags` | string[] | optional | Flexible array of tags | | `agentName` | string | yes | Who created it | | `filePath` | string | optional | VPS path for reference | | `createdAt` | string | yes | ISO timestamp | | `updatedAt` | string | optional | ISO timestamp of last update | **Allowed values — `category`:** `"research"` · `"strategy"` · `"brief"` · `"process"` · `"analysis"` --- ### Table: `pitchBookings` (read-only from agent perspective) Agents do not write to this table. It is populated by the pitch page form. Listed here for completeness. **Allowed values — `status`:** `"new"` · `"contacted"` · `"scheduled"` · `"completed"` --- ### Table: `linkedinPosts` ⚠️ NOT YET BUILT Planned for Phase 0. Valmiki currently writes to the `linkedin-pipeline` Google Sheet. After this table is built, Valmiki writes to Convex first, Sheets as fallback. | Field | Type | Required | Notes | |-------|------|----------|-------| | `insightName` | string | yes | 2-5 word memorable label e.g. "The Invisible Labor Trap". **Dedup key with `sourceBlogSlug`+`insightNumber`.** | | `draftText` | string | yes | Full LinkedIn post draft (1,200-1,600 chars) | | `sourceBlogSlug` | string | yes | Slug of the blog this insight came from | | `sourceBlogTitle` | string | optional | Blog title for display | | `insightNumber` | number | yes | Which insight from this blog (1, 2, 3, etc.) | | `source` | string | yes | See allowed values below | | `icpPass` | boolean | yes | Did this pass Valmiki's ICP filter? | | `icpFailReason` | string | optional | Why it failed (if `icpPass` is false) | | `hookStrategy` | string | optional | See allowed values below | | `ctaType` | string | optional | See allowed values below | | `krishnaFeedback` | string | optional | Krishna's review notes | | `postedDate` | string | optional | ISO date when posted to LinkedIn | | `linkedinUrl` | string | optional | Full LinkedIn post URL | | `status` | string | yes | See allowed values below | | `agentName` | string | yes | Always `"Valmiki"` | | `createdAt` | string | yes | ISO timestamp | | `updatedAt` | string | optional | ISO timestamp | **Allowed values — `source`:** `"blog"` · `"krishna-insight"` **Allowed values — `hookStrategy`:** `"loss-aversion"` · `"curiosity"` · `"authority"` · `"story"` · `"social-proof"` **Allowed values — `ctaType`:** `"value-exchange"` · `"question"` · `"resource"` · `"follow"` **Allowed values — `status`:** | Value | Meaning | Who Sets It | Kanban Column | |-------|---------|-------------|---------------| | `draft_ready` | Valmiki finished draft + ICP check, ready for Krishna | Valmiki (on push) | To Do → Krishna | | `needs_revision` | Krishna gave feedback, Valmiki must revise | Krishna (Kanban) | Blocked → Valmiki | | `approved` | Krishna approved, ready to post | Krishna (Kanban) | In Progress → Krishna | | `posted` | Live on LinkedIn | Krishna (Kanban) | Done | | `skipped` | Won't post this one | Krishna (Kanban) | Done | --- ### Table: `manualTasks` ⚠️ NOT YET BUILT Planned for Phase 0. For tasks Krishna creates himself with no source artifact. | Field | Type | Required | Notes | |-------|------|----------|-------| | `title` | string | yes | Task description | | `description` | string | optional | More detail if needed | | `status` | string | yes | See allowed values below | | `assignee` | string | optional | `"Krishna"` or agent name | | `createdAt` | string | yes | ISO timestamp | | `updatedAt` | string | yes | ISO timestamp | **Allowed values — `status`:** `"todo"` · `"in_progress"` · `"blocked"` · `"done"` --- ## 5. The Sheets-as-Fallback Pattern Once the GET endpoints are live and agents are migrated, the agent push pattern changes: **Current (dual-write, always both):** ``` Agent does work → write to Sheets (always) → write to Convex (always, independently) ``` **New (Convex-first, Sheets only on failure):** ``` Agent does work → try Convex push → if HTTP 200: done → if not 200: write to Sheets + Slack alert + add to retry queue ``` **Shell pattern for agents:** ```bash CONVEX_KEY=$(cat /home/node/openclaw/credentials/convex-api-key.txt) RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \ "https://curious-iguana-738.convex.site/push/briefs" \ -H "Authorization: Bearer $CONVEX_KEY" \ -H "Content-Type: application/json" \ -d "$PAYLOAD") HTTP_STATUS=$(echo "$RESPONSE" | tail -1) if [ "$HTTP_STATUS" = "200" ]; then echo "Convex push successful" else # Fallback: write to Sheets node push-to-sheets.js # Alert # (Parthasarathi: post to Slack with warning + add to retry queue for 7PM health check) echo "WARNING: Convex push failed (HTTP $HTTP_STATUS), fell back to Sheets" fi ``` **Retry:** Parthasarathi's 7 PM health check cron processes any failed Convex pushes from the day. If retry succeeds, log success. If retry also fails, escalate to Slack DM to Krishna. --- ## 6. Parthasarathi's Review Checklist Please check each item and report back: **Endpoint audit — for each agent skill file:** - [ ] Vibhishana's `convex-push-scanner.SKILL.md`: What endpoint does it call for questions? (`/push/questions` canonical, old: `/ingestQuestions` or `/upsertQuestions`) - [ ] Vibhishana's brief push: Is it using `/ingestBrief` (bugged) or `/upsertBrief`? **This is critical — `/ingestBrief` creates duplicates.** - [ ] Vyasa's `convex-push-blog.SKILL.md`: What endpoint does it call? (`/push/blogs` canonical, old: `/ingestBlog` or `/upsertBlog`) - [ ] Does Vyasa push a `writing` status update when it starts writing? (If not, this needs to be added.) - [ ] Vidura's `convex-push-strategy.SKILL.md`: What endpoints? (`/push/topic-clusters` and `/push/tool-opportunities`) - [ ] All agents' activity pushes: Are they using `/push/activity` or `/ingestActivity`? - [ ] Parthasarathi's health check pushes: Same question. **Schema audit — for each agent's push:** - [ ] Does Vibhishana still send `briefCreated: true` boolean field with questions? (This is deprecated — can ignore but shouldn't be relied on.) - [ ] Does Vidura push `"brief-ready"` as a topic cluster status? (Wrong — should be `"in_progress"` or `"complete"`) - [ ] Does any agent push `"live"` as a tool opportunity status? (Wrong — should be `"built"`) --- ## 7. Change Log | Date | Change | |------|--------| | 2026-02-26 | Document created. First canonical reference. Identified `/ingestBrief` dedup bug. Standardized all status values. Defined `linkedinPosts` and `manualTasks` planned tables. | </file>
assistant: Let me do a thorough audit of all agent configurations against this reference.
assistant: ---

## 📋 COMPREHENSIVE AUDIT REPORT

### Section 6 Checklist — Agent Skill Files

---

#### ✅ Vibhishana — Questions Push
| Item | Current | Canonical | Status |
|------|---------|-----------|--------|
| **Endpoint** | `/upsertQuestions` | `/push/questions` | ⚠️ OLD ALIAS (works, should migrate) |
| **Script location** | Inline in AGENTS.md (node script) | — | OK |

---

#### ✅ Vibhishana — Brief Push
| Item | Current | Canonical | Status |
|------|---------|-----------|--------|
| **Endpoint** | `/upsertBrief` | `/push/briefs` | ⚠️ OLD ALIAS (works, should migrate) |
| **NOT using** | `/ingestBrief` | — | ✅ GOOD — NOT using the bugged endpoint |

**Critical check passed:** Vibhishana is using `/upsertBrief`, NOT `/ingestBrief`. No duplicate bug risk.

---

#### ⚠️ Vyasa — Blog Push
| Item | Current | Canonical | Status |
|------|---------|-----------|--------|
| **Endpoint** | `/ingestBlog` | `/push/blogs` | ⚠️ OLD ALIAS (works, should migrate) |
| **`writing` status push** | ❌ NOT IMPLEMENTED | Required | 🔴 MISSING |

**Issue found:** Vyasa's workflow says to update status to "Writing" in the SHEET, but there's no Convex push for `status: "writing"` when starting a blog. This means the Kanban won't show blogs in progress.

---

#### ⚠️ Vidura — Topic Clusters Push
| Item | Current | Canonical | Status |
|------|---------|-----------|--------|
| **Endpoint** | `/ingestTopicCluster` | `/push/topic-clusters` | ⚠️ OLD ALIAS (works, should migrate) |
| **Field names** | `pillar`, `cluster` | `pillarName`, `clusterTopic` | 🔴 WRONG FIELD NAMES |
| **Extra fields** | `keywords`, `briefCount`, `blogCount`, `priority`, `notes` | Not in canonical schema | ⚠️ May be ignored or error |

**Critical field name mismatch:**
- Vidura sends: `"pillar"`, `"cluster"`
- Schema expects: `"pillarName"`, `"clusterTopic"`

---

#### ⚠️ Vidura — Tool Opportunities Push
| Item | Current | Canonical | Status |
|------|---------|-----------|--------|
| **Endpoint** | `/ingestToolOpportunity` | `/push/tool-opportunities` | ⚠️ OLD ALIAS (works, should migrate) |
| **Field names** | `description`, `sourceQuestions`, `icpPain`, `priority` | Different names in schema | 🔴 WRONG FIELD NAMES |
| **Status value** | `"idea"` | `"proposed"` | 🔴 WRONG STATUS VALUE |

**Critical field name mismatches:**
| Vidura sends | Schema expects |
|--------------|----------------|
| `description` | `toolSolution` |
| `sourceQuestions` (array) | `sourceQuestion` (string) |
| `icpPain` | `whyTool` |
| `priority` | Not in schema |
| `status: "idea"` | `status: "proposed"` |

---

#### ⚠️ All Agents — Activity Push
| Item | Current | Canonical | Status |
|------|---------|-----------|--------|
| **Endpoint reference** | `/ingestActivity` | `/push/activity` | ⚠️ OLD ALIAS |
| **Actual implementation** | References non-existent skill file | — | 🔴 NOT WORKING |

**Issue:** My AGENTS.md says "Use the `convex-push-activity` skill" but that skill file doesn't exist. Activity pushes are not happening consistently.

---

### Schema Audit — Field Values

| Agent | Field | Current Value | Allowed Values | Status |
|-------|-------|---------------|----------------|--------|
| Vidura | topicClusters status | `"planned"` | `planned`, `in_progress`, `complete` | ✅ OK |
| Vidura | toolOpportunities status | `"idea"` | `proposed`, `approved`, `rejected`, `building`, `built` | 🔴 WRONG |
| Vibhishana | `briefCreated` boolean | Not found in docs | DEPRECATED | ✅ OK (not using) |

---

## 🔴 CRITICAL ISSUES REQUIRING IMMEDIATE FIX

### 1. Vidura Topic Clusters — Field Names
```
CURRENT:  "pillar", "cluster"
REQUIRED: "pillarName", "clusterTopic"
```

### 2. Vidura Tool Opportunities — Field Names + Status
```
CURRENT:  "description", "sourceQuestions", "icpPain", "status": "idea"
REQUIRED: "toolSolution", "sourceQuestion", "whyTool", "status": "proposed"
```

### 3. Vyasa — Missing `writing` Status Push
Vyasa needs to push `status: "writing"` to Convex when starting a blog, not just update the Sheet.

### 4. Activity Pushes — Not Implemented
All agents reference a non-existent skill file. Need to add direct curl commands for `/push/activity`.

---

## ⚠️ MIGRATION NEEDED (Not Urgent)

All agents should migrate from old aliases to canonical paths:

| Agent | Current | Migrate To |
|-------|---------|------------|
| Vibhishana | `/upsertQuestions` | `/push/questions` |
| Vibhishana | `/upsertBrief` | `/push/briefs` |
| Vyasa | `/ingestBlog` | `/push/blogs` |
| Vidura | `/ingestTopicCluster` | `/push/topic-clusters` |
| Vidura | `/ingestToolOpportunity` | `/push/tool-opportunities` |
| All | `/ingestActivity` | `/push/activity` |

---

## 📝 SUMMARY

| Category | Count |
|----------|-------|
| ✅ Correct | 3 |
| ⚠️ Old alias (works, migrate later) | 6 |
| 🔴 Critical field mismatch | 2 (Vidura clusters + tools) |
| 🔴 Missing implementation | 2 (Vyasa writing status, activity pushes) |

**Priority fix order:**
1. **Vidura field names** — Clusters and Tools are likely failing silently
2. **Vyasa writing status** — Needed for Kanban visibility
3. **Activity pushes** — Needed for Live Feed
4. **Migrate all to canonical paths** — Can do incrementally

**Want me to fix the Vidura field names first?**
