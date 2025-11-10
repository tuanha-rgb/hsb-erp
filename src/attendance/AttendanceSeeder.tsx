// AttendanceSeeder.tsx - UI component to seed Firebase with test data
import React, { useState } from 'react';
import { Database, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { seedAttendanceToFirebase } from './seed-firebase';

export default function AttendanceSeeder() {
  const [status, setStatus] = useState<'idle' | 'seeding' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState<any>(null);

  const handleSeed = async () => {
    setStatus('seeding');
    setMessage('Seeding database...');

    const result = await seedAttendanceToFirebase();

    if (result.success) {
      setStatus('success');
      setMessage('Database seeded successfully!');
      setStats(result.data);
    } else {
      setStatus('error');
      setMessage(`Error: ${result.error}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-4">
        <Database className="w-6 h-6 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Database Seeder</h2>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Click the button below to populate Firebase with test attendance data including:
      </p>

      <ul className="text-sm text-gray-600 mb-6 space-y-1">
        <li>• ~1000+ attendance records (60 days of data)</li>
        <li>• 8 AI camera configurations</li>
        <li>• Student attendance alerts</li>
        <li>• Course attendance statistics</li>
      </ul>

      <button
        onClick={handleSeed}
        disabled={status === 'seeding'}
        className={`w-full px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
          status === 'seeding'
            ? 'bg-gray-400 cursor-not-allowed'
            : status === 'success'
            ? 'bg-green-600 hover:bg-green-700'
            : status === 'error'
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
      >
        {status === 'seeding' && <Loader className="w-5 h-5 animate-spin" />}
        {status === 'success' && <CheckCircle className="w-5 h-5" />}
        {status === 'error' && <AlertCircle className="w-5 h-5" />}
        {status === 'idle' && 'Seed Database'}
        {status === 'seeding' && 'Seeding...'}
        {status === 'success' && 'Seeding Complete!'}
        {status === 'error' && 'Seeding Failed'}
      </button>

      {message && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          status === 'success' ? 'bg-green-50 text-green-800' :
          status === 'error' ? 'bg-red-50 text-red-800' :
          'bg-blue-50 text-blue-800'
        }`}>
          {message}
        </div>
      )}

      {stats && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Seeded Data:</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.records}</div>
              <div className="text-xs text-gray-600">Records</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{stats.cameras}</div>
              <div className="text-xs text-gray-600">Cameras</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{stats.alerts}</div>
              <div className="text-xs text-gray-600">Alerts</div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
        <p className="text-xs text-yellow-800">
          ⚠️ <strong>Note:</strong> This will add test data to your Firebase database.
          Make sure you have proper indexes configured for optimal performance.
        </p>
      </div>
    </div>
  );
}
