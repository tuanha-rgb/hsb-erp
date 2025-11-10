// SCImago proxy server for fetching journal quartile data
// Avoids CORS issues when scraping scimagojr.com

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

/**
 * Fetch SJR quartile from SCImago website using Puppeteer
 * URL format: https://www.scimagojr.com/journalsearch.php?q={ISSN}&tip=issn
 */
app.get('/api/scimago/quartile', async (req, res) => {
  const { issn } = req.query;

  if (!issn) {
    return res.status(400).json({ error: 'ISSN parameter is required' });
  }

  let browser;
  try {
    console.log(`📞 Fetching SCImago data for ISSN: ${issn}`);

    const url = `https://www.scimagojr.com/journalsearch.php?q=${issn}&tip=issn`;

    // Use Puppeteer to handle JavaScript rendering
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    console.log('🌐 Loading SCImago search page...');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });

    // Wait for search results to load
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Click on the first journal result to go to detail page
    console.log('🖱️ Clicking on journal to load detail page...');
    try {
      await page.click('.jrnlname');
      // Wait for detail page to load
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log('✅ Detail page loaded');
    } catch (e) {
      console.warn('⚠️ Could not click journal link, proceeding anyway...');
    }

    console.log('📊 Extracting SCImago data...');

    const data = await page.evaluate(() => {
      // Extract journal title - try multiple selectors for detail page
      let journalTitle = '';

      // Try various selectors that might contain journal title on detail page
      const titleSelectors = [
        'h1',                           // Main heading on detail page
        '.journalname',                 // Alternative class name
        '.journal_title',               // Another possibility
        'div.description h2',          // Sometimes in description section
        '[class*="journal"][class*="title"]'  // Any class containing both words
      ];

      for (const selector of titleSelectors) {
        const elem = document.querySelector(selector);
        if (elem && elem.textContent.trim().length > 10) {
          journalTitle = elem.textContent.trim();
          break;
        }
      }

      // Extract SJR and Quartile from the page
      const bodyText = document.body.innerText;
      let sjrValue = null;
      let quartile = null;

      // Look for quartile first - search for Q1, Q2, Q3, Q4 patterns
      const quartileMatch = bodyText.match(/\b(Q[1-4])\b/);
      if (quartileMatch) {
        quartile = quartileMatch[1];
      }

      // Also check for "Best Quartile" section
      if (!quartile) {
        const bestQuartileMatch = bodyText.match(/Best Quartile[:\s]+(Q[1-4])/i);
        if (bestQuartileMatch) {
          quartile = bestQuartileMatch[1];
        }
      }

      // Look for SJR value - it appears as a decimal number before the quartile
      // Format is typically: "SJR 2024\n\n0.913 Q2"
      // So match a decimal number (0.xxx) that appears before the quartile
      if (quartile) {
        const sjrBeforeQuartileMatch = bodyText.match(new RegExp(`([0-9]+\\.[0-9]+)\\s+${quartile}`));
        if (sjrBeforeQuartileMatch) {
          sjrValue = sjrBeforeQuartileMatch[1];
        }
      }

      // Fallback: look for any decimal number after "SJR" but prefer ones starting with 0.
      if (!sjrValue) {
        const sjrFallbackMatch = bodyText.match(/SJR[^0-9]*([0-9]+\.[0-9]+)/i);
        if (sjrFallbackMatch && sjrFallbackMatch[1].startsWith('0.')) {
          sjrValue = sjrFallbackMatch[1];
        }
      }

      return {
        found: !!(journalTitle || sjrValue || quartile),
        journalTitle,
        sjrValue,
        quartile,
        bodySnippet: bodyText.substring(0, 1500) // Extended to see more content
      };
    });

    await browser.close();
    browser = null;

    // Always log body snippet for debugging
    console.log(`📄 Body snippet:`, data.bodySnippet);

    if (!data.found) {
      console.warn(`⚠️ No journal found for ISSN: ${issn}`);
      return res.json({
        found: false,
        error: 'Journal not found in SCImago'
      });
    }

    console.log(`✅ Found journal: ${data.journalTitle || 'Match found'}`);
    console.log(`📊 Extracted data - SJR: ${data.sjrValue}, Quartile: ${data.quartile}`);

    res.json({
      found: true,
      journal: data.journalTitle,
      sjr: data.sjrValue ? parseFloat(data.sjrValue) : null,
      quartile: data.quartile,
      source: 'SCImago',
      url: url
    });

  } catch (error) {
    console.error('❌ Error fetching SCImago data:', error);
    if (browser) {
      await browser.close();
    }
    res.status(500).json({
      error: error.message || 'Failed to fetch SCImago data'
    });
  }
});

/**
 * Fetch Web of Science Core Collection indexing from Master Journal List
 * URL format: https://mjl.clarivate.com/search-results
 * Searches by journal title or ISSN
 */
app.get('/api/wos/index', async (req, res) => {
  const { issn, journalName } = req.query;

  if (!issn && !journalName) {
    return res.status(400).json({ error: 'Either ISSN or journal name parameter is required' });
  }

  let browser;
  try {
    const searchTerm = issn || journalName;
    console.log(`📞 Fetching WOS data for: ${searchTerm}`);

    // Use Puppeteer to render JavaScript and scrape
    const pageUrl = `https://mjl.clarivate.com/search-results?search=${encodeURIComponent(searchTerm)}`;
    console.log(`🔗 Launching browser for URL: ${pageUrl}`);

    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log('🌐 Navigating to page...');
    await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 20000 });

    // Wait for search results to load
    console.log('⏳ Waiting for search results...');

    // Scroll page to trigger lazy loading
    await page.evaluate(() => window.scrollTo(0, 500));
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Wait for actual journal results (not just filters)
    try {
      await page.waitForFunction(
        () => {
          const text = document.body.innerText;
          // Look for indicators that results are loaded
          return (text.includes('Publisher:') && text.includes('ISSN / eISSN:')) ||
                 text.includes('Exact Match Found') ||
                 text.includes('Search Results\nFound');
        },
        { timeout: 15000 }
      );
      console.log('✅ Search results loaded');
    } catch (e) {
      console.warn('⚠️ Timeout waiting for results, proceeding anyway...');
    }

    // Extra wait for full render
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('📊 Extracting journal data...');

    // Extract journal title and indexes
    const data = await page.evaluate(() => {
      // Look for "Exact Match" section first
      let exactMatchSection = null;
      const allText = document.body.innerText;
      const lines = allText.split('\n');

      // Find the exact match block
      let exactMatchStart = -1;
      let exactMatchEnd = -1;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.includes('Exact Match Found') || line.includes('EXACT MATCH')) {
          exactMatchStart = i;
        }

        // The exact match section ends at "Search Results" or next journal
        if (exactMatchStart >= 0 && exactMatchStart < i) {
          if (line.includes('Search Results') || line.includes('Items per page')) {
            exactMatchEnd = i;
            break;
          }
        }
      }

      // Extract from exact match section if found
      let journalTitle = '';
      let indexes = [];

      if (exactMatchStart >= 0) {
        // Get text from exact match section
        const startIdx = exactMatchStart + 1; // Skip "Exact Match Found" line
        const endIdx = exactMatchEnd >= 0 ? exactMatchEnd : startIdx + 20;
        const exactMatchLines = lines.slice(startIdx, endIdx);

        // Find journal title (usually in UPPERCASE after "Exact Match Found")
        for (const line of exactMatchLines) {
          const trimmed = line.trim();
          if (trimmed.length > 15 && trimmed.toUpperCase() === trimmed &&
              !trimmed.includes('PUBLISHER') && !trimmed.includes('ISSN') &&
              !trimmed.includes('WEB OF SCIENCE') && !trimmed.includes('COLLECTION')) {
            journalTitle = trimmed;
            break;
          }
        }

        // Find the Web of Science Core Collection line and get the NEXT non-empty line
        let foundCoreCollection = false;
        for (const line of exactMatchLines) {
          const trimmed = line.trim();

          if (trimmed === 'Web of Science Core Collection:' || trimmed.includes('Web of Science Core Collection')) {
            foundCoreCollection = true;
            continue;
          }

          // If we found the Core Collection label, the next non-empty line is the index
          if (foundCoreCollection && trimmed.length > 0) {
            if (trimmed.includes('Science Citation Index Expanded')) indexes.push('SCIE');
            else if (trimmed.includes('Social Sciences Citation Index')) indexes.push('SSCI');
            else if (trimmed.includes('Arts & Humanities Citation Index')) indexes.push('AHCI');
            else if (trimmed.includes('Emerging Sources Citation Index')) indexes.push('ESCI');
            break; // Only get the first index after "Web of Science Core Collection:"
          }
        }

        return {
          journalTitle,
          indexes,
          exactMatchFound: true,
          bodySnippet: exactMatchLines.slice(0, 30).join('\n')
        };
      }

      // If no exact match, return not found
      return {
        journalTitle: '',
        indexes: [],
        exactMatchFound: false,
        bodySnippet: lines.slice(0, 50).join('\n')
      };
    });

    await browser.close();
    browser = null;

    console.log('📝 Extracted data:', data);

    if (!data.journalTitle && data.indexes.length === 0) {
      console.warn(`⚠️ No journal found in WOS MJL for: ${searchTerm}`);
      console.log('Body snippet:', data.bodySnippet);
      return res.json({
        found: false,
        error: 'Journal not found in Web of Science Master Journal List'
      });
    }

    // Remove duplicates
    const indexes = [...new Set(data.indexes)];

    console.log(`✅ Found journal: ${data.journalTitle || 'Match found'}`);
    console.log(`📊 Extracted indexes:`, indexes);

    res.json({
      found: true,
      journal: data.journalTitle || 'Journal found in WOS',
      indexes: indexes.length > 0 ? indexes : ['Indexed in WOS'],
      source: 'Web of Science',
      url: pageUrl
    });

  } catch (error) {
    console.error('❌ Error fetching WOS data:', error);
    if (browser) {
      await browser.close();
    }
    res.status(500).json({
      error: error.message || 'Failed to fetch WOS data'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'SCImago & WOS Proxy' });
});

app.listen(PORT, () => {
  console.log(`🚀 SCImago & WOS proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Endpoints:`);
  console.log(`   GET /api/scimago/quartile?issn={ISSN}`);
  console.log(`   GET /api/wos/index?issn={ISSN}`);
  console.log(`   GET /api/wos/index?journalName={NAME}`);
});
