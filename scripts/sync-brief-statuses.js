const https = require('https');
const fs = require('fs');
const { google } = require('googleapis');

const API_KEY = fs.readFileSync('/home/node/openclaw/credentials/convex-api-key.txt', 'utf8').trim();
const BASE_URL = 'curious-iguana-738.convex.site';
const SHEET_ID = '1xmeU8Iu7f540yl4iPp0KaCxVSfwfA_pciE8o1-jKD2g';

// Map sheet status to Convex status
const statusMap = {
  'Published': 'published',
  'Dropped': 'dropped',
  'Brief Ready': 'brief_ready',
  'Needs Revision': 'needs_revision',
  'Pending Review': 'pending_review',
  'Writing': 'writing',
  'PR Created': 'pr_created'
};

function titleToSlug(title) {
  return title
    .toLowerCase()
    .replace(/['''""]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

async function upsertBrief(data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const options = {
      hostname: BASE_URL,
      port: 443,
      path: '/upsertBrief',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve({ error: body });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  // Setup Google Sheets
  const auth = new google.auth.GoogleAuth({
    keyFile: '/home/node/openclaw/credentials/google-service-account.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  });
  const sheets = google.sheets({ version: 'v4', auth });

  // Get blog-queue data (columns A-K: Title, Slug, Primary Keyword, Long-tail, Source URLs, ICP Problem, Gap, Angle, Structure, Notes, Status)
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'blog-queue!A2:K100'
  });

  const rows = response.data.values || [];
  console.log(`Found ${rows.length} rows in blog-queue`);

  let updated = 0, created = 0, skipped = 0, errors = 0;

  for (const row of rows) {
    const title = row[0]?.trim();
    const sheetStatus = row[10]?.trim(); // Column K
    
    if (!title || !sheetStatus) {
      skipped++;
      continue;
    }

    const convexStatus = statusMap[sheetStatus];
    if (!convexStatus) {
      console.log(`⚠️ Unknown status: "${sheetStatus}" for "${title.slice(0, 40)}..."`);
      skipped++;
      continue;
    }

    // Skip dropped/test briefs
    if (convexStatus === 'dropped') {
      console.log(`⏭️ Skipping dropped: ${title.slice(0, 50)}...`);
      skipped++;
      continue;
    }

    const slug = row[1]?.trim() || titleToSlug(title);
    const primaryKeyword = row[2]?.trim() || '';
    
    const briefData = {
      title: title,
      slug: slug,
      primaryKeyword: primaryKeyword || titleToSlug(title),
      status: convexStatus,
      createdAt: new Date().toISOString().split('T')[0],
      agentName: 'Vibhishana'
    };

    try {
      const result = await upsertBrief(briefData);
      if (result.success) {
        if (result.action === 'inserted') {
          console.log(`✅ Created: ${slug} → ${convexStatus}`);
          created++;
        } else {
          console.log(`🔄 Updated: ${slug} → ${convexStatus}`);
          updated++;
        }
      } else {
        console.log(`❌ Error for ${slug}: ${JSON.stringify(result)}`);
        errors++;
      }
    } catch (e) {
      console.log(`❌ Request failed for ${slug}: ${e.message}`);
      errors++;
    }

    // Small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`\n📊 Summary: ${created} created, ${updated} updated, ${skipped} skipped, ${errors} errors`);
}

main().catch(console.error);
