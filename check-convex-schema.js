const https = require('https');
const fs = require('fs');

const API_KEY = fs.readFileSync('/home/node/openclaw/credentials/convex-api-key.txt', 'utf8').trim();

// Try to query existing questions to understand the schema
const options = {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${API_KEY}`
  }
};

// Try different potential endpoints
const endpoints = [
  'https://curious-iguana-738.convex.site/listQuestions',
  'https://curious-iguana-738.convex.site/getQuestions',
  'https://curious-iguana-738.convex.site/questions',
];

async function tryEndpoint(url) {
  return new Promise((resolve) => {
    const req = https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`\n${url}:`);
        console.log(`Status: ${res.statusCode}`);
        console.log(`Response: ${data.substring(0, 500)}`);
        resolve();
      });
    });
    req.on('error', (e) => {
      console.log(`\n${url}: ERROR - ${e.message}`);
      resolve();
    });
  });
}

async function main() {
  for (const endpoint of endpoints) {
    await tryEndpoint(endpoint);
  }
}

main();
