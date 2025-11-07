// RoomSchedule.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, Building, RefreshCw, AlertCircle } from 'lucide-react';

interface RoomSession {
  morning: string;
  afternoon: string;
  evening: string;
}

interface RoomScheduleItem {
  roomCode: string;
  floor: string;
  sessions: RoomSession;
}

interface WeeklyScheduleData {
  [date: string]: RoomScheduleItem[];
}

interface RoomScheduleProps {
  googleSheetUrl?: string;
  apiKey?: string;
}

const getEnvVar = (key: string): string => {
  try {
    return import.meta.env[key] || "";
  } catch {
    return "";
  }
};

const RoomSchedule: React.FC<RoomScheduleProps> = ({ 
  googleSheetUrl = getEnvVar('VITE_SHEET_URL'),
  apiKey = getEnvVar('VITE_SHEET_API')
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [scheduleData, setScheduleData] = useState<WeeklyScheduleData>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  const parseGoogleSheetsData = (data: any[][]): WeeklyScheduleData => {
    const weeklyData: WeeklyScheduleData = {};
    
    if (!data || data.length < 2) return weeklyData;

    const headerRow = data[0];
    const roomColumns: { [key: number]: { name: string; floor: string } } = {};
    
    for (let i = 2; i < headerRow.length; i++) {
      const roomName = (headerRow[i] || '').toString().trim();
      if (!roomName) continue;
      
      let floor = 'Floor 1';
      if (roomName.includes('T1')) floor = 'Floor 1';
      else if (roomName.includes('T2')) floor = 'Floor 2';
      else if (roomName.includes('T3')) floor = 'Floor 3';
      else if (roomName.includes('T4')) floor = 'Floor 4';
      else if (roomName.includes('201') || roomName.includes('202')) floor = 'Floor 2';
      else if (roomName.includes('301') || roomName.includes('302')) floor = 'Floor 3';
      else if (roomName.includes('401') || roomName.includes('402')) floor = 'Floor 4';
      
      roomColumns[i] = { name: roomName, floor };
    }

    let currentDate = '';
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length < 2) continue;

      const dateCell = (row[0] || '').toString().trim();
      const sessionType = (row[1] || '').toString().trim().toUpperCase();

      if (dateCell) {
  console.log('🔍 Raw dateCell:', JSON.stringify(dateCell)); // ADD THIS
  const dateMatch = dateCell.match(/date (\d+)\.(\d+)\.(\d+)/);
  if (dateMatch) {
    const [, day, month, year] = dateMatch;
    const fullYear = year.length === 2 ? `20${year}` : year;
    currentDate = `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    console.log('✅ Matched:', currentDate); // ADD THIS
    if (!weeklyData[currentDate]) weeklyData[currentDate] = [];
  } else {
    console.log('❌ No match for:', dateCell); // ADD THIS
  }
}

      if (!currentDate || !['S', 'C', 'T'].includes(sessionType)) continue;

      Object.entries(roomColumns).forEach(([colIndex, roomInfo]) => {
        const cellValue = (row[parseInt(colIndex)] || '').toString().trim();
        let roomEntry = weeklyData[currentDate].find(r => r.roomCode === roomInfo.name);
        
        if (!roomEntry) {
          roomEntry = {
            roomCode: roomInfo.name,
            floor: roomInfo.floor,
            sessions: { morning: '', afternoon: '', evening: '' }
          };
          weeklyData[currentDate].push(roomEntry);
        }

        if (sessionType === 'S') roomEntry.sessions.morning = cellValue;
        else if (sessionType === 'C') roomEntry.sessions.afternoon = cellValue;
        else if (sessionType === 'T') roomEntry.sessions.evening = cellValue;
      });
    }
    
    return weeklyData;
  };

  

  // Helper to find closest date to today
// Helper to find closest date to today
const findClosestDate = (dates: string[]): string => {
  if (dates.length === 0) return "";
  
  // Get today's date in YYYY-MM-DD format (local timezone)
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;
  
 
  
  // Check if today exists in dates
  if (dates.includes(todayStr)) {
    return todayStr;
  }
  
  // Find closest future date
  const futureDates = dates.filter(d => d >= todayStr).sort();
  if (futureDates.length > 0) {
    return futureDates[0];
  }
  
  // If no future dates, return the most recent past date
  const mostRecent = dates.sort().reverse()[0];
  return mostRecent;
};
  const fetchScheduleData = async () => {
    if (!googleSheetUrl || !apiKey) {
      return;
    }
    
    setLoading(true);
    setError("");
    setDebugInfo("Connecting to Google Sheets...");
    
    try {
      const match = googleSheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (!match) throw new Error("Invalid URL");
      
      const spreadsheetId = match[1];
      const range = "sheet1!A1:R300";
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`API Error (${response.status})`);
      
      const result = await response.json();
      if (!result.values || result.values.length === 0) throw new Error("Empty sheet");
      
      const parsedData = parseGoogleSheetsData(result.values);
      const dates = Object.keys(parsedData).sort();
      
      if (dates.length === 0) throw new Error("No valid data found");
      
      setScheduleData(parsedData);
      setAvailableDates(dates);
      
      // Set to closest date to today
      const closestDate = findClosestDate(dates);
      setSelectedDate(closestDate);
      
      setDebugInfo(`Loaded ${dates.length} days`);
      setTimeout(() => setDebugInfo(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduleData();
  }, []);

  const currentDaySchedule = useMemo(() => scheduleData[selectedDate] || [], [scheduleData, selectedDate]);

  const getDayOfWeek = (dateStr: string) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date(dateStr).getDay()];
  };

  const SessionBadge: React.FC<{ session: string; type: 'morning' | 'afternoon' | 'evening' }> = ({ session, type }) => {
    if (!session) return <div className="text-sm text-gray-400">-</div>;
    
    const badgeClass = type === 'morning' ? "bg-blue-100 text-blue-700" :
      type === 'afternoon' ? "bg-orange-100 text-orange-700" : "bg-purple-100 text-purple-700";

    return <div className={`px-3 py-1.5 rounded-md text-sm font-medium ${badgeClass}`}>{session}</div>;
  };

  return (
    <div className="h-full w-full bg-gray-50 overflow-auto">
      <div className="p-3 max-w mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">HSB Class Schedule</h1>
            {selectedDate && (
  <p className="text-lg text-gray-600">
    {getDayOfWeek(selectedDate)}, {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      timeZone: 'Asia/Ho_Chi_Minh'
    })}
  </p>
)}
          </div>
          
          <button 
            onClick={fetchScheduleData} 
            disabled={loading} 
            className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 font-medium flex items-center gap-2 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Reload
          </button>
        </div>

        {debugInfo && (
          <div className="mb-4 flex items-start gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">{debugInfo}</div>
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-start gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">{error}</div>
          </div>
        )}

        <div className="mb-3 flex flex-wrap items-center justify-between gap-4 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-4 flex-1 min-w-[300px]">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 whitespace-nowrap">
              <Calendar className="w-5 h-5" />
              Select Date:
            </label>
            {availableDates.length > 0 && (
              <select 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableDates.map(date => (
  <option key={date} value={date}>
    {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      timeZone: 'Asia/Ho_Chi_Minh'
    })}
  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm font-medium text-gray-700">Legend:</span>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-100 border border-blue-300 rounded"></div>
              <span className="text-sm">Morning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-orange-100 border border-orange-300 rounded"></div>
              <span className="text-sm">Afternoon</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-purple-100 border border-purple-300 rounded"></div>
              <span className="text-sm">Evening</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
            <RefreshCw className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <p className="text-xl text-gray-600">Loading data...</p>
          </div>
        ) : currentDaySchedule.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {currentDaySchedule.map((room, index) => (
              <div 
                key={`${room.roomCode}-${index}`} 
                className="bg-white rounded-lg border-2 border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all p-4"
              >
                <div className="mb-3 pb-3 border-b-2 border-gray-200">
                  <h3 className="font-bold text-gray-900 text-base mb-1">{room.roomCode}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    {room.floor}
                  </p>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1.5 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      Morning
                    </div>
                    <SessionBadge session={room.sessions.morning} type="morning" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1.5 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      Afternoon
                    </div>
                    <SessionBadge session={room.sessions.afternoon} type="afternoon" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1.5 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      Evening
                    </div>
                    <SessionBadge session={room.sessions.evening} type="evening" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-gray-200">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-3">No schedule for this day</p>
            {availableDates.length > 0 && (
              <button 
                onClick={() => setSelectedDate(findClosestDate(availableDates))}
                className="mt-3 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Go to closest available date
              </button>
            )}
          </div>
        )}

        <div className="mt-3 text-center text-sm text-gray-500">
          © 2025 Hanoi School of Business and Management (HSB). Designed by Tuan.HA
        </div>
      </div>
    </div>
  );
};

export default RoomSchedule;