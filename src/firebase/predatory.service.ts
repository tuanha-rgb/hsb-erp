import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase.config';

export interface PredatoryCheckResult {
  isPredatory: boolean;
  matchedIn?: 'journal' | 'publisher' | 'both';
  journalMatch?: string;
  publisherMatch?: string;
}

/**
 * Check if a journal or publisher is in Beall's List (2025)
 * Uses case-insensitive matching
 */
export async function checkPredatory(
  journalName?: string,
  publisherName?: string
): Promise<PredatoryCheckResult> {
  const result: PredatoryCheckResult = {
    isPredatory: false
  };

  try {
    let journalFound = false;
    let publisherFound = false;
    let journalMatchName = '';
    let publisherMatchName = '';

    // Check journal
    if (journalName && journalName.trim()) {
      const journalQuery = query(
        collection(db, 'predatory_journals'),
        where('name_lowercase', '==', journalName.toLowerCase().trim())
      );
      const journalSnapshot = await getDocs(journalQuery);

      if (!journalSnapshot.empty) {
        journalFound = true;
        journalMatchName = journalSnapshot.docs[0].data().name;
      }
    }

    // Check publisher
    if (publisherName && publisherName.trim()) {
      const publisherQuery = query(
        collection(db, 'predatory_publishers'),
        where('name_lowercase', '==', publisherName.toLowerCase().trim())
      );
      const publisherSnapshot = await getDocs(publisherQuery);

      if (!publisherSnapshot.empty) {
        publisherFound = true;
        publisherMatchName = publisherSnapshot.docs[0].data().name;
      }
    }

    // Set result
    if (journalFound || publisherFound) {
      result.isPredatory = true;

      if (journalFound && publisherFound) {
        result.matchedIn = 'both';
        result.journalMatch = journalMatchName;
        result.publisherMatch = publisherMatchName;
      } else if (journalFound) {
        result.matchedIn = 'journal';
        result.journalMatch = journalMatchName;
      } else {
        result.matchedIn = 'publisher';
        result.publisherMatch = publisherMatchName;
      }
    }

  } catch (error) {
    console.error('Error checking predatory list:', error);
  }

  return result;
}
