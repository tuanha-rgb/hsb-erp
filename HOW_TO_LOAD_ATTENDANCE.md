# How to Load All Student Attendance Records

## Quick Access

### Option 1: Direct URL (Easiest)

Just add `?tab=load-attendance` to your URL:

```
http://localhost:5173/?tab=load-attendance
```

Or in the browser console:
```javascript
window.location.href = '/?tab=load-attendance'
```

### Option 2: Set activeTab manually

In your browser console (F12), type:
```javascript
// Force navigate to attendance loader
window.location.hash = '';
window.location.search = '?tab=load-attendance';
window.location.reload();
```

### Option 3: Add to Navigation Menu

Edit `src/navigation.ts` and add:

```typescript
{
  label: "Load All Attendance",
  key: "load-attendance",
  icon: Download
}
```

## What You'll See

The AttendanceLoader component will:

1. **Automatically load** all attendance records from Firebase on mount
2. **Display stats:**
   - Total records
   - Unique students
   - AI detections count
   - Date range

3. **Two views:**
   - **All Records** - Table of all attendance entries (first 100 shown)
   - **By Student** - Grouped by student with summary stats

4. **Export options:**
   - Download as JSON
   - Download as CSV

## Configuration

You can load different amounts of data:

- 100 records (fastest)
- 500 records
- 1,000 records (default)
- 5,000 records
- 10,000 records

Use the dropdown in the top-right corner to select.

## Features

### Student Summary View

For each student, you'll see:
- Student ID and Name
- Total attendance records
- First seen date/time
- Last seen date/time
- Which cameras detected them
- Which courses they attended

### All Records View

Shows chronological table with:
- Timestamp
- Student ID
- Student Name
- Course ID
- Status (present/absent/late)
- Source (ai-camera/manual/quiz)
- Camera ID
- Confidence score

## Export Data

Click **JSON** or **CSV** buttons to download:

**JSON Export includes:**
```json
{
  "exportDate": "2025-01-12T...",
  "totalRecords": 1234,
  "totalStudents": 56,
  "records": [...],
  "students": [...]
}
```

**CSV Export includes:**
```
Record ID,Student ID,Student Name,Course ID,Date,Time,Status,Source,Camera,Confidence
ATT_123,25080425,PHAM HOANG VIET,DEFAULT_COURSE,1/12/2025,9:32:54 AM,present,ai-camera,450820011,100%
...
```

## Troubleshooting

### "No records found"
- Check Firebase Console → Firestore → `attendance_records` collection
- Verify you have records in the collection
- Check Firebase authentication (you must be logged in)

### "Permission denied"
Update Firestore rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /attendance_records/{record} {
      allow read: if request.auth != null;
    }
  }
}
```

### Component doesn't load
Make sure you've run:
```bash
npm run dev
```

And the file exists:
```
src/attendance/AttendanceLoader.tsx
```

## Next Steps

Once loaded, you can:

1. **Organize by date** - Use the AttendanceOrganizer component
2. **View live feed** - Switch to AttendanceLive component
3. **Export for analysis** - Use the CSV/JSON export
4. **Match with courses** - You mentioned needing to match classes later

## Technical Details

The component:
- Queries `attendance_records` collection in Firestore
- Orders by `timestamp` descending (newest first)
- Limits to selected max records (default 1000)
- Groups data by student ID
- Calculates summary statistics
- Provides export functionality

No data is modified - this is read-only!
