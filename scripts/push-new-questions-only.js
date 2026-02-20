#!/usr/bin/env node
/**
 * Push only NEW questions to Convex (avoids duplicates)
 * Tracks last pushed date and only pushes questions added after that
 */

const fs = require('fs');
const { google } = require('googleapis');
const https = require('https');
const path = require('path');

const SHEET_ID = '1xmeU8Iu7f540yl4iPp0KaCxVSfwfA_pciE8o1-jKD2g';
const CREDENTIALS_PATH = '/home/node/openclaw/credentials/google-service-account.json';
const API_KEY_PATH = '/home/node/openclaw/credentials/convex-api-key.txt';
const TRACKER_PATH = '/home/node/openclaw/vibhishana/pushed-questions-tracker.json';
const CONVEX_URL = 'https://curious-iguana-738.convex.site/ingestQuestions';

function loadTracker() {
  if (!fs.existsSync(TRACKER_PATH)) {
    return {
      lastPushedDate: '1970-01-01',
      pushedBatches: [],
      totalPushed: 0,
      knownDuplicates: 0
    };
  }
  return JSON.parse(fs.readFileSync(TRACKER_PATH, 'utf8'));
}

function saveTracker(tracker) {
  fs.writeFileSync(TRACKER_PATH, JSON.stringify(tracker, null, 2));
}

async function main() {
  const tracker = loadTracker();
  console.log(`Last pushed date: ${tracker.lastPushedDate}`);
  
  // Fetch all questions from sheet
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  
  const sheets = google.sheets({ version: 'v4', auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'questions!A:L',
  });
  
  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    console.error('No data found in sheet');
    return;
  }
  
  // Filter for NEW questions only (after last pushed date)
  const newQuestions = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const dateFound = row[0];
    
    if (dateFound && dateFound > tracker.lastPushedDate) {
      newQuestions.push({
        title: row[2] || '',
        subreddit: row[1] || '',
        url: row[7] || '',
        questionPain: row[3] || '',
        icpRelevance: row[4] || 'MEDIUM',
        launchSpaceAngle: row[8] || '',
        contentPotential: row[9] || 'Watch',
        engagement: row[5] || '',
        notes: row[11] || '',
        postDate: row[6] || '',
        scannedAt: `${dateFound}T09:00:00Z`,
        status: row[10] || 'new',
        briefCreated: false,
        agentName: 'Vibhishana',
        batchId: `${dateFound}-morning`
      });
    }
  }
  
  if (newQuestions.length === 0) {
    console.log('✅ No new questions to push (all up to date)');
    return;
  }
  
  console.log(`Found ${newQuestions.length} NEW questions to push`);
  
  // Get the latest date from new questions
  const latestDate = Math.max(...newQuestions.map(q => q.batchId.split('-morning')[0]));
  
  // Push to Convex
  const apiKey = fs.readFileSync(API_KEY_PATH, 'utf8').trim();
  const payload = JSON.stringify(newQuestions);
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Content-Length': Buffer.byteLength(payload)
    }
  };
  
  await new Promise((resolve, reject) => {
    const req = https.request(CONVEX_URL, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`Response: ${res.statusCode} - ${data}`);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // Update tracker
          tracker.lastPushedDate = latestDate;
          tracker.pushedBatches.push({
            date: new Date().toISOString().split('T')[0],
            batchId: `${latestDate}-batch`,
            count: newQuestions.length,
            pushedAt: new Date().toISOString()
          });
          tracker.totalPushed += newQuestions.length;
          saveTracker(tracker);
          
          console.log(`✅ Pushed ${newQuestions.length} new questions`);
          console.log(`✅ Updated tracker: lastPushedDate = ${latestDate}`);
          resolve();
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

main().catch(console.error);
