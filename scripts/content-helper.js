/**
 * Google Sheets + Docs helper for Lucy's content drafts.
 * Usage: node scripts/content-helper.js <command> [args...]
 * 
 * Commands:
 *   read [range]           - Read data from drafts sheet
 *   add-draft <json-file>  - Add a new draft (creates doc, adds row to sheet)
 *   update <id> <json>     - Update a draft row
 *   list                   - List all drafts with status
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const SPREADSHEET_ID = '1lqWOfU-SMBYdtvwvsMo0iQwaO3HN2dLHluJsJ_Jf-yw';
const FOLDER_ID = '1OQQm_g3HnLoITfKKtfgW7GAN4iPw32c0';
const CREDS_PATH = path.join(__dirname, '..', 'credentials', 'google-service-account.json');

// x-drafts Columns: A=ID, B=Date Drafted, C=Intent, D=Archetype, E=Topic/Angle, F=Hook,
// G=Signal Source, H=Signal Date, I=Image Needed, J=Image Prompt, K=Status,
// L=Repurpose to LinkedIn, M=Feedback Type, N=Platform, O=Full Draft,
// P=Krishna Feedback, Q=Revised Draft, R=Final Post Link, S=Date Posted, T=X Engagement, U=Notes
//
// linkedin-drafts Columns: A=ID, B=Source X Post ID, C=Date Drafted, D=Topic/Angle,
// E=Hook (first 210 chars), F=Full Draft, G=Status, H=Feedback Type,
// I=Krishna Feedback, J=Revised Draft, K=Final Post Link, L=Date Posted, M=Engagement, N=Notes

async function getAuth() {
  const creds = JSON.parse(fs.readFileSync(CREDS_PATH, 'utf8'));
  return new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

async function getSheets() {
  const auth = await getAuth();
  return google.sheets({ version: 'v4', auth });
}

async function readDrafts(range = 'x-drafts!A:U') {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range,
  });
  return res.data.values || [];
}

async function getNextId() {
  const rows = await readDrafts('x-drafts!A:A');
  // Skip header, find max ID (format is X-N)
  let maxId = 0;
  for (let i = 1; i < rows.length; i++) {
    const idStr = rows[i][0] || '';
    const num = parseInt(idStr.replace('X-', ''), 10);
    if (!isNaN(num) && num > maxId) maxId = num;
  }
  return maxId + 1;
}

async function addDraft(draftData) {
  const sheets = await getSheets();
  const id = await getNextId();
  const today = new Date().toISOString().split('T')[0];
  
  const row = [
    'X-' + id,                   // A: ID (with X- prefix)
    today,                       // B: Date Drafted
    draftData.intent || '',      // C: Intent
    draftData.archetype || '',   // D: Archetype
    draftData.topic || '',       // E: Topic/Angle
    draftData.hook || '',        // F: Hook
    draftData.signalSource || '',// G: Signal Source
    draftData.signalDate || '',  // H: Signal Date
    draftData.imageNeeded || 'N',// I: Image Needed
    draftData.imagePrompt || '', // J: Image Prompt
    'Draft',                     // K: Status
    'N',                         // L: Repurpose to LinkedIn
    '',                          // M: Feedback Type
    draftData.platform || 'X Only', // N: Platform
    draftData.fullDraft || '',   // O: Full Draft
    '',                          // P: Krishna Feedback
    '',                          // Q: Revised Draft
    '',                          // R: Final Post Link
    '',                          // S: Date Posted
    '',                          // T: X Engagement
    draftData.notes || ''        // U: Notes
  ];
  
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'x-drafts!A:U',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    resource: { values: [row] }
  });
  
  return { id: 'X-' + id };
}

async function addLinkedInDraft(draftData) {
  const sheets = await getSheets();
  const today = new Date().toISOString().split('T')[0];
  
  // Get next LinkedIn ID
  const rows = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'linkedin-drafts!A:A'
  });
  let maxId = 0;
  if (rows.data.values) {
    for (let i = 1; i < rows.data.values.length; i++) {
      const idStr = rows.data.values[i][0] || '';
      const num = parseInt(idStr.replace('L-', ''), 10);
      if (!isNaN(num) && num > maxId) maxId = num;
    }
  }
  const id = 'L-' + (maxId + 1);
  
  const row = [
    id,                              // A: ID
    draftData.sourceXPostId || '',   // B: Source X Post ID
    today,                           // C: Date Drafted
    draftData.topic || '',           // D: Topic/Angle
    draftData.hook || '',            // E: Hook (first 210 chars)
    draftData.fullDraft || '',       // F: Full Draft
    'Draft',                         // G: Status
    '',                              // H: Feedback Type
    '',                              // I: Krishna Feedback
    '',                              // J: Revised Draft
    '',                              // K: Final Post Link
    '',                              // L: Date Posted
    '',                              // M: Engagement
    draftData.notes || ''            // N: Notes
  ];
  
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'linkedin-drafts!A:N',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    resource: { values: [row] }
  });
  
  return { id };
}

async function listDrafts() {
  const rows = await readDrafts();
  if (rows.length <= 1) {
    console.log('No drafts yet.');
    return;
  }
  
  console.log('\nContent Drafts:\n');
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const id = row[0] || '';
    const date = row[1] || '';
    const intent = row[2] || '';
    const archetype = row[3] || '';
    const topic = row[4] || '';
    const status = row[10] || 'Draft';
    const platform = row[13] || 'X Only';
    console.log(`[${id}] ${status} | ${intent} | ${topic}`);
    console.log(`    Archetype: ${archetype} | Platform: ${platform} | Date: ${date}`);
    console.log('');
  }
}

// CLI handling
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  try {
    switch (command) {
      case 'read':
        const range = args[1] || 'x-drafts!A:U';
        const data = await readDrafts(range);
        console.log(JSON.stringify(data, null, 2));
        break;
        
      case 'add-draft':
        const jsonFile = args[1];
        if (!jsonFile) {
          console.log('Usage: add-draft <json-file>');
          process.exit(1);
        }
        const draftData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
        const result = await addDraft(draftData);
        console.log('Draft added:', result);
        break;
        
      case 'list':
        await listDrafts();
        break;
        
      default:
        console.log('Usage: node content-helper.js <read|add-draft|list>');
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
