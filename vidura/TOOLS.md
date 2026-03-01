# TOOLS.md - Vidura's Tools

## Convex (Primary)

**Endpoint:** `https://curious-iguana-738.convex.site`
**Auth:** `Authorization: Bearer $(cat /home/node/openclaw/credentials/convex-api-key.txt)`

### Read Commands (via helper script)

```bash
# Topic Clusters - your cluster map
node scripts/vidura-sheets-helper.js list-clusters

# Tool Opportunities - your tool proposals
node scripts/vidura-sheets-helper.js list-tools

# Reddit Questions - for Friday tool scan (still from Sheets, migrating)
node scripts/vidura-sheets-helper.js list-questions 50

# Blog Queue status - for context
node scripts/vidura-sheets-helper.js list-briefs
```

### Write Commands (direct curl to Convex)

**Topic Clusters (Monday 10:30 AM):**
```bash
API_KEY=$(cat /home/node/openclaw/credentials/convex-api-key.txt)
curl -s -X POST https://curious-iguana-738.convex.site/push/topic-clusters \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "pillarName": "PILLAR NAME",
    "clusterTopic": "CLUSTER TOPIC",
    "status": "planned",
    "targetKeyword": "TARGET KEYWORD",
    "intentType": "informational",
    "agentName": "Vidura"
  }'
```

**Tool Opportunities (Friday 10:30 AM):**
```bash
API_KEY=$(cat /home/node/openclaw/credentials/convex-api-key.txt)
curl -s -X POST https://curious-iguana-738.convex.site/push/tool-opportunities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "toolName": "TOOL NAME",
    "toolSolution": "WHAT IT DOES",
    "sourceQuestion": "REDDIT QUESTION",
    "whyTool": "WHY TOOL > BLOG",
    "targetKeyword": "TARGET KEYWORD",
    "complexity": "simple",
    "status": "proposed",
    "agentName": "Vidura"
  }'
```

**Strategic Topics (Wednesday 10:30 AM):**
```bash
API_KEY=$(cat /home/node/openclaw/credentials/convex-api-key.txt)
curl -s -X POST https://curious-iguana-738.convex.site/push/briefs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "title": "TOPIC TITLE",
    "slug": "topic-slug-here",
    "primaryKeyword": "PRIMARY KEYWORD",
    "intentType": "comparison",
    "cluster": "PILLAR NAME",
    "launchSpaceAngle": "WHY THIS MATTERS FOR ICP",
    "status": "pending_review",
    "agentName": "Vidura"
  }'
```

**Activity Milestones:**
```bash
curl -s -X POST https://curious-iguana-738.convex.site/push/activity \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "agentName": "Vidura",
    "action": "cluster_mapping",
    "status": "completed",
    "message": "Mapped X new topic clusters",
    "dedupKey": "Vidura:cluster_mapping:'$(date -u +"%Y-%m-%d")'"
  }'
```

## Google Sheets (Fallback Only)

- Sheet ID: `1xmeU8Iu7f540yl4iPp0KaCxVSfwfA_pciE8o1-jKD2g`
- **DO NOT write directly to Sheets.** Write to Convex; Sheets is archive/fallback.
- Helper script falls back to Sheets only if Convex read fails.

## web_search

Use for: LLM citation spot-checks, competitive research, verifying SEO trends.
Each session: test 2-3 queries against AI search to check if thelaunch.space appears.

## web_fetch

Use for: reading published blog content, checking competitor content that ranks for target keywords.
