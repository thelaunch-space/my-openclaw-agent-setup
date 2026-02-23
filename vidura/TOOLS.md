# TOOLS.md - Vidura's Tools

## Google Sheets

- SEO sheet: 1xmeU8Iu7f540yl4iPp0KaCxVSfwfA_pciE8o1-jKD2g
- Tabs: questions, blog-queue, topic-clusters, tool-opportunities
- **Helper script:** `node /home/node/openclaw/scripts/vidura-sheets-helper.js`

### Commands

```bash
# Read Vibhishana's Reddit questions (for Friday tool scan)
node scripts/vidura-sheets-helper.js list-questions 50

# Topic Clusters (for Monday cluster mapping)
node scripts/vidura-sheets-helper.js list-clusters
node scripts/vidura-sheets-helper.js add-cluster '{"pillarName":"...", "clusterTopic":"...", "targetKeyword":"...", "intentType":"informational"}'
node scripts/vidura-sheets-helper.js update-cluster 5 '{"status":"in_progress"}'

# Tool Opportunities (for Friday tool scan)
node scripts/vidura-sheets-helper.js list-tools
node scripts/vidura-sheets-helper.js add-tool '{"toolName":"...", "sourceQuestion":"...", "whyTool":"...", "toolSolution":"...", "targetKeyword":"..."}'

# Blog Queue (read-only, for context)
node scripts/vidura-sheets-helper.js list-briefs
```

**⚠️ Cluster Column (Column S):**
- blog-queue now has column S: "cluster" (pillar name from topic-clusters)
- Current helper script does NOT support adding cluster when adding briefs
- **TODO for Parthasarathi:** Update helper script to accept "cluster" field in add-brief command (when implemented)
- Until then: Manually update cluster column in sheet after adding topics via helper script
- For now: Add topics without cluster via helper, then manually note which cluster they belong to in your reports for Krishna to fill in

**What you READ:**
- blog-queue: enrichment status (enrichment_count, last_enrichment_date), brief quality, cluster alignment
- topic-clusters: cluster completeness, gap analysis

**What you WRITE:**
- blog-queue: add strategic topics (source: "vidura", status: "Pending Review")
- topic-clusters: maintain cluster map (pillars, subtopics, status, keywords, intent types)
- tool-opportunities: add tool proposals (source_question, why_tool, tool_name, tool_solution, target_keyword, complexity, status: "proposed")

## web_search

- Use for: LLM citation spot-checks, competitive research, verifying SEO trends
- Each session: test 2-3 queries against AI search to check if thelaunch.space appears

## web_fetch

- Use for: reading published blog content when evaluating enrichment effectiveness
- Use for: checking competitor content that ranks for target keywords
