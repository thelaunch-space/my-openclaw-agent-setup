/**
 * One-time script to create the linkedin-pipeline tab in the shared sheet.
 * Run: node scripts/create-linkedin-pipeline-tab.js
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const SPREADSHEET_ID = '1xmeU8Iu7f540yl4iPp0KaCxVSfwfA_pciE8o1-jKD2g';
const CREDS_PATH = path.join(__dirname, '..', 'credentials', 'google-service-account.json');
const TAB_NAME = 'linkedin-pipeline';

// Column headers as specified by Krishna
const HEADERS = [
  'Blog Title',
  'Blog Slug', 
  'Blog URL',
  'Extraction Status',
  'Insight #',
  'Insight Name',
  'Insight Summary',
  'ICP Pass',
  'ICP Fail Reason',
  'Post Status',
  'Draft Text',
  'Hook Strategy',
  'CTA Type',
  'Krishna Feedback',
  'Posted Date',
  'LinkedIn URL'
];

async function getSheets() {
  const creds = JSON.parse(fs.readFileSync(CREDS_PATH, 'utf8'));
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

async function createTab() {
  const sheets = await getSheets();
  
  // First, check if tab already exists
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
  });
  
  const existingTabs = spreadsheet.data.sheets.map(s => s.properties.title);
  console.log('Existing tabs:', existingTabs.join(', '));
  
  if (existingTabs.includes(TAB_NAME)) {
    console.log(`Tab "${TAB_NAME}" already exists. Skipping creation.`);
    return;
  }
  
  // Create the new tab
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: {
              title: TAB_NAME,
            },
          },
        },
      ],
    },
  });
  
  console.log(`Created tab: ${TAB_NAME}`);
  
  // Add headers
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${TAB_NAME}!A1:P1`,
    valueInputOption: 'RAW',
    requestBody: { values: [HEADERS] },
  });
  
  console.log('Added headers:', HEADERS.join(' | '));
  console.log('\nTab created successfully!');
}

createTab().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
