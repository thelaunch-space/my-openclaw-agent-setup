/**
 * Google Sheets helper for Vibhishana's blog queue.
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const SPREADSHEET_ID = '1xmeU8Iu7f540yl4iPp0KaCxVSfwfA_pciE8o1-jKD2g';
const CREDS_PATH = path.join(__dirname, '..', 'credentials', 'google-service-account.json');

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
    if (cmd === 'append-blog-queue') {
      const jsonData = process.argv[3];
      if (!jsonData) { 
        console.error('Usage: append-blog-queue <json>'); 
        process.exit(1); 
      }
      const rows = JSON.parse(jsonData);
      const result = await appendToBlogQueue(Array.isArray(rows[0]) ? rows : [rows]);
      console.log('✅ Appended to blog-queue:', JSON.stringify(result));
    } else {
      console.log('Commands: append-blog-queue <json>');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
