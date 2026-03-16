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

// ICP pain signals - BUSINESS GROWTH FOCUSED (not building)
const ICP_KEYWORDS = [
  // Revenue/growth pain (Tier 1 - HIGHEST PRIORITY)
  'revenue plateau', 'stuck at', 'can\'t scale revenue', 'growth stalled',
  'can\'t get clients', 'need more clients', 'lead generation', 'finding customers',
  'marketing not working', 'ads not converting', 'customer acquisition',
  'need more pipeline', 'sales bottleneck', 'how to grow',
  
  // Operations blocking growth (Tier 2)
  'operations holding me back', 'manual processes', 'spending too much time on',
  'admin eating my time', 'can\'t take more clients', 'delivery bottleneck',
  'need to systematize', 'need better systems', 'process improvement',
  'workflow', 'automation', 'streamline',
  
  // Service business specific (Tier 3)
  'consulting business', 'coaching business', 'practice management',
  'professional services', 'solo practice', 'boutique firm',
  'retainer', 'client management', 'service delivery',
  'scaling services', 'leveraging my time', 'productize'
];

// Subreddits to scan - BUSINESS/GROWTH FOCUSED ONLY (Updated 2026-03-05)
const SUBREDDITS = [
  // Service business owners - OPERATIONS/REVENUE FOCUS (HIGHEST PRIORITY)
  { name: 'sweatystartup', category: 'Service Business', priority: 'HIGHEST' }, // 120k+ bootstrapped service biz, scaling/revenue
  { name: 'EntrepreneurRideAlong', category: 'Service Business', priority: 'HIGH' }, // 50k real journeys, revenue breakdowns
  { name: 'smallbusiness', category: 'Business Ops', priority: 'HIGH' },
  { name: 'consulting', category: 'Service Business', priority: 'HIGH' },
  
  // Marketing/Sales for service businesses (GROWTH FOCUSED)
  { name: 'marketing', category: 'Growth/Marketing', priority: 'HIGH' }, // 1.2M digital marketing for local services
  { name: 'sales', category: 'Growth/Sales', priority: 'HIGH' }, // 400k sales tactics for service biz
  { name: 'growthhacking', category: 'Growth/Marketing', priority: 'MEDIUM' }, // 200k low-budget hacks
  
  // General entrepreneurship (KEEP - business ops focus)
  { name: 'entrepreneur', category: 'Business Ops', priority: 'MEDIUM' },
  { name: 'Entrepreneur', category: 'Business Ops', priority: 'MEDIUM' },
  
  // Domain-specific practice owners (VERTICALS)
  { name: 'lawfirm', category: 'Legal Practice', priority: 'HIGH' },
  { name: 'lawyers', category: 'Legal Practice', priority: 'HIGH' },
  { name: 'solopractice', category: 'Legal Practice', priority: 'HIGH' }, // 15k solo attorneys - ops, bootstrapping (added 2026-03-16)
  { name: 'edtech', category: 'Education', priority: 'MEDIUM' },
  
  // REMOVED (2026-03-05): r/SaaS, r/indiehackers, r/nocode, r/cofounder, r/startups, r/HealthTech, r/healthcarestartups
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
  
  // Revenue/growth pain angles
  if (matches.some(m => m.includes('revenue') || m.includes('growth') || m.includes('stalled') || m.includes('plateau'))) {
    return 'Revenue plateau → operations/systems blocking scale';
  }
  if (matches.some(m => m.includes('clients') || m.includes('customers') || m.includes('lead') || m.includes('acquisition'))) {
    return 'Lead gen struggle → need better customer acquisition systems';
  }
  if (matches.some(m => m.includes('marketing') || m.includes('ads'))) {
    return 'Marketing bottleneck → need effective GTM strategy';
  }
  if (matches.some(m => m.includes('operations') || m.includes('manual') || m.includes('processes') || m.includes('time'))) {
    return 'Operations drag → manual work preventing growth';
  }
  if (matches.some(m => m.includes('scale') || m.includes('scaling') || m.includes('systematize'))) {
    return 'Scaling challenge → need systems to grow without hiring';
  }
  if (matches.some(m => m.includes('workflow') || m.includes('automation') || m.includes('streamline'))) {
    return 'Process inefficiency → automation opportunity';
  }
  
  // Service business specific
  if (text.includes('consulting') || text.includes('coaching') || text.includes('practice')) {
    return 'Service business operations → thelaunch.space as growth partner';
  }
  
  return 'Business growth opportunity - needs angle refinement';
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
