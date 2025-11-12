// Frontend API client for Zoho integration
// Direct API calls to Zoho Creator (no proxy server)

const ZOHO_CONFIG = {
  baseUrl: import.meta.env.VITE_ZOHO_BASE_URL || 'https://www.zohoapis.com',
  accountOwner: import.meta.env.VITE_ZOHO_ACCOUNT_OWNER || 'hsbvnu',
  appLinkName: import.meta.env.VITE_ZOHO_APP_LINK_NAME || 'hsbvnu',
  oauthToken: import.meta.env.VITE_ZOHO_OAUTH_TOKEN || '',
  studentsPublicKey: import.meta.env.VITE_ZOHO_STUDENTS_PUBLIC_KEY || '',
  lecturersPublicKey: import.meta.env.VITE_ZOHO_LECTURERS_PUBLIC_KEY || ''
};

export interface ZohoUser {
  // Standard fields
  ID?: string;
  Name?: string;
  Email?: string;
  Phone?: string;
  Role?: string;
  Department?: string;
  Status?: string;
  Last_Login?: string;
  Created_Time?: string;

  // Student Profile specific fields
  Student_Code?: string;
  Gender?: string;
  Date_of_Birth?: string;
  Program?: string;
  Cohort?: string;
  Group?: string;
  Image?: string;
  Program_Name_English?: string;
  Cohort_Begin?: string;
  Degree?: string;

  [key: string]: any;
}

export interface ZohoResponse<T> {
  data?: T;
  code?: number;
  message?: string;
}

export interface GetUsersOptions {
  type?: 'students' | 'lecturers';  // Which custom function to call
}

// ========== BULK READ API (Direct Zoho Calls) ==========

export interface BulkReadJob {
  job_id: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  report_link_name: string;
}

export interface BulkReadResult {
  data: ZohoUser[];
  totalRecords: number;
  recordCursor?: string;
}

/**
 * Initialize bulk read job
 */
export async function initBulkRead(reportLinkName: string): Promise<BulkReadJob> {
  try {
    if (!ZOHO_CONFIG.oauthToken) {
      throw new Error('OAuth token not configured. Set VITE_ZOHO_OAUTH_TOKEN in .env');
    }

    console.log('[Zoho API] Initializing bulk read for:', reportLinkName);

    const url = `${ZOHO_CONFIG.baseUrl}/creator/v2.1/bulk/${ZOHO_CONFIG.accountOwner}/${ZOHO_CONFIG.appLinkName}/report/${reportLinkName}/read`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${ZOHO_CONFIG.oauthToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Zoho API] Bulk read init error:', errorText);
      throw new Error(`Failed to initialize bulk read: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[Zoho API] Bulk read job created:', data.data?.job_id);

    return {
      job_id: data.data?.job_id,
      status: 'PENDING',
      report_link_name: reportLinkName
    };
  } catch (error: any) {
    console.error('[Zoho API] Error initializing bulk read:', error);
    throw error;
  }
}

/**
 * Check bulk read job status
 */
export async function checkBulkReadStatus(
  jobId: string,
  reportLinkName: string
): Promise<BulkReadJob> {
  try {
    if (!ZOHO_CONFIG.oauthToken) {
      throw new Error('OAuth token not configured');
    }

    const url = `${ZOHO_CONFIG.baseUrl}/creator/v2.1/bulk/${ZOHO_CONFIG.accountOwner}/${ZOHO_CONFIG.appLinkName}/report/${reportLinkName}/read/${jobId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Zoho-oauthtoken ${ZOHO_CONFIG.oauthToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to check status: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      job_id: jobId,
      status: data.data?.status || 'PENDING',
      report_link_name: reportLinkName
    };
  } catch (error: any) {
    console.error('[Zoho API] Error checking bulk read status:', error);
    throw error;
  }
}

/**
 * Download and parse bulk read result
 */
export async function downloadBulkReadResult(
  jobId: string,
  reportLinkName: string
): Promise<BulkReadResult> {
  try {
    if (!ZOHO_CONFIG.oauthToken) {
      throw new Error('OAuth token not configured');
    }

    console.log('[Zoho API] Downloading bulk read result:', jobId);

    const url = `${ZOHO_CONFIG.baseUrl}/creator/v2.1/bulk/${ZOHO_CONFIG.accountOwner}/${ZOHO_CONFIG.appLinkName}/report/${reportLinkName}/read/${jobId}/result`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Zoho-oauthtoken ${ZOHO_CONFIG.oauthToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to download result: ${response.statusText}`);
    }

    // Get ZIP file as blob
    const zipBlob = await response.blob();
    console.log('[Zoho API] Downloaded ZIP:', zipBlob.size, 'bytes');

    // Extract CSV from ZIP using JSZip
    const JSZip = (await import('jszip')).default;
    const zip = await JSZip.loadAsync(zipBlob);

    // Find CSV file in ZIP
    const csvFileName = Object.keys(zip.files).find(name => name.endsWith('.csv'));

    if (!csvFileName) {
      throw new Error('No CSV file found in ZIP');
    }

    // Extract CSV content
    const csvContent = await zip.files[csvFileName].async('string');
    console.log('[Zoho API] Extracted CSV:', csvContent.length, 'characters');

    // Parse CSV to JSON
    const records = parseCSV(csvContent);
    console.log('[Zoho API] Parsed records:', records.length);

    // Get record cursor from response headers if available
    const recordCursor = response.headers.get('record-cursor') || undefined;

    return {
      data: records,
      totalRecords: records.length,
      recordCursor
    };
  } catch (error: any) {
    console.error('[Zoho API] Error downloading bulk read result:', error);
    throw error;
  }
}

/**
 * Complete bulk read workflow (init + poll + download)
 */
export async function bulkReadUsers(
  reportLinkName: string,
  onProgress?: (status: string) => void
): Promise<ZohoUser[]> {
  try {
    // Step 1: Initialize
    onProgress?.('Initializing bulk read...');
    const job = await initBulkRead(reportLinkName);

    if (!job.job_id) {
      throw new Error('No job ID received');
    }

    // Step 2: Poll status
    const maxAttempts = 30;
    const pollInterval = 2000; // 2 seconds
    let attempts = 0;
    let jobStatus: BulkReadJob | null = null;

    while (attempts < maxAttempts) {
      attempts++;
      onProgress?.(`Checking status (${attempts}/${maxAttempts})...`);

      await new Promise(resolve => setTimeout(resolve, pollInterval));

      jobStatus = await checkBulkReadStatus(job.job_id, reportLinkName);

      console.log(`[Zoho API] Job status (${attempts}/${maxAttempts}):`, jobStatus.status);

      if (jobStatus.status === 'COMPLETED') {
        break;
      } else if (jobStatus.status === 'FAILED') {
        throw new Error('Bulk read job failed');
      }
    }

    if (jobStatus?.status !== 'COMPLETED') {
      throw new Error('Bulk read job did not complete in time');
    }

    // Step 3: Download result
    onProgress?.('Downloading results...');
    const result = await downloadBulkReadResult(job.job_id, reportLinkName);

    onProgress?.(`Complete! Fetched ${result.totalRecords} records`);
    return result.data;

  } catch (error: any) {
    console.error('[Zoho API] Bulk read workflow error:', error);
    throw error;
  }
}

/**
 * Helper: Parse CSV to JSON
 */
function parseCSV(csvContent: string): ZohoUser[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) {
    return [];
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const records: ZohoUser[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Handle CSV with quoted values
    const values: string[] = [];
    let currentValue = '';
    let insideQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];

      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim().replace(/^"|"$/g, ''));
        currentValue = '';
      } else {
        currentValue += char;
      }
    }

    // Push last value
    values.push(currentValue.trim().replace(/^"|"$/g, ''));

    // Create record
    const record: ZohoUser = {};
    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });

    records.push(record);
  }

  return records;
}

// ========== LEGACY CUSTOM FUNCTION API (Backward Compatibility) ==========

/**
 * Get all users from Zoho via custom function (uses public key authentication)
 */
export async function getZohoUsers(options?: GetUsersOptions): Promise<ZohoUser[]> {
  try {
    const { type = 'students' } = options || {};

    console.log('[Zoho API] Fetching users via custom function:', type);

    let customFunction: string;
    let publicKey: string;

    if (type === 'students') {
      customFunction = 'getAllStudents';
      publicKey = ZOHO_CONFIG.studentsPublicKey;
    } else {
      customFunction = 'getAllLecturers';
      publicKey = ZOHO_CONFIG.lecturersPublicKey;
    }

    if (!publicKey) {
      throw new Error(`Public key not configured for ${type}`);
    }

    const url = `${ZOHO_CONFIG.baseUrl}/creator/custom/${ZOHO_CONFIG.accountOwner}/${customFunction}?zc_PublicKey=${publicKey}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Zoho API] Error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: ZohoResponse<ZohoUser[]> = await response.json();
    console.log('[Zoho API] Users fetched successfully:', data.data?.length || 0);

    return data.data || [];
  } catch (error) {
    console.error('[Zoho API] Error fetching users:', error);
    throw error;
  }
}

/**
 * Check if Zoho configuration is valid
 */
export function checkZohoConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!ZOHO_CONFIG.baseUrl) errors.push('VITE_ZOHO_BASE_URL not set');
  if (!ZOHO_CONFIG.accountOwner) errors.push('VITE_ZOHO_ACCOUNT_OWNER not set');
  if (!ZOHO_CONFIG.appLinkName) errors.push('VITE_ZOHO_APP_LINK_NAME not set');
  if (!ZOHO_CONFIG.oauthToken) errors.push('VITE_ZOHO_OAUTH_TOKEN not set');

  return {
    isValid: errors.length === 0,
    errors
  };
}
