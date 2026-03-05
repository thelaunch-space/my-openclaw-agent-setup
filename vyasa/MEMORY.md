# MEMORY.md - Vyasa's Long-term Memory

## Facts

Durable truths that don't change often.

### Resources
- **Convex endpoint:** `https://curious-iguana-738.convex.site` (SSOT)
- **API key:** `/home/node/openclaw/credentials/convex-api-key.txt`
- **Target repo:** thelaunch-space/thelaunchspace
- **Blog URL pattern:** thelaunch.space/blogs/<topic>/<slug>
- **Published blogs tracker:** `/home/node/openclaw/vyasa/published-blogs.md`
- **Sheets (archive only):** `1xmeU8Iu7f540yl4iPp0KaCxVSfwfA_pciE8o1-jKD2g`

### Published Blogs Summary (as of 2026-03-05)

**Total: 24 blogs published**

| Cluster | Count | Examples |
|---------|-------|----------|
| Startup MVPs & Building | 8 | technical cofounder, MVP without coding, agency vs in-house, hire dev vs AI |
| Founder Advice & Strategy | 12 | validation, CRM, landing pages, distribution, post-MVP doubt |
| AI Tools & Automation | 4 | deploy AI code, invoice automation, vibe coding, AI tools for founders |

Full list with URLs: see `published-blogs.md`

### Topic Slugs
| Slug | Use For |
|------|---------|
| startup-mvps | MVP building, validation, lean startup, cofounders |
| landing-pages | Conversion, copywriting, landing page design |
| ai-tools | AI products, automation, AI for founders |
| founder-advice | General startup advice, lessons learned |
| growth-strategy | Marketing, growth hacking, scaling |
| technical-guides | How-to guides, tech decisions |

---

## Procedures

Learned how-tos from experience.

### The AI-First Paradigm Shift
Core framework for all content. Traditional advice was written for expensive/slow building. We write for cheap/fast:

1. **Building IS validation** - Ship MVP faster than traditional validation cycles.
2. **Skip endless interviews** - Domain experts with 10+ years already know the problem.
3. **Distribution first** - Build distribution model, work backwards to product.
4. **Non-technical founders can build** - AI-assisted development makes this real.

**Apply to every blog:** "How does the AI-first world change this traditional advice?"

### Writing Quality Checks
- **Answer question in first paragraph** - Position for featured snippets.
- **Business analogies for tech concepts** - Docker = "isolated apartments", API = "waiter taking orders".
- **Write as thelaunch.space (brand)** - "we" and "our", not "I" and "my".
- **Visual rhythm** - No more than 2 consecutive plain paragraphs without visual break.

### Internal Linking
- **Read published-blogs.md before writing** - Know what's published, where links fit.
- **2-4 internal links per post** - Descriptive anchor text, not "click here".
- **Same-cluster links strongest** - startup-mvps posts link to each other.
- **Link to homepage at least once.**

### URL Validation
- **Validate every external URL with `web_fetch`** before including.
- **If 404 or content mismatch** - Find alternative source.
- **404 links damage credibility.**

### PR Workflow
- **Push revisions to same branch** - PR updates automatically.
- **Don't close and reopen** for revisions.
- **After PR created:** Push blog metadata to Convex via `/push/blogs` endpoint (see TOOLS.md)

---

## Preferences

Krishna's stated choices for my work.

### Voice
- **Calm confidence** - State clearly, back with evidence.
- **Practitioner-level specificity** - Real tools, numbers, timeframes.
- **Honest about limitations** - "This breaks down when X" builds trust.
- **Avoid AI tells** - No em dashes, no "The secret to X? Y.", no negation-to-pivot.

### Content Standards
- **Bookmark test:** Would someone save this to reference later?
- **AI citation test:** More authoritative than what ChatGPT/Perplexity currently cite?
- **ICP test:** Would 45-year-old ex-McKinsey partner share in their Slack?
- **"So what?" test:** Every section has clear reason to exist.

### Quality Feedback (from Krishna)
- Post #3 (domain expert validation): Contrarian angle landed well. Go deeper on unique angles.
- Post #4 (agency MVP): "Fine, not mighty impactful" - decent take but didn't land strongly. Need more practitioner-specific insights.

---

## Setup Log

Chronological history.

### 2026-03-05
- **Memory audit:** Updated blog count from 4 to 24 (was severely outdated).
- Synced `published-blogs.md` with GitHub repo - found 7 blogs missing from tracking.
- Removed 2 blogs from tracking that no longer exist in repo (teachable-kajabi-custom-decision, first-sale-taking-forever).
- Current breakdown: 8 startup-mvps, 12 founder-advice, 4 ai-tools.

### 2026-02-11
- AI-First Paradigm Shift framework added to SOUL.md.
- Published: "Why Your Agency Wasted $30K" - feedback was lukewarm, need deeper angles.
- URL validation workflow added - `web_fetch` check before including external links.
- Internal linking workflow added - read published-blogs.md, 2-4 links per post.

### 2026-02-10
- Published: "Validate Startup Idea Domain Expert" - contrarian angle landed well.
- `set-published` command added to helper script.

### 2026-02-09
- Published first two blogs: Technical Cofounder, Build MVP Without Coding.
- Krishna requested additions: tool recommendations, learning roadmap.

### 2026-02-08
- Created. Purpose: blog writing + publishing for thelaunch.space.
- Source: Vibhishana's blog-queue. Target: GitHub PRs.
