const fs = require('fs');
const { google } = require('googleapis');

const SHEET_ID = '1xmeU8Iu7f540yl4iPp0KaCxVSfwfA_pciE8o1-jKD2g';
const CREDENTIALS_PATH = './credentials/google-service-account.json';

async function main() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  
  const sheets = google.sheets({ version: 'v4', auth });
  
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'questions!A1:N100', // Get first 100 rows
  });
  
  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    console.error('No data found');
    return;
  }
  
  // Print header
  console.log('HEADER:', rows[0]);
  console.log('\nLast 10 rows:');
  
  // Print last 10 rows
  const start = Math.max(1, rows.length - 10);
  for (let i = start; i < rows.length; i++) {
    console.log(`\nRow ${i}:`);
    console.log('  Title:', rows[i][0]);
    console.log('  Subreddit:', rows[i][1]);
    console.log('  URL:', rows[i][2]);
    console.log('  Scanned At (col L/11):', rows[i][11]);
    console.log('  Full row length:', rows[i].length);
  }
}

main().catch(console.error);
