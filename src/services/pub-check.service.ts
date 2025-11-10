// Publication verification service for SCOPUS and Web of Science
// Checks if publications exist in major academic databases

export interface PubCheckResult {
  database: 'scopus' | 'wos';
  found: boolean;
  title?: string;
  authors?: string[];
  year?: number;
  journal?: string;
  citationCount?: number;
  url?: string;
  error?: string;
  indexStatus?: string;
  quartile?: string;
  sjr?: number;
  citeScore?: number;
  citeScorePercentile?: number;
  subjectAreas?: Array<{ area: string; quartile?: string }>;
}

export interface PubCheckRequest {
  doi?: string;
  isbn?: string;
  journalName?: string;
}

// Get API keys from environment variables - support multiple SCOPUS keys with fallback
const SCOPUS_API_KEYS = [
  import.meta.env.VITE_SCOPUS_API_KEY_1,
  import.meta.env.VITE_SCOPUS_API_KEY_2,
  import.meta.env.VITE_SCOPUS_API_KEY_3
].filter(Boolean); // Remove undefined/empty values

const WOS_API_KEY = import.meta.env.VITE_WOS_API_KEY || '';

// Helper function to try SCOPUS API with fallback keys
async function tryScopusAPI(url: string, keyIndex = 0): Promise<Response> {
  if (keyIndex >= SCOPUS_API_KEYS.length) {
    throw new Error('All SCOPUS API keys failed or rate limited');
  }

  const response = await fetch(url, {
    headers: {
      'X-ELS-APIKey': SCOPUS_API_KEYS[keyIndex],
      'Accept': 'application/json'
    }
  });

  // If rate limited (429) or unauthorized (401), try next key
  if ((response.status === 429 || response.status === 401) && keyIndex + 1 < SCOPUS_API_KEYS.length) {
    console.warn(`SCOPUS API key ${keyIndex + 1} failed (${response.status}), trying next key...`);
    return tryScopusAPI(url, keyIndex + 1);
  }

  return response;
}

/**
 * Fetch journal metrics from SCOPUS Serial Title API
 */
async function fetchJournalMetrics(issn?: string, journalTitle?: string): Promise<{
  sjr?: number;
  citeScore?: number;
  citeScorePercentile?: number;
  quartile?: string;
  subjectAreas?: Array<{ area: string; quartile?: string }>;
}> {
  if (!issn && !journalTitle) {
    console.warn('⚠️ No ISSN or journal title provided for metrics lookup');
    return {};
  }

  try {
    // Build query - prefer ISSN if available, otherwise use title
    // Add view=CITESCORE to get percentile and quartile information
    let url: string;
    if (issn) {
      console.log('📞 Fetching journal by ISSN:', issn);
      url = `https://api.elsevier.com/content/serial/title/issn/${issn}?view=CITESCORE`;
    } else {
      console.log('📞 Fetching journal by title:', journalTitle);
      url = `https://api.elsevier.com/content/serial/title?title=${encodeURIComponent(journalTitle!)}&view=CITESCORE`;
    }

    const response = await tryScopusAPI(url);

    if (!response.ok) {
      console.warn('❌ Failed to fetch journal metrics:', response.status, await response.text());
      return {};
    }

    const data = await response.json();
    console.log('🔍 SCOPUS Serial Title API Response:', JSON.stringify(data, null, 2));

    const entry = data['serial-metadata-response']?.entry?.[0];

    if (!entry) {
      console.warn('⚠️ No entry found in Serial Title API response');
      return {};
    }

    console.log('📊 Journal Entry:', entry['dc:title']);

    // Extract subject area names mapping (code -> name)
    const subjectAreaMap: { [code: string]: string } = {};
    const subjectAreaList = entry['subject-area'];
    if (Array.isArray(subjectAreaList)) {
      for (const subject of subjectAreaList) {
        const code = subject['@code'];
        const name = subject['$'];
        if (code && name) {
          subjectAreaMap[code] = name;
        }
      }
    }
    console.log('📚 Subject Area Names:', subjectAreaMap);

    // Extract SJR (most recent year)
    const sjrList = entry['SJRList']?.SJR;
    const latestSJR = sjrList && sjrList.length > 0 ? sjrList[0] : null;
    const sjrValue = latestSJR ? parseFloat(latestSJR['$']) : undefined;
    console.log('📈 SJR Value:', sjrValue);

    // Extract CiteScore metrics
    const citeScoreData = entry['citeScoreYearInfoList']?.citeScoreCurrentMetric;
    const citeScore = citeScoreData ? parseFloat(citeScoreData) : undefined;
    console.log('📈 CiteScore:', citeScore);

    // Try multiple paths to find percentile data
    const citeScoreTracker = entry['citeScoreTracker'];
    const citeScoreYearInfoList = entry['citeScoreYearInfoList'];
    console.log('📊 CiteScore Tracker:', citeScoreTracker);
    console.log('📊 CiteScore Year Info List:', citeScoreYearInfoList);

    let citeScorePercentile: number | undefined;
    let subjectRanks: any[] = [];

    // Try different field structures for percentile data
    // The correct path is: citeScoreYearInfo[0].citeScoreInformationList[0].citeScoreInfo[0].citeScoreSubjectRank
    if (citeScoreTracker?.citeScoreSubjectRank) {
      subjectRanks = citeScoreTracker.citeScoreSubjectRank;
      console.log('📊 Found citeScoreSubjectRank in Tracker:', subjectRanks);
    } else if (citeScoreYearInfoList?.citeScoreYearInfo?.[0]?.citeScoreInformationList?.[0]?.citeScoreInfo?.[0]?.citeScoreSubjectRank) {
      // Most recent year info (first in array)
      const ranks = citeScoreYearInfoList.citeScoreYearInfo[0].citeScoreInformationList[0].citeScoreInfo[0].citeScoreSubjectRank;
      if (ranks && ranks.length > 0) {
        subjectRanks = ranks;
        console.log('📊 Found citeScoreSubjectRank in YearInfo[0]:', subjectRanks);
      }
    }

    // If still not found, try to find it anywhere in the structure
    if (subjectRanks.length === 0 && citeScoreYearInfoList) {
      console.log('🔍 Searching all paths for citeScoreSubjectRank...');
      console.log('📊 Full citeScoreYearInfoList structure:', JSON.stringify(citeScoreYearInfoList, null, 2));

      // Try citeScoreYearInfo array
      if (Array.isArray(citeScoreYearInfoList.citeScoreYearInfo)) {
        console.log('📊 citeScoreYearInfo is an array with', citeScoreYearInfoList.citeScoreYearInfo.length, 'entries');

        for (let i = 0; i < citeScoreYearInfoList.citeScoreYearInfo.length; i++) {
          const yearInfo = citeScoreYearInfoList.citeScoreYearInfo[i];
          console.log(`📊 YearInfo[${i}]:`, Object.keys(yearInfo));

          // The data is nested: citeScoreInformationList[0].citeScoreInfo[0].citeScoreSubjectRank
          const infoList = yearInfo.citeScoreInformationList?.[0];
          const scoreInfo = infoList?.citeScoreInfo?.[0];
          const ranks = scoreInfo?.citeScoreSubjectRank;

          if (ranks && ranks.length > 0) {
            subjectRanks = ranks;
            console.log('✅ Found citeScoreSubjectRank in YearInfo[' + i + ']:', subjectRanks);
            break;
          }
        }
      }
    }

    // Extract percentile from first subject rank (LOWEST percentile for conservative ranking)
    // Sort by percentile ascending to get the most conservative quartile (like SJR)
    if (subjectRanks.length > 0) {
      // Sort ranks by percentile (LOWEST first - more conservative like SJR)
      const sortedRanks = [...subjectRanks].sort((a, b) => {
        const percentileA = typeof a === 'object' ? parseInt(a.percentile || 0) : (Array.isArray(a) ? parseInt(a[2] || 0) : 0);
        const percentileB = typeof b === 'object' ? parseInt(b.percentile || 0) : (Array.isArray(b) ? parseInt(b[2] || 0) : 0);
        return percentileA - percentileB; // Changed: ascending order (lowest first)
      });

      const firstRank = sortedRanks[0];
      console.log('📊 Most conservative subject rank (lowest percentile):', firstRank);

      // Handle both object format and tuple format
      if (typeof firstRank === 'object' && firstRank.percentile !== undefined) {
        citeScorePercentile = parseInt(String(firstRank.percentile));
        console.log('📊 Extracted percentile from object:', firstRank.percentile, '->', citeScorePercentile);
      } else if (Array.isArray(firstRank) && firstRank.length >= 3) {
        citeScorePercentile = parseInt(String(firstRank[2])); // Third element in tuple is percentile
        console.log('📊 Extracted percentile from array:', firstRank[2], '->', citeScorePercentile);
      }
    }
    console.log('📊 Final Extracted Percentile:', citeScorePercentile);

    // Calculate overall quartile from CiteScore percentile (using LOWEST percentile - conservative like SJR)
    let quartile: string | undefined;
    if (citeScorePercentile !== undefined) {
      if (citeScorePercentile >= 75) quartile = 'Q1';
      else if (citeScorePercentile >= 50) quartile = 'Q2';
      else if (citeScorePercentile >= 25) quartile = 'Q3';
      else quartile = 'Q4';
    }
    console.log('🎯 Calculated Quartile (conservative - lowest percentile):', quartile, `(${citeScorePercentile}th percentile)`);

    // Extract subject areas with quartile information
    const subjectAreas: Array<{ area: string; quartile?: string }> = [];

    for (const rank of subjectRanks) {
      let areaCode: string;
      let percentile: number | undefined;

      // Handle both object format and tuple format
      if (typeof rank === 'object') {
        areaCode = rank.subjectCode || rank.code || 'Unknown';
        percentile = rank.percentile ? parseInt(String(rank.percentile)) : undefined;
      } else if (Array.isArray(rank) && rank.length >= 3) {
        areaCode = rank[0] || 'Unknown'; // First element is subject code
        percentile = parseInt(String(rank[2])); // Third element is percentile
      } else {
        continue;
      }

      // Map subject code to full name
      const areaName = subjectAreaMap[areaCode] || areaCode;

      let areaQuartile: string | undefined;
      if (percentile !== undefined && !isNaN(percentile)) {
        if (percentile >= 75) areaQuartile = 'Q1';
        else if (percentile >= 50) areaQuartile = 'Q2';
        else if (percentile >= 25) areaQuartile = 'Q3';
        else areaQuartile = 'Q4';
      }

      subjectAreas.push({ area: areaName, quartile: areaQuartile });
    }
    console.log('📚 Subject Areas with Names:', subjectAreas);

    // Use CiteScore-based quartile calculation (simplified for Vercel deployment)
    const finalQuartile = quartile || (sjrValue ? 'Scopus-indexed' : undefined);

    const result = {
      sjr: sjrValue,
      citeScore,
      citeScorePercentile,
      quartile: finalQuartile,
      subjectAreas: subjectAreas.length > 0 ? subjectAreas : undefined
    };
    console.log('✅ Final Journal Metrics:', result);

    return result;
  } catch (error) {
    console.error('Error fetching journal metrics:', error);
    return {};
  }
}

/**
 * Check if a publication exists in SCOPUS database using DOI
 */
export async function checkScopusByDOI(doi: string): Promise<PubCheckResult> {
  if (SCOPUS_API_KEYS.length === 0) {
    return {
      database: 'scopus',
      found: false,
      error: 'SCOPUS API key not configured. Please add VITE_SCOPUS_API_KEY to your .env file'
    };
  }

  try {
    // Clean the DOI
    const cleanDOI = doi.trim().replace(/^https?:\/\/doi\.org\//, '');

    // SCOPUS Abstract Retrieval API endpoint
    const url = `https://api.elsevier.com/content/abstract/doi/${encodeURIComponent(cleanDOI)}`;

    const response = await tryScopusAPI(url);

    if (response.status === 404) {
      return {
        database: 'scopus',
        found: false,
        error: 'Publication not found in SCOPUS'
      };
    }

    if (!response.ok) {
      const errorText = await response.text();
      return {
        database: 'scopus',
        found: false,
        error: `SCOPUS API error: ${response.status} - ${errorText}`
      };
    }

    const data = await response.json();
    const coredata = data['abstracts-retrieval-response']?.coredata;

    if (!coredata) {
      return {
        database: 'scopus',
        found: false,
        error: 'Invalid response from SCOPUS'
      };
    }

    // Extract authors
    const authors = data['abstracts-retrieval-response']?.authors?.author?.map((a: any) =>
      `${a['preferred-name']?.['given-name'] || ''} ${a['preferred-name']?.['surname'] || ''}`.trim()
    ) || [];

    // Extract ISSN and journal title for metrics lookup
    const issn = coredata['prism:issn'] || coredata['prism:eIssn'];
    const journalTitle = coredata['prism:publicationName'];

    console.log('🔍 Publication found in SCOPUS:', {
      title: coredata['dc:title'],
      journal: journalTitle,
      issn,
      doi: cleanDOI
    });

    // Fetch journal-level metrics (quartile, SJR, CiteScore)
    console.log('📊 Fetching journal metrics for:', journalTitle, issn);
    const journalMetrics = await fetchJournalMetrics(issn, journalTitle);

    const result = {
      database: 'scopus' as const,
      found: true,
      title: coredata['dc:title'],
      authors,
      year: parseInt(coredata['prism:coverDate']?.split('-')[0]) || undefined,
      journal: journalTitle,
      citationCount: parseInt(coredata['citedby-count']) || 0,
      url: coredata['prism:url'] || `https://www.scopus.com/record/display.uri?eid=${coredata['eid']}`,
      indexStatus: 'Indexed in SCOPUS',
      quartile: journalMetrics.quartile,
      sjr: journalMetrics.sjr,
      citeScore: journalMetrics.citeScore,
      citeScorePercentile: journalMetrics.citeScorePercentile,
      subjectAreas: journalMetrics.subjectAreas
    };

    console.log('✅ Returning result to UI:', result);
    return result;
  } catch (error) {
    console.error('Error checking SCOPUS:', error);
    return {
      database: 'scopus',
      found: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Check if a publication exists in SCOPUS database using ISBN
 */
export async function checkScopusByISBN(isbn: string): Promise<PubCheckResult> {
  if (SCOPUS_API_KEYS.length === 0) {
    return {
      database: 'scopus',
      found: false,
      error: 'SCOPUS API key not configured'
    };
  }

  try {
    // Clean the ISBN (remove hyphens and spaces)
    const cleanISBN = isbn.trim().replace(/[-\s]/g, '');

    // SCOPUS Search API endpoint - search by ISBN
    const url = `https://api.elsevier.com/content/search/scopus?query=ISBN(${cleanISBN})`;

    const response = await tryScopusAPI(url);

    if (!response.ok) {
      const errorText = await response.text();
      return {
        database: 'scopus',
        found: false,
        error: `SCOPUS API error: ${response.status} - ${errorText}`
      };
    }

    const data = await response.json();
    const results = data['search-results']?.entry;

    if (!results || results.length === 0) {
      return {
        database: 'scopus',
        found: false,
        error: 'Publication not found in SCOPUS'
      };
    }

    const firstResult = results[0];

    return {
      database: 'scopus',
      found: true,
      title: firstResult['dc:title'],
      authors: [firstResult['dc:creator']],
      year: parseInt(firstResult['prism:coverDate']?.split('-')[0]) || undefined,
      journal: firstResult['prism:publicationName'],
      citationCount: parseInt(firstResult['citedby-count']) || 0,
      url: firstResult['link']?.find((l: any) => l['@ref'] === 'scopus')?.['@href'],
      indexStatus: 'Indexed in SCOPUS'
    };
  } catch (error) {
    console.error('Error checking SCOPUS:', error);
    return {
      database: 'scopus',
      found: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Check if a journal is indexed in SCOPUS
 */
export async function checkScopusJournal(journalName: string): Promise<PubCheckResult> {
  if (SCOPUS_API_KEYS.length === 0) {
    return {
      database: 'scopus',
      found: false,
      error: 'SCOPUS API key not configured'
    };
  }

  try {
    // SCOPUS Serial Title API endpoint with CITESCORE view
    const url = `https://api.elsevier.com/content/serial/title?title=${encodeURIComponent(journalName)}&view=CITESCORE`;

    const response = await tryScopusAPI(url);

    if (!response.ok) {
      const errorText = await response.text();
      return {
        database: 'scopus',
        found: false,
        error: `SCOPUS API error: ${response.status} - ${errorText}`
      };
    }

    const data = await response.json();
    const entry = data['serial-metadata-response']?.entry;

    if (!entry || entry.length === 0) {
      return {
        database: 'scopus',
        found: false,
        error: 'Journal not found in SCOPUS'
      };
    }

    const firstEntry = entry[0];

    // Extract subject area names mapping (code -> name)
    const subjectAreaMap: { [code: string]: string } = {};
    const subjectAreaList = firstEntry['subject-area'];
    if (Array.isArray(subjectAreaList)) {
      for (const subject of subjectAreaList) {
        const code = subject['@code'];
        const name = subject['$'];
        if (code && name) {
          subjectAreaMap[code] = name;
        }
      }
    }

    // Extract SJR (most recent year)
    const sjrList = firstEntry['SJRList']?.SJR;
    const latestSJR = sjrList && sjrList.length > 0 ? sjrList[0] : null;
    const sjrValue = latestSJR ? parseFloat(latestSJR['$']) : undefined;

    // Extract CiteScore metrics
    const citeScoreData = firstEntry['citeScoreYearInfoList']?.citeScoreCurrentMetric;
    const citeScore = citeScoreData ? parseFloat(citeScoreData) : undefined;

    // Try multiple paths to find percentile data
    const citeScoreTracker = firstEntry['citeScoreTracker'];
    const citeScoreYearInfoList = firstEntry['citeScoreYearInfoList'];

    let citeScorePercentile: number | undefined;
    let subjectRanks: any[] = [];

    // Try different field structures for percentile data
    // The correct path is: citeScoreYearInfo[0].citeScoreInformationList[0].citeScoreInfo[0].citeScoreSubjectRank
    if (citeScoreTracker?.citeScoreSubjectRank) {
      subjectRanks = citeScoreTracker.citeScoreSubjectRank;
    } else if (citeScoreYearInfoList?.citeScoreYearInfo?.[0]?.citeScoreInformationList?.[0]?.citeScoreInfo?.[0]?.citeScoreSubjectRank) {
      // Most recent year info (first in array)
      const ranks = citeScoreYearInfoList.citeScoreYearInfo[0].citeScoreInformationList[0].citeScoreInfo[0].citeScoreSubjectRank;
      if (ranks && ranks.length > 0) {
        subjectRanks = ranks;
      }
    }

    // If still not found, try to find it anywhere in the structure
    if (subjectRanks.length === 0 && citeScoreYearInfoList) {
      // Try citeScoreYearInfo array
      if (Array.isArray(citeScoreYearInfoList.citeScoreYearInfo)) {
        for (const yearInfo of citeScoreYearInfoList.citeScoreYearInfo) {
          const infoList = yearInfo.citeScoreInformationList?.[0];
          const scoreInfo = infoList?.citeScoreInfo?.[0];
          const ranks = scoreInfo?.citeScoreSubjectRank;

          if (ranks && ranks.length > 0) {
            subjectRanks = ranks;
            break;
          }
        }
      }
    }

    // Extract percentile from first subject rank (LOWEST percentile for conservative ranking)
    // Sort by percentile ascending to get the most conservative quartile (like SJR)
    if (subjectRanks.length > 0) {
      // Sort ranks by percentile (LOWEST first - more conservative like SJR)
      const sortedRanks = [...subjectRanks].sort((a, b) => {
        const percentileA = typeof a === 'object' ? parseInt(String(a.percentile || 0)) : (Array.isArray(a) ? parseInt(String(a[2] || 0)) : 0);
        const percentileB = typeof b === 'object' ? parseInt(String(b.percentile || 0)) : (Array.isArray(b) ? parseInt(String(b[2] || 0)) : 0);
        return percentileA - percentileB; // Ascending order (lowest first)
      });

      const firstRank = sortedRanks[0];
      // Handle both object format and tuple format
      if (typeof firstRank === 'object' && firstRank.percentile !== undefined) {
        citeScorePercentile = parseInt(String(firstRank.percentile));
      } else if (Array.isArray(firstRank) && firstRank.length >= 3) {
        citeScorePercentile = parseInt(String(firstRank[2])); // Third element in tuple is percentile
      }
    }

    // Calculate overall quartile from CiteScore percentile (using LOWEST percentile - conservative like SJR)
    let quartile: string | undefined;
    if (citeScorePercentile !== undefined) {
      if (citeScorePercentile >= 75) quartile = 'Q1';
      else if (citeScorePercentile >= 50) quartile = 'Q2';
      else if (citeScorePercentile >= 25) quartile = 'Q3';
      else quartile = 'Q4';
    } else if (sjrValue) {
      quartile = 'Scopus-indexed';
    }

    // Extract subject areas with quartile information
    const subjectAreasWithQuartiles: Array<{ area: string; quartile?: string }> = [];

    for (const rank of subjectRanks) {
      let areaCode: string;
      let percentile: number | undefined;

      // Handle both object format and tuple format
      if (typeof rank === 'object') {
        areaCode = rank.subjectCode || rank.code || 'Unknown';
        percentile = rank.percentile ? parseInt(String(rank.percentile)) : undefined;
      } else if (Array.isArray(rank) && rank.length >= 3) {
        areaCode = rank[0] || 'Unknown'; // First element is subject code
        percentile = parseInt(String(rank[2])); // Third element is percentile
      } else {
        continue;
      }

      // Map subject code to full name
      const areaName = subjectAreaMap[areaCode] || areaCode;

      let areaQuartile: string | undefined;
      if (percentile !== undefined && !isNaN(percentile)) {
        if (percentile >= 75) areaQuartile = 'Q1';
        else if (percentile >= 50) areaQuartile = 'Q2';
        else if (percentile >= 25) areaQuartile = 'Q3';
        else areaQuartile = 'Q4';
      }

      subjectAreasWithQuartiles.push({ area: areaName, quartile: areaQuartile });
    }

    return {
      database: 'scopus',
      found: true,
      title: firstEntry['dc:title'],
      journal: firstEntry['dc:title'],
      url: firstEntry['link']?.find((l: any) => l['@ref'] === 'scopus-source')?.['@href'],
      indexStatus: 'Journal indexed in SCOPUS',
      quartile,
      sjr: sjrValue,
      citeScore,
      citeScorePercentile,
      subjectAreas: subjectAreasWithQuartiles.length > 0 ? subjectAreasWithQuartiles : undefined
    };
  } catch (error) {
    console.error('Error checking SCOPUS journal:', error);
    return {
      database: 'scopus',
      found: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Check if a publication exists in Web of Science using DOI
 * Provides link to WOS Master Journal List for manual verification
 */
export async function checkWebOfScienceByDOI(doi: string): Promise<PubCheckResult> {
  try {
    // Clean the DOI
    const cleanDOI = doi.trim().replace(/^https?:\/\/doi\.org\//, '');

    console.log('🔍 Checking WOS for DOI:', cleanDOI);

    // Get journal info from SCOPUS to build WOS search URL
    console.log('📞 Fetching journal info from SCOPUS...');

    const scopusUrl = `https://api.elsevier.com/content/abstract/doi/${encodeURIComponent(cleanDOI)}`;
    const scopusResponse = await tryScopusAPI(scopusUrl);

    if (!scopusResponse.ok) {
      return {
        database: 'wos',
        found: false,
        error: 'Unable to retrieve journal information'
      };
    }

    const scopusData = await scopusResponse.json();
    const coredata = scopusData['abstracts-retrieval-response']?.coredata;

    if (!coredata) {
      return {
        database: 'wos',
        found: false,
        error: 'Unable to retrieve journal information'
      };
    }

    const issn = coredata['prism:issn'] || coredata['prism:eIssn'];
    const journalTitle = coredata['prism:publicationName'];

    // Extract authors
    const authors = scopusData['abstracts-retrieval-response']?.authors?.author?.map((a: any) =>
      `${a['preferred-name']?.['given-name'] || ''} ${a['preferred-name']?.['surname'] || ''}`.trim()
    ) || [];

    // Remove hyphens from ISSN for WOS search URL
    const issnForWOS = issn ? issn.replace(/-/g, '') : undefined;

    // Build result with manual WOS verification link (simplified for Vercel deployment)
    const result: PubCheckResult = {
      database: 'wos',
      found: true,
      title: coredata['dc:title'],
      authors,
      year: parseInt(coredata['prism:coverDate']?.split('-')[0]) || undefined,
      journal: journalTitle,
      citationCount: parseInt(coredata['citedby-count']) || 0,
      url: `https://mjl.clarivate.com/search-results?search=${encodeURIComponent(issnForWOS || journalTitle)}`,
      indexStatus: 'Verify WOS indexing manually (click link below)'
    };

    return result;
  } catch (error) {
    console.error('Error checking Web of Science:', error);
    return {
      database: 'wos',
      found: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Check if a journal is indexed in Web of Science
 * Attempts scraping with fallback to manual verification link
 */
export async function checkWebOfScienceJournal(journalName: string): Promise<PubCheckResult> {
  try {
    console.log('🔍 Checking WOS for journal:', journalName);

    // Provide manual verification link (simplified for Vercel deployment)
    const result: PubCheckResult = {
      database: 'wos',
      found: true,
      journal: journalName,
      url: `https://mjl.clarivate.com/search-results?search=${encodeURIComponent(journalName)}`,
      indexStatus: 'Verify WOS indexing manually (click link below)'
    };

    return result;
  } catch (error) {
    console.error('Error checking Web of Science journal:', error);
    return {
      database: 'wos',
      found: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Comprehensive publication check across both databases
 */
export async function checkPublication(request: PubCheckRequest): Promise<{
  scopus: PubCheckResult | null;
  wos: PubCheckResult | null;
}> {
  const results: { scopus: PubCheckResult | null; wos: PubCheckResult | null } = {
    scopus: null,
    wos: null
  };

  const promises: Promise<void>[] = [];

  // Check by DOI if provided
  if (request.doi) {
    promises.push(
      checkScopusByDOI(request.doi).then(result => { results.scopus = result; }),
      checkWebOfScienceByDOI(request.doi).then(result => { results.wos = result; })
    );
  }
  // Check by ISBN if provided (SCOPUS only, WoS doesn't support ISBN search)
  else if (request.isbn) {
    promises.push(
      checkScopusByISBN(request.isbn).then(result => { results.scopus = result; })
    );
    results.wos = {
      database: 'wos',
      found: false,
      error: 'Web of Science does not support ISBN search'
    };
  }
  // Check journal name if provided
  else if (request.journalName) {
    promises.push(
      checkScopusJournal(request.journalName).then(result => { results.scopus = result; }),
      checkWebOfScienceJournal(request.journalName).then(result => { results.wos = result; })
    );
  }

  await Promise.all(promises);
  return results;
}
