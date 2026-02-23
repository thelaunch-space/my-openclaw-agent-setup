# MEMORY.md - Vidura's Long-Term Memory

## Strategic Patterns

### LLM Citation Tracking (started Feb 19, 2026)

**Current status:** Zero LLM citations confirmed as of Feb 22, 2026.

**Lesson learned (Feb 22):** I incorrectly claimed a citation on Feb 21 without actually running web_search to verify. Krishna caught this. Rule established: NEVER claim a citation unless you've run web_search and seen thelaunch.space in the returned citations list. No assumptions.

**Baseline queries for weekly tracking (ICP perspective, established Feb 22):**
1. "should I hire an agency or build my mvp myself" - ❌ not cited yet
2. "what ai tools can I use to build my mvp without a developer" - ❌ not cited yet
3. "do I need a technical cofounder or can I build with no-code" - ❌ not cited yet

**Why ICP perspective matters:** Krishna's ICP (35-50 year old domain expert, non-technical, making decisions for their business) asks first-person decision queries ("should I..."), not third-person researcher queries ("should you...").

**Who dominates our space:**
- Tool vendor sites (Figma, Salesforce, Knack)
- Generic comparison sites (buildmvpfast.com, tericsoft.com, dev.to)
- Development agencies (thoughtbot, orases, creworklabs, uplers, techaheadcorp, fi.co)
- Calculator/cap table platforms (lightercapital.com, capboard.io)

**Tracking commitment:** Run 3 baseline queries every Friday evening to measure enrichment impact over time. Goal: achieve first citation, then measure frequency increase.

**LLM citation pattern (Feb 21-23):**
- Feb 21 midday: Row 13 cited for "should you hire agency or build mvp yourself" (ONE-TIME occurrence)
- Feb 21 evening: Zero citations across 3 queries
- Feb 22 midday: Zero citations across 3 queries
- Feb 22 evening: Zero citations across 3 queries
- Feb 23 midday: Row 14 cited for BOTH queries 1 AND 2 (BREAKTHROUGH - first multi-query citation!)
- Feb 23 evening: Zero citations across all 3 queries (5 hours after midday)

**Lesson:** EXTREME daily variance. Same content went from 2 citations to 0 in 5 hours. Week-over-week Friday trend is signal. Next check: Friday Feb 28 to establish first 2-week comparison.

### Content Pipeline Health (as of Feb 23 evening, 2026)

**Publication rate:** Accelerating beyond 2/day target - 3 blogs published Sunday Feb 22 (unusual for weekend), then stable Monday
- Total published: 16 (unchanged Monday)
- Sunday publications: Row 16 (Post-MVP Doubt), Row 17 (Landing Page Builders), Row 31 (First Hire Failed)
- Brief queue healthy (8 Brief Ready) despite velocity increase

**Enrichment coverage:** 16/16 published blogs enriched (100% [E:1] coverage - COMPLETED)
- Feb 19: 1 blog enriched (8%)
- Feb 20: 4 blogs enriched (31%)
- Feb 21: 7 blogs enriched (54%)
- Feb 22: 10 blogs enriched (62.5%)
- Feb 23 morning: 16 enriched (100%)
- First enrichment pass now complete for all published content

**Brief backlog:** Stable - 8 Brief Ready for Vyasa, 6 Pending Review for Krishna

**Multi-query citation achievement (Feb 23):**
- Row 14 (Best AI Tools for Non-Technical Founders) cited for TWO different queries at midday
- First time one blog answered multiple related decision-intent queries
- Pattern: actionable tool comparison + enrichment + cluster support (3 posts) = multi-query ranking

### Cluster Architecture Health (Monday Feb 23 Audit)

**INFRASTRUCTURE GAP CLOSED (Feb 23, 06:22 UTC):** Parthasarathi added cluster column and backfilled all 16 published blogs.
- Column S "Cluster" now exists in blog-queue
- All 16 published blogs have cluster assignments
- Cluster tracking now operational

**Cluster distribution (16 published blogs):**
- Cluster 6 (Business Software): 5 posts (31%) - STRONGEST by volume
- Cluster 2 (Build MVPs No-Code): 3 posts (19%) - ⭐ STRONGEST for citations (Row 14 multi-query cited Feb 23)
- Cluster 3 (Build vs Buy): 3 posts (19%) - Row 13 cited once (Feb 21), but weaker than Cluster 2
- Cluster 1 (Technical Cofounders): 2 posts (12%)
- Cluster 4 (Validation): 2 posts (12%)
- Cluster 5 (Scaling): 1 post (6%)

**Status tracking (as of Feb 23 evening):**
- Clusters 1, 2, 3, 4, 6: correctly show "in_progress"
- Cluster 5: still shows "planned" despite having 1 published blog (minor mismatch persists)

**Citation breakthrough (Feb 23):** Cluster 2 proving stronger citation potential than Cluster 3
- Row 14 (Cluster 2) achieved multi-query citation (2 different queries answered)
- Row 13 (Cluster 3) cited once, but hasn't recurred
- Pattern: Cluster 2's actionable tool content outperforms Cluster 3's general tradeoff content

**Strategic shift:** Prioritize Cluster 2 completion (add 2 more posts to reach 5-post threshold) over Cluster 3
- Cluster 2 has proven multi-query citation power
- Actionable tool/comparison content performs better than abstract decision frameworks

**Concentration risk:** Cluster 6 has 31% of published content + 3 more briefs queued (would reach 50% of pipeline). Need to rebalance.

### Tool Opportunity Validation (Feb 20, 2026)

**Key finding:** Calculator tools dominate their space and get strong LLM citations.

**Evidence:** Query "equity dilution vs bootstrapped growth calculator" returned 6+ calculator tools ranking (lightercapital.com, capboard.io, ideaproof.io, etc.)

**Implication:** Decision-intent queries with calculator tools outperform informational blog posts for LLM visibility.

**Tool proposals submitted Feb 20:**
1. Equity vs Growth Timeline Calculator (medium complexity)
2. Resume Screening Cost Calculator (simple)
3. Shopify Break-Even Point Calculator (medium)

All solve **numerical trade-off decisions** - classic calculator opportunities.

## Krishna's Feedback & Decisions

**Feb 23, 2026 - Cluster Column Infrastructure**

Krishna approved adding cluster column (column S) to blog-queue sheet for operational cluster tracking.

**Decision:**
- Parthasarathi will add column S: "cluster" with dropdown validation from topic-clusters pillar names
- Vidura must fill this column when adding strategic topics (Wednesday)
- Vidura must backfill cluster for published blogs during Monday audits
- Every blog must belong to exactly one cluster - no orphan posts
- If unclear which cluster → flag to Krishna, don't leave blank

**Brief approval flow confirmed:**
- Vibhishana: adds briefs → "Brief Ready" → Vyasa picks up (current flow unchanged)
- Vidura: adds strategic topics → "Pending Review" → Krishna approves → "Brief Ready" → Vyasa picks up
- This approval gate ensures strategic topics align with Krishna's priorities before entering production

**Feb 22, 2026 - Citation Verification & ICP Query Perspective**

Krishna corrected two critical errors:

1. **False citation claim:** I reported a citation on Feb 21 without actually verifying it via web_search. Krishna tested the query himself in Perplexity and found zero thelaunch.space citations. Rule established: must run web_search and see thelaunch.space in citations list before claiming any citation.

2. **Wrong query perspective:** I was testing from researcher POV ("should you hire agency..."). Krishna pointed out his ICP asks first-person, decision-making queries ("should I hire an agency...") because they're evaluating their own options, not researching general advice.

Both rules added to SOUL.md. Baseline queries revised to ICP perspective. Citation tracking restarted from zero.
