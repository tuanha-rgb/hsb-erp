// seed-firebase.ts
// Simplified seeder that can be called from browser console or component
import { bulkRecordAttendance, registerCamera, createAlert } from './attendance_firebase_service';
import { initializeAttendanceData } from './attendancemodel';

export async function seedAttendanceToFirebase() {
  console.log('🌱 Starting Firebase seed...');

  try {
    // Generate test data
    const data = initializeAttendanceData();

    console.log(`📊 Generated:
    - ${data.records.length} attendance records
    - ${data.cameras.length} cameras
    - ${data.alerts.length} alerts`);

    // 1. Seed Cameras
    console.log('\n📷 Seeding AI cameras...');
    for (const camera of data.cameras) {
      await registerCamera(camera);
    }
    console.log(`✅ Created ${data.cameras.length} cameras`);

    // 2. Seed Attendance Records (in batches)
    console.log('\n📝 Seeding attendance records...');
    const batchSize = 500;
    for (let i = 0; i < data.records.length; i += batchSize) {
      const batch = data.records.slice(i, i + batchSize);
      await bulkRecordAttendance(batch);
      console.log(`  ✓ Written ${Math.min(i + batchSize, data.records.length)}/${data.records.length} records`);
    }
    console.log(`✅ Created ${data.records.length} attendance records`);

    // 3. Seed Alerts
    console.log('\n🚨 Seeding alerts...');
    for (const alert of data.alerts) {
      await createAlert(alert);
    }
    console.log(`✅ Created ${data.alerts.length} alerts`);

    console.log('\n✅ Seeding complete!');
    console.log('\n📊 Summary:');
    console.log(`   - Attendance Records: ${data.records.length}`);
    console.log(`   - AI Cameras: ${data.cameras.length}`);
    console.log(`   - Alerts: ${data.alerts.length}`);

    return {
      success: true,
      data: {
        records: data.records.length,
        cameras: data.cameras.length,
        alerts: data.alerts.length
      }
    };
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).seedAttendance = seedAttendanceToFirebase;
}
