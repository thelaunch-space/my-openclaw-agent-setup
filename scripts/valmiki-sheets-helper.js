#!/usr/bin/env node
/**
 * Valmiki LinkedIn Tracker Helper
 * 
 * Convex-first pattern: tries Convex, falls back to Google Sheets.
 * 
 * Usage:
 *   node valmiki-sheets-helper.js list [limit]           - List recent posts
 *   node valmiki-sheets-helper.js add-post '{json}'      - Add a new post entry
 *   node valmiki-sheets-helper.js update-metrics <insightName> '{json}' - Update metrics for a post
 *   node valmiki-sheets-helper.js get-stats              - Get performance summary
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const https = require('https');

const SHEET_ID = '1GyEUrZxvwiYhtHm5uhAPUelwbFoeWbnxQVSySokRfd8';
const TAB_NAME = 'linkedin-data';
const CONVEX_BASE = 'https://curious-iguana-738.convex.site';

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

// ---------- Convex helpers ----------

function getApiKey() {
  const keyPath = '/home/node/openclaw/credentials/convex-api-key.txt';
  return fs.readFileSync(keyPath, 'utf8').trim();
}

function convexRequest(method, endpoint, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, CONVEX_BASE);
    const options = {
      method,
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: {
        'Authorization': `Bearer ${getApiKey()}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch {
            resolve(data);
          }
        } else {
          reject(new Error(`Convex ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Convex request timeout'));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function queryConvexPosts(status = null) {
  const endpoint = status 
    ? `/query/linkedin-posts?status=${encodeURIComponent(status)}`
    : '/query/linkedin-posts';
  return convexRequest('GET', endpoint);
}

async function pushToConvex(postData) {
  return convexRequest('POST', '/push/linkedin-posts', postData);
}

// ---------- Google Sheets helpers ----------

async function getAuth() {
  const credsPath = '/home/node/openclaw/credentials/google-service-account.json';
  const creds = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
  return new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
}

async function listPostsFromSheets(limit = 20) {
  const auth = await getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${TAB_NAME}!A:M`
  });
  
  const rows = response.data.values || [];
  return rows;
}

// ---------- Commands ----------

async function listPosts(limit = 20) {
  // Try Convex first
  try {
    const posts = await queryConvexPosts();
    
    if (posts && posts.length > 0) {
      console.log(`\n📝 LinkedIn Posts from Convex (${Math.min(posts.length, limit)} of ${posts.length}):\n`);
      
      const recentPosts = posts.slice(-limit);
      recentPosts.forEach((post, idx) => {
        const status = post.status || '';
        const insightName = post.insightName || '';
        const goLiveDate = post.goLiveDate || '';
        const impressions = post.impressions || '';
        const likes = post.likes || '';
        const sourceBlog = post.sourceBlogSlug || '';
        
        console.log(`[${status}] ${insightName}`);
        console.log(`  Source: ${sourceBlog}`);
        if (goLiveDate) console.log(`  Posted: ${goLiveDate}`);
        if (impressions) console.log(`  Metrics: ${impressions} imp, ${likes} likes`);
        console.log('');
      });
      return;
    }
  } catch (err) {
    console.log(`⚠️ Convex unavailable (${err.message}), falling back to Sheets...`);
  }
  
  // Fallback to Sheets
  const rows = await listPostsFromSheets(limit);
  
  if (rows.length <= 1) {
    console.log('No posts found.');
    return;
  }
  
  const dataRows = rows.slice(1).slice(-limit);
  
  console.log(`\n📝 LinkedIn Posts from Sheets (last ${dataRows.length}):\n`);
  
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

async function updateMetrics(insightNameOrRow, metricsData) {
  const data = typeof metricsData === 'string' ? JSON.parse(metricsData) : metricsData;
  
  // If it looks like a row number (numeric), use Sheets directly
  const isRowNumber = /^\d+$/.test(insightNameOrRow);
  
  // Try Convex first (if we have an insightName)
  if (!isRowNumber) {
    try {
      const payload = {
        insightName: insightNameOrRow,
        ...data
      };
      
      // Map field names if needed
      if (data.goLiveDate !== undefined) payload.goLiveDate = data.goLiveDate;
      if (data.goLiveTime !== undefined) payload.goLiveTime = data.goLiveTime;
      if (data.impressions !== undefined) payload.impressions = data.impressions;
      if (data.likes !== undefined) payload.likes = data.likes;
      if (data.comments !== undefined) payload.comments = data.comments;
      if (data.status !== undefined) payload.status = data.status;
      
      const result = await pushToConvex(payload);
      console.log(`✅ Metrics pushed to Convex for: ${insightNameOrRow}`);
      if (data.impressions !== undefined) console.log(`   Impressions: ${data.impressions}`);
      if (data.likes !== undefined) console.log(`   Likes: ${data.likes}`);
      if (data.comments !== undefined) console.log(`   Comments: ${data.comments}`);
      if (data.goLiveDate) console.log(`   Go-live date: ${data.goLiveDate}`);
      return;
    } catch (err) {
      console.log(`⚠️ Convex push failed (${err.message}), falling back to Sheets...`);
    }
  }
  
  // Fallback to Sheets (using row number)
  const rowNum = isRowNumber ? parseInt(insightNameOrRow) : null;
  
  if (!rowNum) {
    console.error('Error: For Sheets fallback, need a row number. Got:', insightNameOrRow);
    process.exit(1);
  }
  
  const auth = await getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  
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
  
  console.log(`✅ Row ${rowNum} updated in Sheets`);
  updates.forEach(u => {
    const col = u.range.match(/!([A-Z])/)?.[1];
    console.log(`   ${col}: ${u.values[0][0]}`);
  });
}

async function getStats() {
  // Try Convex first
  try {
    const posts = await queryConvexPosts();
    
    if (posts && posts.length > 0) {
      console.log('\n📊 LinkedIn Performance Summary (from Convex)\n');
      
      let totalPosts = posts.length;
      let postedCount = 0;
      let totalImpressions = 0;
      let totalLikes = 0;
      let totalComments = 0;
      let postsWithMetrics = 0;
      
      const statusCount = {};
      
      posts.forEach(post => {
        const status = post.status || 'unknown';
        statusCount[status] = (statusCount[status] || 0) + 1;
        
        if (post.goLiveDate) {
          postedCount++;
        }
        
        if (post.impressions && post.impressions > 0) {
          postsWithMetrics++;
          totalImpressions += post.impressions || 0;
          totalLikes += post.likes || 0;
          totalComments += post.comments || 0;
        }
      });
      
      console.log(`Total posts tracked: ${totalPosts}`);
      console.log(`Posts published (with goLiveDate): ${postedCount}`);
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
      
      console.log('Posts by status:');
      Object.entries(statusCount)
        .sort((a, b) => b[1] - a[1])
        .forEach(([status, count]) => {
          console.log(`  ${status}: ${count}`);
        });
      
      // Show top performers
      const withMetrics = posts.filter(p => p.impressions && p.impressions > 0);
      if (withMetrics.length > 0) {
        console.log('\nTop performers (by impressions):');
        withMetrics
          .sort((a, b) => (b.impressions || 0) - (a.impressions || 0))
          .slice(0, 5)
          .forEach((post, idx) => {
            console.log(`  ${idx + 1}. ${post.insightName}: ${post.impressions} imp, ${post.likes || 0} likes`);
          });
      }
      
      return;
    }
  } catch (err) {
    console.log(`⚠️ Convex unavailable (${err.message}), falling back to Sheets...`);
  }
  
  // Fallback to Sheets
  const rows = await listPostsFromSheets();
  
  if (rows.length <= 1) {
    console.log('No posts to analyze.');
    return;
  }
  
  const dataRows = rows.slice(1);
  
  console.log('\n📊 LinkedIn Performance Summary (from Sheets)\n');
  
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
          console.error('Usage: update-metrics <insightName|row> \'{"status":"posted", "goLiveDate":"2026-02-19", "impressions":500, "likes":15}\'');
          console.error('');
          console.error('Use insightName for Convex (preferred), row number for Sheets fallback.');
          process.exit(1);
        }
        await updateMetrics(args[0], args[1]);
        break;
      case 'get-stats':
        await getStats();
        break;
      default:
        console.log('Valmiki LinkedIn Tracker Helper');
        console.log('');
        console.log('Convex-first pattern: tries Convex, falls back to Google Sheets.');
        console.log('');
        console.log('Commands:');
        console.log('  list [limit]                        - List recent posts');
        console.log('  add-post \'{json}\'                   - Add a new post entry (Sheets only)');
        console.log('  update-metrics <insightName> \'{json}\' - Update metrics (Convex-first)');
        console.log('  get-stats                           - Get performance summary (Convex-first)');
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
