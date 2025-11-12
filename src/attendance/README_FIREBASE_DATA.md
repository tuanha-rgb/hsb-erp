# Using Real Firebase Attendance Data

This guide explains how to use **real attendance data from Firebase** instead of mock/generated data in your components.

## Overview

Your Firebase `attendance_records` collection is already receiving real data from ANSVIS AI cameras. This guide shows you how to retrieve and use that data.

## Quick Start

### Option 1: Use the React Hook (Recommended)

```tsx
import { useAttendanceData } from './attendance/useAttendanceData';
import { sampleStudents } from './student/studentdata';
import { courseData } from './acad/courses';

function MyComponent() {
  const { records, students, courses, cameras, alerts, loading, refresh } = useAttendanceData({
    startDate: new Date('2025-01-01'),
    endDate: new Date(),
    studentData: sampleStudents,
    courseData: courseData
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Total Records: {records.length}</h2>
      <h3>Students Tracked: {students.length}</h3>
      <button onClick={refresh}>Refresh Data</button>
    </div>
  );
}
```

### Option 2: Use Service Functions Directly

```tsx
import {
  getAllAttendanceRecords,
  getAllStudentStats,
  getAllCourseStats
} from './attendance/attendance_firebase_service';

async function loadData() {
  // Get all attendance records
  const records = await getAllAttendanceRecords();

  // Get student stats (calculated from real records)
  const studentStats = await getAllStudentStats(sampleStudents);

  // Get course stats (calculated from real records)
  const courseStats = await getAllCourseStats(courseData);
}
```

## Available Functions

### `getAllAttendanceRecords(startDate?, endDate?)`
Retrieves all attendance records from Firebase.

```tsx
// Get all records
const allRecords = await getAllAttendanceRecords();

// Get records from last 30 days
const startDate = new Date();
startDate.setDate(startDate.getDate() - 30);
const recentRecords = await getAllAttendanceRecords(startDate);
```

**Returns:** `AttendanceRecord[]`

Each record contains:
- `id` - Unique record ID
- `studentId` - Student identifier
- `courseId` - Course identifier
- `date` - Date of attendance
- `timestamp` - Exact time of detection
- `status` - 'present' | 'absent' | 'late' | 'excused'
- `source` - 'ai-camera' | 'manual' | 'quiz' | 'assignment'
- `cameraId` - Camera that detected (if source is 'ai-camera')
- `confidence` - AI confidence score (0-1)
- `lecturerVerified` - Whether lecturer confirmed

### `getAllStudentStats(studentData, startDate?, endDate?)`
Calculates attendance statistics for all students based on real Firebase records.

```tsx
const stats = await getAllStudentStats(sampleStudents);

// Each stat includes:
// - attendanceRate (0-100%)
// - totalSessions, attended, late, absent, excused
// - trend ('improving' | 'declining' | 'stable')
// - atRisk (boolean)
// - eligibleForExam (boolean)
// - quizBonus (0-10 bonus points)
```

**Parameters:**
- `studentData` - Array of students with `{ id, name, program, level, year }`
- `startDate`, `endDate` - Optional date range filter

**Returns:** `StudentAttendanceStats[]`

### `getAllCourseStats(courseData, startDate?, endDate?)`
Calculates attendance statistics for all courses.

```tsx
const stats = await getAllCourseStats(courseData);

// Each stat includes:
// - averageAttendance (0-100%)
// - sessionsHeld (number of unique dates)
// - atRiskStudents (count)
// - trend ('up' | 'down' | 'stable')
```

**Returns:** `CourseAttendance[]`

### `getAllCameras()`
Gets all registered AI cameras with status.

```tsx
const cameras = await getAllCameras();

// Each camera includes:
// - id, location
// - status ('online' | 'offline' | 'maintenance')
// - lastSync (Date)
// - sessionsToday (number)
// - accuracy (percentage)
```

### `getAllAlerts(limit?)`
Gets all attendance alerts from Firebase.

```tsx
const alerts = await getAllAlerts(50); // Get 50 most recent alerts

// Each alert includes:
// - type ('below-threshold' | 'declining-trend' | 'exam-ineligible')
// - severity ('critical' | 'warning' | 'info')
// - message (human-readable)
// - acknowledged (boolean)
```

### `generateAndSaveAlerts(studentStats)`
Generates new alerts for at-risk students and saves to Firebase.

```tsx
const studentStats = await getAllStudentStats(sampleStudents);
const newAlerts = await generateAndSaveAlerts(studentStats);

console.log(`Generated ${newAlerts.length} new alerts`);
```

## React Hooks

### `useAttendanceData(options)`
Main hook that loads all attendance data.

```tsx
const {
  records,    // All attendance records
  students,   // Student stats
  courses,    // Course stats
  alerts,     // All alerts
  cameras,    // Camera status
  loading,    // Loading state
  error,      // Error message if any
  refresh     // Function to reload data
} = useAttendanceData({
  startDate: new Date('2025-01-01'),
  endDate: new Date(),
  studentData: sampleStudents,
  courseData: courseData,
  autoLoad: true  // Auto-load on mount (default: true)
});
```

### `useStudentAttendanceStats(studentData, startDate?, endDate?)`
Hook for loading only student statistics.

```tsx
const { stats, loading, error, refresh } = useStudentAttendanceStats(
  sampleStudents,
  new Date('2025-01-01')
);
```

### `useCourseAttendanceStats(courseData, startDate?, endDate?)`
Hook for loading only course statistics.

```tsx
const { stats, loading, error, refresh } = useCourseAttendanceStats(
  courseData,
  new Date('2025-01-01')
);
```

## Example Components

### Full Attendance Dashboard

See `src/attendance/AttendanceOverview.tsx` for a complete example that:
- Loads real Firebase data
- Shows summary statistics
- Displays recent records
- Lists top performers and at-risk students
- Includes refresh button and date range filter

### Live Attendance Monitor

See `src/attendance/attendanceLive.tsx` - already using real Firebase data with:
- Real-time updates via `subscribeToLiveAttendance()`
- Live feed tab showing current session
- Camera status monitoring
- Alert notifications

## Migrating from Mock Data

### Before (Using Mock Data)
```tsx
import { initializeAttendanceData } from './attendance/attendancemodel';

function MyComponent() {
  const [data] = useState(() => initializeAttendanceData());
  // Uses generated/fake data
}
```

### After (Using Real Firebase Data)
```tsx
import { useAttendanceData } from './attendance/useAttendanceData';
import { sampleStudents } from './student/studentdata';
import { courseData } from './acad/courses';

function MyComponent() {
  const { records, students, courses, loading } = useAttendanceData({
    studentData: sampleStudents,
    courseData: courseData
  });
  // Uses real data from Firebase
}
```

## Data Flow Architecture

```
ANSVIS Camera
    ↓
Webhook POST → attendance-webhook.js (Express server)
    ↓
Firebase Admin SDK → Firestore
    ↓
Collection: attendance_records
    ↓
React App ← Firebase Client SDK ← useAttendanceData hook
    ↓
Your Components
```

## Common Patterns

### Get Today's Attendance
```tsx
const today = new Date();
today.setHours(0, 0, 0, 0);
const records = await getAllAttendanceRecords(today);
```

### Get This Week's Stats
```tsx
const weekAgo = new Date();
weekAgo.setDate(weekAgo.getDate() - 7);

const { students } = useAttendanceData({
  startDate: weekAgo,
  studentData: sampleStudents
});
```

### Filter At-Risk Students
```tsx
const { students } = useAttendanceData({ studentData: sampleStudents });
const atRisk = students.filter(s => s.atRisk);
```

### Get AI Camera Detections Only
```tsx
const records = await getAllAttendanceRecords();
const aiDetections = records.filter(r => r.source === 'ai-camera');
```

### Calculate Attendance Rate for One Student
```tsx
import { calculateLiveStats } from './attendance/attendance_firebase_service';

const studentStats = await calculateLiveStats('SV001');
console.log(`Attendance: ${studentStats.attendanceRate}%`);
```

## Performance Tips

1. **Use date filters** to limit data:
   ```tsx
   const { records } = useAttendanceData({
     startDate: new Date('2025-01-01'),
     endDate: new Date()
   });
   ```

2. **Cache results** with React Query (optional):
   ```tsx
   import { useQuery } from '@tanstack/react-query';

   const { data } = useQuery({
     queryKey: ['attendance', startDate, endDate],
     queryFn: () => getAllAttendanceRecords(startDate, endDate),
     staleTime: 5 * 60 * 1000 // 5 minutes
   });
   ```

3. **Use real-time listeners** for live data:
   ```tsx
   import { subscribeToLiveAttendance } from './attendance/attendance_firebase_service';

   useEffect(() => {
     const unsubscribe = subscribeToLiveAttendance(
       courseId,
       new Date(),
       (liveRecords) => {
         setRecords(liveRecords);
       }
     );
     return unsubscribe;
   }, [courseId]);
   ```

## Troubleshooting

### "No records found"
- Check Firebase Console → Firestore → `attendance_records` collection
- Verify webhook server is running: `npm run attendance`
- Check camera webhook configuration

### "Permission denied"
- Update Firestore rules to allow read access
- Ensure user is authenticated

### "Data is stale"
- Use the `refresh()` function from the hook
- Or implement real-time listeners with `subscribeToLiveAttendance()`

### "Stats don't match records"
- Ensure `studentData` and `courseData` are provided to the hook
- Check that student/course IDs in Firebase match your local data

## Next Steps

- See `AttendanceLive.tsx` for real-time monitoring
- See `AttendanceOverview.tsx` for dashboard example
- See `server/ATTENDANCE_WEBHOOK_SETUP.md` for webhook configuration
- Check Firebase Console to verify data is flowing
