const fs = require('fs');
const { google } = require('googleapis');
const https = require('https');

const SHEET_ID = '1xmeU8Iu7f540yl4iPp0KaCxVSfwfA_pciE8o1-jKD2g';
const CREDENTIALS_PATH = './credentials/google-service-account.json';
const API_KEY_PATH = './credentials/convex-api-key.txt';
const CONVEX_URL = 'https://curious-iguana-738.convex.site/ingestQuestions';

async function main() {
  // 1. Fetch questions from Google Sheet
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  
  const sheets = google.sheets({ version: 'v4', auth });
  
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'questions!A:N',
  });
  
  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    console.error('No data found in sheet');
    process.exit(1);
  }
  
  // Filter for today's date (2026-02-19)
  const today = '2026-02-19';
  const todaysQuestions = [];
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const scannedAt = row[11]; // Column L - Scanned At
    
    if (scannedAt && scannedAt.startsWith(today)) {
      todaysQuestions.push({
        title: row[0] || '',
        subreddit: row[1] || '',
        url: row[2] || '',
        questionPain: row[3] || '',
        icpRelevance: row[4] || 'MEDIUM',
        launchSpaceAngle: row[5] || '',
        contentPotential: row[6] || 'Watch',
        engagement: row[7] || '',
        notes: row[8] || '',
        postDate: row[9] || '',
        scannedAt: scannedAt,
        status: row[12] || 'new',
        briefCreated: row[13] === 'TRUE' || row[13] === 'true',
        agentName: 'Vibhishana',
        batchId: `${today}-morning`
      });
    }
  }
  
  console.log(`Found ${todaysQuestions.length} questions from ${today}`);
  
  if (todaysQuestions.length === 0) {
    console.log('No questions to push');
    return;
  }
  
  // 2. Push to Convex
  const apiKey = fs.readFileSync(API_KEY_PATH, 'utf8').trim();
  const payload = JSON.stringify(todaysQuestions);
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Content-Length': Buffer.byteLength(payload)
    }
  };
  
  return new Promise((resolve, reject) => {
    const req = https.request(CONVEX_URL, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('Response status:', res.statusCode);
        console.log('Response body:', data);
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
}

main().catch(console.error);
