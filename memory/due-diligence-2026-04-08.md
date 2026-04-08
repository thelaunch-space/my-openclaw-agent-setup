# Daily Due Diligence Report - April 8, 2026

## Cron Status: 7 jobs, 2 with errors

| Job | Status | Notes |
|-----|--------|-------|
| Morning Health Check | ✅ OK | Last run: ok |
| Pre-Blog Health Check | ✅ OK | Last run: ok |
| Midday Health Check | ✅ OK | Last run: ok |
| Daily Context Backup | ✅ OK | Last run: ok |
| Daily Due Diligence | 🔄 Running | This job |
| Daily Blog Run (Vyasa) | ⚠️ ERROR | `user_not_found` - Slack delivery issue |
| Citation Enrichment (Vyasa) | ⚠️ ERROR | `user_not_found` - Slack delivery issue |

## Blog-Queue Snapshot

| Status | Count |
|--------|-------|
| Published | 23 |
| Brief Ready | 2 |
| Pending Review | 12 |
| Needs Revision | 4 |
| Dropped | 7 |

## Issues Detected

### Vyasa Crons Failing
Both Vyasa crons (Daily Blog Run and Citation Enrichment) are failing with `user_not_found` error. This is a Slack delivery configuration issue - the `delivery.to` field is set to `u0ad3qln32s` which appears to be an invalid user ID.

**Root Cause:** The Vyasa cron delivery is configured with an incorrect Slack user ID format.

**Proposed Fix:** Update the Vyasa cron delivery settings to use the correct user ID format or remove delivery entirely if not needed.

## Action Items for Krishna

1. Fix Vyasa cron delivery settings (user ID mismatch)
2. Review 12 pending briefs in blog-queue
3. 2 briefs are ready for Vyasa to write once crons are fixed

## Convex Activity

✅ Pushed activity to Launch Control: `due_diligence` action logged.

## Slack Delivery

⚠️ Could not deliver report via Slack - slack tool not available in current context. Report saved to memory file.
