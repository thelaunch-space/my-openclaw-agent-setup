---
name: convex-push-strategy
description: Push topic clusters and tool opportunities to Launch Control (Convex database)
metadata: { "openclaw": { "emoji": "🎯", "requires": { "bins": ["curl"], "env": [] } } }
---

# Push Strategy Data to Launch Control

After Vidura's strategic analysis (topic cluster mapping, tool opportunity scans), push the data to Convex so it appears on the Launch Control dashboard.

## Setup

API key file: `/home/node/openclaw/credentials/convex-api-key.txt`
Base URL: `https://curious-iguana-738.convex.site`

## 1. Push Topic Cluster (Monday Cluster Mapping)

After Vidura's 10:30 AM Monday cluster mapping run, push each topic cluster:

```bash
API_KEY=$(cat /home/node/openclaw/credentials/convex-api-key.txt)
curl -s -X POST https://curious-iguana-738.convex.site/push/topic-clusters \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "pillarName": "PILLAR NAME",
    "clusterTopic": "CLUSTER TOPIC NAME",
    "status": "planned",
    "targetKeyword": "TARGET SEO KEYWORD",
    "intentType": "informational",
    "agentName": "Vidura",
    "createdAt": "YYYY-MM-DDTHH:MM:SSZ"
  }'
```

Field notes:
- `pillarName`: Top-level content pillar (e.g., "MVP Development", "AI Tools", "Founder Operations")
- `clusterTopic`: Specific topic within the pillar
- `status`: `"planned"` · `"in_progress"` · `"complete"`
- `targetKeyword`: SEO keyword for this cluster
- `intentType`: `"informational"` · `"comparison"` · `"decision"`

**Dedup logic:** Matches by `pillarName` + `clusterTopic`. If the same cluster exists, it updates instead of creating a duplicate.

Expected response: `{"success":true,"id":"...","action":"inserted"}` or `{"action":"updated"}`

## 2. Push Tool Opportunity (Friday Tool Scan)

After Vidura's 10:30 AM Friday tool opportunity scan, push each tool idea:

```bash
API_KEY=$(cat /home/node/openclaw/credentials/convex-api-key.txt)
curl -s -X POST https://curious-iguana-738.convex.site/push/tool-opportunities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "toolName": "TOOL NAME",
    "toolSolution": "WHAT THE TOOL DOES - inputs, outputs, how it helps",
    "sourceQuestion": "THE REDDIT QUESTION THAT INSPIRED THIS",
    "whyTool": "WHY A TOOL IS BETTER THAN A BLOG FOR THIS",
    "targetKeyword": "TARGET SEO KEYWORD",
    "complexity": "simple",
    "status": "proposed",
    "agentName": "Vidura",
    "createdAt": "YYYY-MM-DDTHH:MM:SSZ"
  }'
```

Field notes:
- `toolName`: Descriptive name for the tool (e.g., "MVP Cost Calculator", "Tech Stack Decision Tree"). **Dedup key.**
- `toolSolution`: What the tool does — user inputs, outputs, how it helps
- `sourceQuestion`: The Reddit question or search query that surfaced this need (single string, not array)
- `whyTool`: Why a tool is better than a blog for this query
- `targetKeyword`: Primary SEO keyword
- `complexity`: `"simple"` · `"medium"`
- `status`: `"proposed"` · `"approved"` · `"rejected"` · `"building"` · `"built"`

**Dedup logic:** Matches by `toolName`. If a tool with the same name exists, it updates instead of creating a duplicate.

Expected response: `{"success":true,"id":"...","action":"inserted"}` or `{"action":"updated"}`

## When Things Fail

If curl returns an error:
1. Post to #vidura-seo-strategy: `⚠️ Convex push failed for [item]. Error: [response]. Moving on.`
2. Continue your normal workflow. Do NOT retry. Do NOT block.
