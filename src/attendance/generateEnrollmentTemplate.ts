// Helper script to generate enrollment template from existing student data
// Run: npm run generate-enrollment

import { sampleStudents } from '../student/studentdata';
import { getCurrentSemester } from './enrollmentModel';
import * as fs from 'fs';

/**
 * Block date ranges for Fall/Spring/Summer semesters
 * Adjust these dates based on your academic calendar
 */
const BLOCK_DATES = {
  'fall': [ // Semester 1 (typically 3 blocks)
    { block: 1, start: '2024-09-01', end: '2024-10-15' },
    { block: 2, start: '2024-10-16', end: '2024-11-30' },
    { block: 3, start: '2024-12-01', end: '2025-01-15' }
  ],
  'spring': [ // Semester 2 (typically 3 blocks)
    { block: 1, start: '2025-02-01', end: '2025-03-15' },
    { block: 2, start: '2025-03-16', end: '2025-04-30' },
    { block: 3, start: '2025-05-01', end: '2025-06-15' }
  ],
  'summer': [ // Semester 3 (typically 2 blocks)
    { block: 1, start: '2025-06-16', end: '2025-07-31' },
    { block: 2, start: '2025-08-01', end: '2025-08-31' }
  ]
};

/**
 * Get block dates based on semester
 */
function getBlockDates(semester: string) {
  const parts = semester.split('-');
  if (parts.length !== 3) {
    // Default to fall
    return BLOCK_DATES.fall;
  }

  const semNum = parseInt(parts[2]);
  if (semNum === 1) return BLOCK_DATES.fall;
  if (semNum === 2) return BLOCK_DATES.spring;
  if (semNum === 3) return BLOCK_DATES.summer;
  return BLOCK_DATES.fall;
}

/**
 * Generate enrollment CSV template with all existing students and blocks
 * This creates a file you can fill out with actual course assignments
 */
function generateEnrollmentTemplate() {
  const currentSemester = getCurrentSemester();
  const blockDates = getBlockDates(currentSemester);

  // CSV header
  let csv = 'studentId,semester,block,startDate,endDate,morningCourse,afternoonCourse,nightCourse\n';

  // Add each student with all blocks
  sampleStudents.forEach(student => {
    // Only include active students
    if (student.status === 'Active') {
      blockDates.forEach(block => {
        csv += `${student.id},${currentSemester},${block.block},${block.start},${block.end},,,\n`;
      });
    }
  });

  // Write to file
  const filename = `enrollment-template-${currentSemester}.csv`;
  fs.writeFileSync(filename, csv);

  console.log(`✅ Created enrollment template: ${filename}`);
  console.log(`📊 Total active students: ${sampleStudents.filter(s => s.status === 'Active').length}`);
  console.log(`📅 Blocks per semester: ${blockDates.length}`);
  console.log(`📝 Total rows: ${sampleStudents.filter(s => s.status === 'Active').length * blockDates.length} (${sampleStudents.filter(s => s.status === 'Active').length} students × ${blockDates.length} blocks)`);
  console.log(`\n📆 Block Date Ranges:`);
  blockDates.forEach(block => {
    console.log(`   Block ${block.block}: ${block.start} to ${block.end}`);
  });
  console.log(`\nNext steps:`);
  console.log(`1. Open ${filename} in Excel or Google Sheets`);
  console.log(`2. Fill in course IDs for each student's sessions in each block`);
  console.log(`3. Leave blank if student has no class in that session`);
  console.log(`4. Each student has ${blockDates.length} rows (one per block)`);
  console.log(`5. Import the completed CSV in the Enrollment Importer`);
}

/**
 * Generate sample enrollment data with random courses
 * FOR TESTING PURPOSES ONLY
 */
function generateSampleEnrollment() {
  const currentSemester = getCurrentSemester();
  const blockDates = getBlockDates(currentSemester);

  // Sample courses for each level
  const courses = {
    Bachelor: {
      morning: ['CS101', 'MATH101', 'PHYS101', 'ENG101', 'CHEM101', 'BIO101', 'MET101', 'MET201', 'MET301'],
      afternoon: ['CS201', 'MATH201', 'PHYS201', 'ENG201', 'CHEM201', 'BIO201', 'MET102', 'MET202', 'MET302'],
      night: ['CS301', 'MATH301', 'PHYS301', 'ENG301', 'CHEM301', 'BIO301', 'MET103', 'MET303', 'MET403']
    },
    Master: {
      morning: ['ADV-CS501', 'ADV-MATH501', 'ADV-ENG501', 'MBA-501', 'MNS-501'],
      afternoon: ['ADV-CS601', 'ADV-MATH601', 'ADV-ENG601', 'MBA-601', 'MNS-601'],
      night: ['ADV-CS701', 'ADV-MATH701', 'ADV-ENG701', 'MBA-701', 'MNS-701']
    },
    PhD: {
      morning: ['PHD-RES801', 'PHD-SEM801', 'DMS-801'],
      afternoon: ['PHD-RES901', 'PHD-SEM901', 'DMS-901'],
      night: ['PHD-RES1001', 'PHD-SEM1001', 'DMS-1001']
    }
  };

  // CSV header
  let csv = 'studentId,semester,block,startDate,endDate,morningCourse,afternoonCourse,nightCourse\n';

  // Generate random enrollments
  sampleStudents.forEach(student => {
    if (student.status !== 'Active') return;

    const levelCourses = courses[student.level];

    // For each block, randomly assign 1-2 courses per student
    blockDates.forEach(block => {
      const numCourses = Math.floor(Math.random() * 2) + 1; // 1 or 2 courses per block
      const sessions = ['morning', 'afternoon', 'night'];
      const selectedSessions = sessions
        .sort(() => Math.random() - 0.5)
        .slice(0, numCourses);

      const morning = selectedSessions.includes('morning')
        ? levelCourses.morning[Math.floor(Math.random() * levelCourses.morning.length)]
        : '';
      const afternoon = selectedSessions.includes('afternoon')
        ? levelCourses.afternoon[Math.floor(Math.random() * levelCourses.afternoon.length)]
        : '';
      const night = selectedSessions.includes('night')
        ? levelCourses.night[Math.floor(Math.random() * levelCourses.night.length)]
        : '';

      csv += `${student.id},${currentSemester},${block.block},${block.start},${block.end},${morning},${afternoon},${night}\n`;
    });
  });

  const filename = `enrollment-sample-${currentSemester}.csv`;
  fs.writeFileSync(filename, csv);

  console.log(`✅ Created sample enrollment: ${filename}`);
  console.log(`⚠️  This is SAMPLE DATA for testing purposes`);
  console.log(`📊 Total active students: ${sampleStudents.filter(s => s.status === 'Active').length}`);
  console.log(`📅 Blocks per semester: ${blockDates.length}`);
  console.log(`📝 Total rows: ${sampleStudents.filter(s => s.status === 'Active').length * blockDates.length}`);
}

// Parse command line arguments
const args = process.argv.slice(2);
const mode = args[0] || 'template';

if (mode === 'sample') {
  console.log('Generating SAMPLE enrollment data (for testing)...\n');
  generateSampleEnrollment();
} else {
  console.log('Generating blank enrollment template with blocks...\n');
  generateEnrollmentTemplate();
}
