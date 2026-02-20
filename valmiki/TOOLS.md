# Tools - Valmiki

## Core Tools

### LinkedIn Tracker Sheet

**Sheet:** https://docs.google.com/spreadsheets/d/1GyEUrZxvwiYhtHm5uhAPUelwbFoeWbnxQVSySokRfd8/edit

**Helper script:** `node /home/node/openclaw/scripts/valmiki-sheets-helper.js`

**Commands:**
```bash
# List recent posts
node /home/node/openclaw/scripts/valmiki-sheets-helper.js list

# Add a post after Krishna approves
node /home/node/openclaw/scripts/valmiki-sheets-helper.js add-post '{"category":"lead_gen", "hook":"First line...", "body":"Rest of post...", "cta":"...", "fullPost":"Complete post text", "status":"approved"}'

# Update metrics after posting
node /home/node/openclaw/scripts/valmiki-sheets-helper.js update-metrics <row> '{"status":"posted", "goLiveDate":"2026-02-19", "goLiveTime":"08:30"}'

# Get performance summary
node /home/node/openclaw/scripts/valmiki-sheets-helper.js get-stats
```

**Columns:**
- date-drafted, post-category, post-hook, post-body, post-cta, post-full
- post-status (drafted → approved → posted → analyzed)
- post-go-live-date, post-go-live-time
- impression-count, comment-count, like-count, experiment-tag

### Reading Agent Channels
```
message action=read channel=slack channelId=<ID> limit=<N>
```

**Channel IDs:**
- #vyasa-blogs: `C0ADUM2TLEQ`
- #vibhishana-seo: `C0AEFPRRV08`
- #vidura-seo-strategy: `C0AFTEV7Q6Q`

### Reading Blog-Queue Sheet
```
node /home/node/openclaw/scripts/vyasa-sheets-helper.js list
```

Shows all briefs with status, titles, and metadata.

### Posting to Your Channel
```
message action=send channel=slack target=C0AD3SHGV2A message="your message"
```

### Web Search (for research)
```
web_search query="LinkedIn growth tactics 2026"
```

Use for weekly research sessions, competitive analysis, or when Krishna asks you to study something specific.

## Not Used

- **Cron management** - Parthasarathi handles this
- **Gateway config** - Parthasarathi handles this
- **GitHub** - Vyasa handles blog PRs
- **Direct LinkedIn access** - Krishna posts manually
