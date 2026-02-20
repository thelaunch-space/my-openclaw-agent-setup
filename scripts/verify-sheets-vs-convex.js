#!/usr/bin/env node

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const path = require('path');

const SPREADSHEET_ID = '1xmeU8Iu7f540yl4iPp0KaCxVSfwfA_pciE8o1-jKD2g';
const CREDENTIALS_PATH = path.join(__dirname, '../credentials/google-service-account.json');

async function verifySheets() {
  try {
    const serviceAccountAuth = new JWT({
      keyFile: CREDENTIALS_PATH,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    
    const sheet = doc.sheetsByTitle['blog-queue'];
    if (!sheet) {
      throw new Error('blog-queue sheet not found');
    }

    const rows = await sheet.getRows();
    
    console.log('📊 FULL VERIFICATION - Google Sheets Blog Queue\n');
    console.log('='.repeat(80));
    
    // Focus on rows 25-37 (recent briefs)
    const recentBriefs = rows.slice(24); // 0-indexed, so row 25 = index 24
    
    console.log(`\nRecent briefs (rows 25-${rows.length}):\n`);
    
    recentBriefs.forEach((row, idx) => {
      const rowNumber = idx + 25;
      const title = row.get('Title');
      const slug = row.get('Slug');
      const status = row.get('Status');
      
      if (title) {
        console.log(`ROW ${rowNumber}:`);
        console.log(`  Title: ${title}`);
        console.log(`  Slug: ${slug || 'N/A'}`);
        console.log(`  Status: ${status || 'N/A'}`);
        console.log('');
      }
    });
    
    console.log('='.repeat(80));
    console.log('\nPending Review count:', recentBriefs.filter(r => r.get('Status') === 'Pending Review').length);
    console.log('Total rows 25+:', recentBriefs.filter(r => r.get('Title')).length);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifySheets();
