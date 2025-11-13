// blockUtils.ts
// Utility functions for determining block and session from timestamps

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

export type SemesterType = 'spring' | 'summer' | 'fall';
export type SessionType = 'M' | 'A' | 'E';

export interface BlockConfig {
  [semester: string]: {
    [blockNum: number]: {
      start: string;
      end: string;
    };
  };
}

// Memory cache for block config (avoids repeated Firebase calls)
let cachedBlockConfig: BlockConfig | null = null;
let lastCacheUpdate: number = 0;
const CACHE_TTL = 60000; // Cache for 1 minute

/**
 * Get session from timestamp hour
 * M (Morning): 7:00 AM - 11:45 AM
 * NOON BREAK: 11:46 AM - 1:15 PM (DEFAULT_COURSE)
 * A (Afternoon): 1:16 PM - 6:00 PM
 * E (Evening): 6:00 PM - 9:00 PM
 * Returns null for times outside defined ranges
 */
export function getSessionFromTimestamp(timestamp: Date): SessionType | null {
  const hour = timestamp.getHours();
  const minute = timestamp.getMinutes();

  // Morning: 7:00 AM - 11:45 AM
  if (hour >= 7 && (hour < 11 || (hour === 11 && minute <= 45))) {
    return 'M';
  }
  // Noon break: 11:46 AM - 1:15 PM (returns null for DEFAULT_COURSE)
  else if ((hour === 11 && minute >= 46) || hour === 12 || (hour === 13 && minute <= 15)) {
    return null;
  }
  // Afternoon: 1:16 PM - 6:00 PM
  else if ((hour === 13 && minute >= 16) || (hour > 13 && hour < 18)) {
    return 'A';
  }
  // Evening: 6:00 PM - 9:00 PM (hour 18-20)
  else if (hour >= 18 && hour < 21) {
    return 'E';
  }
  // Outside defined session times - no registration
  else {
    return null;
  }
}

/**
 * Load block configuration from Firebase with memory cache
 * Falls back to localStorage if Firebase is unavailable
 */
export async function loadBlockConfigFromFirebase(): Promise<BlockConfig> {
  try {
    // Check memory cache first (1 minute TTL)
    const now = Date.now();
    if (cachedBlockConfig && (now - lastCacheUpdate) < CACHE_TTL) {
      console.log('[BlockUtils] Using cached config');
      return cachedBlockConfig;
    }

    // Load from Firebase
    const configRef = doc(db, 'system_config', 'attendance_blocks');
    const configDoc = await getDoc(configRef);

    if (configDoc.exists()) {
      const firebaseConfig = configDoc.data().blockConfigs || {};
      console.log('[BlockUtils] Loaded config from Firebase:', firebaseConfig);

      // Update cache
      cachedBlockConfig = firebaseConfig;
      lastCacheUpdate = now;

      // Also save to localStorage as backup
      saveBlockConfigToLocalStorage(firebaseConfig);

      return firebaseConfig;
    } else {
      console.log('[BlockUtils] No Firebase config, checking localStorage...');
      // Fallback to localStorage
      const saved = localStorage.getItem('attendance_block_configs');
      if (saved) {
        const parsed = JSON.parse(saved);
        cachedBlockConfig = parsed;
        lastCacheUpdate = now;
        return parsed;
      }
    }
  } catch (err) {
    console.error('[BlockUtils] Failed to load from Firebase:', err);
    // Try localStorage as last resort
    try {
      const saved = localStorage.getItem('attendance_block_configs');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (localErr) {
      console.error('[BlockUtils] Failed to load from localStorage:', localErr);
    }
  }
  return {};
}

/**
 * Load block configuration from memory cache or localStorage (synchronous)
 * Use this for synchronous operations, but prefer loadBlockConfigFromFirebase when possible
 */
export function loadBlockConfig(): BlockConfig {
  // Try memory cache first
  if (cachedBlockConfig) {
    return cachedBlockConfig;
  }

  // Fall back to localStorage
  try {
    const saved = localStorage.getItem('attendance_block_configs');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Failed to load block config from localStorage:', err);
  }
  return {};
}

/**
 * Update the memory cache with new config
 * Call this after saving to Firebase to keep cache in sync
 */
export function updateBlockConfigCache(config: BlockConfig): void {
  cachedBlockConfig = config;
  lastCacheUpdate = Date.now();
  console.log('[BlockUtils] Updated memory cache');
}

/**
 * Save block configuration to localStorage (cache)
 */
export function saveBlockConfigToLocalStorage(config: BlockConfig): void {
  try {
    localStorage.setItem('attendance_block_configs', JSON.stringify(config));
    console.log('[BlockUtils] Saved to localStorage:', config);
  } catch (err) {
    console.error('Failed to save block config to localStorage:', err);
  }
}

/**
 * Get block and session information from a timestamp
 * Returns null if no matching block is found
 */
export function getBlockInfoFromTimestamp(timestamp: Date): {
  semester: SemesterType;
  block: number;
  session: SessionType;
  courseCode: string;
} | null {
  const config = loadBlockConfig();
  const dateStr = timestamp.toISOString().split('T')[0]; // YYYY-MM-DD

  console.log('[BlockUtils] Checking timestamp:', timestamp.toISOString());
  console.log('[BlockUtils] Date string:', dateStr);
  console.log('[BlockUtils] Loaded config:', JSON.stringify(config, null, 2));

  // Check each semester
  for (const semester of ['spring', 'summer', 'fall'] as SemesterType[]) {
    if (!config[semester]) {
      console.log(`[BlockUtils] No config for ${semester}`);
      continue;
    }

    const blocks = config[semester];

    // Check each block in this semester
    for (const blockNumStr of Object.keys(blocks)) {
      const blockNum = parseInt(blockNumStr);
      const blockDates = blocks[blockNum];

      console.log(`[BlockUtils] Checking ${semester} Block ${blockNum}: ${blockDates.start} to ${blockDates.end}`);

      if (dateStr >= blockDates.start && dateStr <= blockDates.end) {
        const session = getSessionFromTimestamp(timestamp);

        // If time is outside defined session ranges, don't assign a block
        if (!session) {
          console.log(`[BlockUtils] ✗ Time outside session ranges (${timestamp.getHours()}:${timestamp.getMinutes()})`);
          return null;
        }

        const courseCode = `Blk${blockNum}_${session}`;

        console.log(`[BlockUtils] ✓ MATCH! Returning:`, { semester, block: blockNum, session, courseCode });

        return {
          semester,
          block: blockNum,
          session,
          courseCode
        };
      }
    }
  }

  console.log('[BlockUtils] ✗ No matching block found for date:', dateStr);
  return null;
}

/**
 * Get course code for a timestamp (convenience function)
 * Returns 'DEFAULT_COURSE' if no block configuration matches
 */
export function getCourseCodeFromTimestamp(timestamp: Date): string {
  const blockInfo = getBlockInfoFromTimestamp(timestamp);
  return blockInfo ? blockInfo.courseCode : 'DEFAULT_COURSE';
}
