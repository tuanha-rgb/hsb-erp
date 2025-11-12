// verify-attendance.ts
// Quick script to verify attendance data and match with student database

import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/firebase.config';
import { sampleStudents } from '../student/studentdata';

export async function verifyAttendanceData() {
  console.log('🔍 Verifying Attendance Data...\n');

  try {
    // Load attendance records
    const recordsRef = collection(db, 'attendance_records');
    const q = query(recordsRef, orderBy('timestamp', 'desc'), limit(1000));
    const snapshot = await getDocs(q);

    console.log(`📊 Total Records: ${snapshot.docs.length}`);

    // Extract unique student IDs from attendance
    const attendanceStudentIds = new Set<string>();
    const recordsByStudent = new Map<string, number>();
    const cameraUsage = new Map<string, number>();
    const courseUsage = new Map<string, number>();

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const studentId = data.studentId;

      if (studentId) {
        attendanceStudentIds.add(studentId);
        recordsByStudent.set(studentId, (recordsByStudent.get(studentId) || 0) + 1);
      }

      if (data.cameraId) {
        cameraUsage.set(data.cameraId, (cameraUsage.get(data.cameraId) || 0) + 1);
      }

      if (data.courseId) {
        courseUsage.set(data.courseId, (courseUsage.get(data.courseId) || 0) + 1);
      }
    });

    console.log(`👥 Unique Students in Attendance: ${attendanceStudentIds.size}\n`);

    // Load student database
    const dbStudentIds = new Set(sampleStudents.map(s => s.id));
    console.log(`📚 Students in Database: ${dbStudentIds.size}\n`);

    // Match analysis
    const matched = Array.from(attendanceStudentIds).filter(id => dbStudentIds.has(id));
    const unmatched = Array.from(attendanceStudentIds).filter(id => !dbStudentIds.has(id));

    console.log('✅ MATCHED STUDENTS:');
    console.log(`   ${matched.length} students have both attendance records and database entries`);
    if (matched.length > 0) {
      console.log('   Sample matched IDs:', matched.slice(0, 5).join(', '));
    }
    console.log('');

    console.log('⚠️  UNMATCHED STUDENTS:');
    console.log(`   ${unmatched.length} students in attendance but NOT in database`);
    if (unmatched.length > 0) {
      console.log('   Unmatched IDs:', unmatched.join(', '));
      console.log('   ⚠️  These students need to be added to studentdata.ts');
    }
    console.log('');

    // Camera usage
    console.log('📸 CAMERA USAGE:');
    Array.from(cameraUsage.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([camera, count]) => {
        console.log(`   ${camera}: ${count} records`);
      });
    console.log('');

    // Course usage
    console.log('📚 COURSE DISTRIBUTION:');
    Array.from(courseUsage.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([course, count]) => {
        console.log(`   ${course}: ${count} records`);
      });
    console.log('');

    // Top students by record count
    console.log('🏆 TOP 10 STUDENTS BY ATTENDANCE RECORDS:');
    Array.from(recordsByStudent.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([studentId, count], index) => {
        const student = sampleStudents.find(s => s.id === studentId);
        const name = student ? student.name : '(Not in database)';
        console.log(`   ${index + 1}. ${studentId} - ${name}: ${count} records`);
      });
    console.log('');

    // Date range
    if (snapshot.docs.length > 0) {
      const oldest = snapshot.docs[snapshot.docs.length - 1].data().timestamp?.toDate();
      const newest = snapshot.docs[0].data().timestamp?.toDate();
      console.log('📅 DATE RANGE:');
      console.log(`   From: ${oldest?.toLocaleString() || 'Unknown'}`);
      console.log(`   To:   ${newest?.toLocaleString() || 'Unknown'}`);
      console.log('');
    }

    // Summary
    const matchRate = (matched.length / attendanceStudentIds.size) * 100;
    console.log('📊 SUMMARY:');
    console.log(`   Match Rate: ${matchRate.toFixed(1)}%`);
    console.log(`   Status: ${matchRate > 80 ? '✅ Good' : matchRate > 50 ? '⚠️  Fair' : '❌ Needs Work'}`);
    console.log('');

    return {
      totalRecords: snapshot.docs.length,
      uniqueStudents: attendanceStudentIds.size,
      matched: matched.length,
      unmatched: unmatched.length,
      unmatchedIds: unmatched,
      matchRate,
      cameras: Array.from(cameraUsage.entries()),
      courses: Array.from(courseUsage.entries()),
      topStudents: Array.from(recordsByStudent.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10)
    };

  } catch (error) {
    console.error('❌ Error verifying attendance:', error);
    throw error;
  }
}

// Export function to download unmatched students as CSV
export function exportUnmatchedStudents(unmatchedIds: string[]) {
  const csv = ['Student ID,Status,Action Needed'].concat(
    unmatchedIds.map(id => `${id},Not in database,Add to studentdata.ts`)
  ).join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `unmatched_students_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
