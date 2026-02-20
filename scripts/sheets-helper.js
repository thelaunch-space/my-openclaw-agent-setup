/**
 * Google Sheets helper for Lucy's lead tracking.
 * Usage: node scripts/sheets-helper.js <command> [args...]
 * 
 * Commands:
 *   read [range]           - Read data from sheet (default: leads!A:O)
 *   append <json-file>     - Append rows from a JSON file to leads tab
 *   append-watching <json> - Append rows to watching tab
 *   write <range> <json>   - Write data to specific range
 *   headers                - Show column headers
 *   tabs                   - List all tabs in the spreadsheet
 *   create-tab <name>      - Create a new tab
 *   setup-watching         - Create and setup the watching tab with headers
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const SPREADSHEET_ID = '1N1yNSggmU46jeTUbxF0tvtcycHf2lvE0fuix5o2EKFs';
const CREDS_PATH = path.join(__dirname, '..', 'credentials', 'google-service-account.json');
// Columns: A=Date Found, B=Name, C=Title, D=Company, E=Location, F=What They Do,
// G=Why They're a Fit, H=Trigger Signal, I=Suggested Approach, J=Confidence,
// K=Source URL, L=Status, M=Assigned To, N=Last Update Date, O=Notes

async function getSheets() {
  const creds = JSON.parse(fs.readFileSync(CREDS_PATH, 'utf8'));
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

async function readSheet(range = 'leads!A:O') {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range,
  });
  return res.data.values || [];
}

async function appendRows(rows) {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'leads!A:O',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: rows },
  });
  return res.data.updates;
}

async function writeSheet(range, values) {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  });
  return res.data;
}

async function listTabs() {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
    fields: 'sheets.properties.title,sheets.properties.sheetId',
  });
  return res.data.sheets.map(s => ({ 
    title: s.properties.title, 
    sheetId: s.properties.sheetId 
  }));
}

async function createTab(title) {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [{
        addSheet: {
          properties: { title }
        }
      }]
    }
  });
  return res.data.replies[0].addSheet.properties;
}

async function appendToWatching(rows) {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'watching!A:O',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: rows },
  });
  return res.data.updates;
}

// Watching tab headers - simpler structure for context signals
const WATCHING_HEADERS = [
  'Date Found', 'Name', 'Title', 'Company', 'Location', 'What They Do',
  'Why Watching', 'Signals So Far', 'Next Check Date', 'Source URL', 'Notes'
];

// CLI interface
(async () => {
  const cmd = process.argv[2];
  
  try {
    switch (cmd) {
      case 'read': {
        const range = process.argv[3] || 'leads!A:M';
        const data = await readSheet(range);
        console.log(JSON.stringify(data, null, 2));
        break;
      }
      case 'append': {
        const filePath = process.argv[3];
        if (!filePath) { console.error('Usage: append <json-file>'); process.exit(1); }
        const rows = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const result = await appendRows(rows);
        console.log('Appended:', JSON.stringify(result));
        break;
      }
      case 'write': {
        const range = process.argv[3];
        const jsonData = process.argv[4];
        if (!range || !jsonData) { console.error('Usage: write <range> <json>'); process.exit(1); }
        const values = JSON.parse(jsonData);
        const result = await writeSheet(range, values);
        console.log('Written:', JSON.stringify(result));
        break;
      }
      case 'headers': {
        const data = await readSheet('leads!A1:O1');
        if (data.length > 0) {
          data[0].forEach((h, i) => console.log(`${String.fromCharCode(65 + i)}: ${h}`));
        }
        break;
      }
      case 'tabs': {
        const tabs = await listTabs();
        tabs.forEach(t => console.log(`${t.title} (id: ${t.sheetId})`));
        break;
      }
      case 'create-tab': {
        const name = process.argv[3];
        if (!name) { console.error('Usage: create-tab <name>'); process.exit(1); }
        const result = await createTab(name);
        console.log('Created tab:', JSON.stringify(result));
        break;
      }
      case 'setup-watching': {
        // Create watching tab and add headers
        try {
          await createTab('watching');
          console.log('Created watching tab');
        } catch (e) {
          if (e.message.includes('already exists')) {
            console.log('Watching tab already exists');
          } else {
            throw e;
          }
        }
        const result = await writeSheet('watching!A1:K1', [WATCHING_HEADERS]);
        console.log('Headers written:', JSON.stringify(result));
        break;
      }
      case 'append-watching': {
        const jsonData = process.argv[3];
        if (!jsonData) { console.error('Usage: append-watching <json>'); process.exit(1); }
        const rows = JSON.parse(jsonData);
        const result = await appendToWatching(Array.isArray(rows[0]) ? rows : [rows]);
        console.log('Appended to watching:', JSON.stringify(result));
        break;
      }
      default:
        console.log('Commands: read [range], append <json-file>, write <range> <json>, headers, tabs, create-tab <name>, setup-watching, append-watching <json>');
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
