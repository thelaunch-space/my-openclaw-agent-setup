# Tools Configuration

## Active Tools

### web_search
- Perplexity Sonar via OpenRouter
- Use for: research, news, finding articles, SEO checks
- Preferred over browser for general searches

### browser (Playwright/Chromium)
- Headless Chromium, installed and working
- Use for: Reddit browsing, reading pages that need JS, screenshots
- Config: `/home/node/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome`

**Platform guide:**

| Platform | Risk | Recommendation |
|----------|------|----------------|
| Reddit | LOW | Safe for regular use |
| Google | MEDIUM | Use web_search instead |
| X/Twitter | MEDIUM | Occasional OK, not bulk |
| LinkedIn | HIGH | Avoid - use Apify if configured |

### Slack (Configured)
- Socket Mode connection active
- Channels: DMs, #vibhishana-seo, #vyasa-blogs, #sanjaya-scouting-leads (paused), #valmiki-content (paused)
- Use `message` tool for sending

### Google Sheets (Configured)
- Service account: `lucy-the-scout@lucy-automation-486513.iam.gserviceaccount.com`
- Credentials: `/home/node/openclaw/credentials/google-service-account.json`
- Helper: `node scripts/sheets-helper.js`

## Helper Scripts

| Script | Purpose |
|--------|---------|
| `node scripts/sheets-helper.js` | Lead tracking sheet operations |
| `node scripts/reddit-scanner.js` | Reddit scanning (Vibhishana) |
| `node scripts/vyasa-sheets-helper.js` | Blog-queue operations (Vyasa) |
| `node scripts/content-helper.js` | Content drafts sheet |

## Not Active (Future)

These are documented but not currently configured:

- **Apify** - LinkedIn scrapers, bulk data collection. No token configured.
- **Zapier MCP** - App integrations. Not set up.

## Data Flow

```
Blog Pipeline (Active):
  Vibhishana scans Reddit → questions tab
  Vibhishana creates brief → blog-queue (Pending Review)
  Krishna reviews → Brief Ready
  Vyasa writes blog → PR Created
  Krishna merges → Published

Lead Pipeline (Paused):
  Sanjaya would scan sources → leads sheet
  Currently inactive
```

## Tool Usage Rules

1. Prefer web_search over browser for simple lookups
2. Browser is fine for Reddit, news sites, public forums
3. Check data freshness before acting on it
4. Save notable findings to memory
