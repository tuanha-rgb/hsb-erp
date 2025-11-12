// Zoho Creator API Proxy Server
// Handles CORS and authentication for Zoho Creator API calls

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const AdmZip = require('adm-zip');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration
const ZOHO_CONFIG = {
  baseUrl: process.env.ZOHO_BASE_URL || 'https://www.zohoapis.com',
  accountOwner: process.env.ZOHO_ACCOUNT_OWNER || 'hsbvnu',
  appLinkName: process.env.ZOHO_APP_LINK_NAME || 'hsbvnu',
  oauthToken: process.env.ZOHO_OAUTH_TOKEN || '',
  studentsPublicKey: process.env.VITE_ZOHO_STUDENTS_PUBLIC_KEY || '',
  lecturersPublicKey: process.env.VITE_ZOHO_LECTURERS_PUBLIC_KEY || ''
};

// Logging helper
function log(message, data = null) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

// ========== HEALTH CHECK ==========

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    config: {
      baseUrl: ZOHO_CONFIG.baseUrl,
      accountOwner: ZOHO_CONFIG.accountOwner,
      appLinkName: ZOHO_CONFIG.appLinkName,
      hasOAuthToken: !!ZOHO_CONFIG.oauthToken,
      hasStudentsKey: !!ZOHO_CONFIG.studentsPublicKey,
      hasLecturersKey: !!ZOHO_CONFIG.lecturersPublicKey
    }
  });
});

// ========== BULK READ API ==========

/**
 * Initialize bulk read job
 * POST /api/zoho/bulk/read/init
 */
app.post('/api/zoho/bulk/read/init', async (req, res) => {
  try {
    const { reportLinkName } = req.body;

    if (!reportLinkName) {
      return res.status(400).json({ error: 'reportLinkName is required' });
    }

    if (!ZOHO_CONFIG.oauthToken) {
      return res.status(500).json({ error: 'ZOHO_OAUTH_TOKEN not configured' });
    }

    log(`Initializing bulk read job for report: ${reportLinkName}`);

    const url = `${ZOHO_CONFIG.baseUrl}/creator/v2.1/bulk/${ZOHO_CONFIG.accountOwner}/${ZOHO_CONFIG.appLinkName}/report/${reportLinkName}/read`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${ZOHO_CONFIG.oauthToken}`,
        'Content-Type': 'application/json'
      }
    });

    const responseText = await response.text();
    log(`Zoho bulk read init response (${response.status}):`, responseText);

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Zoho API error: ${response.statusText}`,
        details: responseText
      });
    }

    const data = JSON.parse(responseText);
    res.json(data);

  } catch (error) {
    log('Error initializing bulk read:', error.message);
    res.status(500).json({
      error: 'Failed to initialize bulk read',
      details: error.message
    });
  }
});

/**
 * Check bulk read job status
 * GET /api/zoho/bulk/read/:jobId/status
 */
app.get('/api/zoho/bulk/read/:jobId/status', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { reportLinkName } = req.query;

    if (!reportLinkName) {
      return res.status(400).json({ error: 'reportLinkName query parameter is required' });
    }

    if (!ZOHO_CONFIG.oauthToken) {
      return res.status(500).json({ error: 'ZOHO_OAUTH_TOKEN not configured' });
    }

    log(`Checking bulk read job status: ${jobId}`);

    const url = `${ZOHO_CONFIG.baseUrl}/creator/v2.1/bulk/${ZOHO_CONFIG.accountOwner}/${ZOHO_CONFIG.appLinkName}/report/${reportLinkName}/read/${jobId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Zoho-oauthtoken ${ZOHO_CONFIG.oauthToken}`
      }
    });

    const responseText = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Zoho API error: ${response.statusText}`,
        details: responseText
      });
    }

    const data = JSON.parse(responseText);
    res.json(data);

  } catch (error) {
    log('Error checking bulk read status:', error.message);
    res.status(500).json({
      error: 'Failed to check bulk read status',
      details: error.message
    });
  }
});

/**
 * Download bulk read result (CSV in ZIP format)
 * GET /api/zoho/bulk/read/:jobId/result
 */
app.get('/api/zoho/bulk/read/:jobId/result', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { reportLinkName } = req.query;

    if (!reportLinkName) {
      return res.status(400).json({ error: 'reportLinkName query parameter is required' });
    }

    if (!ZOHO_CONFIG.oauthToken) {
      return res.status(500).json({ error: 'ZOHO_OAUTH_TOKEN not configured' });
    }

    log(`Downloading bulk read result: ${jobId}`);

    const url = `${ZOHO_CONFIG.baseUrl}/creator/v2.1/bulk/${ZOHO_CONFIG.accountOwner}/${ZOHO_CONFIG.appLinkName}/report/${reportLinkName}/read/${jobId}/result`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Zoho-oauthtoken ${ZOHO_CONFIG.oauthToken}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `Zoho API error: ${response.statusText}`,
        details: errorText
      });
    }

    // Get the ZIP file as buffer
    const zipBuffer = await response.buffer();
    log(`Received ZIP file: ${zipBuffer.length} bytes`);

    // Extract CSV from ZIP
    const zip = new AdmZip(zipBuffer);
    const zipEntries = zip.getEntries();

    if (zipEntries.length === 0) {
      return res.status(500).json({ error: 'ZIP file is empty' });
    }

    // Find the CSV file (usually the first entry)
    const csvEntry = zipEntries.find(entry => entry.entryName.endsWith('.csv'));

    if (!csvEntry) {
      return res.status(500).json({ error: 'No CSV file found in ZIP' });
    }

    // Extract CSV content
    const csvContent = csvEntry.getData().toString('utf8');
    log(`Extracted CSV: ${csvContent.length} characters`);

    // Parse CSV to JSON
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const records = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const record = {};
      headers.forEach((header, index) => {
        record[header] = values[index] || '';
      });
      records.push(record);
    }

    log(`Parsed ${records.length} records from CSV`);

    // Get record cursor from response headers if available
    const recordCursor = response.headers.get('record-cursor') || null;

    res.json({
      data: records,
      recordCursor,
      totalRecords: records.length
    });

  } catch (error) {
    log('Error downloading bulk read result:', error.message);
    res.status(500).json({
      error: 'Failed to download bulk read result',
      details: error.message
    });
  }
});

/**
 * Complete bulk read workflow (init + poll + download)
 * POST /api/zoho/bulk/read/complete
 */
app.post('/api/zoho/bulk/read/complete', async (req, res) => {
  try {
    const { reportLinkName } = req.body;

    if (!reportLinkName) {
      return res.status(400).json({ error: 'reportLinkName is required' });
    }

    log(`Starting complete bulk read workflow for: ${reportLinkName}`);

    // Step 1: Initialize bulk read job
    const initUrl = `${ZOHO_CONFIG.baseUrl}/creator/v2.1/bulk/${ZOHO_CONFIG.accountOwner}/${ZOHO_CONFIG.appLinkName}/report/${reportLinkName}/read`;

    const initResponse = await fetch(initUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${ZOHO_CONFIG.oauthToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!initResponse.ok) {
      const errorText = await initResponse.text();
      return res.status(initResponse.status).json({
        error: 'Failed to initialize bulk read',
        details: errorText
      });
    }

    const initData = await initResponse.json();
    const jobId = initData.data?.job_id;

    if (!jobId) {
      return res.status(500).json({ error: 'No job ID received from Zoho' });
    }

    log(`Bulk read job initialized: ${jobId}`);

    // Step 2: Poll job status until complete
    const maxAttempts = 30; // 30 attempts
    const pollInterval = 2000; // 2 seconds

    let attempts = 0;
    let jobComplete = false;
    let jobStatus = null;

    while (attempts < maxAttempts && !jobComplete) {
      attempts++;
      log(`Polling job status (attempt ${attempts}/${maxAttempts})...`);

      await new Promise(resolve => setTimeout(resolve, pollInterval));

      const statusUrl = `${ZOHO_CONFIG.baseUrl}/creator/v2.1/bulk/${ZOHO_CONFIG.accountOwner}/${ZOHO_CONFIG.appLinkName}/report/${reportLinkName}/read/${jobId}`;

      const statusResponse = await fetch(statusUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Zoho-oauthtoken ${ZOHO_CONFIG.oauthToken}`
        }
      });

      if (statusResponse.ok) {
        jobStatus = await statusResponse.json();
        const state = jobStatus.data?.status;

        log(`Job status: ${state}`);

        if (state === 'COMPLETED') {
          jobComplete = true;
        } else if (state === 'FAILED') {
          return res.status(500).json({
            error: 'Bulk read job failed',
            details: jobStatus
          });
        }
      }
    }

    if (!jobComplete) {
      return res.status(408).json({
        error: 'Bulk read job timeout',
        message: 'Job did not complete within expected time'
      });
    }

    // Step 3: Download result
    log('Downloading job result...');

    const resultUrl = `${ZOHO_CONFIG.baseUrl}/creator/v2.1/bulk/${ZOHO_CONFIG.accountOwner}/${ZOHO_CONFIG.appLinkName}/report/${reportLinkName}/read/${jobId}/result`;

    const resultResponse = await fetch(resultUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Zoho-oauthtoken ${ZOHO_CONFIG.oauthToken}`
      }
    });

    if (!resultResponse.ok) {
      const errorText = await resultResponse.text();
      return res.status(resultResponse.status).json({
        error: 'Failed to download result',
        details: errorText
      });
    }

    // Extract CSV from ZIP
    const zipBuffer = await resultResponse.buffer();
    const zip = new AdmZip(zipBuffer);
    const zipEntries = zip.getEntries();

    const csvEntry = zipEntries.find(entry => entry.entryName.endsWith('.csv'));

    if (!csvEntry) {
      return res.status(500).json({ error: 'No CSV file found in result' });
    }

    const csvContent = csvEntry.getData().toString('utf8');

    // Parse CSV to JSON
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const records = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const record = {};
      headers.forEach((header, index) => {
        record[header] = values[index] || '';
      });
      records.push(record);
    }

    log(`Successfully fetched ${records.length} records`);

    res.json({
      data: records,
      jobId,
      totalRecords: records.length
    });

  } catch (error) {
    log('Error in complete bulk read workflow:', error.message);
    res.status(500).json({
      error: 'Failed to complete bulk read workflow',
      details: error.message
    });
  }
});

// ========== CUSTOM FUNCTION API (Legacy - for backward compatibility) ==========

/**
 * Get users via custom Zoho Creator function (getAllStudents/getAllLecturers)
 * GET /api/zoho/users?type=students|lecturers
 */
app.get('/api/zoho/users', async (req, res) => {
  try {
    const { type = 'students' } = req.query;

    log(`Fetching ${type} via custom function...`);

    let customFunction, publicKey;

    if (type === 'students') {
      customFunction = 'getAllStudents';
      publicKey = ZOHO_CONFIG.studentsPublicKey;
    } else if (type === 'lecturers') {
      customFunction = 'getAllLecturers';
      publicKey = ZOHO_CONFIG.lecturersPublicKey;
    } else {
      return res.status(400).json({ error: 'Invalid type. Must be "students" or "lecturers"' });
    }

    if (!publicKey) {
      return res.status(500).json({ error: `Public key not configured for ${type}` });
    }

    const url = `${ZOHO_CONFIG.baseUrl}/creator/custom/${ZOHO_CONFIG.accountOwner}/${customFunction}?zc_PublicKey=${publicKey}`;

    log(`Calling Zoho: ${url.replace(publicKey, '***')}`);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const responseText = await response.text();

    if (!response.ok) {
      log(`Zoho API error (${response.status}):`, responseText);
      return res.status(response.status).json({
        error: `Zoho API error: ${response.statusText}`,
        details: responseText
      });
    }

    const data = JSON.parse(responseText);
    log(`Fetched ${data.data?.length || 0} ${type}`);

    res.json(data);

  } catch (error) {
    log('Error fetching users:', error.message);
    res.status(500).json({
      error: 'Failed to fetch users from Zoho',
      details: error.message
    });
  }
});

// ========== START SERVER ==========

app.listen(PORT, () => {
  log(`Zoho Proxy Server running on http://localhost:${PORT}`);
  log('Configuration:', {
    baseUrl: ZOHO_CONFIG.baseUrl,
    accountOwner: ZOHO_CONFIG.accountOwner,
    appLinkName: ZOHO_CONFIG.appLinkName,
    hasOAuthToken: !!ZOHO_CONFIG.oauthToken,
    hasStudentsKey: !!ZOHO_CONFIG.studentsPublicKey,
    hasLecturersKey: !!ZOHO_CONFIG.lecturersPublicKey
  });
});
