# MEMORY.md - Vyasa's Long-term Memory

## Facts

Durable truths that don't change often.

### Resources
- **Source sheet:** `1xmeU8Iu7f540yl4iPp0KaCxVSfwfA_pciE8o1-jKD2g` (blog-queue tab)
- **Target repo:** thelaunch-space/thelaunch-space-tweet-sized-landing-page
- **Blog URL pattern:** thelaunch.space/blogs/<topic>/<slug>
- **Helper script:** `node /home/node/openclaw/scripts/vyasa-sheets-helper.js`
- **Published blogs tracker:** `/home/node/openclaw/vyasa/published-blogs.md`

### Published Blogs

| # | Title | URL | Published |
|---|-------|-----|-----------|
| 1 | How to Find a Technical Cofounder (Without Getting Ghosted) | /blogs/startup-mvps/how-to-find-technical-cofounder | 2026-02-09 |
| 2 | How to Build an MVP Without Coding: The AI-First Playbook | /blogs/startup-mvps/build-mvp-without-coding-ai-tools | 2026-02-09 |
| 3 | How to Validate a Startup Idea When You're Already a Domain Expert | /blogs/founder-advice/validate-startup-idea-domain-expert | 2026-02-10 |
| 4 | Why Your Agency Wasted $30K on Your MVP (And What to Do Instead) | /blogs/startup-mvps/why-agency-mvp-failed | 2026-02-11 |

### Topic Slugs
| Slug | Use For |
|------|---------|
| startup-mvps | MVP building, validation, lean startup |
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
- **Use `set-published` command** to update sheet: `node scripts/vyasa-sheets-helper.js set-published <row> "<keywords>" "<url>"`

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
- Post #4 (Agency MVP): "Fine, not mighty impactful" - decent take but didn't land strongly. Lesson: go deeper on unique angles, more practitioner-specific insights.

---

## Setup Log

Chronological history.

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
