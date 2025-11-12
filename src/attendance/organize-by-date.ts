// organize-by-date.ts
// Script to reorganize attendance_records in Firestore by date

import {
  collection,
  getDocs,
  doc,
  setDoc,
  writeBatch,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/firebase.config';

/**
 * OPTION 1: Reorganize in Firestore with date-based structure
 *
 * New structure:
 * attendance_by_date (collection)
 *   └─ 2025-01-11 (document)
 *       └─ records (subcollection)
 *           ├─ ATT-001 (document)
 *           └─ ATT-002 (document)
 */
export async function reorganizeByDate() {
  console.log('📋 Starting attendance records reorganization...\n');

  try {
    // Step 1: Read all records from attendance_records
    console.log('📖 Reading all records from attendance_records...');
    const recordsRef = collection(db, 'attendance_records');
    const snapshot = await getDocs(recordsRef);

    console.log(`✅ Found ${snapshot.docs.length} records\n`);

    // Step 2: Group by date
    const recordsByDate = new Map<string, any[]>();

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const date = data.date?.toDate() || new Date();
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

      if (!recordsByDate.has(dateKey)) {
        recordsByDate.set(dateKey, []);
      }

      recordsByDate.get(dateKey)!.push({
        id: doc.id,
        ...data
      });
    });

    console.log(`📅 Grouped into ${recordsByDate.size} unique dates\n`);

    // Step 3: Write to new structure
    console.log('💾 Writing to date-organized structure...\n');

    for (const [dateKey, records] of recordsByDate.entries()) {
      console.log(`  📆 ${dateKey}: ${records.length} records`);

      // Create date document
      const dateDocRef = doc(db, 'attendance_by_date', dateKey);
      await setDoc(dateDocRef, {
        date: dateKey,
        recordCount: records.length,
        createdAt: Timestamp.now()
      });

      // Batch write records to subcollection
      let batch = writeBatch(db);
      let batchCount = 0;

      for (const record of records) {
        const recordRef = doc(db, 'attendance_by_date', dateKey, 'records', record.id);
        batch.set(recordRef, record);
        batchCount++;

        // Firestore batch limit is 500
        if (batchCount === 500) {
          await batch.commit();
          batch = writeBatch(db);
          batchCount = 0;
        }
      }

      if (batchCount > 0) {
        await batch.commit();
      }
    }

    console.log('\n✅ Reorganization complete!\n');
    console.log('New structure: attendance_by_date/{date}/records/{recordId}');
    console.log('Old structure: attendance_records/{recordId} (still intact)\n');

    return {
      totalRecords: snapshot.docs.length,
      uniqueDates: recordsByDate.size,
      dateBreakdown: Array.from(recordsByDate.entries()).map(([date, records]) => ({
        date,
        count: records.length
      }))
    };

  } catch (error) {
    console.error('❌ Error reorganizing records:', error);
    throw error;
  }
}

/**
 * OPTION 2: Export to JSON files organized by date folders
 *
 * Creates structure:
 * attendance_exports/
 *   ├─ 2025-01-11/
 *   │   └─ records.json
 *   ├─ 2025-01-12/
 *   │   └─ records.json
 *   └─ summary.json
 */
export async function exportByDate() {
  console.log('📋 Starting attendance records export...\n');

  try {
    // Step 1: Read all records
    console.log('📖 Reading all records from attendance_records...');
    const recordsRef = collection(db, 'attendance_records');
    const snapshot = await getDocs(recordsRef);

    console.log(`✅ Found ${snapshot.docs.length} records\n`);

    // Step 2: Group by date
    const recordsByDate = new Map<string, any[]>();

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const date = data.date?.toDate() || new Date();
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

      if (!recordsByDate.has(dateKey)) {
        recordsByDate.set(dateKey, []);
      }

      // Convert Timestamps to ISO strings for JSON export
      const exportData = {
        id: doc.id,
        ...data,
        date: date.toISOString(),
        timestamp: data.timestamp?.toDate().toISOString() || null,
        createdAt: data.createdAt?.toDate().toISOString() || null,
        updatedAt: data.updatedAt?.toDate().toISOString() || null
      };

      recordsByDate.get(dateKey)!.push(exportData);
    });

    console.log(`📅 Grouped into ${recordsByDate.size} unique dates\n`);

    // Step 3: Create export data structure
    const exportData: Record<string, any> = {};
    const summary: any = {
      exportDate: new Date().toISOString(),
      totalRecords: snapshot.docs.length,
      uniqueDates: recordsByDate.size,
      dateBreakdown: []
    };

    recordsByDate.forEach((records, dateKey) => {
      exportData[dateKey] = {
        date: dateKey,
        recordCount: records.length,
        records: records
      };

      summary.dateBreakdown.push({
        date: dateKey,
        count: records.length,
        sources: {
          aiCamera: records.filter(r => r.source === 'ai-camera').length,
          manual: records.filter(r => r.source === 'manual').length,
          quiz: records.filter(r => r.source === 'quiz').length,
          assignment: records.filter(r => r.source === 'assignment').length
        },
        statuses: {
          present: records.filter(r => r.status === 'present').length,
          absent: records.filter(r => r.status === 'absent').length,
          late: records.filter(r => r.status === 'late').length,
          excused: records.filter(r => r.status === 'excused').length
        }
      });
    });

    console.log('📊 Export Summary:');
    console.log(`   Total Records: ${summary.totalRecords}`);
    console.log(`   Unique Dates: ${summary.uniqueDates}`);
    console.log(`   Date Range: ${summary.dateBreakdown[0]?.date} to ${summary.dateBreakdown[summary.dateBreakdown.length - 1]?.date}\n`);

    // Return data that can be saved to files
    return {
      summary,
      byDate: exportData,
      // Helper to get download blob
      downloadJSON: (filename: string, data: any) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }
    };

  } catch (error) {
    console.error('❌ Error exporting records:', error);
    throw error;
  }
}

/**
 * Get records for a specific date from the new structure
 */
export async function getRecordsByDate(dateString: string) {
  const recordsRef = collection(db, 'attendance_by_date', dateString, 'records');
  const snapshot = await getDocs(recordsRef);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date?.toDate() || new Date(),
    timestamp: doc.data().timestamp?.toDate() || new Date()
  }));
}

/**
 * Get summary of all dates with record counts
 */
export async function getDateSummary() {
  const datesRef = collection(db, 'attendance_by_date');
  const snapshot = await getDocs(datesRef);

  return snapshot.docs.map(doc => ({
    date: doc.id,
    recordCount: doc.data().recordCount || 0,
    createdAt: doc.data().createdAt?.toDate()
  })).sort((a, b) => b.date.localeCompare(a.date));
}
