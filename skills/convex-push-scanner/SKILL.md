---
name: convex-push-scanner
description: Push scanned questions and research briefs to Launch Control (Convex database)
metadata: { "openclaw": { "emoji": "📡", "requires": { "bins": ["curl", "node"], "env": [] } } }
---

# Push Scanner Data to Launch Control

After scanning Reddit questions or creating research briefs, push the data to Convex so it appears on the Launch Control dashboard.

## Setup

API key file: `/home/node/openclaw/credentials/convex-api-key.txt`
Base URL: `https://curious-iguana-738.convex.site`

## 1. Push Questions (After Morning Reddit Scan)

After your 9:00 AM scan completes, push all questions found in that batch. **Use upsertQuestions (not ingestQuestions)** — this prevents duplicates if the same URL is scanned again.

```bash
API_KEY=$(cat /home/node/openclaw/credentials/convex-api-key.txt)
curl -s -X POST https://curious-iguana-738.convex.site/upsertQuestions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '[
    {
      "title": "REDDIT POST TITLE HERE",
      "subreddit": "r/SUBREDDIT_NAME",
      "url": "FULL REDDIT URL",
      "questionPain": "THE PAIN POINT YOU EXTRACTED",
      "icpRelevance": "HIGH or MEDIUM or LOW",
      "launchSpaceAngle": "HOW THELAUNCH.SPACE ADDRESSES THIS",
      "contentPotential": "Strong blog candidate or Blog candidate or Watch",
      "engagement": "X upvotes, Y comments",
      "notes": "YOUR SCANNER NOTES",
      "postDate": "YYYY-MM-DD",
      "scannedAt": "YYYY-MM-DDTHH:MM:SSZ",
      "status": "new",
      "briefCreated": false,
      "agentName": "Vibhishana",
      "batchId": "YYYY-MM-DD-morning"
    }
  ]'
```

Send ALL questions from the scan as one array. Do not send one curl per question.

**Dedup logic:** Matches by `url` field. If a question with the same URL already exists, it updates the existing record instead of creating a duplicate.

Expected response: `{"success":true,"inserted":N,"updated":M}`

## 2. Push Brief (After Creating Each Research Brief)

After each brief run (11 AM, 2 PM, 5 PM), push the brief you just created.

```bash
API_KEY=$(cat /home/node/openclaw/credentials/convex-api-key.txt)
BRIEF_CONTENT=$(node -e "console.log(JSON.stringify(require('fs').readFileSync('/home/node/openclaw/vibhishana/briefs/YYYY-MM-DD-slug.md', 'utf8')))")

curl -s -X POST https://curious-iguana-738.convex.site/ingestBrief \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d "{
    \"title\": \"BRIEF TITLE\",
    \"slug\": \"brief-slug\",
    \"primaryKeyword\": \"target seo keyword\",
    \"longTailKeywords\": [\"keyword 1\", \"keyword 2\", \"keyword 3\"],
    \"icpProblem\": \"THE ICP PAIN POINT\",
    \"competitiveGap\": \"WHAT IS MISSING IN TOP RESULTS\",
    \"launchSpaceAngle\": \"OUR UNIQUE ANGLE\",
    \"suggestedStructure\": \"H2: Section 1 / H2: Section 2 / H2: Section 3\",
    \"researchNotes\": \"RESEARCH CONTEXT\",
    \"contentMarkdown\": $BRIEF_CONTENT,
    \"sourceUrls\": [\"https://reddit.com/r/...\"],
    \"category\": \"Founder-Phase or Post-MVP or Distribution-GTM or Operations or Vertical-Specific or Product-Strategy\",
    \"status\": \"pending_review\",
    \"createdAt\": \"YYYY-MM-DDTHH:MM:SSZ\",
    \"agentName\": \"Vibhishana\"
  }"
```

The `contentMarkdown` field uses Node.js to safely escape the markdown file content as a JSON string. This handles newlines, quotes, and special characters. (Uses `node` instead of `jq` since jq is not available on the VPS.)

Expected response: `{"success":true,"id":"..."}`

## 3. After Pushing a Brief, Update the Question

If the brief was created from a specific question, push an update for that question too — resend it to `/upsertQuestions` with `"status": "brief_created"` and `"briefCreated": true`. The upsert will match by URL and update the existing record.

## 4. Update Brief Status (Sync from Sheet)

When brief statuses change in Google Sheets (e.g., Krishna reviews and changes to "Brief Ready" or "Needs Revision"), sync to Convex:

```bash
API_KEY=$(cat /home/node/openclaw/credentials/convex-api-key.txt)
curl -s -X POST https://curious-iguana-738.convex.site/updateBriefStatus \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "slug": "brief-slug-here",
    "status": "brief_ready"
  }'
```

**Status values (use lowercase with underscores):**
- `pending_review` - Waiting for Krishna's review
- `needs_revision` - Krishna gave feedback
- `brief_ready` - Approved, Vyasa can pick up
- `writing` - Vyasa working on it
- `pr_created` - PR submitted
- `published` - Live on site
- `dropped` - Krishna decided not to pursue

Expected response: `{"success":true,"id":"...","slug":"...","newStatus":"..."}`

If brief not found: `{"success":false,"error":"Brief not found","slug":"..."}`

## 5. Upsert Brief (Create or Update)

For idempotent pushes (won't create duplicates if same slug exists):

```bash
API_KEY=$(cat /home/node/openclaw/credentials/convex-api-key.txt)
curl -s -X POST https://curious-iguana-738.convex.site/upsertBrief \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    ... same fields as ingestBrief ...
  }'
```

This will:
- **Create** if no brief with this slug exists
- **Update** if a brief with this slug already exists

Expected response: `{"success":true,"id":"...","action":"inserted"}` or `{"success":true,"id":"...","action":"updated"}`

## When Things Fail

If curl returns an error or non-200 response:
1. Post to #vibhishana-seo: `⚠️ Convex push failed for [item]. Error: [response]. Moving on.`
2. Continue your normal workflow. Do NOT retry. Do NOT block.
3. The data is still in Google Sheets — Convex is additive, not a replacement.
