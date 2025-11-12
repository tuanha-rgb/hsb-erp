# Student Enrollment Import Guide (Block-Based System)

## 🎯 Understanding the Block System

### Why Blocks?

A semester is divided into **blocks** (typically 3 blocks per semester, 2 for summer). Students take **different courses in different blocks**.

**Example:**
- **Block 1** (Sep 1 - Oct 15): Student takes CS101 in morning, MATH201 in afternoon
- **Block 2** (Oct 16 - Nov 30): Student takes CS201 in morning, MATH301 in afternoon
- **Block 3** (Dec 1 - Jan 15): Student takes CS301 in morning, PHYS401 at night

This allows the system to match attendance to the **correct course based on the date**.

---

## 📋 New CSV Format

### Format Overview

```csv
studentId,semester,block,startDate,endDate,morningCourse,afternoonCourse,nightCourse
S001001,2024-2025-1,1,2024-09-01,2024-10-15,CS101,MATH201,
S001001,2024-2025-1,2,2024-10-16,2024-11-30,CS201,MATH301,
S001001,2024-2025-1,3,2024-12-01,2025-01-15,CS301,,PHYS401
```

### Key Changes from Before

| Old Format | New Format |
|------------|------------|
| **One row per student** | **Multiple rows per student** (one per block) |
| No date ranges | **Date ranges for each block** (startDate, endDate) |
| Assumed same courses all semester | **Different courses per block** |
| studentId, semester, morning, afternoon, night | studentId, semester, **block, startDate, endDate**, morning, afternoon, night |

### Column Definitions

| Column | Required | Format | Example | Description |
|--------|----------|--------|---------|-------------|
| `studentId` | ✅ Yes | String | S001001 | Student ID matching your database |
| `semester` | ✅ Yes | YYYY-YYYY-S | 2024-2025-1 | Semester (1=Fall, 2=Spring, 3=Summer) |
| `block` | ✅ Yes | 1, 2, or 3 | 1 | Block number within semester |
| `startDate` | ✅ Yes | YYYY-MM-DD | 2024-09-01 | First day of this block |
| `endDate` | ✅ Yes | YYYY-MM-DD | 2024-10-15 | Last day of this block |
| `morningCourse` | ❌ No | String | CS101 | Course ID for morning session (07:00-12:00) |
| `afternoonCourse` | ❌ No | String | MATH201 | Course ID for afternoon session (12:00-17:30) |
| `nightCourse` | ❌ No | String | PHYS401 | Course ID for night session (17:30-22:00) |

---

## 🚀 Quick Start (3 Steps)

### Step 1: Generate Template

```bash
npm run generate-enrollment
```

This creates a CSV file with **all active students × all blocks** with blank course fields.

**Output:**
```
✅ Created enrollment template: enrollment-template-2024-2025-1.csv
📊 Total active students: 200
📅 Blocks per semester: 3
📝 Total rows: 600 (200 students × 3 blocks)

📆 Block Date Ranges:
   Block 1: 2024-09-01 to 2024-10-15
   Block 2: 2024-10-16 to 2024-11-30
   Block 3: 2024-12-01 to 2025-01-15
```

### Step 2: Fill in Courses

Open the CSV and fill in course IDs for each student-block-session combination:

**Example for Marine Engineering students:**

```csv
studentId,semester,block,startDate,endDate,morningCourse,afternoonCourse,nightCourse
S001040,2024-2025-1,1,2024-09-01,2024-10-15,MET101,MET102,
S001040,2024-2025-1,2,2024-10-16,2024-11-30,MET201,MET202,
S001040,2024-2025-1,3,2024-12-01,2025-01-15,MET301,,MET303
S001041,2024-2025-1,1,2024-09-01,2024-10-15,MET101,MET102,
S001041,2024-2025-1,2,2024-10-16,2024-11-30,MET201,MET202,MET203
S001041,2024-2025-1,3,2024-12-01,2025-01-15,MET301,,
```

**Rules:**
- Each student needs **multiple rows** (one per block)
- Leave blank if no class in that session for that block
- Dates must be correct for each block

### Step 3: Import and Match

1. Go to: http://localhost:5174/?tab=enrollment-importer
2. Paste your CSV data
3. Click **"Preview Data"** → verify blocks look correct
4. Click **"Import to Firebase"**
5. Click **"Match All Attendance Records"**

**Done!** ✅

---

## 🔍 How Matching Works Now

### Before (Without Blocks) - ❌ Incorrect

```
Student S001040 detected at 08:30 on Oct 20
→ Morning session (08:30 = morning)
→ Look up: S001040's morning course
→ Result: MET101 (WRONG! Should be MET201 in Block 2)
```

### After (With Blocks) - ✅ Correct

```
Student S001040 detected at 08:30 on Oct 20
→ Date: Oct 20 = Block 2 (Oct 16 - Nov 30)
→ Session: 08:30 = morning
→ Look up: S001040's morning course in Block 2
→ Result: MET201 ✅ Correct!
```

---

## 📅 Block Date Configuration

### Default Block Dates (Configurable in `generateEnrollmentTemplate.ts`)

**Fall Semester (Semester 1)** - 3 Blocks:
- Block 1: September 1 - October 15
- Block 2: October 16 - November 30
- Block 3: December 1 - January 15

**Spring Semester (Semester 2)** - 3 Blocks:
- Block 1: February 1 - March 15
- Block 2: March 16 - April 30
- Block 3: May 1 - June 15

**Summer Semester (Semester 3)** - 2 Blocks:
- Block 1: June 16 - July 31
- Block 2: August 1 - August 31

### How to Adjust Block Dates

Edit `src/attendance/generateEnrollmentTemplate.ts`:

```typescript
const BLOCK_DATES = {
  'fall': [
    { block: 1, start: '2024-09-01', end: '2024-10-15' }, // ← Change these dates
    { block: 2, start: '2024-10-16', end: '2024-11-30' },
    { block: 3, start: '2024-12-01', end: '2025-01-15' }
  ],
  // ...
};
```

---

## 💡 Real-World Example

### Scenario: Marine Engineering Program

**Your Schedule:**
- Block 1: Introductory courses (MET101, MET102, MET103)
- Block 2: Intermediate courses (MET201, MET202, MET203)
- Block 3: Advanced courses (MET301, MET302, MET303)

**Your CSV:**

```csv
studentId,semester,block,startDate,endDate,morningCourse,afternoonCourse,nightCourse
S001040,2024-2025-1,1,2024-09-01,2024-10-15,MET101,MET102,MET103
S001040,2024-2025-1,2,2024-10-16,2024-11-30,MET201,MET202,
S001040,2024-2025-1,3,2024-12-01,2025-01-15,MET301,,MET303
S001041,2024-2025-1,1,2024-09-01,2024-10-15,MET101,MET102,
S001041,2024-2025-1,2,2024-10-16,2024-11-30,MET201,MET202,MET203
S001041,2024-2025-1,3,2024-12-01,2025-01-15,MET301,MET302,
S001042,2024-2025-1,1,2024-09-01,2024-10-15,MET101,MET102,
S001042,2024-2025-1,2,2024-10-16,2024-11-30,MET201,,
S001042,2024-2025-1,3,2024-12-01,2025-01-15,MET301,MET302,
```

**Matching Results:**
- S001040 detected on Sep 15 at 08:30 → Block 1, morning → **MET101** ✅
- S001040 detected on Oct 20 at 08:30 → Block 2, morning → **MET201** ✅
- S001040 detected on Dec 10 at 08:30 → Block 3, morning → **MET301** ✅

---

## 🧪 Testing with Sample Data

Want to test the system first?

```bash
npm run generate-enrollment-sample
```

This creates a CSV with **randomized course assignments** for all students across all blocks.

**Use this to:**
- Verify the import process works
- Test the matching algorithm
- Understand the format before creating real data

---

## ❓ FAQ

### Q: Do ALL semesters have 3 blocks?

**A:** No! Typically:
- Fall: 3 blocks
- Spring: 3 blocks
- Summer: 2 blocks (shorter)

You can adjust this in the template generator.

### Q: What if my block dates are different?

**A:** Edit the `BLOCK_DATES` in `src/attendance/generateEnrollmentTemplate.ts` to match your academic calendar.

### Q: Can blocks overlap?

**A:** No! Blocks must have **non-overlapping date ranges**. Each date should belong to exactly one block.

### Q: What if a student doesn't attend during a block?

**A:** Just leave all course fields blank for that block. The student will still have a row, but with empty courses.

### Q: Can I have different block dates for different students?

**A:** Not with the CSV format. All students in the same semester share the same block dates. If you need custom dates, use the JSON format instead.

### Q: What happens if attendance falls outside all block date ranges?

**A:** The system will not match that attendance record (it stays as `DEFAULT_COURSE`). Check your block dates cover the entire semester.

---

## 📊 Comparison: Old vs New Format

### Old Format (Single Row Per Student)

```csv
studentId,semester,morningCourse,afternoonCourse,nightCourse
S001001,2024-2025-1,CS101,MATH201,
```

**Problem:** Student S001001 takes CS101 all semester? ❌ Not realistic!

### New Format (Multiple Rows with Blocks)

```csv
studentId,semester,block,startDate,endDate,morningCourse,afternoonCourse,nightCourse
S001001,2024-2025-1,1,2024-09-01,2024-10-15,CS101,MATH201,
S001001,2024-2025-1,2,2024-10-16,2024-11-30,CS201,MATH301,
S001001,2024-2025-1,3,2024-12-01,2025-01-15,CS301,,PHYS401
```

**Solution:** Student S001001 takes different courses in each block ✅ Realistic!

---

## 🎬 Complete Workflow Summary

```bash
# 1. Generate template
npm run generate-enrollment

# 2. Open the generated CSV file
# (Use Excel, Google Sheets, or text editor)

# 3. Fill in course IDs for each student-block-session

# 4. Save the file

# 5. Go to enrollment importer
# http://localhost:5174/?tab=enrollment-importer

# 6. Import and match
```

---

## 📞 Need Help?

**Common Issues:**

1. **"Invalid block number"** → Block must be 1, 2, or 3
2. **"Missing startDate or endDate"** → All blocks need date ranges
3. **"No course found for student"** → Check block dates cover attendance date
4. **"Date doesn't fall into any block"** → Verify block date ranges cover entire semester

**Tips:**
- Double-check date formats (YYYY-MM-DD)
- Ensure blocks don't have gaps between them
- Verify block dates match your academic calendar
- Test with sample data first

---

## ✅ Ready to Start?

```bash
npm run generate-enrollment
```

Good luck! 🚀
