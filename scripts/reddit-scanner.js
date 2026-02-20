#!/usr/bin/env node
/**
 * Reddit Scanner for ICP Question Mining
 * Uses Reddit's public JSON API (no auth required for reading)
 */

const { google } = require('googleapis');
const https = require('https');
const http = require('http');

const SPREADSHEET_ID = '1xmeU8Iu7f540yl4iPp0KaCxVSfwfA_pciE8o1-jKD2g';
const CREDENTIALS_PATH = '/home/node/openclaw/credentials/google-service-account.json';

// ICP pain signals to look for
const ICP_KEYWORDS = [
  // Direct intent (Tier 1)
  'looking for developer', 'need a developer', 'hire developer',
  'looking for CTO', 'need CTO', 'fractional CTO',
  'technical cofounder', 'tech cofounder', 'looking for cofounder',
  'need someone to build', 'help me build',
  
  // Pain signals (Tier 2)
  'agency', 'freelancer', 'frustrated with', 'disappointed with',
  'wasted money on', 'took too long', 'over budget',
  'MVP', 'prototype', 'build my app', 'build my idea',
  'non-technical founder', 'no coding', "can't code", "don't code",
  'AI for my business', 'automate my', 'need automation',
  
  // Context signals (Tier 3)
  'services business', 'consulting business', 'coaching business',
  'how do I build', 'should I build', 'what tools',
  'startup advice', 'first time founder', 'solo founder',
  'scaling', 'growing pains', 'bottleneck'
];

// Subreddits to scan
const SUBREDDITS = [
  { name: 'entrepreneur', category: 'General', priority: 'HIGH' },
  { name: 'Entrepreneur', category: 'General', priority: 'HIGH' },
  { name: 'smallbusiness', category: 'General', priority: 'HIGH' },
  { name: 'startups', category: 'General', priority: 'HIGH' },
  { name: 'cofounder', category: 'General', priority: 'HIGH' },
  { name: 'SaaS', category: 'General', priority: 'MEDIUM' },
  { name: 'indiehackers', category: 'General', priority: 'MEDIUM' },
  { name: 'nocode', category: 'Adjacent', priority: 'MEDIUM' },
  { name: 'edtech', category: 'Vertical', priority: 'HIGH' },
  // Added 2026-02-09 - Weekly Community Discovery
  { name: 'consulting', category: 'Corporate Exit', priority: 'HIGH' }, // ~150k members, consultants going independent
  { name: 'HealthTech', category: 'Vertical', priority: 'MEDIUM' }, // Healthcare founders + tech
  { name: 'healthcarestartups', category: 'Vertical', priority: 'MEDIUM' }, // Healthcare startup operations
];

async function fetchReddit(subreddit, sort = 'new', limit = 25) {
  const url = `https://old.reddit.com/r/${subreddit}/${sort}/.json?limit=${limit}`;
  
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; research bot)'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON from r/${subreddit}: ${e.message}`));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error(`Timeout fetching r/${subreddit}`));
    });
  });
}

function scoreRelevance(title, selftext) {
  const text = `${title} ${selftext}`.toLowerCase();
  let score = 0;
  let matches = [];
  
  for (const keyword of ICP_KEYWORDS) {
    if (text.includes(keyword.toLowerCase())) {
      score += 1;
      matches.push(keyword);
    }
  }
  
  // Boost for question posts
  if (title.includes('?') || title.toLowerCase().startsWith('how') || 
      title.toLowerCase().startsWith('what') || title.toLowerCase().startsWith('should')) {
    score += 0.5;
  }
  
  // Boost for seeking help
  if (text.includes('help') || text.includes('advice') || text.includes('looking for')) {
    score += 0.5;
  }
  
  return { score, matches };
}

function extractQuestion(title, selftext) {
  // Extract the core question or pain point
  if (title.includes('?')) {
    return title;
  }
  // Look for question in selftext
  const sentences = selftext.split(/[.!?]+/);
  for (const s of sentences) {
    if (s.includes('?') || s.toLowerCase().includes('how do') || s.toLowerCase().includes('should i')) {
      return s.trim().substring(0, 200);
    }
  }
  return title;
}

function determineAngle(matches, title, selftext) {
  const text = `${title} ${selftext}`.toLowerCase();
  
  if (matches.some(m => ['agency', 'freelancer', 'frustrated', 'disappointed'].includes(m.toLowerCase()))) {
    return 'Agency frustration → thelaunch.space as reliable alternative';
  }
  if (matches.some(m => m.includes('cofounder') || m.includes('CTO'))) {
    return 'Seeking technical partner → Krishna as fractional CTO';
  }
  if (matches.some(m => m.includes('MVP') || m.includes('prototype') || m.includes('build'))) {
    return 'Building first product → 21-day MVP service';
  }
  if (text.includes('ai') || text.includes('automat')) {
    return 'AI curiosity/confusion → Krishna as AI-native builder';
  }
  if (matches.some(m => m.includes('non-technical') || m.includes("can't code"))) {
    return 'Non-technical founder → proof that non-devs can ship';
  }
  
  return 'General ICP overlap - needs specific angle';
}

async function getSheets() {
  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  return google.sheets({ version: 'v4', auth: await auth.getClient() });
}

async function getExistingUrls(sheets) {
  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'questions!H:H'
    });
    return new Set((result.data.values || []).flat());
  } catch (e) {
    return new Set();
  }
}

async function appendQuestions(sheets, questions) {
  if (questions.length === 0) return;
  
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'questions!A2',
    valueInputOption: 'RAW',
    requestBody: { values: questions }
  });
}

async function updateSubredditScanTime(sheets, subreddit) {
  // Update last scanned time for subreddit
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'subreddits!A:F'
  });
  
  const rows = result.data.values || [];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === `r/${subreddit}` || rows[i][0] === subreddit) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `subreddits!F${i + 1}`,
        valueInputOption: 'RAW',
        requestBody: { values: [[new Date().toISOString().split('T')[0]]] }
      });
      break;
    }
  }
}

async function scan(subredditsToScan = null, minScore = 1) {
  console.log('Starting Reddit scan...');
  const sheets = await getSheets();
  const existingUrls = await getExistingUrls(sheets);
  console.log(`Found ${existingUrls.size} existing URLs in sheet`);
  
  const today = new Date().toISOString().split('T')[0];
  const targetSubs = subredditsToScan || SUBREDDITS;
  let totalFound = 0;
  let newQuestions = [];
  
  for (const sub of targetSubs) {
    const subredditName = typeof sub === 'string' ? sub : sub.name;
    console.log(`\nScanning r/${subredditName}...`);
    
    try {
      const data = await fetchReddit(subredditName, 'new', 50);
      
      if (!data.data || !data.data.children) {
        console.log(`  No data returned for r/${subredditName}`);
        continue;
      }
      
      const posts = data.data.children;
      console.log(`  Found ${posts.length} posts`);
      
      for (const post of posts) {
        const p = post.data;
        if (!p || !p.title) continue;
        
        const url = `https://reddit.com${p.permalink}`;
        if (existingUrls.has(url)) continue;
        
        const { score, matches } = scoreRelevance(p.title, p.selftext || '');
        
        if (score >= minScore) {
          const postDate = new Date(p.created_utc * 1000).toISOString().split('T')[0];
          const question = extractQuestion(p.title, p.selftext || '');
          const angle = determineAngle(matches, p.title, p.selftext || '');
          
          // Determine ICP relevance level
          let icpRelevance = 'LOW';
          if (score >= 3) icpRelevance = 'HIGH';
          else if (score >= 2) icpRelevance = 'MEDIUM';
          
          // Content potential
          let contentPotential = 'Watch';
          if (score >= 2 && p.num_comments >= 5) contentPotential = 'Blog candidate';
          if (score >= 3) contentPotential = 'Strong blog candidate';
          
          newQuestions.push([
            today,                                    // Date Found
            `r/${subredditName}`,                     // Subreddit
            p.title.substring(0, 150),                // Post Title
            question.substring(0, 300),               // Question/Pain
            icpRelevance,                             // ICP Relevance
            `${p.score} upvotes, ${p.num_comments} comments`, // Engagement
            postDate,                                 // Post Date
            url,                                      // Post URL
            angle,                                    // thelaunch.space Angle
            contentPotential,                         // Content Potential
            'New',                                    // Status
            `Matches: ${matches.join(', ')}`          // Notes
          ]);
          
          existingUrls.add(url);
          totalFound++;
        }
      }
      
      await updateSubredditScanTime(sheets, subredditName);
      
      // Rate limiting - be nice to Reddit
      await new Promise(r => setTimeout(r, 1000));
      
    } catch (e) {
      console.log(`  Error scanning r/${subredditName}: ${e.message}`);
    }
  }
  
  if (newQuestions.length > 0) {
    await appendQuestions(sheets, newQuestions);
    console.log(`\nAdded ${newQuestions.length} new questions to sheet`);
  }
  
  console.log(`\nScan complete. Total new ICP-relevant posts: ${totalFound}`);
  return { found: totalFound, added: newQuestions.length };
}

// CLI interface
const args = process.argv.slice(2);
const command = args[0] || 'scan';

if (command === 'scan') {
  scan().then(result => {
    console.log(JSON.stringify(result));
  }).catch(e => {
    console.error('Scan failed:', e.message);
    process.exit(1);
  });
} else if (command === 'test') {
  // Test a single subreddit
  const sub = args[1] || 'entrepreneur';
  scan([{ name: sub }], 0.5).then(console.log).catch(console.error);
} else {
  console.log('Usage: node reddit-scanner.js [scan|test <subreddit>]');
}
