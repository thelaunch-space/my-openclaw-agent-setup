---
name: convex-push-document
description: Push significant documents (research, strategy, analysis, process) to Launch Control (Convex database)
metadata: { "openclaw": { "emoji": "📄", "requires": { "bins": ["curl"], "env": [] } } }
---

# Push Documents to Launch Control

When you create a significant document (research report, strategy doc, analysis, process doc), push it to Convex so it appears in Launch Control's Documents tab.

## Setup

API key file: `/home/node/openclaw/credentials/convex-api-key.txt`
Base URL: `https://curious-iguana-738.convex.site`

## When to Push (and When NOT to)

### ✅ PUSH These Document Types

| Agent | Document Type | Category |
|-------|--------------|----------|
| Valmiki | ICP research, market analysis, competitive research | `research` or `analysis` |
| Vidura | SEO strategy docs, cluster plans, citation reports | `strategy` |
| Vibhishana | Deep research (NOT daily briefs - those go to briefs table) | `research` |
| Parthasarathi | Process docs, workflow documentation, system architecture | `process` |
| Vyasa | Content strategy docs, standalone analysis | `analysis` |

### ❌ Do NOT Push These

- Daily memory files (`memory/YYYY-MM-DD.md`)
- Config files (`AGENTS.md`, `SOUL.md`, `TOOLS.md`, etc.)
- Daily research briefs from Vibhishana (they go to the `briefs` table)
- Blog post content (goes to `blogs` table)
- Activity logs (goes to `agentActivity` table)

## Category Values

Use one of:
- `research` — ICP analysis, market research, competitive analysis
- `strategy` — SEO plans, content strategy, cluster mapping
- `brief` — Deep research briefs (not daily 3x briefs)
- `process` — Workflow documentation, system architecture
- `analysis` — Data analysis, performance reports

## Push Document

Run this with `exec` after creating a significant document. Use Node.js for JSON escaping (jq not installed):

```bash
node -e "
const fs = require('fs');
const https = require('https');

const apiKey = fs.readFileSync('/home/node/openclaw/credentials/convex-api-key.txt', 'utf8').trim();
const content = fs.readFileSync('/path/to/document.md', 'utf8');

const payload = JSON.stringify({
  title: 'DOCUMENT TITLE',
  slug: 'document-slug-here',
  content: content,
  summary: 'One-line description of document',
  category: 'research',
  tags: ['tag1', 'tag2'],
  agentName: 'AGENT_NAME',
  filePath: '/home/node/openclaw/AGENT/path/to/file.md',
  createdAt: new Date().toISOString().split('T')[0]
});

// Write payload to temp file for curl
fs.writeFileSync('/tmp/doc-payload.json', payload);
console.log('Payload written to /tmp/doc-payload.json');
"

# Then use curl with the temp file
API_KEY=\$(cat /home/node/openclaw/credentials/convex-api-key.txt)
curl -s --max-time 60 -X POST "https://curious-iguana-738.convex.site/upsertDocument" \\
  -H "Authorization: Bearer \$API_KEY" \\
  -H "Content-Type: application/json" \\
  -d @/tmp/doc-payload.json
```

## Field Reference

| Field | Required | Description |
|-------|----------|-------------|
| `title` | ✅ | Human-readable title |
| `slug` | ✅ | URL-safe identifier (lowercase, hyphens). **Dedup key** — same slug updates existing doc |
| `content` | ✅ | Full markdown content |
| `category` | ✅ | One of: `research`, `strategy`, `brief`, `process`, `analysis` |
| `agentName` | ✅ | Exactly: `"Parthasarathi"`, `"Valmiki"`, `"Vidura"`, `"Vibhishana"`, `"Vyasa"` |
| `createdAt` | ✅ | Date string: `YYYY-MM-DD` |
| `summary` | ❌ | One-line description |
| `tags` | ❌ | Array of strings for filtering |
| `filePath` | ❌ | VPS path to source file |
| `updatedAt` | ❌ | Date string if updating existing doc |

## Slug Rules

- Slug is the **dedup key**. Same slug = update existing. New slug = insert new.
- Format: lowercase, hyphens, no spaces
- Examples:
  - `icp-research-domain-expert-founders`
  - `seo-strategy-q1-2026`
  - `content-pipeline-process-doc`

## Examples by Agent

**Valmiki (ICP Research):**
```bash
node -e "
const fs = require('fs');
const content = fs.readFileSync('/home/node/openclaw/valmiki/memory/ICP-RESEARCH.md', 'utf8');
const payload = JSON.stringify({
  title: 'ICP Research: 10 Target Industries',
  slug: 'icp-research-10-target-industries',
  content: content,
  summary: 'Deep analysis of 10 industries for thelaunch.space ICP targeting',
  category: 'research',
  tags: ['icp', 'market-research', 'targeting'],
  agentName: 'Valmiki',
  filePath: '/home/node/openclaw/valmiki/memory/ICP-RESEARCH.md',
  createdAt: '2026-02-23'
});
fs.writeFileSync('/tmp/doc-payload.json', payload);
"

API_KEY=$(cat /home/node/openclaw/credentials/convex-api-key.txt)
curl -s --max-time 60 -X POST "https://curious-iguana-738.convex.site/upsertDocument" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d @/tmp/doc-payload.json
```

**Vidura (SEO Strategy):**
```bash
node -e "
const fs = require('fs');
const content = fs.readFileSync('/path/to/seo-strategy.md', 'utf8');
const payload = JSON.stringify({
  title: 'Q1 2026 SEO Strategy',
  slug: 'seo-strategy-q1-2026',
  content: content,
  summary: 'Topic clusters, keyword targets, and content priorities for Q1',
  category: 'strategy',
  tags: ['seo', 'content-strategy', 'topic-clusters'],
  agentName: 'Vidura',
  filePath: '/path/to/seo-strategy.md',
  createdAt: new Date().toISOString().split('T')[0]
});
fs.writeFileSync('/tmp/doc-payload.json', payload);
"

API_KEY=$(cat /home/node/openclaw/credentials/convex-api-key.txt)
curl -s --max-time 60 -X POST "https://curious-iguana-738.convex.site/upsertDocument" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d @/tmp/doc-payload.json
```

**Parthasarathi (Process Doc):**
```bash
node -e "
const fs = require('fs');
const content = fs.readFileSync('/path/to/workflow.md', 'utf8');
const payload = JSON.stringify({
  title: 'Agent Orchestration Workflow',
  slug: 'agent-orchestration-workflow',
  content: content,
  summary: 'How Parthasarathi coordinates the agent team',
  category: 'process',
  tags: ['workflow', 'orchestration', 'agents'],
  agentName: 'Parthasarathi',
  filePath: '/path/to/workflow.md',
  createdAt: new Date().toISOString().split('T')[0]
});
fs.writeFileSync('/tmp/doc-payload.json', payload);
"

API_KEY=$(cat /home/node/openclaw/credentials/convex-api-key.txt)
curl -s --max-time 60 -X POST "https://curious-iguana-738.convex.site/upsertDocument" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d @/tmp/doc-payload.json
```

## Post-Push Checklist

After every document push:

1. ✅ Check response: `{"success":true,"id":"..."}`
2. ✅ Post to your Slack channel: `✅ Pushed document: [TITLE] to Launch Control`
3. ❌ If error: Post `⚠️ Convex document push failed for [TITLE]. Error: [response]`

## When Things Fail

If curl returns an error:
1. Log to Slack: `⚠️ Convex document push failed for [TITLE]. Error: [response]. Moving on.`
2. Do NOT retry. Do NOT block. Document logging is nice-to-have, not critical.

Expected success response: `{"success":true,"id":"..."}` or `{"success":true,"id":"...","updated":true}` if updating existing
