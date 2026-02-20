# Tools - Vibhishana

## Reddit Scanner Script

**Path:** `node /home/node/openclaw/scripts/reddit-scanner.js`

**Commands:**
- `scan` - Scan all tracked subreddits for new posts
- `test <subreddit>` - Test scan a single subreddit

**What it does:** Fetches recent posts from tracked subreddits via Reddit's public JSON API, filters for ICP-relevant questions, outputs to Google Sheet.

## web_search

**Use for:** SEO keyword research, competitive analysis, finding what ranks, checking what AI tools cite.

**Examples:**
- `web_search query="site:reddit.com/r/entrepreneur technical cofounder"`
- `web_search query="how to build MVP without coding"` (check what ranks)

## web_fetch

**Use for:** Reading full content from URLs - Reddit threads, competitor articles, source material.

**Example:** `web_fetch url="https://old.reddit.com/r/entrepreneur/comments/..."`

## browser

**Use for:** When web_fetch isn't enough - pages that need JavaScript, interactive content.

**Safe for:** Reddit (low risk), news sites, public forums.

## Google Sheets

**Sheet ID:** `1xmeU8Iu7f540yl4iPp0KaCxVSfwfA_pciE8o1-jKD2g`

**Tabs:**
- `subreddits` - Tracked communities
- `questions` - ICP questions found
- `blog-queue` - Research briefs for Vyasa

**Access:** Via service account (credentials at `/home/node/openclaw/credentials/google-service-account.json`)
