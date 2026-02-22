# MEMORY.md - Long-term Memory

## Facts

Durable truths that don't change often.

### Identifiers
- **Krishna's Slack ID:** U0AD3QLN32S
- **Krishna's DM channel:** D0AD3R8FC14
- **Krishna's X handle:** @nkgoutham (https://x.com/nkgoutham) - 1,213 followers
- **Krishna's LinkedIn:** ~11K followers

### Slack Channels
| Channel | ID | Agent |
|---------|-----|-------|
| #vibhishana-seo | C0AEFPRRV08 | Vibhishana |
| #vyasa-blogs | C0ADUM2TLEQ | Vyasa |
| #vidura-seo-strategy | C0AFTEV7Q6Q | Vidura |
| #valmiki-content | C0AD3SHGV2A | Valmiki |
| #sanjaya-scouting-leads | C0ACZGK0SQ3 | Sanjaya (paused) |

### Google Sheets
| Sheet | ID | Tabs |
|-------|-----|------|
| Reddit + SEO Workspace | `1xmeU8Iu7f540yl4iPp0KaCxVSfwfA_pciE8o1-jKD2g` | subreddits, questions, blog-queue |
| Lead Scouting Dashboard | `1N1yNSggmU46jeTUbxF0tvtcycHf2lvE0fuix5o2EKFs` | leads, watching |
| Content Drafts | `1lqWOfU-SMBYdtvwvsMo0iQwaO3HN2dLHluJsJ_Jf-yw` | drafts |

### Credentials
- **Google Service Account:** `lucy-the-scout@lucy-automation-486513.iam.gserviceaccount.com`
- **Credentials path:** `/home/node/openclaw/credentials/google-service-account.json`
- **Browser path:** `/home/node/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome`

### Cron Schedule (IST) — Updated 2026-02-19
| Time | Agent | Job | Model | Output |
|------|-------|-----|-------|--------|
| 8:00 AM | Parthasarathi | Morning Health Check | grok-fast | Krishna DM |
| 9:00 AM | Vibhishana | Morning Reddit Scan | opus | #vibhishana-seo |
| 9:30 AM | Vidura | Morning Analysis | sonnet | #vidura-seo-strategy |
| 10:00 AM Mon | Vibhishana | Weekly Community Discovery | opus | #vibhishana-seo |
| 10:30 AM | Parthasarathi | Pre-Blog Health Check | grok-fast | Krishna DM |
| 10:30 AM Mon | Vidura | Topic Cluster Mapping | sonnet | #vidura-seo-strategy |
| 10:30 AM Wed | Vidura | Strategic Topic Generation | sonnet | #vidura-seo-strategy |
| 10:30 AM Fri | Vidura | Tool Opportunity Scan | sonnet | #vidura-seo-strategy |
| 11:00 AM | Vibhishana | SEO Brief (1/day) | sonnet | blog-queue |
| 11:00 AM | Vyasa | Daily Blog Run | opus | PR + #vyasa-blogs |
| 1:00 PM | Parthasarathi | Midday Health Check | grok-fast | Krishna DM |
| ~~2:00 PM~~ | ~~Vibhishana~~ | ~~SEO Brief #2~~ | ~~DISABLED~~ | Reduced to 1 brief/day |
| 2:30 PM | Vidura | Midday Strategy | sonnet | #vidura-seo-strategy |
| 3:00 PM | Vyasa | Citation Enrichment #1 | sonnet | PR + #vyasa-blogs |
| ~~4:30 PM~~ | ~~Vibhishana~~ | ~~SEO Brief #3~~ | ~~DISABLED~~ | Reduced to 1 brief/day |
| 5:00 PM | Vyasa | Citation Enrichment #2 | sonnet | PR + #vyasa-blogs |
| 6:00 PM | Vibhishana | Evening Report | opus | #vibhishana-seo |
| 7:00 PM | Parthasarathi | Daily Due Diligence | grok-fast | Krishna DM |
| 7:30 PM | Vidura | Evening Review | sonnet | #vidura-seo-strategy |
| 8:00 PM | Valmiki | Daily Observation | sonnet | memory file (no Slack) |
| 8:00 PM | Vyasa | Citation Enrichment #3 | sonnet | PR + #vyasa-blogs |
| 9:00 PM | Valmiki | Ping Krishna | sonnet | #valmiki-content |
| 10:00 AM Sat | Valmiki | Weekly Performance Review | sonnet | #valmiki-content |

### Model Aliases
| Alias | Model |
|-------|-------|
| opus | anthropic/claude-opus-4-5 |
| sonnet | anthropic/claude-sonnet-4-5 |
| gpt | openai/gpt-5.2 |
| grok-fast | openrouter/x-ai/grok-4.1-fast |

### Tools Status
- web_search ✓ (Perplexity Sonar via OpenRouter) - may hit monthly limits
- browser ✓ (Chromium, headless)
- Slack ✓ (Socket Mode)
- Google Sheets ✓ (service account)
- sessions_history ✓ (cross-agent enabled 2026-02-12)
- session-memory hook ✓ (enabled 2026-02-13) - auto-saves before /new
- boot-md hook ✓ (enabled 2026-02-13) - runs BOOT.md on gateway start
- hybrid memory search ✓ (enabled 2026-02-13) - BM25 + vector
- Apify ✗ (no token)
- Zapier ✗ (not configured)

### SEO Tools
- **Ubersuggest:** Krishna has lifetime deal (lowest tier) - manual lookups only
- **Ahrefs/SEMrush:** Not subscribed yet
- **DuckDuckGo:** Works for competitive research (Google blocks automated search)

### Launch Control (Convex Dashboard)
- **Live URL:** thelaunch.space/launch-control
- **Production endpoint:** `https://curious-iguana-738.convex.site`
- **API key:** `/home/node/openclaw/credentials/convex-api-key.txt`
- **HTTP endpoints:** `/ingestQuestions`, `/ingestBrief`, `/ingestBlog`, `/ingestActivity`
- **Auth:** All endpoints require `Authorization: Bearer <API_KEY>` header
- **Push method:** Direct curl to endpoints (skill files don't exist - use curl directly)

---

## Procedures

Learned how-tos from experience (not from docs).

### Cron Management
- **Use model aliases in crons** - `opus`, `sonnet`, `gpt`. Never full names like `anthropic/claude-sonnet-4-5` (causes resolution errors).
- **Use `wakeMode: "now"`** - Changed from `next-heartbeat` on 2026-02-13. Since heartbeats are disabled (`every: "0m"`), `next-heartbeat` caused multi-hour delays. `now` executes immediately when scheduled.
- **Verify after creation** - Check that `nextRunAtMs` is populated in state.
- **Check before recreating** - Use `includeDisabled: true` to see all crons. Don't create duplicates.
- **Update, don't recreate** - Use `cron action=update` to modify existing jobs.
- **Isolated sessions need explicit Slack delivery** - `sessionTarget: "isolated"` sessions don't auto-route to Slack. The `delivery.mode: "announce"` mechanism fails for isolated sessions. Solution: Set `delivery.mode: "none"` and add explicit `message action=send channel=slack target=<channel_id>` instruction at the end of the cron prompt. Agents handle their own posting.
- **Cron list needs longer timeout** - With 15 jobs, `cron action=list` takes 20-40s under load. Use `timeoutMs: 45000` when calling cron list. 30s is sometimes insufficient.

### Triggering Agents
- **Bot messages don't trigger agents** - Loop prevention. Posting to a channel as Parthasarathi won't wake an agent.
- **To trigger immediately** - Create a one-shot cron with `schedule.kind: "at"` and near-future timestamp.
- **Or update and run** - `cron action=run jobId=X` (if allowed).
- **Or ask Krishna to post** - Human messages trigger agents.

### Reddit Scanning
- **JSON API works** - `old.reddit.com/r/{sub}/new/.json` - no login required for reading.
- **Browser login blocked** - Reddit blocks headless browsers on login pages.
- **Manual fallback** - If scanner unavailable, use `web_search` with `site:reddit.com/r/[subreddit]`.

### File Changes
- **Notify Krishna immediately** - He syncs to local Mac manually.
- **One notification per change** - Don't batch.

### Launch Control (Convex) Oversight
- **Agents push their own work** - Vibhishana pushes briefs, Vyasa pushes blogs. Both post confirmation to Slack.
- **Health checks (8AM/1PM/3PM)** - Scan for "⚠️ Convex push failed" messages → retry those.
- **7 PM Due Diligence** - Full reconciliation: list today's briefs, check for push confirmations, push any that were missed entirely.
- **Skills used:** `convex-push-scanner` for briefs/questions, `convex-push-blog` for blogs, `convex-push-activity` for milestones.
- **Push confirmation format:** "✅ Pushed [slug] to Launch Control" or "⚠️ Convex push failed for [slug]"

### Cross-Agent Visibility
- **Enabled via:** `tools.agentToAgent.enabled: true` in config
- **Also set:** `agents.defaults.sandbox.sessionToolsVisibility: "all"`
- **Use sessions_list** - Shows all agents' sessions (Vibhishana, Vyasa, etc.)
- **Use sessions_history** - Read full transcript including thinking blocks
- **7 PM Due Diligence uses this** - To read agent context and spot patterns

### Search Engine Research
- **Google blocked** - CAPTCHA on automated access
- **DuckDuckGo works** - `web_fetch` on `https://duckduckgo.com/html/?q=<query>`
- **Not identical to Google** - But useful for competitive analysis (what content exists)
- **Reddit questions = PAA equivalent** - Real user questions from Vibhishana's scans

---

## Preferences

Krishna's stated choices and patterns.

### Lead Research
- **Freshness:** Max 1 week old. Anything older is a passed opportunity.
- **Signal freshness:** Tier 1 signals (cofounder posts) go stale fast. >1 week = check if filled. >1 month = move to watching.
- **Tier 2 signals stay fresh longer:** Scaling pain, launch pressure are ongoing.
- **Geography:** 50:50 ratio Indian to non-Indian founders. Indian OK if: funded startup, profitable small business, or interesting.
- **Delivery:** Google Sheet, not Slack messages. Krishna needs to track pipeline.
- **Approach:** Don't approach on Tier 3 signals alone. Need Tier 1 or Tier 2 + context.
- **Warmth ladder:** Value-first > warm-cold > cold. No cold DMs.

### Content
- **Intent system:** lead_gen, credibility, reach, no_filter. Every post gets declared intent.
- **Platform mix:** X = 70% ICP / 30% builder. LinkedIn = 90% ICP.
- **ICP Resonance Check:** "Would a 45-year-old ex-McKinsey partner bookmark this?"
- **Trending proof:** Must show actual source (link, date) - last week/month only.
- **Anti-self-promotion:** Don't claim positioning directly. Let work demonstrate it.
- **Value requirement:** Every post must have concrete takeaway.
- **CTA requirement:** Purposeful CTAs tied to intent, not generic "follow for more".
- **Banned construct:** "This isn't X, it's Y" / negation-to-pivot - AI-generic.

### Operational
- **Model:** Uses Anthropic OAuth (Claude Max 20x, $200/mo). Opus for interactive, Sonnet for cron jobs.
- **Model fallback chain:** Opus 4.5 → Sonnet 4.5 → Kimi K2.5 → GLM-4.7.
- **Cron timeout:** 900s (15 min) to avoid cutoffs.
- **Reporting structure:** Krishna → Parthasarathi → Agents. Krishna can override.

---

## Setup Log

Chronological history of setup and changes.

### 2026-02-20
- **Slack delivery fix:** All 14 agent crons updated to use self-contained Slack delivery. Root cause: `delivery.mode: "announce"` was failing with "cron announce delivery failed" for isolated sessions. Fix: Changed all agent crons to `delivery.mode: "none"` and added explicit `message action=send` instructions in the cron prompt itself. Now agents post to Slack directly instead of relying on the delivery mechanism.

### 2026-02-19
- **Security hardening:** Tailscale HTTPS access enabled (srv1331841.tail4447a0.ts.net), Docker port locked to localhost (127.0.0.1:41473), `allowInsecureAuth: false` enforced.
- **OpenClaw updated:** v2026.2.2 → v2026.2.17
- **File loss incident:** Container recreation wiped workspace (was inside container, not volume-mounted). All agent files, scripts, credentials lost temporarily.
- **ROOT CAUSE FIX:** Docker volume mount corrected. Workspace (`/home/node/openclaw/`) now mounted to VPS host. Future container updates won't wipe files.
- **Restoration:** All files restored from Krishna's local mirrors. GitHub token regenerated (new PAT expires May 9). Convex API key fixed (AGENT_API_KEY, not deploy key).
- **Permissions fix:** Restored files had root ownership; fixed with `chown -R node:node`.
- **Memory reconstruction:** Rebuilt Feb 18-19 context from Slack history.

### 2026-02-18
- **Valmiki reactivated:** 30-day LinkedIn challenge starts. Schedule: 8 PM observation, 9 PM ping Krishna, 9:30 PM draft delivery.
- **Vibhishana output:** 3 briefs created (Zero Signups/Participation Shift, Monetization Dead Zone, Teachable/Kajabi Custom Decision).
- **EdTech vertical filled:** Teachable/Kajabi brief leverages Krishna's 9+ years BYJU'S background.
- **Normal operations:** All Convex pushes successful, no issues.

### 2026-02-17
- **Launch Control LIVE:** Public dashboard at thelaunch.space/launch-control showing agents working in real-time.
- **Production backfill complete:** 554 questions, 14 briefs, 7 blogs, 30 activity entries (605 total) pushed to Convex.
- **3 skill files installed:** `/app/skills/convex-push-{scanner,blog,activity}/SKILL.md`
- **Convex credentials stored:** `/home/node/openclaw/credentials/convex-api-key.txt`
- **Root cause identified:** Agents not pushing to Convex because skills installed ≠ agents using skills. Need explicit AGENTS.md instructions.
- **Convex push workflow formalized:**
  - Vibhishana's AGENTS.md: Added mandatory 5-item checklist for every brief push
  - Vyasa's AGENTS.md: Added same checklist for blog pushes
  - My AGENTS.md: Added "Launch Control Oversight" section documenting my safety net role
  - My health checks: Now check for failed AND missed pushes
  - 7 PM Due Diligence: Full reconciliation - compare brief files to push confirmations, push any missed
- **Brief standardization:** Consolidated 14 brief files to `/home/node/openclaw/vibhishana/briefs/`, documented 21 vs 12 gap.
- **Cron timeout:** Updated to 45s (was 30s) for cron list queries under load.

### 2026-02-15
- **Cron list timeout fix:** Root cause of recurring "gateway timeout" errors identified. With 11 cron jobs, the `cron action=list` query takes 15-20s to enumerate all jobs. Default 10s timeout was too short. Solution: use `timeoutMs: 30000` when calling cron list. Gateway itself is healthy.

### 2026-02-13 (evening)
- **OpenClaw optimization sprint:** Deep research on underutilized features.
- **Hooks enabled:** `session-memory` (auto-saves context before /new) + `boot-md` (runs BOOT.md on gateway start).
- **Health checks moved to Grok 4.1 Fast:** All 4 health check crons (8AM, 1PM, 3PM, 7PM) now use `grok-fast` alias instead of Sonnet. Cost savings ~$5-10/month.
- **Hybrid memory search enabled:** BM25 + vector search now active (70% vector, 30% text weight).
- **BOOT.md created:** Gateway startup notification system.
- **New model alias:** `grok-fast` → `openrouter/x-ai/grok-4.1-fast`

### 2026-02-13
- **Cron wakeMode fix:** Changed all 11 crons from `wakeMode: "next-heartbeat"` to `wakeMode: "now"`. Root cause: heartbeats disabled (`every: "0m"`) but crons were waiting for heartbeats, causing 2+ hour execution delays. Now jobs execute immediately at scheduled time.

### 2026-02-13 (earlier)
- SEO strategy discussion: free tools > traditional link building. Paused tool builder for now.
- Vyasa workflow enhancement planned: DuckDuckGo for competitive research, "Questions to Answer" approach.
- DuckDuckGo confirmed working for search; Google blocked by CAPTCHA.
- Platform portability confirmed: all knowledge on VPS survives channel switch.

### 2026-02-12
- Cross-agent visibility enabled: `tools.agentToAgent.enabled: true` + `sessionToolsVisibility: "all"`.
- 7 PM Due Diligence cron enhanced with "Opportunities & Quick Wins" strategic section.
- My SOUL.md updated with "Strategic Layer" section (strategic partner role).
- ICP/voice de-duplication across 5 agent SOUL.md files (single source in USER.md and my SOUL.md).
- Agent doc restructure Phase 1: softened aggressive language in Opus agents, cleaned up TOOLS.md files, added examples to SOUL.md files, restructured MEMORY.md with semantic sections.

### 2026-02-11
- Vibhishana schedule split: 1 brief run → 3 runs (11AM, 2PM, 5PM) to avoid rate limits.
- Health check Slack delivery fixed: added explicit `message action=send` to cron prompts.
- Cron cleanup: removed 6 orphan/duplicate jobs.
- Model alias fix: added `sonnet` alias to config.

### 2026-02-10
- Blog-queue columns added: Final Keywords (L), Blog URL (M), Ranking Notes (N).
- Vibhishana review workflow: Pending Review → Krishna reviews → Brief Ready.
- Agent triggering discovery: Bot messages don't trigger agents (loop prevention).

### 2026-02-09
- Sanjaya and Valmiki paused. Krishna will say when to activate.

### 2026-02-08
- Vyasa added: Blog writer, #vyasa-blogs (C0ADUM2TLEQ).
- Workflow split: Vibhishana = research brain, Vyasa = writing brain.

### 2026-02-07
- Multi-agent team established: Parthasarathi (main), Sanjaya, Valmiki, Vibhishana.
- Reddit SEO system established. First scan: 138 ICP-relevant questions.

### 2026-02-06
- Memory features enabled (flush before compaction + session search).
- Model fallback chain configured via OpenRouter.
- USER.md enriched with Unfair Advantages, Skills, Proof Points, Verticals.
- Content feedback calibration: new banned constructs, value requirements.

### 2026-02-05
- First session. Slack connected (Socket Mode).
- Content strategy established: bridge angle, intent system, archetypes.
- Signal-based approach agreed: Week 1 is signal collection only.
