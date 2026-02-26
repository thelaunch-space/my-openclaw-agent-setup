---
name: convex-push-blog
description: Push published blog metadata to Launch Control (Convex database)
metadata: { "openclaw": { "emoji": "📝", "requires": { "bins": ["curl"], "env": [] } } }
---

# Push Blog Data to Launch Control

Push blog status updates to Convex so the Launch Control dashboard reflects real-time progress.

## Setup

API key file: `/home/node/openclaw/credentials/convex-api-key.txt`
Base URL: `https://curious-iguana-738.convex.site`

## 1. Push Writing Status (When Starting a Blog)

**IMMEDIATELY** after selecting a brief and before you start writing, push the blog with `status: "writing"`. This lets Krishna see that work is in progress.

```bash
API_KEY=$(cat /home/node/openclaw/credentials/convex-api-key.txt)
curl -s -X POST https://curious-iguana-738.convex.site/push/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "title": "BLOG TITLE FROM BRIEF",
    "slug": "blog-post-slug",
    "keyword": "PRIMARY TARGET KEYWORD",
    "status": "writing",
    "agentName": "Vyasa",
    "wordCount": 0,
    "createdAt": "YYYY-MM-DDTHH:MM:SSZ"
  }'
```

**When:** Right after you pick up a "Brief Ready" entry and mark the sheet as "Writing"
**Why:** Launch Control shows real-time status. Without this, Krishna doesn't know writing has started.

Expected response: `{"success":true,"id":"...","action":"inserted"}`

## 2. Push PR Created Status (After Creating PR)

After the PR is created and the sheet is updated, push again with `status: "pr_created"`.

```bash
API_KEY=$(cat /home/node/openclaw/credentials/convex-api-key.txt)
curl -s -X POST https://curious-iguana-738.convex.site/push/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "title": "BLOG TITLE",
    "slug": "blog-post-slug",
    "url": "https://thelaunch.space/blogs/TOPIC-SLUG/POST-SLUG",
    "keyword": "PRIMARY TARGET KEYWORD",
    "status": "pr_created",
    "agentName": "Vyasa",
    "wordCount": WORD_COUNT_NUMBER,
    "createdAt": "YYYY-MM-DDTHH:MM:SSZ"
  }'
```

Field notes:
- `slug`: the post slug (e.g., `hire-developer-vs-build-with-ai`) — **this is the dedup key**
- `url`: the full URL where this blog will live once merged
- `keyword`: the primary keyword from Vibhishana's brief
- `status`: `"pr_created"` — Krishna will update to `"published"` after merge
- `wordCount`: the actual word count as a number (no quotes), e.g., `2847`
- `createdAt`: ISO timestamp of when you started writing

**Dedup logic:** Matches by `slug` field. Since you already pushed with `writing` status, this updates the same record.

Expected response: `{"success":true,"id":"...","action":"updated"}`

## 3. Push Enrichment Data

After Vyasa's enrichment cycle (citation enrichment), push enrichment metadata for the blog that was just enriched.

```bash
API_KEY=$(cat /home/node/openclaw/credentials/convex-api-key.txt)
curl -s -X POST https://curious-iguana-738.convex.site/update/blog-enrichment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "slug": "blog-post-slug",
    "enrichmentCount": 2,
    "lastEnrichmentDate": "YYYY-MM-DDTHH:MM:SSZ",
    "enrichmentLog": "Added 3 expert citations, updated stats section, added FAQ schema"
  }'
```

- **When:** After each enrichment PR is created
- **Expected response:** `{"success":true}`
- `enrichmentCount`: Cumulative — if this is the 2nd enrichment pass, use 2
- `enrichmentLog`: One-line summary of what was enriched in this pass

## When Things Fail

If curl returns an error or non-200 response:
1. Post to #vyasa-blogs: `⚠️ Convex push failed for [blog title]. Error: [response]. Moving on.`
2. Continue your normal workflow. The PR is still created — Convex is additive.
3. Do NOT retry. Do NOT block your workflow.
