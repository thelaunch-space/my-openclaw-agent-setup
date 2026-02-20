# GitHub PR Workflow

This workflow covers submitting blog posts to the thelaunch.space repository.

---

## Submit PR via GitHub API

**Repository:** thelaunch-space/thelaunch-space-tweet-sized-landing-page

**Auth:** GitHub token from environment variable, `Authorization: Bearer <token>`

### Step 1: Get Latest Main SHA

`GET /repos/thelaunch-space/thelaunch-space-tweet-sized-landing-page/git/ref/heads/main`

### Step 2: Create Branch

`POST /repos/.../git/refs`

Body:
```json
{
  "ref": "refs/heads/blog/<topic>/<slug>",
  "sha": "<main-sha>"
}
```

### Step 3: Create File

`PUT /repos/.../contents/app/blogs/<topic>/<slug>/page.tsx`

Body:
```json
{
  "message": "Add blog: <Title>",
  "content": "<base64-encoded-content>",
  "branch": "blog/<topic>/<slug>"
}
```

### Step 4: Create PR

`POST /repos/.../pulls`

Body:
```json
{
  "title": "Add blog: <Title>",
  "head": "blog/<topic>/<slug>",
  "base": "main",
  "body": "## New Blog Post\n- **Title:** <Title>\n- **Topic:** <topic>\n- **URL:** thelaunch.space/blogs/<topic>/<slug>\n- **Keywords:** <primary + long-tail>\n- **Summary:** <2-3 sentences>"
}
```

---

## Report to Slack

Post to #vyasa-blogs:

```
## New Blog PR

**Title:** [title]
**URL:** thelaunch.space/blogs/[topic]/[slug]
**PR:** [GitHub PR link]
**Keywords:** [primary keyword, long-tail keywords]
**Summary:** [2-3 sentences about what the post covers]
**Source:** Based on Vibhishana's research from [date]
**External sources cited:** [count] backlinks to authoritative sources
```

---

## Update Google Sheet

Use the helper script to update Vibhishana's blog-queue:

```bash
node /home/node/openclaw/scripts/vyasa-sheets-helper.js set-published <row> "<final keywords>" "<blog url>"
```

This updates three columns at once:
- **Status** → "PR Created"
- **Final Keywords** → The actual keywords you optimized for (comma-separated). Include primary + key long-tail keywords.
- **Blog URL** → Full URL: `https://thelaunch.space/blogs/<topic>/<slug>`

Example:
```bash
node /home/node/openclaw/scripts/vyasa-sheets-helper.js set-published 3 "how to build MVP without coding, no-code MVP tools, AI tools for building MVP" "https://thelaunch.space/blogs/startup-mvps/build-mvp-without-coding-ai-tools"
```

---

## Update published-blogs.md

Add the new blog to the relevant cluster table in `published-blogs.md`:

| # | Title | URL | Primary Keyword | Key Headings |

This keeps the internal linking reference current for the next blog.

---

## PR Revisions

When Krishna asks for changes on an existing PR:
- Push new commits to the same branch
- The PR updates automatically
- Avoid closing and reopening a new PR for revisions
