const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const SPREADSHEET_ID = '1xmeU8Iu7f540yl4iPp0KaCxVSfwfA_pciE8o1-jKD2g';
const CREDS_PATH = '/home/node/openclaw/credentials/google-service-account.json';

async function addStrategicTopics() {
  const creds = JSON.parse(fs.readFileSync(CREDS_PATH, 'utf8'));
  const auth = new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  // blog-queue columns: A=title, B=slug, C=primary_keyword, D-J=other fields, 
  // K=status, L-Q=more fields, R=source, S=cluster, T=notes
  const topics = [
    {
      title: 'Should I Hire a Technical Cofounder or Outsource Development?',
      keyword: 'technical cofounder vs outsourcing development',
      intentType: 'comparison',
      cluster: 'Finding & Working with Technical Cofounders',
      notes: 'Strategic topic - fills Cluster 1 gap (needs 3rd post for citation threshold). Decision-intent comparison: equity + time vs upfront cost. ICP query: should I give equity or pay agency?'
    },
    {
      title: 'Should I Build an MVP or Start with Consulting First?',
      keyword: 'mvp vs consulting services validation',
      intentType: 'comparison',
      cluster: 'Validation to First 100 Customers',
      notes: 'Strategic topic - fills Cluster 4 gap (needs 3rd post). Decision-intent: service-first validation vs product-first. ICP asks: can I validate without building? Classic bootstrapper dilemma.'
    },
    {
      title: 'When Should I Hire vs Automate? The Solo Founder Scaling Framework',
      keyword: 'when to hire vs automate startup',
      intentType: 'decision',
      cluster: 'Scaling Without Breaking',
      notes: 'Strategic topic - fills Cluster 5 gap (only 1 post). Decision-intent: operational scaling decision. Framework: calculate cost threshold, identify repeatable work, decide hire vs tool. Classic solo founder question.'
    },
    {
      title: 'Should I Rebuild My MVP or Live with Technical Debt?',
      keyword: 'rebuild mvp vs fix technical debt',
      intentType: 'decision',
      cluster: 'Scaling Without Breaking',
      notes: 'Strategic topic - fills Cluster 5 gap. Decision-intent: post-traction dilemma. ICP query: my MVP works but code is messy - rebuild or patch? Framework: revenue threshold, team size, customer impact.'
    }
  ];

  for (const topic of topics) {
    // Build row with proper column mapping:
    // A=title, C=keyword, K=status, R=source, S=cluster, T=notes
    // Fill other columns with empty strings
    const row = [
      topic.title,  // A
      '',           // B - slug (empty, will be generated)
      topic.keyword,// C - primary keyword
      '',           // D - secondary keywords
      topic.intentType, // E - intent type
      '',           // F-J - empty fields
      '',
      '',
      '',
      '',
      'Pending Review', // K - status
      '',           // L-Q - empty enrichment/metadata fields
      '',
      '',
      '',
      '',
      '',
      'vidura',     // R - source
      topic.cluster,// S - cluster
      topic.notes   // T - notes
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'blog-queue!A:T',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] },
    });
    
    console.log(`✅ Added: ${topic.title}`);
  }
  
  console.log(`\n✅ Successfully added 4 strategic topics to blog-queue`);
  console.log('   - All set to "Pending Review" for Krishna approval');
  console.log('   - All have cluster assignments in column S');
  console.log('   - Source: vidura');
}

addStrategicTopics().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
