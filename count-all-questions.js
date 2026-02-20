const fs = require('fs');
const { google } = require('googleapis');

const SHEET_ID = '1xmeU8Iu7f540yl4iPp0KaCxVSfwfA_pciE8o1-jKD2g';
const CREDENTIALS_PATH = '/home/node/openclaw/credentials/google-service-account.json';

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
  
  console.log(`Total rows in sheet: ${rows.length - 1} (excluding header)`);
  
  // Count by date
  const dateCounts = {};
  for (let i = 1; i < rows.length; i++) {
    const dateFound = rows[i][0];
    if (dateFound) {
      dateCounts[dateFound] = (dateCounts[dateFound] || 0) + 1;
    }
  }
  
  console.log('\nQuestions by date:');
  const sortedDates = Object.keys(dateCounts).sort().reverse();
  for (const date of sortedDates.slice(0, 10)) {
    console.log(`  ${date}: ${dateCounts[date]} questions`);
  }
  
  // Show Feb 19 specifically
  const feb19Count = dateCounts['2026-02-19'] || 0;
  console.log(`\n🔍 Feb 19 specifically: ${feb19Count} questions`);
  
  if (feb19Count !== 46) {
    console.log(`\n⚠️ MISMATCH: Sheet has ${feb19Count} questions but only 46 were pushed!`);
  }
}

main().catch(console.error);
