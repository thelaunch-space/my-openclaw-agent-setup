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
curl -s -X POST https://curious-iguana-738.convex.site/ingestTopicCluster \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "pillar": "PILLAR NAME",
    "cluster": "CLUSTER NAME",
    "keywords": ["keyword 1", "keyword 2", "keyword 3"],
    "briefCount": 0,
    "blogCount": 0,
    "status": "planned",
    "priority": "high",
    "notes": "STRATEGIC NOTES",
    "agentName": "Vidura",
    "createdAt": "YYYY-MM-DDTHH:MM:SSZ"
  }'
```

Field notes:
- `pillar`: Top-level content pillar (e.g., "MVP Development", "AI Tools", "Founder Operations")
- `cluster`: Specific topic cluster within the pillar
- `keywords`: Target keywords for this cluster
- `briefCount`/`blogCount`: Track content coverage (update as briefs/blogs are created)
- `status`: `"planned"`, `"in_progress"`, `"covered"`, `"saturated"`
- `priority`: `"high"`, `"medium"`, `"low"`

**Dedup logic:** Matches by `pillar` + `cluster`. If the same cluster exists, it updates instead of creating a duplicate.

Expected response: `{"success":true,"id":"...","action":"inserted"}` or `{"action":"updated"}`

## 2. Push Tool Opportunity (Friday Tool Scan)

After Vidura's 10:30 AM Friday tool opportunity scan, push each tool idea:

```bash
API_KEY=$(cat /home/node/openclaw/credentials/convex-api-key.txt)
curl -s -X POST https://curious-iguana-738.convex.site/ingestToolOpportunity \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "toolName": "TOOL NAME",
    "description": "WHAT THE TOOL DOES",
    "sourceQuestions": ["reddit URL 1", "reddit URL 2"],
    "icpPain": "THE SPECIFIC PAIN POINT",
    "complexity": "simple",
    "priority": "high",
    "status": "idea",
    "notes": "IMPLEMENTATION NOTES",
    "agentName": "Vidura",
    "createdAt": "YYYY-MM-DDTHH:MM:SSZ"
  }'
```

Field notes:
- `toolName`: Descriptive name for the tool (e.g., "MVP Cost Calculator", "Tech Stack Decision Tree")
- `sourceQuestions`: Reddit URLs that surfaced this need
- `complexity`: `"simple"` (1-2 days), `"medium"` (1 week), `"complex"` (2+ weeks)
- `priority`: `"high"` (clear ICP pain), `"medium"` (nice to have), `"low"` (future consideration)
- `status`: `"idea"`, `"approved"`, `"in_progress"`, `"live"`, `"dropped"`

**Dedup logic:** Matches by `toolName`. If a tool with the same name exists, it updates instead of creating a duplicate.

Expected response: `{"success":true,"id":"...","action":"inserted"}` or `{"action":"updated"}`

## When Things Fail

If curl returns an error:
1. Post to #vidura-seo-strategy: `⚠️ Convex push failed for [item]. Error: [response]. Moving on.`
2. Continue your normal workflow. Do NOT retry. Do NOT block.
