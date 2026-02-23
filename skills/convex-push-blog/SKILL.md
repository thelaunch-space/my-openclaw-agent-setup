---
name: convex-push-blog
description: Push published blog metadata to Launch Control (Convex database)
metadata: { "openclaw": { "emoji": "📝", "requires": { "bins": ["curl"], "env": [] } } }
---

# Push Blog Data to Launch Control

After creating a blog PR, push the blog metadata to Convex so it appears on the Launch Control dashboard.

## Setup

API key file: `/home/node/openclaw/credentials/convex-api-key.txt`
Base URL: `https://curious-iguana-738.convex.site`

## Push Blog (After Creating PR)

After your daily blog run, once the PR is created and the sheet is updated, push the blog metadata. **Use upsertBlog (not ingestBlog)** — this prevents duplicates if the same blog is pushed again (e.g., during enrichment or retries).

```bash
API_KEY=$(cat /home/node/openclaw/credentials/convex-api-key.txt)
curl -s -X POST https://curious-iguana-738.convex.site/upsertBlog \
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
- `status`: use `"pr_created"` when you submit the PR. Krishna or Partha will update to `"published"` after merge.
- `wordCount`: the actual word count as a number (no quotes), e.g., `2847`
- `createdAt`: ISO timestamp of when you started writing

**Dedup logic:** Matches by `slug` field. If a blog with the same slug exists, it updates the record instead of creating a duplicate.

Expected response: `{"success":true,"id":"...","action":"inserted"}` or `{"success":true,"id":"...","action":"updated"}`

## Pushing Enrichment Data

After Vyasa's enrichment cycle (citation enrichment), push enrichment metadata for the blog that was just enriched.

Run this with `exec`:

```bash
API_KEY=$(cat /home/node/openclaw/credentials/convex-api-key.txt)

curl -s -X POST https://curious-iguana-738.convex.site/updateBlogEnrichment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "slug": "blog-post-slug",
    "enrichmentCount": 2,
    "lastEnrichmentDate": "YYYY-MM-DDTHH:MM:SSZ",
    "enrichmentLog": "Added 3 expert citations, updated stats section, added FAQ schema"
  }'
```

- When: After each enrichment PR is created
- Expected response: `{"success":true}`
- `enrichmentCount`: Cumulative — if this is the 2nd enrichment pass, use 2
- `enrichmentLog`: One-line summary of what was enriched in this pass
- Same error handling as below: log to #vyasa-blogs, move on, never retry

## When Things Fail

If curl returns an error or non-200 response:
1. Post to #vyasa-blogs: `⚠️ Convex push failed for [blog title]. Error: [response]. Moving on.`
2. Continue your normal workflow. The PR is still created — Convex is additive.
3. Do NOT retry. Do NOT block your workflow.
