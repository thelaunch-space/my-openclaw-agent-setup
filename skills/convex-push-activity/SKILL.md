---
name: convex-push-activity
description: Push agent activity milestones to Launch Control (Convex database)
metadata: { "openclaw": { "emoji": "📊", "requires": { "bins": ["curl"], "env": [] } } }
---

# Push Activity Milestones to Launch Control

After key events (scan complete, brief created, blog published, health check), push a milestone to Convex so the Launch Control dashboard shows agent activity in real-time.

## Setup

API key file: `/home/node/openclaw/credentials/convex-api-key.txt`
Base URL: `https://curious-iguana-738.convex.site`

## Push Activity Milestone

Run this with `exec` after completing a significant action:

```bash
API_KEY=$(cat /home/node/openclaw/credentials/convex-api-key.txt)
curl -s -X POST https://curious-iguana-738.convex.site/push/activity \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "agentName": "YOUR AGENT NAME",
    "action": "ACTION TYPE",
    "status": "completed",
    "message": "ONE-LINE SUMMARY OF WHAT HAPPENED",
    "timestamp": "YYYY-MM-DDTHH:MM:SSZ",
    "dedupKey": "AGENT:ACTION:DATE-OR-CONTEXT"
  }'
```

## When to Push (and What to Say)

Push activity at these moments — not after every small step, only at milestones:

**Vibhishana:**
- After morning scan: `{"action": "scan_complete", "message": "Scanned X questions from Y subreddits", "agentName": "Vibhishana"}`
- After each brief: `{"action": "brief_created", "message": "Created brief: TITLE", "agentName": "Vibhishana"}`
- After evening report: `{"action": "daily_report", "message": "Daily summary: X questions scanned, Y briefs created", "agentName": "Vibhishana"}`

**Vyasa:**
- After blog PR created: `{"action": "blog_pr_created", "message": "PR created: TITLE (WORD_COUNT words)", "agentName": "Vyasa"}`
- After enrichment: `{"action": "blog_enriched", "message": "Enriched: BLOG_TITLE (added X citations, updated Y sections)", "agentName": "Vyasa"}`

**Vidura:**
- After morning analysis: `{"action": "morning_analysis", "message": "Morning strategy review complete. X clusters active, Y tool opportunities tracked", "agentName": "Vidura"}`
- After cluster mapping: `{"action": "cluster_mapping", "message": "Mapped X new topic clusters for PILLAR_NAME", "agentName": "Vidura"}`
- After topic generation: `{"action": "topic_generation", "message": "Generated X new topic ideas across Y pillars", "agentName": "Vidura"}`
- After tool scan: `{"action": "tool_scan", "message": "Identified X tool opportunities from community questions", "agentName": "Vidura"}`
- After evening review: `{"action": "evening_review", "message": "Evening review: X content pieces published today, Y in pipeline", "agentName": "Vidura"}`

**Parthasarathi:**
- After 7 PM due diligence: `{"action": "due_diligence", "message": "Daily review complete. X briefs pending, Y blogs in pipeline", "agentName": "Parthasarathi"}`
- After health check: `{"action": "health_check", "message": "All systems nominal. X crons active", "agentName": "Parthasarathi"}`
- After cron/config change: `{"action": "config_change", "message": "Updated AGENT cron: WHAT CHANGED", "agentName": "Parthasarathi"}`

## Field Rules

- `agentName`: Exactly `"Parthasarathi"`, `"Vibhishana"`, `"Vyasa"`, or `"Vidura"` (capitalized)
- `action`: Use the exact strings above (lowercase with underscores)
- `status`: Usually `"completed"`. Use `"error"` only if something failed.
- `message`: One sentence. Be specific — include counts, titles, or names.
- `timestamp`: ISO 8601 format. Use `date -u +"%Y-%m-%dT%H:%M:%SZ"` to generate.
- `dedupKey` (optional): Include to prevent duplicate activity entries. Format: `"agentName:action:YYYY-MM-DD"` or `"agentName:action:slug"`. If omitted, no dedup is applied.

**Dedup examples:**
- Health check: `"dedupKey": "Parthasarathi:health_check:2026-02-23"` — one entry per day
- Brief created: `"dedupKey": "Vibhishana:brief_created:mvp-pricing-guide"` — one entry per brief

Expected response: `{"success":true,"id":"..."}` or `{"success":true,"id":"...","deduplicated":true}` if already exists

## When Things Fail

If curl returns an error:
1. Log to Slack: `⚠️ Convex activity push failed. Error: [response]. Moving on.`
2. Do NOT retry. Do NOT block. Activity logging is nice-to-have, not critical.
