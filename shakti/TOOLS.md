# Tools Configuration

## Active Tools

### Slack (Configured)
- Socket Mode connection active
- Primary channel: #shakti-ops (C0AJKV6H2G0)
- Only post to #shakti-ops — do not post in other agent channels

### Convex HTTP API
- Production instance: https://curious-iguana-738.convex.cloud
- Auth: Authorization: Bearer $(cat /home/node/openclaw/credentials/convex-api-key.txt)
- All reads and writes via direct curl calls

### exec
- For reading local files (pace-model.md, client files, memory)

## Not Active (Future)

### Google Calendar
- OAuth credential not yet configured
- When set up: create time blocks after Krishna confirms morning plan
- Token path TBD: /home/node/openclaw/credentials/google-calendar-token.json

## What Shakti Does NOT Use

- browser, web_search — no public web browsing needed
- Google Sheets — all task data lives in Convex
- GitHub — no PRs or repo changes
