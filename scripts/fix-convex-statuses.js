const https = require('https');
const fs = require('fs');

const API_KEY = fs.readFileSync('/home/node/openclaw/credentials/convex-api-key.txt', 'utf8').trim();
const BASE_URL = 'curious-iguana-738.convex.site';

// Map from sheet status to Convex status
const statusMap = {
  'Published': 'published',
  'Dropped': 'dropped',
  'Brief Ready': 'brief_ready',
  'Needs Revision': 'needs_revision',
  'Pending Review': 'pending_review',
  'Writing': 'writing',
  'PR Created': 'pr_created'
};

// Briefs from the sheet (title -> status)
// Converting titles to slugs (lowercase, hyphenated, truncated)
const briefs = [
  { title: 'How to Find a Technical Cofounder as a Non-Technical Founder', status: 'Published' },
  { title: 'How to Build an MVP Without Coding: The AI-First Playbook', status: 'Published' },
  { title: 'How to Validate a Startup Idea When You\'re Already a Domain Expert', status: 'Published' },
  { title: 'How Much Equity Should You Offer a Technical Co-Founder', status: 'Dropped' },
  { title: 'What Does an MVP Actually Cost in 2026', status: 'Needs Revision' },
  { title: 'Why Your Agency Wasted $30K on Your MVP', status: 'Published' },
  { title: 'Why You Can\'t Find a Technical Cofounder', status: 'Published' },
  { title: 'What Should an MVP Actually Cost in 2025', status: 'Needs Revision' },
  { title: 'When No-Code Tools Stop Working', status: 'Published' },
  { title: 'Should You Hire Developers or Build It Yourself with AI', status: 'Published' },
  { title: 'How to Validate Your Startup Idea in 7 Days', status: 'Needs Revision' },
  { title: 'Should You Hire an Agency or Build In-House', status: 'Published' },
  { title: 'Best AI Tools for Non-Technical Founders to Build MVPs', status: 'Published' },
  { title: 'The Post-MVP Doubt: Should You Keep Going or Quit', status: 'Published' },
  { title: 'Why Your MVP Costs Too Much', status: 'Published' },
  { title: 'Why Most Founders Fail at Distribution', status: 'Published' },
  { title: 'I Built My App With AI. Now What? - The Deployment Reality', status: 'Published' },
  { title: 'When Should You Automate Invoice Processing', status: 'Dropped' },
  { title: 'CRM for Service Businesses', status: 'Published' },
  { title: 'When to Stop Using Spreadsheets for Leads', status: 'Published' },
  { title: 'Are Landing Page Tests Dead', status: 'Published' },
  { title: 'How to Build an MVP Without Burning Money', status: 'Dropped' },
  { title: 'When to Rescue Your Stuck AI/No-Code Project', status: 'Dropped' },
  { title: 'How to Get Your First 100 Customers', status: 'Needs Revision' },
  { title: 'Invoice Automation for Small Businesses: When OCR Fails', status: 'Brief Ready' },
  { title: 'When You Have Outgrown SimplePractice', status: 'Dropped' },
  { title: 'Do Solo Lawyers Really Need Case Management Software', status: 'Brief Ready' },
  { title: 'When Vibe Coding Breaks at Scale: The 3-Flow Wall', status: 'Brief Ready' },
  { title: 'How to Handle Customer Feature Requests', status: 'Published' },
  { title: 'Why Your Landing Page Gets Zero Signups', status: 'Brief Ready' },
  { title: 'Why You Got Zero Signups After Launch', status: 'Brief Ready' },
  { title: 'I Validated the Problem. Why Won\'t Anyone Pay', status: 'Brief Ready' },
  { title: 'When to Leave Teachable/Kajabi for Custom', status: 'Brief Ready' },
  { title: 'Why Your First Sale Is Taking Forever', status: 'Brief Ready' },
  { title: 'Invoice Data Entry Automation for Small Businesses', status: 'Dropped' },
  { title: 'Why Your ChatGPT-Generated MVP Won\'t Deploy', status: 'Pending Review' },
  { title: 'Your Product is Built. Why Can\'t You Get Customers', status: 'Pending Review' },
  { title: 'Client Onboarding Is Your Agency\'s Real Bottleneck', status: 'Pending Review' },
  { title: 'Should I Hire a Developer or Use No-Code Tools', status: 'Pending Review' },
  { title: 'Custom Software vs Off-the-Shelf', status: 'Pending Review' },
  { title: 'You Launched Your MVP. Now No One Is Using It', status: 'Pending Review' }
];

function titleToSlug(title) {
  return title
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

async function updateStatus(slug, status) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ slug, status });
    const options = {
      hostname: BASE_URL,
      port: 443,
      path: '/updateBriefStatus',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ slug, result: JSON.parse(body) });
        } catch (e) {
          resolve({ slug, result: body });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  let updated = 0, notFound = 0, errors = 0;
  
  for (const brief of briefs) {
    const slug = titleToSlug(brief.title);
    const convexStatus = statusMap[brief.status];
    
    if (!convexStatus) {
      console.log(`⚠️ Unknown status: ${brief.status} for "${brief.title}"`);
      errors++;
      continue;
    }
    
    try {
      const { result } = await updateStatus(slug, convexStatus);
      if (result.success) {
        console.log(`✅ ${slug} → ${convexStatus}`);
        updated++;
      } else if (result.error === 'Brief not found') {
        console.log(`❌ Not found: ${slug}`);
        notFound++;
      } else {
        console.log(`⚠️ Error for ${slug}: ${JSON.stringify(result)}`);
        errors++;
      }
    } catch (e) {
      console.log(`❌ Request failed for ${slug}: ${e.message}`);
      errors++;
    }
    
    // Small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 100));
  }
  
  console.log(`\n📊 Summary: ${updated} updated, ${notFound} not found, ${errors} errors`);
}

main();
