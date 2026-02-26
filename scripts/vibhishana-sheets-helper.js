/**
 * Vibhishana's helper for blog-queue operations.
 * 
 * Commands:
 *   pending-review          - Check pending_review queue (Convex)
 *   append-blog-queue <json> - Add brief rows (Sheets)
 * 
 * Data source:
 *   - `pending-review` reads from Convex (primary source)
 *   - `append-blog-queue` writes to Sheets (archive)
 */

const { google } = require('googleapis');
const https = require('https');
const fs = require('fs');
const path = require('path');

const SPREADSHEET_ID = '1xmeU8Iu7f540yl4iPp0KaCxVSfwfA_pciE8o1-jKD2g';
const CREDS_PATH = path.join(__dirname, '..', 'credentials', 'google-service-account.json');

// Convex configuration
const CONVEX_BASE_URL = 'curious-iguana-738.convex.site';
const CONVEX_API_KEY_PATH = path.join(__dirname, '..', 'credentials', 'convex-api-key.txt');

/**
 * Read pending_review briefs count from Convex
 * Returns { count, slugs, titles }
 */
async function readPendingReviewFromConvex() {
  const apiKey = fs.readFileSync(CONVEX_API_KEY_PATH, 'utf8').trim();
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: CONVEX_BASE_URL,
      path: '/query/briefs?status=pending_review',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const result = JSON.parse(data);
            resolve(result);
          } catch (e) {
            reject(new Error(`Failed to parse Convex response: ${e.message}`));
          }
        } else {
          reject(new Error(`Convex returned HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    
    req.on('error', (e) => reject(new Error(`Convex request failed: ${e.message}`)));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Convex request timeout'));
    });
    
    req.end();
  });
}

async function getSheets() {
  const creds = JSON.parse(fs.readFileSync(CREDS_PATH, 'utf8'));
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

async function appendToBlogQueue(rows) {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'blog-queue!A:N',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: rows },
  });
  return res.data.updates;
}

(async () => {
  const cmd = process.argv[2];
  
  try {
    switch (cmd) {
      case 'pending-review': {
        // Read from Convex (primary source)
        try {
          const result = await readPendingReviewFromConvex();
          console.log(JSON.stringify(result, null, 2));
        } catch (convexErr) {
          console.error(`Convex read failed: ${convexErr.message}`);
          console.log(JSON.stringify({ count: 0, slugs: [], titles: [], error: convexErr.message }));
        }
        break;
      }
      
      case 'append-blog-queue': {
        const jsonData = process.argv[3];
        if (!jsonData) { 
          console.error('Usage: append-blog-queue <json>'); 
          process.exit(1); 
        }
        const rows = JSON.parse(jsonData);
        const result = await appendToBlogQueue(Array.isArray(rows[0]) ? rows : [rows]);
        console.log('✅ Appended to blog-queue:', JSON.stringify(result));
        break;
      }
      
      default:
        console.log('Vibhishana Helper - Commands:\n');
        console.log('  pending-review          - Check pending_review queue from Convex');
        console.log('  append-blog-queue <json> - Add brief rows to Sheets');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
