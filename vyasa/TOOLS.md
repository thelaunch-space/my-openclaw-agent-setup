# TOOLS.md - Vyasa's Local Notes

## Convex (Primary Data Source)

**Convex is SSOT for all brief/blog operations.**

### Get Briefs Ready to Write
```bash
API_KEY=$(cat /home/node/openclaw/credentials/convex-api-key.txt)
curl -s "https://curious-iguana-738.convex.site/query/briefs?status=brief_ready" \
  -H "Authorization: Bearer $API_KEY"
```

### Update Brief Status
```bash
API_KEY=$(cat /home/node/openclaw/credentials/convex-api-key.txt)
curl -s -X POST "https://curious-iguana-738.convex.site/update/brief-status" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"slug": "your-slug", "status": "writing"}'
```

### Push Blog After PR Created
```bash
API_KEY=$(cat /home/node/openclaw/credentials/convex-api-key.txt)
curl -s -X POST "https://curious-iguana-738.convex.site/push/blogs" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"slug": "...", "title": "...", "url": "...", "keywords": [...], ...}'
```

Workflow: query `brief_ready` → update status to `writing` → write blog → create PR → push blog to Convex

## Google Sheets (Archive Only)

Sheet ID: `1xmeU8Iu7f540yl4iPp0KaCxVSfwfA_pciE8o1-jKD2g`
**DO NOT read from Sheets. Convex is primary. Sheets is archive/fallback only.**

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
