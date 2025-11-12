# Quick Start: Student Enrollment Import

## 3-Step Process to Enable Attendance-Course Matching

### Step 1: Generate Template (1 minute)

Run this command to create a CSV file with all your active students:

```bash
npm run generate-enrollment
```

This creates `enrollment-template-2024-2025-1.csv` with your students:
```csv
studentId,semester,morningCourse,afternoonCourse,nightCourse
S001001,2024-2025-1,,,
S001002,2024-2025-1,,,
S001003,2024-2025-1,,,
... (all 200+ active students)
```

### Step 2: Fill in Courses (10-30 minutes)

Open the CSV file and add course IDs for each student:

**Example for Marine Engineering students:**
```csv
studentId,semester,morningCourse,afternoonCourse,nightCourse
S001040,2024-2025-1,MET101,MET102,MET103
S001041,2024-2025-1,MET301,,MET303
S001042,2024-2025-1,MET201,MET202,
```

**Rules:**
- Each student = ONE course per session (morning/afternoon/night)
- Leave blank if no class in that session
- Use your actual course IDs

### Step 3: Import & Match (2 minutes)

1. Open: http://localhost:5174/?tab=enrollment-importer
2. Copy/paste your completed CSV
3. Click "Preview Data" → verify it looks correct
4. Click "Import to Firebase" → wait for success
5. Click "Match All Attendance Records" → updates all existing attendance

**Done!** Your attendance records now show actual courses instead of "DEFAULT_COURSE"

---

## Session Times

| Session | Time Range | Example Classes |
|---------|------------|-----------------|
| Morning | 07:00 - 12:00 | First period classes |
| Afternoon | 12:00 - 17:30 | Mid-day classes |
| Night | 17:30 - 22:00 | Evening classes |

---

## Testing First? Use Sample Data

Want to test before using real data?

```bash
npm run generate-enrollment-sample
```

This creates `enrollment-sample-2024-2025-1.csv` with randomized course assignments for testing.

---

## Visual Guide

### Before Import:
```
Attendance Record:
  studentId: S001040
  timestamp: 2025-01-12 08:30
  courseId: "DEFAULT_COURSE"  ❌ Not useful!
```

### After Import + Match:
```
Attendance Record:
  studentId: S001040
  timestamp: 2025-01-12 08:30
  courseId: "MET101"  ✅ Correct course!

How it matched:
  1. Student S001040 detected at 08:30
  2. 08:30 = morning session (07:00-12:00)
  3. Lookup: S001040's morning course = MET101
  4. Update: courseId = "MET101"
```

---

## Your Actual Students (First 10)

Here are your first 10 active students to get started:

| Student ID | Name | Program | Level | Year |
|------------|------|---------|-------|------|
| S001001 | Nguyen Quang Binh | MNS | Master | 1 |
| S001002 | Hoang Khanh Binh | DMS | PhD | 1 |
| S001003 | Maria Santoso | MNS | Master | 1 |
| S001006 | Nguyen Van Mai | MAC | Bachelor | 4 |
| S001007 | Do Duc Hoa | MBA | Master | 2 |
| S001010 | Do Anh Lan | MOTE | Master | 1 |
| S001012 | Nguyen Thanh Lan | HAT | Bachelor | 1 |
| S001015 | Hoang Huy Hung | HAT | Bachelor | 2 |
| S001019 | Bui Thu An | MBA | Master | 1 |
| S001024 | Le Huy Lan | MAC | Bachelor | 1 |

Fill out their enrollments based on their actual class schedules!

---

## What If I Don't Have Course IDs Yet?

**Option A: Use Simple Codes**
Create your own simple course IDs:
- `MET-Y1-M` = Marine Engineering Year 1 Morning
- `CS-Y2-A` = Computer Science Year 2 Afternoon
- `MBA-Y1-N` = MBA Year 1 Night

**Option B: Use Course Names**
Just use the course names:
- `Introduction-to-Marine-Engineering`
- `Advanced-Computer-Science`
- `Business-Strategy`

The system doesn't care what format you use, as long as:
1. It's consistent
2. Each course has a unique ID
3. You use the same ID everywhere

---

## Need More Help?

See **ENROLLMENT_IMPORT_GUIDE.md** for the complete detailed guide with:
- Troubleshooting
- JSON format option
- Error handling
- Real-world examples
- FAQ

---

## Ready? Let's Go!

```bash
# 1. Generate template
npm run generate-enrollment

# 2. Open and fill out the CSV file
# (Use Excel, Google Sheets, or text editor)

# 3. Go to importer
# http://localhost:5174/?tab=enrollment-importer

# 4. Import and match!
```

That's it! 🎉
