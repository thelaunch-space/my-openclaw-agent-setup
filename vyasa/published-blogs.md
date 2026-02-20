# Published Blogs - thelaunch.space

> Vyasa: Read this file before writing every blog post.
> Use it to add relevant internal links. Only link when contextually relevant. Never force a link.
> Update this file after every PR is submitted (add the new blog entry).

## Topic Clusters

Blogs are grouped into clusters. Google treats clusters as authority signals — blogs within the same cluster should link to each other when relevant. Cross-cluster links are fine when the content genuinely connects.

### Cluster: Startup MVPs & Building
Blogs about building products, finding cofounders, MVP methodology.

| # | Title | URL | Primary Keyword | Key Headings |
|---|-------|-----|-----------------|--------------|
| 1 | How to Find a Technical Cofounder (Without Getting Ghosted) | /blogs/startup-mvps/how-to-find-technical-cofounder | find technical cofounder | Where to look, What cofounders want, Red flags, Alternatives |
| 2 | Build Your MVP Without Coding: AI-First Tools That Actually Work | /blogs/startup-mvps/build-mvp-without-coding-ai-tools | build MVP without coding | AI tools comparison, When to use what, Real cost breakdown |
| 4 | Why Your Agency Wasted $30K on Your MVP (And What to Do Instead) | /blogs/startup-mvps/why-agency-mvp-failed | agency MVP failed | Agency failure patterns, DIY alternatives, AI-first approach |

### Cluster: Founder Advice & Strategy
Blogs about founder decision-making, validation, growth.

| # | Title | URL | Primary Keyword | Key Headings |
|---|-------|-----|-----------------|--------------|
| 3 | How to Validate Your Startup Idea as a Domain Expert | /blogs/founder-advice/validate-startup-idea-domain-expert | validate startup idea | Domain expertise advantage, Validation framework, Testing demand |

### Cluster: AI Tools & Automation
Blogs about AI products, automation, AI for non-technical founders.

| # | Title | URL | Primary Keyword | Key Headings |
|---|-------|-----|-----------------|--------------|
| 5 | I Built My App With AI. Now What? | /blogs/ai-tools/ai-generated-code-deployment-reality | deploy AI generated code production | Why AI code feels like trap, Tool reality check, Three paths forward, $1,000 calculator, Rescue pathway |

## Internal Linking Rules

1. **Only link when contextually relevant.** If the current paragraph naturally relates to another blog's topic, link it. If not, skip it. Forced links hurt readability and SEO.
2. **Target: 2-4 internal links per blog post** (for ~1,500 words). Zero is fine if nothing is relevant. Never pad to hit a number.
3. **Use descriptive anchor text.** Write: "learn how to [validate your startup idea](/blogs/founder-advice/validate-startup-idea-domain-expert) before building." NOT: "[click here](/blogs/...)" or "[read more](/blogs/...)."
4. **Same-cluster links are strongest.** Two blogs in the "Startup MVPs" cluster linking to each other tells Google you have depth on that topic.
5. **Cross-cluster links work when genuine.** A blog about MVP building can naturally reference the validation blog — they're related even though they're in different clusters.
6. **Link early in the post when possible.** Internal links in the first 30% of the post carry more weight than links buried at the bottom.
7. **Homepage link still required.** Keep the existing rule: link to `/` at least once (usually in the CTA or naturally in text).
8. **Never link the same blog twice** in one post. One mention is enough.

## How to Update This File

After submitting every PR, add a new row to the relevant cluster table:

| # | Title | URL | Primary Keyword | Key Headings |

If the blog doesn't fit an existing cluster, create a new cluster section with a descriptive name.

Use the topic slug categories from AGENTS.md:
- startup-mvps → Cluster: Startup MVPs & Building
- landing-pages → Cluster: Landing Pages & Conversion
- ai-tools → Cluster: AI Tools & Automation
- founder-advice → Cluster: Founder Advice & Strategy
- growth-strategy → Cluster: Growth & Marketing Strategy
- technical-guides → Cluster: Technical Guides
