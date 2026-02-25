# Daily Agent Workflow — End-to-End Sequential Map

> Last updated: 2026-02-25
> Purpose: Full operational view of every agent action, every sheet update, every handoff — from first cron to last.

---

## The Cast

| Agent | Role | Model | Channel |
|-------|------|-------|---------|
| **Parthasarathi** | Orchestrator / COO | Opus 4.5 | DM with Krishna |
| **Vibhishana** | SEO Scanner + Research Brief Writer | Sonnet 4.5 | #vibhishana-seo |
| **Vyasa** | Blog Writer + Enrichment | Opus 4.5 | #vyasa-blogs |
| **Vidura** | SEO Strategy + Intelligence | Sonnet 4.5 | #vidura-seo-strategy |
| **Valmiki** | LinkedIn Growth Engine | Sonnet 4.5 | #valmiki-content |
| **Sanjaya** | Lead Scout | — | PAUSED |

## The Shared Infrastructure

**Google Sheet (shared pipeline):** `1xmeU8Iu7f540yl4iPp0KaCxVSfwfA_pciE8o1-jKD2g`

| Tab | Owner | Purpose |
|-----|-------|---------|
| `subreddits` | Vibhishana | List of monitored communities |
| `questions` | Vibhishana | Mined Reddit questions |
| `blog-queue` | Vibhishana + Vidura → Vyasa | Research briefs pipeline |
| `topic-clusters` | Vidura | Pillar-cluster map with subtopics |
| `tool-opportunities` | Vidura | Interactive tool proposals |
| `linkedin-pipeline` | **Valmiki** | Blog-to-LinkedIn extraction tracker |

**Valmiki's LinkedIn tracker sheet (separate):** `1lqWOfU-SMBYdtvwvsMo0iQwaO3HN2dLHluJsJ_Jf-yw` (tab: `drafts`) — Final approved LinkedIn posts + metrics.

**Convex (Launch Control):** Live public dashboard at thelaunch.space/launch-control.

**GitHub repo:** `thelaunch-space/thelaunch-space-tweet-sized-landing-page`

---

## Valmiki LinkedIn Pipeline Tab

Lives in the shared pipeline sheet, tab: `linkedin-pipeline`

### Columns

| Column | Purpose | Example |
|--------|---------|---------|
| Blog Title | Source blog title | "CRM for Small Service Businesses" |
| Blog Slug | For reference/linking | `crm-for-small-service-business` |
| Blog URL | Full path | `/blogs/founder-advice/crm-for-small-service-business` |
| Extraction Status | Blog-level tracking | `Not Started` / `Extracting` / `Extracted` / `All Posts Done` |
| Insight # | Row per insight (1-5 per blog) | 1, 2, 3 |
| Insight Name | 2-5 word named label | "The Adoption Pyramid" |
| Insight Summary | One-line description | "Teams abandon CRMs they didn't choose" |
| ICP Pass | Did it survive the ICP filter? | Yes / No |
| ICP Fail Reason | Why it was filtered out | "Only speaks to developers" |
| Post Status | Per-insight tracking | `Extracted` / `Drafting` / `Draft Ready` / `Approved` / `Posted` / `Skipped` |
| Draft Text | Full LinkedIn post draft | [the complete post] |
| Hook Strategy | What hook approach | "Loss aversion — cost of inaction" |
| CTA Type | What CTA | "Value-exchange: free audit" |
| Krishna Feedback | If revision needed | "Tone too technical" |
| Posted Date | When live | 2026-03-01 |
| LinkedIn URL | Link to live post | [URL] |

### How Valmiki Uses This Tab

**One continuous flow:**
1. Check `blog-queue` for Status = "Published"
2. Cross-reference `linkedin-pipeline` — find oldest published blog not yet mined
3. Read the blog via `web_fetch`
4. Set Extraction Status to `Extracting`
5. Extract 3-5 insights → add rows with Post Status = `Extracted`
6. Filter through ICP → set ICP Pass = Yes/No
7. Draft 1-2 posts → set Post Status = `Draft Ready`
8. Set Extraction Status to `Extracted`
9. Present to #valmiki-content
10. After approval: `Approved` → Krishna posts manually
11. After posting: `Posted` + date + URL filled
12. When all insights done: Extraction Status = `All Posts Done`

---

## Daily Schedule (IST)

| Time | Agent | Action |
|------|-------|--------|
| 8:00 AM | Parthasarathi | Morning Health Check |
| 9:00 AM | Vibhishana | Morning Reddit Scan |
| 9:30 AM | Vidura | Morning Analysis |
| 10:30 AM | Parthasarathi | Pre-Blog Health Check |
| 10:30 AM Mon | Vidura | Topic Cluster Mapping |
| 10:30 AM Wed | Vidura | Strategic Topic Generation |
| 10:30 AM Fri | Vidura | Tool Opportunity Scan |
| 11:00 AM | Vibhishana | SEO Brief |
| 11:00 AM | Vyasa | Daily Blog Run |
| 1:00 PM | Parthasarathi | Midday Health Check |
| 2:30 PM | Vidura | Midday Strategy |
| 3:00 PM | Vyasa | Citation Enrichment #1 |
| 5:00 PM | Vyasa | Citation Enrichment #2 |
| 6:00 PM | Vibhishana | Evening Report |
| 7:00 PM | Parthasarathi | Daily Due Diligence |
| **7:00 PM** | **Valmiki** | **LinkedIn Extraction** |
| 7:30 PM | Vidura | Evening Review |
| 8:00 PM | Vyasa | Citation Enrichment #3 |
| 10:00 PM | Parthasarathi | Daily Context Backup |
| **8:30 AM next day** | **Krishna (manual)** | **Post to LinkedIn** |
| **10:00 AM Sat** | **Valmiki** | **Weekly Performance Review** |

---

## Status Flow Summary

```
Vibhishana scans Reddit → questions tab + Convex
    ↓
Vibhishana creates brief → blog-queue (Pending Review) + Convex
    ↓
Krishna reviews → Brief Ready
    ↓
Vyasa picks up → Writing → PR Created + Convex
    ↓
Krishna merges → Published (Netlify auto-deploys)
    ↓
Vyasa enriches (3x/day) → Updated content
    ↓
Valmiki extracts insights → linkedin-pipeline tab
    ↓
Valmiki filters ICP → passes/fails marked
    ↓
Valmiki drafts 1-2 posts → Draft Ready
    ↓
Valmiki presents to Krishna → #valmiki-content
    ↓
Krishna approves → Approved
    ↓
Krishna posts manually (8:30 AM) → Posted
    ↓
All insights done → All Posts Done
```

---

## Backlog Math

- **18 blogs published** as of Feb 25, 2026
- At 3-5 insights per blog = **54-90 potential LinkedIn posts**
- At 4-5 posts/week = **11-22 weeks of content**
- Valmiki starts from blog #1, mines sequentially
- By the time existing blogs exhausted, Vyasa will have published new ones
- No phase switch needed — trigger is always "oldest unmined Published blog"
