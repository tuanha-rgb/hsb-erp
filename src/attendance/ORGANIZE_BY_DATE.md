## Organizing Attendance Records by Date

Your attendance records are currently flat in the `attendance_records` collection. This tool helps organize them by date for better management.

## Quick Start

### Option 1: Use the UI Component

1. Add the organizer component to your navigation (ERPLayout.tsx):

```tsx
import AttendanceOrganizer from './attendance/AttendanceOrganizer';

// In your render/routing logic:
case 'organize-attendance':
  return <AttendanceOrganizer />;
```

2. Navigate to the organizer in your app
3. Click "Reorganize in Firestore" or "Export to JSON"

### Option 2: Run from Browser Console

```javascript
// Open your app in browser, then open Console (F12)

// Import the function
import { reorganizeByDate } from './attendance/organize-by-date';

// Run reorganization
reorganizeByDate().then(result => {
  console.log('Done!', result);
});
```

### Option 3: Create a Node.js Script

Create `server/organize-attendance.js`:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function reorganize() {
  const snapshot = await db.collection('attendance_records').get();
  console.log(`Found ${snapshot.docs.length} records`);

  const recordsByDate = new Map();

  snapshot.docs.forEach(doc => {
    const data = doc.data();
    const date = data.date.toDate();
    const dateKey = date.toISOString().split('T')[0];

    if (!recordsByDate.has(dateKey)) {
      recordsByDate.set(dateKey, []);
    }

    recordsByDate.get(dateKey).push({ id: doc.id, ...data });
  });

  console.log(`Grouped into ${recordsByDate.size} dates`);

  for (const [dateKey, records] of recordsByDate.entries()) {
    console.log(`Writing ${dateKey}: ${records.length} records`);

    const dateRef = db.collection('attendance_by_date').doc(dateKey);
    await dateRef.set({
      date: dateKey,
      recordCount: records.length,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    const batch = db.batch();
    records.forEach(record => {
      const recordRef = dateRef.collection('records').doc(record.id);
      batch.set(recordRef, record);
    });

    await batch.commit();
  }

  console.log('Done!');
  process.exit(0);
}

reorganize().catch(console.error);
```

Run it:
```bash
cd server
node organize-attendance.js
```

## What Happens

### Firestore Reorganization

**Before:**
```
attendance_records/
  ├─ ATT-001
  ├─ ATT-002
  ├─ ATT-003
  └─ ...
```

**After:**
```
attendance_by_date/
  ├─ 2025-01-11/
  │   ├─ recordCount: 45
  │   └─ records/
  │       ├─ ATT-001
  │       ├─ ATT-002
  │       └─ ...
  ├─ 2025-01-12/
  │   ├─ recordCount: 38
  │   └─ records/
  │       ├─ ATT-050
  │       └─ ...
  └─ ...
```

### JSON Export

Creates downloadable files:
- `attendance_summary.json` - Overview of all dates
- `attendance_2025-01-11.json` - Records for Jan 11
- `attendance_2025-01-12.json` - Records for Jan 12
- etc.

## Using Organized Data

After reorganization, query by date:

```typescript
import { getRecordsByDate, getDateSummary } from './attendance/organize-by-date';

// Get all records for a specific date
const records = await getRecordsByDate('2025-01-11');

// Get summary of all dates
const summary = await getDateSummary();
// Returns: [{ date: '2025-01-12', recordCount: 38 }, ...]
```

## Benefits

1. **Faster Queries** - Query specific date instead of entire collection
2. **Better Organization** - Clear date-based structure
3. **Easier Backups** - Export individual dates
4. **Scalability** - Reduces collection size per query
5. **Analytics** - Easier to analyze by date ranges

## Important Notes

- ✅ Original `attendance_records` collection is **NOT deleted**
- ✅ All data is **copied**, not moved
- ✅ You can delete the old collection after verifying
- ✅ Firestore has 500 document per batch limit (handled automatically)
- ⚠️ Re-running will overwrite existing organized data

## Troubleshooting

### "Permission denied"
Update Firestore rules:
```javascript
match /attendance_by_date/{date} {
  allow read, write: if request.auth != null;
  match /records/{record} {
    allow read, write: if request.auth != null;
  }
}
```

### "Out of memory"
If you have millions of records, process in batches:
```typescript
// Modify organize-by-date.ts to process in chunks
const snapshot = await getDocs(query(
  collection(db, 'attendance_records'),
  limit(10000)
));
```

### Verify Organization
```typescript
const summary = await getDateSummary();
console.log(summary);

const sampleRecords = await getRecordsByDate('2025-01-11');
console.log(`Sample: ${sampleRecords.length} records on 2025-01-11`);
```

## Next Steps

After organization, update your queries to use the new structure for faster performance:

```typescript
// Old way (slow for large datasets)
const allRecords = await getDocs(collection(db, 'attendance_records'));

// New way (fast)
const todayRecords = await getRecordsByDate('2025-01-12');
```
