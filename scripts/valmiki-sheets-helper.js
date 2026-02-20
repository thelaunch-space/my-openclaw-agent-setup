#!/usr/bin/env node
/**
 * Valmiki LinkedIn Tracker Helper
 * 
 * Usage:
 *   node valmiki-sheets-helper.js list [limit]           - List recent posts
 *   node valmiki-sheets-helper.js add-post '{json}'      - Add a new post entry
 *   node valmiki-sheets-helper.js update-metrics <row> '{json}' - Update metrics for a post
 *   node valmiki-sheets-helper.js get-stats              - Get performance summary
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const SHEET_ID = '1GyEUrZxvwiYhtHm5uhAPUelwbFoeWbnxQVSySokRfd8';
const TAB_NAME = 'linkedin-data';

// Column mapping (1-indexed for Sheets API)
const COLUMNS = {
  DATE_DRAFTED: 'A',      // date-drafted
  CATEGORY: 'B',          // post-category
  HOOK: 'C',              // post-hook
  BODY: 'D',              // post-body
  CTA: 'E',               // post-cta
  FULL_POST: 'F',         // post-full
  STATUS: 'G',            // post-status (drafted, approved, posted, analyzed)
  GO_LIVE_DATE: 'H',      // post-go-live-date
  GO_LIVE_TIME: 'I',      // post-go-live-time
  IMPRESSIONS: 'J',       // impression-count
  COMMENTS: 'K',          // comment-count
  LIKES: 'L',             // like-count
  EXPERIMENT: 'M'         // experiment-tag
};

async function getAuth() {
  const credsPath = '/home/node/openclaw/credentials/google-service-account.json';
  const creds = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
  return new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
}

async function listPosts(limit = 20) {
  const auth = await getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${TAB_NAME}!A:M`
  });
  
  const rows = response.data.values || [];
  if (rows.length <= 1) {
    console.log('No posts found.');
    return;
  }
  
  const headers = rows[0];
  const dataRows = rows.slice(1).slice(-limit);
  
  console.log(`\n📝 LinkedIn Posts (last ${dataRows.length}):\n`);
  
  dataRows.forEach((row, idx) => {
    const rowNum = rows.length - dataRows.length + idx + 1;
    const dateDrafted = row[0] || '';
    const category = row[1] || '';
    const hook = row[2] || '';
    const status = row[6] || '';
    const goLiveDate = row[7] || '';
    const impressions = row[9] || '';
    const likes = row[11] || '';
    
    console.log(`Row ${rowNum}: [${status}] ${dateDrafted}`);
    console.log(`  Category: ${category}`);
    console.log(`  Hook: ${hook.substring(0, 60)}${hook.length > 60 ? '...' : ''}`);
    if (goLiveDate) console.log(`  Posted: ${goLiveDate}`);
    if (impressions) console.log(`  Metrics: ${impressions} imp, ${likes} likes`);
    console.log('');
  });
}

async function addPost(postData) {
  const auth = await getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  
  const data = typeof postData === 'string' ? JSON.parse(postData) : postData;
  
  // Build row array matching column order
  const row = [
    data.dateDrafted || new Date().toISOString().split('T')[0],
    data.category || '',
    data.hook || '',
    data.body || '',
    data.cta || '',
    data.fullPost || '',
    data.status || 'drafted',
    data.goLiveDate || '',
    data.goLiveTime || '',
    data.impressions || '',
    data.comments || '',
    data.likes || '',
    data.experiment || ''
  ];
  
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${TAB_NAME}!A:M`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [row] }
  });
  
  const updatedRange = response.data.updates.updatedRange;
  const rowNum = updatedRange.match(/(\d+)$/)?.[1];
  
  console.log(`✅ Post added to row ${rowNum}`);
  console.log(`   Status: ${data.status || 'drafted'}`);
  console.log(`   Category: ${data.category}`);
  console.log(`   Hook: ${data.hook?.substring(0, 50)}...`);
}

async function updateMetrics(rowNum, metricsData) {
  const auth = await getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  
  const data = typeof metricsData === 'string' ? JSON.parse(metricsData) : metricsData;
  
  // Update specific cells
  const updates = [];
  
  if (data.status) {
    updates.push({
      range: `${TAB_NAME}!G${rowNum}`,
      values: [[data.status]]
    });
  }
  if (data.goLiveDate) {
    updates.push({
      range: `${TAB_NAME}!H${rowNum}`,
      values: [[data.goLiveDate]]
    });
  }
  if (data.goLiveTime) {
    updates.push({
      range: `${TAB_NAME}!I${rowNum}`,
      values: [[data.goLiveTime]]
    });
  }
  if (data.impressions !== undefined) {
    updates.push({
      range: `${TAB_NAME}!J${rowNum}`,
      values: [[data.impressions]]
    });
  }
  if (data.comments !== undefined) {
    updates.push({
      range: `${TAB_NAME}!K${rowNum}`,
      values: [[data.comments]]
    });
  }
  if (data.likes !== undefined) {
    updates.push({
      range: `${TAB_NAME}!L${rowNum}`,
      values: [[data.likes]]
    });
  }
  
  if (updates.length === 0) {
    console.log('No updates specified.');
    return;
  }
  
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: { data: updates, valueInputOption: 'USER_ENTERED' }
  });
  
  console.log(`✅ Row ${rowNum} updated`);
  updates.forEach(u => {
    const col = u.range.match(/!([A-Z])/)?.[1];
    console.log(`   ${col}: ${u.values[0][0]}`);
  });
}

async function getStats() {
  const auth = await getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${TAB_NAME}!A:M`
  });
  
  const rows = response.data.values || [];
  if (rows.length <= 1) {
    console.log('No posts to analyze.');
    return;
  }
  
  const dataRows = rows.slice(1);
  
  let totalPosts = dataRows.length;
  let postedCount = 0;
  let totalImpressions = 0;
  let totalLikes = 0;
  let totalComments = 0;
  let postsWithMetrics = 0;
  
  const categoryCount = {};
  
  dataRows.forEach(row => {
    const status = row[6] || '';
    const category = row[1] || 'uncategorized';
    const impressions = parseInt(row[9]) || 0;
    const likes = parseInt(row[11]) || 0;
    const comments = parseInt(row[10]) || 0;
    
    if (status === 'posted' || status === 'analyzed') {
      postedCount++;
    }
    
    categoryCount[category] = (categoryCount[category] || 0) + 1;
    
    if (impressions > 0) {
      postsWithMetrics++;
      totalImpressions += impressions;
      totalLikes += likes;
      totalComments += comments;
    }
  });
  
  console.log('\n📊 LinkedIn Performance Summary\n');
  console.log(`Total posts tracked: ${totalPosts}`);
  console.log(`Posts published: ${postedCount}`);
  console.log(`Posts with metrics: ${postsWithMetrics}`);
  console.log('');
  
  if (postsWithMetrics > 0) {
    console.log('Aggregate metrics:');
    console.log(`  Total impressions: ${totalImpressions}`);
    console.log(`  Total likes: ${totalLikes}`);
    console.log(`  Total comments: ${totalComments}`);
    console.log(`  Avg impressions/post: ${Math.round(totalImpressions / postsWithMetrics)}`);
    console.log(`  Avg likes/post: ${(totalLikes / postsWithMetrics).toFixed(1)}`);
    console.log('');
  }
  
  console.log('Posts by category:');
  Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });
}

// Main
const [,, command, ...args] = process.argv;

(async () => {
  try {
    switch (command) {
      case 'list':
        await listPosts(parseInt(args[0]) || 20);
        break;
      case 'add-post':
        if (!args[0]) {
          console.error('Usage: add-post \'{"category":"...", "hook":"...", "body":"...", "cta":"...", "fullPost":"...", "status":"drafted"}\'');
          process.exit(1);
        }
        await addPost(args[0]);
        break;
      case 'update-metrics':
        if (!args[0] || !args[1]) {
          console.error('Usage: update-metrics <row> \'{"status":"posted", "goLiveDate":"2026-02-19", "impressions":500, "likes":15}\'');
          process.exit(1);
        }
        await updateMetrics(parseInt(args[0]), args[1]);
        break;
      case 'get-stats':
        await getStats();
        break;
      default:
        console.log('Valmiki LinkedIn Tracker Helper');
        console.log('');
        console.log('Commands:');
        console.log('  list [limit]              - List recent posts');
        console.log('  add-post \'{json}\'         - Add a new post entry');
        console.log('  update-metrics <row> \'{json}\' - Update metrics for a post');
        console.log('  get-stats                 - Get performance summary');
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
