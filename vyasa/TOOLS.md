# TOOLS.md - Vyasa's Local Notes

## Google Sheets

- Vibhishana's SEO sheet: 1xmeU8Iu7f540yl4iPp0KaCxVSfwfA_pciE8o1-jKD2g
- Tab: blog-queue
- **My helper script:** `node /home/node/openclaw/scripts/vyasa-sheets-helper.js`
  - `list` - show all briefs with status
  - `ready` - get first "Brief Ready" entry as JSON (use this to pick next blog)
  - `set-status <row> <status>` - update status (e.g., `set-status 2 Writing`)
  - `set-published <row> "<keywords>" "<url>"` - update Final Keywords, Blog URL, and set status to "PR Created"
- Workflow: `ready` → `set-status N Writing` → write blog → PR → `set-published N "<keywords>" "<url>"`

### Enrichment Commands

```bash
# List all published blogs with enrichment data
node scripts/vyasa-sheets-helper.js list-published

# Get next blog to enrich (oldest enrichment date, NULLs first) as JSON
node scripts/vyasa-sheets-helper.js next-enrich

# Update enrichment columns after enrichment PR
node scripts/vyasa-sheets-helper.js set-enrichment <row> <count> "<log>"
# Example: set-enrichment 3 2 "Added 3 stats, FAQ section, comparison table"
```

Enrichment workflow: `next-enrich` → enrich blog → PR → `set-enrichment N <count> "<log>"`

## Enrichment Tracking (blog-queue sheet)

Additional columns used during enrichment runs:

- **enrichment_count** - how many enrichment passes this blog has had
- **last_enrichment_date** - when it was last enriched
- **enrichment_log** - what was added in the last pass
- **source** - who originated the topic: "vibhishana" or "vidura"

Selection logic: pick published blog with oldest last_enrichment_date. NULLs first.

## GitHub API

- Repo: thelaunch-space/thelaunchspace
- Auth: `cat /home/node/openclaw/credentials/github-token.txt` → use as Bearer token
- Base URL: https://api.github.com/repos/thelaunch-space/thelaunchspace
- Always create branches from latest main SHA
- Branch naming: blog/<topic-slug>/<post-slug>
- File path: app/blogs/<topic-slug>/<post-slug>/page.tsx
- Commit message: Add blog: <Title>

## web_search

- Use for: fact checking, finding current data, checking competitors, finding backlink sources
- Use liberally during research phase
