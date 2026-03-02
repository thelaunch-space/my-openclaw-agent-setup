# Tools Configuration

## Active Tools

### Slack (Configured)
- Socket Mode connection active
- Primary channel: #shakti-ops (C0AJKV6H2G0)
- Only post to #shakti-ops — do not post in other agent channels

### Convex HTTP API
- **Base URL:** https://curious-iguana-738.convex.site
- **Auth:** Authorization: Bearer $(cat /home/node/openclaw/credentials/convex-api-key.txt)
- All reads and writes via direct curl calls

#### Endpoints

**Read Tasks:**
```bash
API_KEY=$(cat /home/node/openclaw/credentials/convex-api-key.txt)
curl -s "https://curious-iguana-738.convex.site/query/tasks" \
  -H "Authorization: Bearer $API_KEY"
```
Returns array of tasks. Each task has an `_id` field for updates/deletes.

**Create/Update Task (upsert):**
```bash
curl -s -X POST "https://curious-iguana-738.convex.site/push/tasks" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ ... task fields ... }'
```

**Update Task Fields — POST /update/task:**
Use this to correct a task's title, description, or pace notes by its Convex `_id`.
```bash
curl -s -X POST "https://curious-iguana-738.convex.site/update/task" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "<task _id from /query/tasks>",
    "title": "Updated title here",
    "description": "Updated description here",
    "paceNotes": "Updated pace notes here"
  }'
```
All fields except `id` are optional — only include what needs to change.
Returns `{ "success": true }`.

**Delete Task — POST /delete/task:**
Use this to permanently remove a task by its Convex `_id`. **No recovery after this.**
```bash
curl -s -X POST "https://curious-iguana-738.convex.site/delete/task" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "<task _id from /query/tasks>"
  }'
```
Returns `{ "success": true }`.

**⚠️ DELETE POLICY:** Only use `/delete/task` when Krishna explicitly asks to remove a task. Never delete proactively.

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
