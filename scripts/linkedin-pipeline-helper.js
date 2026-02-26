/**
 * Valmiki's LinkedIn Pipeline helper for extraction and drafting workflow.
 * Usage: node scripts/linkedin-pipeline-helper.js <command> [args...]
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * COLUMN OWNERSHIP MATRIX - WHO updates WHAT, WHEN
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * COLUMN           | WHO      | WHAT                          | WHEN
 * ─────────────────┼──────────┼───────────────────────────────┼─────────────────────────────
 * A: blog-title    | Valmiki  | Title from blog-queue         | At extraction start
 * B: blog-slug     | Valmiki  | Slug from blog-queue          | At extraction start
 * C: blog-url      | Valmiki  | URL from blog-queue           | At extraction start
 * D: source        | Valmiki  | "blog" or "krishna-insight"   | At row creation
 * E: extraction-   | Valmiki  | Not Started → Extracting →    | Status changes during
 *    status        |          | Extracted → All Posts Done    | extraction workflow
 * F: insight-#     | Valmiki  | "1", "2", "3", etc.           | At insight extraction
 * G: insight-name  | Valmiki  | 2-5 word memorable label      | At insight extraction
 * H: insight-      | Valmiki  | 1-2 sentence summary          | At insight extraction
 *    summary       |          |                               |
 * I: icp-pass      | Valmiki  | "Yes" or "No"                 | At ICP filtering (after extraction)
 * J: icp-fail-     | Valmiki  | Reason if icp-pass="No"       | At ICP filtering (after extraction)
 *    reason        |          |                               |
 * K: post-status   | Various  | See POST-STATUS TRANSITIONS   | See below
 * L: draft-text    | Valmiki  | Full LinkedIn post draft      | At draft creation
 * M: hook-strategy | Valmiki  | "loss-aversion", "curiosity", | At draft creation
 *                  |          | "authority", "story", etc.    |
 * N: cta-type      | Valmiki  | "value-exchange", "question", | At draft creation
 *                  |          | "resource", "follow", etc.    |
 * O: krishna-      | Krishna  | Review notes, edits needed    | After reviewing draft
 *    feedback      |          |                               |
 * P: posted-date   | Krishna  | "2026-02-25" format           | After posting to LinkedIn
 * Q: linkedin-url  | Krishna  | Full LinkedIn post URL        | After posting to LinkedIn
 * R: likes         | Krishna  | Number                        | 24-48h after posting (manual)
 * S: comments      | Krishna  | Number                        | 24-48h after posting (manual)
 * T: impressions   | Krishna  | Number                        | 24-48h after posting (manual)
 * U: profile-views | Krishna  | Number (weekly delta)         | Weekly review (Saturday)
 * V: connection-   | Krishna  | Number (weekly delta)         | Weekly review (Saturday)
 *    requests      |          |                               |
 * W: notes         | Either   | Any relevant context          | Anytime
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * POST-STATUS (Column K) TRANSITIONS
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * STATUS         | SET BY   | WHEN                          | NEXT STATES
 * ───────────────┼──────────┼───────────────────────────────┼──────────────────
 * (empty)        | -        | Row just created              | → Extracted
 * Extracted      | Valmiki  | After ICP filtering           | → Draft Ready, Skipped
 * Draft Ready    | Valmiki  | After draft written           | → Approved, Needs Edit, Skipped
 * Needs Edit     | Krishna  | Feedback given, needs rework  | → Draft Ready
 * Approved       | Krishna  | Ready to post                 | → Posted
 * Posted         | Krishna  | After manual LinkedIn post    | (terminal)
 * Skipped        | Either   | Won't post (ICP fail, etc.)   | (terminal)
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * EXTRACTION-STATUS (Column E) TRANSITIONS
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * STATUS         | SET BY   | WHEN                          | MEANING
 * ───────────────┼──────────┼───────────────────────────────┼──────────────────
 * Not Started    | -        | Default                       | Blog not yet mined
 * Extracting     | Valmiki  | Starting to extract insights  | Work in progress
 * Extracted      | Valmiki  | All insights extracted        | Ready for drafting
 * All Posts Done | Valmiki  | All posts Posted or Skipped   | Blog fully processed
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * WORKFLOW SEQUENCE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * 1. VALMIKI 7 PM: next-blog → set-extracting → extract insights → add-insight (×3-5)
 *    → ICP filter (set icp-pass) → set-extracted → draft posts (L,M,N) → set-draft-ready
 * 
 * 2. VALMIKI posts to #valmiki-content: "Here are today's drafts for review"
 * 
 * 3. KRISHNA reviews: Either approves (set-approved) or gives feedback (add-feedback + Needs Edit)
 * 
 * 4. KRISHNA 8:30 AM next day: Posts approved drafts to LinkedIn manually
 *    → set-posted <row> <date> [url]
 * 
 * 5. KRISHNA 24-48h later: Fills R,S,T (likes, comments, impressions)
 * 
 * 6. KRISHNA Saturday: Fills U,V (profile-views, connection-requests weekly delta)
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Column order (23 total):
 * A: blog-title, B: blog-slug, C: blog-url, D: source, E: extraction-status,
 * F: insight-#, G: insight-name, H: insight-summary, I: icp-pass, J: icp-fail-reason,
 * K: post-status, L: draft-text, M: hook-strategy, N: cta-type, O: krishna-feedback,
 * P: posted-date, Q: linkedin-url, R: likes, S: comments, T: impressions,
 * U: profile-views, V: connection-requests, W: notes
 * 
 * Commands:
 *   next-blog                         - Get next Published blog to extract
 *   list                              - List all pipeline entries
 *   list-drafts                       - List all "Draft Ready" posts
 *   
 *   VALMIKI:
 *   set-extracting <slug>             - Mark blog as "Extracting"
 *   add-insight <json>                - Add extracted insight row
 *   set-extracted <slug>              - Mark blog extraction complete
 *   set-draft-ready <row>             - Mark insight as "Draft Ready"
 *   set-skipped <row>                 - Mark as "Skipped"
 *   set-all-done <slug>               - Mark blog as "All Posts Done"
 *   
 *   KRISHNA:
 *   add-feedback <row> <feedback>     - Add review feedback
 *   set-needs-edit <row>              - Mark as "Needs Edit" (after feedback)
 *   set-approved <row>                - Mark as "Approved" (ready to post)
 *   set-posted <row> <date> [url]     - Mark as "Posted" with date/URL
 *   update-metrics <row> <json>       - Update engagement metrics (likes, comments, etc.)
 */

const { google } = require('googleapis');
const https = require('https');
const fs = require('fs');
const path = require('path');

const SPREADSHEET_ID = '1xmeU8Iu7f540yl4iPp0KaCxVSfwfA_pciE8o1-jKD2g';
const CREDS_PATH = path.join(__dirname, '..', 'credentials', 'google-service-account.json');
const PIPELINE_TAB = 'linkedin-pipeline';
const BLOGQUEUE_TAB = 'blog-queue';

// Convex configuration
const CONVEX_BASE_URL = 'curious-iguana-738.convex.site';
const CONVEX_API_KEY_PATH = path.join(__dirname, '..', 'credentials', 'convex-api-key.txt');

/**
 * Push LinkedIn post to Convex
 */
async function pushToConvex(postData) {
  const apiKey = fs.readFileSync(CONVEX_API_KEY_PATH, 'utf8').trim();
  const payload = JSON.stringify(postData);
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: CONVEX_BASE_URL,
      path: '/push/linkedin-posts',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
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
    
    req.write(payload);
    req.end();
  });
}

async function getSheets() {
  const creds = JSON.parse(fs.readFileSync(CREDS_PATH, 'utf8'));
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

async function readPipeline() {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${PIPELINE_TAB}!A:W`,
  });
  return res.data.values || [];
}

async function readBlogQueue() {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${BLOGQUEUE_TAB}!A:M`,
  });
  return res.data.values || [];
}

// Parse pipeline rows into structured entries
// Column order: blog-title(0), blog-slug(1), blog-url(2), source(3), extraction-status(4),
// insight-#(5), insight-name(6), insight-summary(7), icp-pass(8), icp-fail-reason(9),
// post-status(10), draft-text(11), hook-strategy(12), cta-type(13), krishna-feedback(14),
// posted-date(15), linkedin-url(16), likes(17), comments(18), impressions(19),
// profile-views(20), connection-requests(21), notes(22)
function parsePipeline(rows) {
  if (rows.length < 2) return [];
  return rows.slice(1).map((row, idx) => ({
    rowNumber: idx + 2,
    blogTitle: row[0] || '',
    blogSlug: row[1] || '',
    blogUrl: row[2] || '',
    source: row[3] || '',
    extractionStatus: row[4] || '',
    insightNum: row[5] || '',
    insightName: row[6] || '',
    insightSummary: row[7] || '',
    icpPass: row[8] || '',
    icpFailReason: row[9] || '',
    postStatus: row[10] || '',
    draftText: row[11] || '',
    hookStrategy: row[12] || '',
    ctaType: row[13] || '',
    krishnaFeedback: row[14] || '',
    postedDate: row[15] || '',
    linkedinUrl: row[16] || '',
    likes: row[17] || '',
    comments: row[18] || '',
    impressions: row[19] || '',
    profileViews: row[20] || '',
    connectionRequests: row[21] || '',
    notes: row[22] || '',
  }));
}

// Parse blog-queue to get published blogs
function parsePublished(rows) {
  if (rows.length < 2) return [];
  return rows.slice(1)
    .map((row, idx) => ({
      rowNumber: idx + 2,
      title: row[0] || '',
      slug: row[1] || '',
      status: row[10] || '',
      blogUrl: row[12] || '',
    }))
    .filter(b => b.status === 'Published');
}

// Get next blog to extract: oldest Published blog where linkedin-extracted (col T) is empty
async function getNextBlog() {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${BLOGQUEUE_TAB}!A:T`,  // Include column T (linkedin-extracted)
  });
  const rows = res.data.values || [];
  if (rows.length < 2) return null;
  
  // Find first Published blog where column T (index 19) is empty
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const status = row[10] || '';  // Column K = Status
    const linkedinExtracted = row[19] || '';  // Column T = linkedin-extracted
    
    if (status === 'Published' && !linkedinExtracted) {
      return {
        rowNumber: i + 1,
        title: row[0] || '',
        slug: row[1] || '',
        status: status,
        blogUrl: row[12] || '',
      };
    }
  }
  
  return null; // All blogs extracted
}

// Mark a blog as linkedin-extracted in blog-queue (column T)
async function markLinkedinExtracted(rowNumber) {
  const sheets = await getSheets();
  
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${BLOGQUEUE_TAB}!T${rowNumber}`,
    valueInputOption: 'RAW',
    requestBody: { values: [['Yes']] },
  });
  
  return { rowNumber, marked: true };
}

// Add insight row to pipeline
async function addInsight(data) {
  const sheets = await getSheets();
  
  // 23 columns: A through W
  const row = [
    data.blogTitle || '',
    data.blogSlug || '',
    data.blogUrl || '',
    data.source || 'blog',  // Default to 'blog', can be 'krishna-insight'
    data.extractionStatus || 'Extracting',
    data.insightNum || '',
    data.insightName || '',
    data.insightSummary || '',
    data.icpPass || '',
    data.icpFailReason || '',
    data.postStatus || 'Extracted',
    data.draftText || '',
    data.hookStrategy || '',
    data.ctaType || '',
    data.krishnaFeedback || '',
    data.postedDate || '',
    data.linkedinUrl || '',
    data.likes || '',
    data.comments || '',
    data.impressions || '',
    data.profileViews || '',
    data.connectionRequests || '',
    data.notes || '',
  ];
  
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${PIPELINE_TAB}!A:W`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [row] },
  });
  
  return { insightName: data.insightName, blogSlug: data.blogSlug, source: data.source || 'blog' };
}

// Update extraction status for a blog (all rows with that slug)
// extraction-status is column E (index 4)
async function setExtractionStatus(slug, status) {
  const sheets = await getSheets();
  const rows = await readPipeline();
  const pipeline = parsePipeline(rows);
  
  const updates = [];
  pipeline.forEach(p => {
    if (p.blogSlug === slug) {
      updates.push({
        range: `${PIPELINE_TAB}!E${p.rowNumber}`,  // Column E = extraction-status
        values: [[status]],
      });
    }
  });
  
  if (updates.length === 0) {
    return { updated: 0, slug, status };
  }
  
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      valueInputOption: 'RAW',
      data: updates,
    },
  });
  
  return { updated: updates.length, slug, status };
}

// Update post status for a specific row
// post-status is column K (index 10)
async function setPostStatus(row, status, extras = {}) {
  const sheets = await getSheets();
  
  // Column K is post-status
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${PIPELINE_TAB}!K${row}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[status]] },
  });
  
  // If setting Posted, also update date and URL (columns P and Q)
  if (status === 'Posted' && (extras.date || extras.url)) {
    const values = [[extras.date || '', extras.url || '']];
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${PIPELINE_TAB}!P${row}:Q${row}`,
      valueInputOption: 'RAW',
      requestBody: { values },
    });
  }
  
  return { row, status, ...extras };
}

// Add feedback to a row
// krishna-feedback is column O (index 14)
async function addFeedback(row, feedback) {
  const sheets = await getSheets();
  
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${PIPELINE_TAB}!O${row}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[feedback]] },
  });
  
  return { row, feedback };
}

// Update engagement metrics for a row (Krishna fills these after posting)
// likes(R), comments(S), impressions(T), profile-views(U), connection-requests(V)
async function updateMetrics(row, metrics) {
  const sheets = await getSheets();
  
  // Build values array for columns R-V
  const values = [[
    metrics.likes || '',
    metrics.comments || '',
    metrics.impressions || '',
    metrics.profileViews || '',
    metrics.connectionRequests || '',
  ]];
  
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${PIPELINE_TAB}!R${row}:V${row}`,
    valueInputOption: 'RAW',
    requestBody: { values },
  });
  
  return { row, ...metrics };
}

// Update draft text for a row
// draft-text(L), hook-strategy(M), cta-type(N)
async function updateDraft(row, draftText, hookStrategy, ctaType) {
  const sheets = await getSheets();
  
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${PIPELINE_TAB}!L${row}:N${row}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[draftText, hookStrategy, ctaType]] },
  });
  
  return { row, updated: true };
}

// Update notes for a row
// notes(W)
async function updateNote(row, note) {
  const sheets = await getSheets();
  
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${PIPELINE_TAB}!W${row}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[note]] },
  });
  
  return { row, note };
}

// CLI
(async () => {
  const cmd = process.argv[2];
  
  try {
    switch (cmd) {
      case 'next-blog': {
        const blog = await getNextBlog();
        if (blog) {
          console.log(JSON.stringify(blog, null, 2));
        } else {
          console.log(JSON.stringify({ 
            status: 'caught_up', 
            message: 'All published blogs extracted. Waiting for new Vyasa publications.' 
          }));
        }
        break;
      }
      
      case 'mark-blog-claimed': {
        const row = parseInt(process.argv[3]);
        if (!row) {
          console.error('Usage: mark-blog-claimed <row-number>');
          console.error('       Marks linkedin-extracted=Yes in blog-queue column T');
          process.exit(1);
        }
        const result = await markLinkedinExtracted(row);
        console.log(`Marked blog-queue row ${result.rowNumber} as linkedin-extracted`);
        break;
      }
      
      case 'set-extracting': {
        const slug = process.argv[3];
        if (!slug) {
          console.error('Usage: set-extracting <slug>');
          process.exit(1);
        }
        const result = await setExtractionStatus(slug, 'Extracting');
        console.log(`Set ${result.updated} rows for "${slug}" to Extracting`);
        break;
      }
      
      case 'add-insight': {
        const jsonArg = process.argv[3];
        if (!jsonArg) {
          console.error('Usage: add-insight \'{"blogTitle":"...", "blogSlug":"...", "insightName":"...", "source":"blog|krishna-insight"}\'');
          process.exit(1);
        }
        const data = JSON.parse(jsonArg);
        const result = await addInsight(data);
        console.log(`Added insight "${result.insightName}" (source: ${result.source}) for "${result.blogSlug || 'direct insight'}"`);
        break;
      }
      
      case 'set-draft-ready': {
        const row = parseInt(process.argv[3]);
        if (!row) {
          console.error('Usage: set-draft-ready <row>');
          process.exit(1);
        }
        const result = await setPostStatus(row, 'Draft Ready');
        console.log(`Row ${result.row} set to Draft Ready`);
        break;
      }
      
      case 'update-draft': {
        const row = parseInt(process.argv[3]);
        const jsonStr = process.argv[4];
        if (!row || !jsonStr) {
          console.error('Usage: update-draft <row> \'{"draftText":"...", "hookStrategy":"...", "ctaType":"..."}\'');
          process.exit(1);
        }
        const data = JSON.parse(jsonStr);
        const result = await updateDraft(row, data.draftText, data.hookStrategy, data.ctaType);
        console.log(`Row ${result.row} draft updated`);
        break;
      }
      
      case 'set-approved': {
        const row = parseInt(process.argv[3]);
        if (!row) {
          console.error('Usage: set-approved <row>');
          process.exit(1);
        }
        const result = await setPostStatus(row, 'Approved');
        console.log(`Row ${result.row} set to Approved`);
        break;
      }
      
      case 'set-posted': {
        const row = parseInt(process.argv[3]);
        const date = process.argv[4];
        const url = process.argv[5] || '';
        if (!row || !date) {
          console.error('Usage: set-posted <row> <date> [linkedin-url]');
          process.exit(1);
        }
        const result = await setPostStatus(row, 'Posted', { date, url });
        console.log(`Row ${result.row} set to Posted (${date})`);
        break;
      }
      
      case 'set-skipped': {
        const row = parseInt(process.argv[3]);
        if (!row) {
          console.error('Usage: set-skipped <row>');
          process.exit(1);
        }
        const result = await setPostStatus(row, 'Skipped');
        console.log(`Row ${result.row} set to Skipped`);
        break;
      }
      
      case 'set-needs-edit': {
        const row = parseInt(process.argv[3]);
        if (!row) {
          console.error('Usage: set-needs-edit <row>');
          process.exit(1);
        }
        const result = await setPostStatus(row, 'Needs Edit');
        console.log(`Row ${result.row} set to Needs Edit`);
        break;
      }
      
      case 'set-extracted': {
        const slug = process.argv[3];
        if (!slug) {
          console.error('Usage: set-extracted <slug>');
          process.exit(1);
        }
        const result = await setExtractionStatus(slug, 'Extracted');
        console.log(`Set ${result.updated} rows for "${slug}" to Extracted`);
        break;
      }
      
      case 'set-all-done': {
        const slug = process.argv[3];
        if (!slug) {
          console.error('Usage: set-all-done <slug>');
          process.exit(1);
        }
        const result = await setExtractionStatus(slug, 'All Posts Done');
        console.log(`Set ${result.updated} rows for "${slug}" to All Posts Done`);
        break;
      }
      
      case 'add-feedback': {
        const row = parseInt(process.argv[3]);
        const feedback = process.argv[4];
        if (!row || !feedback) {
          console.error('Usage: add-feedback <row> "<feedback text>"');
          process.exit(1);
        }
        const result = await addFeedback(row, feedback);
        console.log(`Added feedback to row ${result.row}`);
        break;
      }
      
      case 'update-metrics': {
        const row = parseInt(process.argv[3]);
        const jsonArg = process.argv[4];
        if (!row || !jsonArg) {
          console.error('Usage: update-metrics <row> \'{"likes":10, "comments":2, "impressions":500}\'');
          console.error('       Fields: likes, comments, impressions, profileViews, connectionRequests');
          process.exit(1);
        }
        const metrics = JSON.parse(jsonArg);
        const result = await updateMetrics(row, metrics);
        console.log(`Updated metrics for row ${result.row}: likes=${result.likes || '-'}, comments=${result.comments || '-'}, impressions=${result.impressions || '-'}`);
        break;
      }
      
      case 'update-note': {
        const row = parseInt(process.argv[3]);
        const note = process.argv[4];
        if (!row || !note) {
          console.error('Usage: update-note <row> "note text"');
          process.exit(1);
        }
        const result = await updateNote(row, note);
        console.log(`Updated note for row ${result.row}`);
        break;
      }
      
      case 'list': {
        const rows = await readPipeline();
        const pipeline = parsePipeline(rows);
        if (pipeline.length === 0) {
          console.log('Pipeline is empty.');
          break;
        }
        console.log(`\n📊 LinkedIn Pipeline (${pipeline.length} entries):\n`);
        let currentBlog = '';
        pipeline.forEach(p => {
          if (p.blogSlug !== currentBlog) {
            currentBlog = p.blogSlug;
            const sourceTag = p.source === 'krishna-insight' ? ' 💡' : '';
            console.log(`\n📝 ${p.blogTitle || '(Krishna\'s Direct Insight)'} [${p.extractionStatus}]${sourceTag}`);
            if (p.blogSlug) console.log(`   ${p.blogSlug}`);
          }
          const icpIcon = p.icpPass === 'Yes' ? '✅' : p.icpPass === 'No' ? '❌' : '⏳';
          console.log(`   ${p.insightNum}. "${p.insightName}" ${icpIcon} [${p.postStatus}]`);
        });
        break;
      }
      
      case 'list-drafts': {
        const rows = await readPipeline();
        const pipeline = parsePipeline(rows);
        const drafts = pipeline.filter(p => p.postStatus === 'Draft Ready');
        if (drafts.length === 0) {
          console.log('No drafts ready for review.');
          break;
        }
        console.log(`\n✍️ Drafts Ready for Review (${drafts.length}):\n`);
        drafts.forEach(d => {
          const sourceTag = d.source === 'krishna-insight' ? ' 💡' : '';
          console.log(`Row ${d.rowNumber}: "${d.insightName}" from ${d.blogSlug || 'direct insight'}${sourceTag}`);
          console.log(`   Hook: ${d.hookStrategy} | CTA: ${d.ctaType}`);
          console.log(`   Draft: ${d.draftText.substring(0, 100)}...`);
          console.log('');
        });
        break;
      }
      
      case 'push-convex': {
        const row = parseInt(process.argv[3]);
        if (!row) {
          console.error('Usage: push-convex <row>');
          console.error('Push a draft row to Convex (linkedinPosts table)');
          process.exit(1);
        }
        const rows = await readPipeline();
        const pipeline = parsePipeline(rows);
        const entry = pipeline.find(p => p.rowNumber === row);
        if (!entry) {
          console.error(`Row ${row} not found`);
          process.exit(1);
        }
        if (!entry.insightName || !entry.draftText) {
          console.error('Row missing insightName or draftText - cannot push to Convex');
          process.exit(1);
        }
        
        // Map to Convex schema
        const convexData = {
          insightName: entry.insightName,
          draftText: entry.draftText,
          sourceBlogSlug: entry.blogSlug || '',
          sourceBlogTitle: entry.blogTitle || '',
          insightNumber: parseInt(entry.insightNum) || 1,
          source: entry.source === 'krishna-insight' ? 'krishna-insight' : 'blog',
          icpPass: entry.icpPass === 'Yes',
          icpFailReason: entry.icpPass === 'No' ? (entry.icpFailReason || null) : null,
          hookStrategy: entry.hookStrategy || null,
          ctaType: entry.ctaType || null,
          status: entry.postStatus === 'Draft Ready' ? 'draft_ready' : 
                  entry.postStatus === 'Needs Edit' ? 'needs_revision' :
                  entry.postStatus === 'Approved' ? 'approved' :
                  entry.postStatus === 'Posted' ? 'posted' :
                  entry.postStatus === 'Skipped' ? 'skipped' : 'draft_ready',
          agentName: 'Valmiki',
          createdAt: new Date().toISOString()
        };
        
        try {
          const result = await pushToConvex(convexData);
          console.log(`✅ Pushed to Convex: ${JSON.stringify(result)}`);
        } catch (err) {
          console.error(`⚠️ Convex push failed: ${err.message}`);
          process.exit(1);
        }
        break;
      }
      
      default:
        console.log('LinkedIn Pipeline Helper - Commands:\n');
        console.log('═══════════════════════════════════════════════════════════════════════');
        console.log('DISCOVERY');
        console.log('═══════════════════════════════════════════════════════════════════════');
        console.log('  next-blog                         - Get next Published blog to extract');
        console.log('  list                              - List all pipeline entries');
        console.log('  list-drafts                       - List all "Draft Ready" posts');
        console.log('');
        console.log('═══════════════════════════════════════════════════════════════════════');
        console.log('VALMIKI COMMANDS (Extraction & Drafting)');
        console.log('═══════════════════════════════════════════════════════════════════════');
        console.log('  mark-blog-claimed <row>           - Mark blog-queue column T = Yes (FIRST!)');
        console.log('  set-extracting <slug>             - Mark blog as "Extracting"');
        console.log('  add-insight <json>                - Add extracted insight row');
        console.log('    JSON: {blogTitle, blogSlug, blogUrl, source, insightNum,');
        console.log('           insightName, insightSummary, icpPass, icpFailReason}');
        console.log('  set-extracted <slug>              - Mark blog extraction complete');
        console.log('  set-draft-ready <row>             - Mark insight as "Draft Ready"');
        console.log('  set-skipped <row>                 - Mark as "Skipped" (ICP fail)');
        console.log('  set-all-done <slug>               - Mark blog as "All Posts Done"');
        console.log('');
        console.log('═══════════════════════════════════════════════════════════════════════');
        console.log('KRISHNA COMMANDS (Review & Metrics)');
        console.log('═══════════════════════════════════════════════════════════════════════');
        console.log('  add-feedback <row> "<text>"       - Add review feedback');
        console.log('  set-needs-edit <row>              - Mark as "Needs Edit" (with feedback)');
        console.log('  set-approved <row>                - Mark as "Approved" (ready to post)');
        console.log('  set-posted <row> <date> [url]     - Mark as "Posted" after LinkedIn post');
        console.log('  update-metrics <row> <json>       - Update engagement metrics');
        console.log('    JSON: {likes, comments, impressions, profileViews, connectionRequests}');
        console.log('');
        console.log('═══════════════════════════════════════════════════════════════════════');
        console.log('See top of this file for full COLUMN OWNERSHIP MATRIX');
        console.log('═══════════════════════════════════════════════════════════════════════');
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
