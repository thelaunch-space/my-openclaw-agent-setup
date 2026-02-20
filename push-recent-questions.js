const fs = require('fs');
const { google } = require('googleapis');
const https = require('https');

const SHEET_ID = '1xmeU8Iu7f540yl4iPp0KaCxVSfwfA_pciE8o1-jKD2g';
const CREDENTIALS_PATH = '/home/node/openclaw/credentials/google-service-account.json';
const API_KEY_PATH = '/home/node/openclaw/credentials/convex-api-key.txt';
const CONVEX_URL = 'https://curious-iguana-738.convex.site/ingestQuestions';

async function main() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  
  const sheets = google.sheets({ version: 'v4', auth });
  
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'questions!A:L',
  });
  
  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    console.error('No data found');
    return;
  }
  
  // Get last 7 days of questions
  const cutoffDate = '2026-02-13'; // 7 days back from Feb 20
  const recentQuestions = [];
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const dateFound = row[0];
    
    if (dateFound && dateFound >= cutoffDate) {
      recentQuestions.push({
        title: row[2] || '',
        subreddit: row[1] || '',
        url: row[7] || '',
        questionPain: row[3] || '',
        icpRelevance: row[4] || 'MEDIUM',
        launchSpaceAngle: row[8] || '',
        contentPotential: row[9] || 'Watch',
        engagement: row[5] || '',
        notes: row[11] || '',
        postDate: row[6] || '',
        scannedAt: `${dateFound}T09:00:00Z`,
        status: row[10] || 'new',
        briefCreated: false,
        agentName: 'Vibhishana',
        batchId: `${dateFound}-morning`
      });
    }
  }
  
  console.log(`Found ${recentQuestions.length} questions from ${cutoffDate} onwards`);
  
  if (recentQuestions.length === 0) {
    console.log('No questions to push');
    return;
  }
  
  // Push to Convex in batches of 100 to avoid payload size issues
  const batchSize = 100;
  const apiKey = fs.readFileSync(API_KEY_PATH, 'utf8').trim();
  
  for (let i = 0; i < recentQuestions.length; i += batchSize) {
    const batch = recentQuestions.slice(i, i + batchSize);
    console.log(`\nPushing batch ${Math.floor(i/batchSize) + 1}: ${batch.length} questions`);
    
    const payload = JSON.stringify(batch);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(payload)
      }
    };
    
    await new Promise((resolve, reject) => {
      const req = https.request(CONVEX_URL, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          console.log(`Response: ${res.statusCode} - ${data}`);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve();
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      });
      req.on('error', reject);
      req.write(payload);
      req.end();
    });
    
    // Small delay between batches
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log(`\n✅ Successfully pushed ${recentQuestions.length} questions total`);
}

main().catch(console.error);
