# Student Enrollment Import Guide

## Quick Start Guide

This guide helps you prepare and import student enrollment data to enable automatic attendance-to-course matching.

---

## 📋 What You Need to Prepare

For each student, you need to specify which course they're enrolled in for each session:

- **Morning Session** (07:00 - 12:00): Which course?
- **Afternoon Session** (12:00 - 17:30): Which course?
- **Night Session** (17:30 - 22:00): Which course?

**Important Rules:**
- Each student can have **ONLY ONE** course per session
- If a student has no class in a session, leave it blank
- Use the exact course IDs as they appear in your system

---

## 🎯 Method 1: Generate Template (Recommended)

### Step 1: Generate a blank template with all your students

```bash
npx ts-node src/attendance/generateEnrollmentTemplate.ts
```

This creates a file like `enrollment-template-2024-2025-1.csv` with all active students:

```csv
studentId,semester,morningCourse,afternoonCourse,nightCourse
S001001,2024-2025-1,,,
S001002,2024-2025-1,,,
S001003,2024-2025-1,,,
...
```

### Step 2: Fill in the course assignments

Open the CSV file in Excel, Google Sheets, or any text editor:

**Example:**
```csv
studentId,semester,morningCourse,afternoonCourse,nightCourse
S001001,2024-2025-1,CS101,MATH201,
S001002,2024-2025-1,CS101,,BIO401
S001003,2024-2025-1,,PHYS201,CHEM301
S001040,2024-2025-1,MET101,MET201,
S001041,2024-2025-1,MET201,,MET401
```

**Explanation:**
- S001001: Has CS101 in morning, MATH201 in afternoon, nothing at night
- S001002: Has CS101 in morning, nothing in afternoon, BIO401 at night
- S001003: Nothing in morning, PHYS201 in afternoon, CHEM301 at night

### Step 3: Import the completed CSV

1. Go to http://localhost:5174/?tab=enrollment-importer
2. Select "CSV Format"
3. Copy and paste your completed CSV data
4. Click "Preview Data" to verify
5. Click "Import to Firebase"

---

## 🧪 Method 2: Generate Test Data (For Testing)

If you want to test the system with random sample data first:

```bash
npx ts-node src/attendance/generateEnrollmentTemplate.ts sample
```

This creates `enrollment-sample-2024-2025-1.csv` with randomized course assignments for all students.

**⚠️ WARNING:** This is for testing only! Use real data for production.

---

## 📊 Data Format Specifications

### CSV Format

**Required Headers:**
- `studentId` - Must match student IDs in your database (e.g., S001001)
- `semester` - Format: YYYY-YYYY-S (e.g., 2024-2025-1)
  - Semester 1 = Fall (Sep-Dec)
  - Semester 2 = Spring (Jan-May)
  - Semester 3 = Summer (Jun-Aug)

**Optional Columns:**
- `morningCourse` (or `morning`) - Course ID for morning session
- `afternoonCourse` (or `afternoon`) - Course ID for afternoon session
- `nightCourse` (or `night`) - Course ID for night session

**Rules:**
- Leave cells blank (empty) if student has no class in that session
- Don't use "N/A", "None", "-" - just leave blank
- Course IDs are case-sensitive

### JSON Format

Alternative format if you prefer JSON:

```json
[
  {
    "studentId": "S001001",
    "semester": "2024-2025-1",
    "courses": {
      "morning": "CS101",
      "afternoon": "MATH201"
    }
  },
  {
    "studentId": "S001002",
    "semester": "2024-2025-1",
    "courses": {
      "morning": "CS101",
      "night": "BIO401"
    }
  }
]
```

---

## 🔧 Real-World Example

Let's say you have Marine Engineering students with this schedule:

**Morning (07:00-12:00):**
- MET101: Introduction to Marine Engineering (Year 1)
- MET201: Ship Design (Year 2)
- MET301: Marine Propulsion (Year 3)

**Afternoon (12:00-17:30):**
- MET102: Thermodynamics (Year 1)
- MET202: Marine Systems (Year 2)

**Night (17:30-22:00):**
- MET103: Lab Work (Year 1)
- MET303: Advanced Topics (Year 3)

Your CSV would look like:

```csv
studentId,semester,morningCourse,afternoonCourse,nightCourse
S001040,2024-2025-1,MET101,MET102,MET103
S001041,2024-2025-1,MET301,,MET303
S001042,2024-2025-1,MET201,MET202,
S001045,2024-2025-1,MET101,MET102,MET103
S001061,2024-2025-1,MET201,MET202,
```

---

## 🚀 After Import: Run Matching

Once you've imported enrollments:

1. Click **"Match All Attendance Records"** button
2. System will:
   - Find all attendance records with `courseId = "DEFAULT_COURSE"`
   - Look up each student's enrollment
   - Determine session from timestamp (morning/afternoon/night)
   - Update courseId to the correct course
3. View the results:
   - ✅ Matched: Records successfully matched to courses
   - ⚠️ Unmatched: Students not found in enrollment data
   - Match Rate: Percentage of successfully matched records

---

## 📈 Checking Your Work

### Before Import

Check that your data looks correct:

```bash
# View your students
grep "MET" src/student/studentdata.ts

# Count active students
grep "Active" src/student/studentdata.ts | wc -l
```

### After Import

In the Enrollment Importer interface, you'll see:

**Dashboard Stats:**
- **Existing Enrollments**: How many student enrollments are stored
- **Match Rate**: Percentage of attendance records matched to courses
- **Unmatched Records**: How many attendance records couldn't be matched

**Import Results:**
- ✓ Imported: X records
- ✗ Errors: Y errors (with details)

**Matching Results:**
- Total Records: Total attendance records processed
- ✓ Matched: Successfully matched
- ⚠ Unmatched: Could not match (student not in enrollment data)

---

## ❓ Common Questions

### Q: What if I don't know the exact course IDs?

**A:** Check your course database or schedule. Common formats:
- Department code + number: `CS101`, `MATH201`, `MET301`
- Full name: `Introduction-to-Programming`
- Custom IDs: Whatever your system uses

### Q: Can a student be in multiple courses at the same time?

**A:** No! Each student can only have ONE course per session. The system assumes:
- If attendance detected at 08:30 (morning) → Must be their morning course
- If attendance detected at 14:00 (afternoon) → Must be their afternoon course

### Q: What happens to attendance records before I import enrollments?

**A:** They stay as `courseId = "DEFAULT_COURSE"` until you:
1. Import enrollments
2. Run "Match All Attendance Records"

### Q: What if my semester format is different?

**A:** You can modify the semester in your CSV. Common formats:
- `2024-2025-1` (Fall 2024)
- `2024-2025-2` (Spring 2025)
- `2024-2025-3` (Summer 2025)

Or use your own: `Fall-2024`, `Spring-2025`, etc.

### Q: Can I update enrollments later?

**A:** Yes! Just import a new CSV with the same studentId + semester. It will update the existing record.

---

## 🎬 Complete Workflow

**Step 1: Prepare Data**
```bash
# Generate template
npx ts-node src/attendance/generateEnrollmentTemplate.ts

# Fill out enrollment-template-2024-2025-1.csv with actual courses
```

**Step 2: Import**
```
1. Open http://localhost:5174/?tab=enrollment-importer
2. Paste CSV data
3. Click "Preview Data"
4. Click "Import to Firebase"
```

**Step 3: Match Attendance**
```
1. Click "Match All Attendance Records"
2. Wait for processing
3. Review match rate and errors
```

**Step 4: Verify**
```
1. Go to Attendance tab
2. Check that records show correct course names (not DEFAULT_COURSE)
3. Export and verify data
```

---

## 📞 Need Help?

If you get errors during import:

1. **Check CSV format**: Make sure headers match exactly
2. **Check student IDs**: Must match IDs in your database (S001001, etc.)
3. **Check for special characters**: Avoid quotes, commas in course names
4. **Check semester format**: Use consistent format (YYYY-YYYY-S)

**Common Errors:**
- `Missing studentId`: A row has blank student ID
- `Line X: error message`: Check that specific line in your CSV
- `No course found for student`: Student has attendance but no enrollment data

---

## 🎯 Next Steps

After successfully importing enrollments:

1. **Update Webhook** (Optional): Modify `functions/src/index.ts` to auto-match new attendance records
2. **Monitor Match Rate**: Keep it above 90% by keeping enrollment data up-to-date
3. **Handle Unmatched**: Manually review unmatched students
4. **Re-import Each Semester**: Update enrollments when courses change

---

## 📝 Quick Reference

**Generate blank template:**
```bash
npx ts-node src/attendance/generateEnrollmentTemplate.ts
```

**Generate sample data (testing):**
```bash
npx ts-node src/attendance/generateEnrollmentTemplate.ts sample
```

**Access importer:**
```
http://localhost:5174/?tab=enrollment-importer
```

**Session times:**
- Morning: 07:00 - 12:00
- Afternoon: 12:00 - 17:30
- Night: 17:30 - 22:00

**CSV format:**
```csv
studentId,semester,morningCourse,afternoonCourse,nightCourse
```

---

Good luck with your enrollment import! 🚀
