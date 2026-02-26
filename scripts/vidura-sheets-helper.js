/**
 * Vidura's helper for SEO strategy operations.
 * Usage: node scripts/vidura-sheets-helper.js <command> [args...]
 * 
 * Commands:
 *   list-questions [limit]      - List questions from Vibhishana's scans (Sheets)
 *   list-clusters               - List all topic clusters (Convex primary)
 *   add-cluster <json>          - Add a new topic cluster (Sheets)
 *   update-cluster <row> <json> - Update a cluster row (Sheets)
 *   list-tools                  - List all tool opportunities (Convex primary)
 *   add-tool <json>             - Add a new tool opportunity (Sheets)
 *   list-briefs                 - List blog-queue entries (Sheets)
 * 
 * Data source:
 *   - `list-clusters` and `list-tools` read from Convex (primary)
 *   - Write commands still use Sheets (archive)
 */

const { google } = require('googleapis');
const https = require('https');
const fs = require('fs');
const path = require('path');

const SPREADSHEET_ID = '1xmeU8Iu7f540yl4iPp0KaCxVSfwfA_pciE8o1-jKD2g';
const CREDS_PATH = path.join(__dirname, '..', 'credentials', 'google-service-account.json');

// Tab names
const TABS = {
  QUESTIONS: 'questions',
  CLUSTERS: 'topic-clusters',
  TOOLS: 'tool-opportunities',
  BRIEFS: 'blog-queue',
};

// Convex configuration
const CONVEX_BASE_URL = 'curious-iguana-738.convex.site';
const CONVEX_API_KEY_PATH = path.join(__dirname, '..', 'credentials', 'convex-api-key.txt');

/**
 * Generic Convex GET request
 */
async function convexGet(endpoint) {
  const apiKey = fs.readFileSync(CONVEX_API_KEY_PATH, 'utf8').trim();
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: CONVEX_BASE_URL,
      path: endpoint,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Failed to parse Convex response: ${e.message}`));
          }
        } else {
          reject(new Error(`Convex returned HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    
    req.on('error', (e) => reject(new Error(`Convex request failed: ${e.message}`)));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Convex request timeout'));
    });
    
    req.end();
  });
}

/**
 * Read all topic clusters from Convex
 */
async function readClustersFromConvex() {
  return await convexGet('/query/topic-clusters');
}

/**
 * Read all tool opportunities from Convex
 */
async function readToolsFromConvex() {
  return await convexGet('/query/tool-opportunities');
}

async function getSheets() {
  const creds = JSON.parse(fs.readFileSync(CREDS_PATH, 'utf8'));
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

async function readTab(tabName, range = 'A:Z') {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${tabName}!${range}`,
  });
  return res.data.values || [];
}

async function appendRow(tabName, row) {
  const sheets = await getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${tabName}!A:Z`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [row] },
  });
}

async function updateRow(tabName, rowNum, values, startCol = 'A') {
  const sheets = await getSheets();
  const endCol = String.fromCharCode(startCol.charCodeAt(0) + values.length - 1);
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${tabName}!${startCol}${rowNum}:${endCol}${rowNum}`,
    valueInputOption: 'RAW',
    requestBody: { values: [values] },
  });
}

// ============ QUESTIONS TAB ============
// Actual columns: A=Date Found, B=Subreddit, C=Post Title, D=Question/Pain, 
//                 E=ICP Relevance, F=Engagement, G=Post Date, H=Post URL,
//                 I=thelaunch.space Angle, J=Content Potential, K=Status, L=Notes

function parseQuestions(rows) {
  if (rows.length < 2) return [];
  return rows.slice(1).map((row, idx) => ({
    rowNumber: idx + 2,
    dateFound: row[0] || '',
    subreddit: row[1] || '',
    postTitle: row[2] || '',
    questionPain: row[3] || '',
    icpRelevance: row[4] || '',
    engagement: row[5] || '',
    postDate: row[6] || '',
    postUrl: row[7] || '',
    launchSpaceAngle: row[8] || '',
    contentPotential: row[9] || '',
    status: row[10] || '',
    notes: row[11] || '',
  }));
}

// ============ TOPIC-CLUSTERS TAB ============
// Actual columns: A=pillar_name, B=cluster_topic, C=status, D=blog_url,
//                 E=target_keyword, F=intent_type

function parseClusters(rows) {
  if (rows.length < 2) return [];
  return rows.slice(1).map((row, idx) => ({
    rowNumber: idx + 2,
    pillarName: row[0] || '',
    clusterTopic: row[1] || '',
    status: row[2] || '',
    blogUrl: row[3] || '',
    targetKeyword: row[4] || '',
    intentType: row[5] || '',
  }));
}

async function addCluster(data) {
  // Columns: A=pillar_name, B=cluster_topic, C=status, D=blog_url, E=target_keyword, F=intent_type
  const row = [
    data.pillarName || '',
    data.clusterTopic || '',
    data.status || 'planned',
    data.blogUrl || '',
    data.targetKeyword || '',
    data.intentType || 'informational',
  ];
  await appendRow(TABS.CLUSTERS, row);
  const allRows = await readTab(TABS.CLUSTERS);
  return { rowNumber: allRows.length, pillarName: data.pillarName, clusterTopic: data.clusterTopic };
}

async function updateCluster(rowNum, data) {
  const rows = await readTab(TABS.CLUSTERS);
  const existing = rows[rowNum - 1]; // 0-indexed
  if (!existing) throw new Error(`Row ${rowNum} not found`);
  
  const updated = [
    data.pillarName ?? existing[0] ?? '',
    data.clusterTopic ?? existing[1] ?? '',
    data.status ?? existing[2] ?? '',
    data.blogUrl ?? existing[3] ?? '',
    data.targetKeyword ?? existing[4] ?? '',
    data.intentType ?? existing[5] ?? '',
  ];
  await updateRow(TABS.CLUSTERS, rowNum, updated);
  return { rowNumber: rowNum, updated: data };
}

// ============ TOOL-OPPORTUNITIES TAB ============
// Actual columns: A=source_question, B=why_tool, C=tool_name, D=tool_solution,
//                 E=target_keyword, F=complexity, G=status, H=krishna_notes

function parseTools(rows) {
  if (rows.length < 2) return [];
  return rows.slice(1).map((row, idx) => ({
    rowNumber: idx + 2,
    sourceQuestion: row[0] || '',
    whyTool: row[1] || '',
    toolName: row[2] || '',
    toolSolution: row[3] || '',
    targetKeyword: row[4] || '',
    complexity: row[5] || '',
    status: row[6] || '',
    krishnaNotes: row[7] || '',
  }));
}

async function addTool(data) {
  // Columns: A=source_question, B=why_tool, C=tool_name, D=tool_solution, 
  //          E=target_keyword, F=complexity, G=status, H=krishna_notes
  const row = [
    data.sourceQuestion || '',
    data.whyTool || '',
    data.toolName || '',
    data.toolSolution || '',
    data.targetKeyword || '',
    data.complexity || 'simple',
    data.status || 'proposed',
    '', // krishna_notes - leave empty, Krishna fills this
  ];
  await appendRow(TABS.TOOLS, row);
  const allRows = await readTab(TABS.TOOLS);
  return { rowNumber: allRows.length, toolName: data.toolName };
}

// ============ BLOG-QUEUE TAB (read-only for Vidura) ============
// Columns: A-N standard + O=enrichment_count, P=last_enrichment_date, Q=enrichment_log, R=source

function parseBriefs(rows) {
  if (rows.length < 2) return [];
  return rows.slice(1).map((row, idx) => ({
    rowNumber: idx + 2,
    title: row[0] || '',
    slug: row[1] || '',
    primaryKeyword: row[2] || '',
    status: row[10] || '',
    enrichmentCount: row[14] || '',
    lastEnrichmentDate: row[15] || '',
    enrichmentLog: row[16] || '',
    source: row[17] || '',
  }));
}

// ============ CLI ============

(async () => {
  const cmd = process.argv[2];
  
  try {
    switch (cmd) {
      case 'list-questions': {
        const limit = parseInt(process.argv[3]) || 50;
        const rows = await readTab(TABS.QUESTIONS);
        const questions = parseQuestions(rows).slice(-limit); // Last N questions
        console.log(`\n📋 Last ${questions.length} questions from Vibhishana's scans:\n`);
        questions.forEach(q => {
          const relevance = q.icpRelevance ? `[${q.icpRelevance}]` : '';
          const potential = q.contentPotential ? `(${q.contentPotential})` : '';
          console.log(`Row ${q.rowNumber}: ${relevance} ${q.postTitle.substring(0, 60)}... ${potential}`);
          if (q.questionPain) console.log(`   Pain: ${q.questionPain.substring(0, 80)}...`);
          if (q.postUrl) console.log(`   URL: ${q.postUrl}`);
        });
        break;
      }
      
      case 'list-clusters': {
        let clusters;
        try {
          // Read from Convex (primary source)
          clusters = await readClustersFromConvex();
        } catch (convexErr) {
          console.error(`Convex read failed (${convexErr.message}), falling back to Sheets...`);
          const rows = await readTab(TABS.CLUSTERS);
          clusters = parseClusters(rows);
        }
        console.log(`\n🗂️ Topic Clusters (${clusters.length} total):\n`);
        
        // Group by pillar
        const byPillar = {};
        clusters.forEach(c => {
          const pillar = c.pillarName || '(No Pillar)';
          if (!byPillar[pillar]) byPillar[pillar] = [];
          byPillar[pillar].push(c);
        });
        
        Object.entries(byPillar).forEach(([pillar, topics]) => {
          console.log(`\n📌 ${pillar}`);
          topics.forEach(t => {
            const status = t.status ? `[${t.status}]` : '[?]';
            const intent = t.intentType ? `(${t.intentType})` : '';
            console.log(`   ${status} ${t.clusterTopic} ${intent}`);
            if (t.targetKeyword) console.log(`      Keyword: ${t.targetKeyword}`);
          });
        });
        break;
      }
      
      case 'add-cluster': {
        const jsonArg = process.argv[3];
        if (!jsonArg) {
          console.error('Usage: add-cluster \'{"pillarName":"...", "clusterTopic":"...", "targetKeyword":"..."}\'');
          console.error('Required: pillarName, clusterTopic, targetKeyword');
          console.error('Optional: status (default: planned), intentType (default: informational), blogUrl');
          process.exit(1);
        }
        const data = JSON.parse(jsonArg);
        if (!data.pillarName || !data.clusterTopic || !data.targetKeyword) {
          console.error('Missing required fields: pillarName, clusterTopic, targetKeyword');
          process.exit(1);
        }
        const result = await addCluster(data);
        console.log(`✅ Added cluster to row ${result.rowNumber}:`);
        console.log(`   Pillar: ${result.pillarName}`);
        console.log(`   Topic: ${result.clusterTopic}`);
        break;
      }
      
      case 'update-cluster': {
        const rowNum = parseInt(process.argv[3]);
        const jsonArg = process.argv[4];
        if (!rowNum || !jsonArg) {
          console.error('Usage: update-cluster <row> \'{"status":"published", "blogUrl":"https://..."}\'');
          process.exit(1);
        }
        const data = JSON.parse(jsonArg);
        const result = await updateCluster(rowNum, data);
        console.log(`✅ Updated cluster row ${result.rowNumber}`);
        break;
      }
      
      case 'list-tools': {
        let tools;
        try {
          // Read from Convex (primary source)
          tools = await readToolsFromConvex();
        } catch (convexErr) {
          console.error(`Convex read failed (${convexErr.message}), falling back to Sheets...`);
          const rows = await readTab(TABS.TOOLS);
          tools = parseTools(rows);
        }
        console.log(`\n🔧 Tool Opportunities (${tools.length} total):\n`);
        tools.forEach(t => {
          const status = t.status ? `[${t.status}]` : '[?]';
          const complexity = t.complexity ? `(${t.complexity})` : '';
          console.log(`${status} ${t.toolName} ${complexity}`);
          console.log(`   Keyword: ${t.targetKeyword}`);
          if (t.toolSolution) console.log(`   Solution: ${t.toolSolution.substring(0, 80)}...`);
          console.log('');
        });
        break;
      }
      
      case 'add-tool': {
        const jsonArg = process.argv[3];
        if (!jsonArg) {
          console.error('Usage: add-tool \'{"toolName":"...", "sourceQuestion":"...", "whyTool":"...", "toolSolution":"...", "targetKeyword":"..."}\'');
          console.error('Required: toolName, sourceQuestion, whyTool, toolSolution, targetKeyword');
          console.error('Optional: complexity (default: simple), status (default: proposed)');
          process.exit(1);
        }
        const data = JSON.parse(jsonArg);
        if (!data.toolName || !data.sourceQuestion || !data.targetKeyword) {
          console.error('Missing required fields: toolName, sourceQuestion, targetKeyword');
          process.exit(1);
        }
        const result = await addTool(data);
        console.log(`✅ Added tool opportunity to row ${result.rowNumber}: "${result.toolName}"`);
        break;
      }
      
      case 'list-briefs': {
        const rows = await readTab(TABS.BRIEFS);
        const briefs = parseBriefs(rows);
        console.log(`\n📝 Blog Queue (${briefs.length} total):\n`);
        
        // Group by status
        const byStatus = {};
        briefs.forEach(b => {
          const s = b.status || 'Unknown';
          if (!byStatus[s]) byStatus[s] = [];
          byStatus[s].push(b);
        });
        
        Object.entries(byStatus).forEach(([status, items]) => {
          console.log(`\n[${status}] (${items.length})`);
          items.slice(0, 10).forEach(b => {
            const source = b.source ? ` (${b.source})` : '';
            const enriched = b.enrichmentCount ? ` [E:${b.enrichmentCount}]` : '';
            console.log(`   Row ${b.rowNumber}: ${b.title.substring(0, 50)}...${source}${enriched}`);
          });
          if (items.length > 10) console.log(`   ... and ${items.length - 10} more`);
        });
        break;
      }
      
      default:
        console.log('Vidura Sheets Helper - Commands:');
        console.log('');
        console.log('  list-questions [limit]      - List questions from Vibhishana\'s scans');
        console.log('  list-clusters               - List all topic clusters');
        console.log('  add-cluster <json>          - Add a new topic cluster');
        console.log('  update-cluster <row> <json> - Update a cluster row');
        console.log('  list-tools                  - List all tool opportunities');
        console.log('  add-tool <json>             - Add a new tool opportunity');
        console.log('  list-briefs                 - List blog-queue entries (read-only)');
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
