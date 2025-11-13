// blockUtils.ts
// Utility functions for determining block and session from timestamps

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
 * Load block configuration from localStorage
 */
export function loadBlockConfig(): BlockConfig {
  try {
    const saved = localStorage.getItem('attendance_block_configs');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Failed to load block config:', err);
  }
  return {};
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
