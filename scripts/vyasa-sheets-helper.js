/**
 * Vyasa's Google Sheets helper for blog-queue operations.
 * Usage: node scripts/vyasa-sheets-helper.js <command> [args...]
 * 
 * Commands:
 *   list                              - List all briefs with their status
 *   ready                             - Get first "Brief Ready" entry as JSON
 *   set-status <row> <status>         - Update status for a row
 *   set-published <row> <keywords> <url> - Update keywords, URL, set status to "PR Created"
 *   add-brief <json>                  - Add a new brief row
 *   
 * Enrichment commands:
 *   list-published                    - List all published blogs with enrichment data
 *   next-enrich                       - Get next blog to enrich (oldest enrichment date, NULLs first)
 *   set-enrichment <row> <count> <log> - Update enrichment columns after enrichment
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const SPREADSHEET_ID = '1xmeU8Iu7f540yl4iPp0KaCxVSfwfA_pciE8o1-jKD2g';
const CREDS_PATH = path.join(__dirname, '..', 'credentials', 'google-service-account.json');
const TAB_NAME = 'blog-queue';

async function getSheets() {
  const creds = JSON.parse(fs.readFileSync(CREDS_PATH, 'utf8'));
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

async function readBlogQueue() {
  const sheets = await getSheets();
  // Read up to column S to include Cluster column (added Feb 23)
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${TAB_NAME}!A:S`,
  });
  return res.data.values || [];
}

async function setStatus(row, status) {
  const sheets = await getSheets();
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${TAB_NAME}!K${row}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[status]] },
  });
  return { row, status };
}

// Parse rows into structured briefs
// Columns: A-N standard + O=enrichment_count, P=last_enrichment_date, Q=enrichment_log, R=source, S=cluster
function parseBriefs(rows) {
  if (rows.length < 2) return [];
  return rows.slice(1).map((row, idx) => ({
    rowNumber: idx + 2,
    title: row[0] || '',
    slug: row[1] || '',
    primaryKeyword: row[2] || '',
    longTailKeywords: row[3] || '',
    sourceUrls: row[4] || '',
    icpProblem: row[5] || '',
    competitiveGap: row[6] || '',
    thelaunchAngle: row[7] || '',
    suggestedStructure: row[8] || '',
    researchNotes: row[9] || '',
    status: row[10] || '',
    finalKeywords: row[11] || '',
    blogUrl: row[12] || '',
    rankingNotes: row[13] || '',
    // Enrichment columns (O, P, Q, R, S)
    enrichmentCount: row[14] || '',
    lastEnrichmentDate: row[15] || '',
    enrichmentLog: row[16] || '',
    source: row[17] || '',
    cluster: row[18] || '',  // Column S: Cluster (added Feb 23)
  }));
}

async function setPublished(row, finalKeywords, blogUrl) {
  const sheets = await getSheets();
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${TAB_NAME}!K${row}:M${row}`,
    valueInputOption: 'RAW',
    requestBody: { values: [['PR Created', finalKeywords, blogUrl]] },
  });
  return { row, finalKeywords, blogUrl };
}

async function setEnrichment(row, count, log) {
  const sheets = await getSheets();
  const today = new Date().toISOString().split('T')[0];
  // Update columns O (enrichment_count), P (last_enrichment_date), Q (enrichment_log)
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${TAB_NAME}!O${row}:Q${row}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[count, today, log]] },
  });
  return { row, count, date: today, log };
}

async function addBrief(briefData) {
  const sheets = await getSheets();
  
  // Columns A-S (including Cluster column added Feb 23)
  const row = [
    briefData.title || '',
    briefData.slug || '',
    briefData.primaryKeyword || '',
    briefData.longTailKeywords || '',
    briefData.sourceUrls || '',
    briefData.icpProblem || '',
    briefData.competitiveGap || '',
    briefData.thelaunchAngle || '',
    briefData.suggestedStructure || '',
    briefData.researchNotes || '',
    briefData.status || 'Pending Review',
    briefData.finalKeywords || '',
    briefData.blogUrl || '',
    briefData.rankingNotes || '',
    briefData.enrichmentCount || '',
    briefData.lastEnrichmentDate || '',
    briefData.enrichmentLog || '',
    briefData.source || '',
    briefData.cluster || '',  // Column S: Cluster (added Feb 23)
  ];
  
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${TAB_NAME}!A:S`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [row] },
  });
  
  const allRows = await readBlogQueue();
  return { rowNumber: allRows.length, title: briefData.title, cluster: briefData.cluster };
}

// Get next blog to enrich: Published status, oldest lastEnrichmentDate (NULLs first)
function getNextToEnrich(briefs) {
  const published = briefs.filter(b => b.status === 'Published');
  if (published.length === 0) return null;
  
  // Sort: NULLs/empty first, then by date ascending
  published.sort((a, b) => {
    const aDate = a.lastEnrichmentDate || '';
    const bDate = b.lastEnrichmentDate || '';
    
    // NULLs first
    if (!aDate && bDate) return -1;
    if (aDate && !bDate) return 1;
    if (!aDate && !bDate) return 0;
    
    // Then by date ascending (oldest first)
    return aDate.localeCompare(bDate);
  });
  
  return published[0];
}

// CLI interface
(async () => {
  const cmd = process.argv[2];
  
  try {
    switch (cmd) {
      case 'list': {
        const rows = await readBlogQueue();
        const briefs = parseBriefs(rows);
        briefs.forEach(b => {
          const enriched = b.enrichmentCount ? ` [E:${b.enrichmentCount}]` : '';
          console.log(`Row ${b.rowNumber}: [${b.status}] ${b.title.substring(0, 55)}...${enriched}`);
        });
        break;
      }
      
      case 'ready': {
        const rows = await readBlogQueue();
        const briefs = parseBriefs(rows);
        const ready = briefs.find(b => b.status === 'Brief Ready');
        if (ready) {
          console.log(JSON.stringify(ready, null, 2));
        } else {
          console.log(JSON.stringify({ error: 'No briefs with status "Brief Ready"' }));
        }
        break;
      }
      
      case 'set-status': {
        const row = parseInt(process.argv[3]);
        const status = process.argv[4];
        if (!row || !status) {
          console.error('Usage: set-status <row> <status>');
          process.exit(1);
        }
        const result = await setStatus(row, status);
        console.log(`Updated row ${result.row} to "${result.status}"`);
        break;
      }
      
      case 'set-published': {
        const row = parseInt(process.argv[3]);
        const finalKeywords = process.argv[4];
        const blogUrl = process.argv[5];
        if (!row || !finalKeywords || !blogUrl) {
          console.error('Usage: set-published <row> "<final keywords>" "<blog url>"');
          process.exit(1);
        }
        const result = await setPublished(row, finalKeywords, blogUrl);
        console.log(`Updated row ${result.row}: Status=PR Created, URL=${result.blogUrl}`);
        break;
      }
      
      case 'add-brief': {
        const jsonArg = process.argv[3];
        if (!jsonArg) {
          console.error('Usage: add-brief \'{"title":"...", "slug":"...", "primaryKeyword":"..."}\'');
          process.exit(1);
        }
        const briefData = JSON.parse(jsonArg);
        if (!briefData.title || !briefData.slug || !briefData.primaryKeyword) {
          console.error('Missing required fields: title, slug, primaryKeyword');
          process.exit(1);
        }
        const result = await addBrief(briefData);
        console.log(`Added brief to row ${result.rowNumber}: "${result.title}"`);
        break;
      }
      
      // ============ ENRICHMENT COMMANDS ============
      
      case 'list-published': {
        const rows = await readBlogQueue();
        const briefs = parseBriefs(rows);
        const published = briefs.filter(b => b.status === 'Published');
        console.log(`\n📚 Published Blogs (${published.length} total):\n`);
        published.forEach(b => {
          const count = b.enrichmentCount || '0';
          const lastDate = b.lastEnrichmentDate || 'never';
          console.log(`Row ${b.rowNumber}: ${b.title.substring(0, 50)}...`);
          console.log(`   Enrichments: ${count} | Last: ${lastDate}`);
          console.log(`   URL: ${b.blogUrl || '(no URL)'}`);
          console.log('');
        });
        break;
      }
      
      case 'next-enrich': {
        const rows = await readBlogQueue();
        const briefs = parseBriefs(rows);
        const next = getNextToEnrich(briefs);
        if (next) {
          console.log(JSON.stringify(next, null, 2));
        } else {
          console.log(JSON.stringify({ error: 'No published blogs available for enrichment' }));
        }
        break;
      }
      
      case 'set-enrichment': {
        const row = parseInt(process.argv[3]);
        const count = process.argv[4];
        const log = process.argv[5];
        if (!row || !count || !log) {
          console.error('Usage: set-enrichment <row> <count> "<enrichment log>"');
          console.error('Example: set-enrichment 3 2 "Added 3 stats, FAQ section, comparison table"');
          process.exit(1);
        }
        const result = await setEnrichment(row, count, log);
        console.log(`Updated row ${result.row}:`);
        console.log(`  enrichment_count: ${result.count}`);
        console.log(`  last_enrichment_date: ${result.date}`);
        console.log(`  enrichment_log: ${result.log}`);
        break;
      }
      
      default:
        console.log('Vyasa Sheets Helper - Commands:\n');
        console.log('Blog Workflow:');
        console.log('  list                              - List all briefs with status');
        console.log('  ready                             - Get first "Brief Ready" entry as JSON');
        console.log('  set-status <row> <status>         - Update status for a row');
        console.log('  set-published <row> <kw> <url>    - Set keywords, URL, status to PR Created');
        console.log('  add-brief <json>                  - Add a new brief row');
        console.log('\nEnrichment Workflow:');
        console.log('  list-published                    - List published blogs with enrichment data');
        console.log('  next-enrich                       - Get next blog to enrich (as JSON)');
        console.log('  set-enrichment <row> <count> <log> - Update enrichment columns');
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
