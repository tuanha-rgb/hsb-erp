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
 * M (Morning): 7:00 AM - 1:00 PM
 * A (Afternoon): 1:00 PM - 6:00 PM
 * E (Evening): 6:00 PM - 9:00 PM
 */
export function getSessionFromTimestamp(timestamp: Date): SessionType {
  const hour = timestamp.getHours();

  if (hour >= 7 && hour < 13) {
    return 'M'; // Morning: 7:00 AM - 1:00 PM
  } else if (hour >= 13 && hour < 18) {
    return 'A'; // Afternoon: 1:00 PM - 6:00 PM
  } else {
    return 'E'; // Evening: 6:00 PM - 9:00 PM
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
