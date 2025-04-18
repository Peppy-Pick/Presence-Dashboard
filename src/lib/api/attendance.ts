
import { fetchWithCache, handleApiError, ApiResponse, ATTENDANCE_API_BASE_URL } from './utils';

// Attendance types
export interface AttendanceDate {
  date: string;
  day: string;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalLeave: number;
  totalEmployees: number;
}

export interface LocationData {
  distance_km: number;
  latitude: number;
  longitude: number;
  type: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  employeeId: string;
  employeeName?: string;
  status: string;
  clock_in: string | null;
  clock_out: string | null;
  hours: number;
  location: LocationData;
  clock_out_location?: LocationData;
  created_date?: string;
  last_modified_date?: string;
}

export interface ApiAttendanceRecord {
  id: string;
  employee_id: string;
  employee_name?: string;
  status: string;
  clock_in: string | null;
  clock_out: string | null;
  hours_worked?: number;
  location: LocationData;
  clock_out_location?: LocationData;
  created_date?: string;
  last_modified_date?: string;
  date: string;
}

export interface DailyAttendance {
  employee_id: string;
  employee_name?: string;
  status: string;
  check_in: string | null;
  check_out: string | null;
  hours_worked: number;
  notes: string;
}

// Get all attendance records
export const getAllAttendanceRecords = async (): Promise<AttendanceRecord[]> => {
  try {
    const response = await fetchWithCache<ApiResponse<ApiAttendanceRecord[]>>(
      `${ATTENDANCE_API_BASE_URL}/api/attendance/all`
    );
    
    if (!response.data) {
      throw new Error('Invalid response format from attendance API');
    }
    
    // Transform API response to our internal format
    return response.data.map(transformApiRecordToAttendanceRecord);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch attendance records');
  }
};

// Helper function to transform API record to our internal format
const transformApiRecordToAttendanceRecord = (record: ApiAttendanceRecord): AttendanceRecord => {
  return {
    id: record.id || `attendance-${Date.now()}-${Math.random()}`,
    date: record.date || '',
    employeeId: record.employee_id || '',
    employeeName: record.employee_name || 'Unknown Employee',
    status: record.status || 'VALID',
    clock_in: record.clock_in || null,
    clock_out: record.clock_out || null,
    hours: record.hours_worked || 0,
    location: record.location || { 
      distance_km: 0, 
      latitude: 0, 
      longitude: 0, 
      type: 'clock_in' 
    },
    clock_out_location: record.clock_out_location,
    created_date: record.created_date,
    last_modified_date: record.last_modified_date
  };
};

// Get attendance by date - Properly parse API response
export const getAttendanceByDate = async (date: string): Promise<AttendanceRecord[]> => {
  try {
    console.log(`Fetching attendance for date: ${date}`);
    const response = await fetchWithCache<ApiResponse<ApiAttendanceRecord[]>>(
      `${ATTENDANCE_API_BASE_URL}/api/attendance/date?date=${date}`
    );
    
    if (!response.data) {
      console.error('Invalid response format from attendance API:', response);
      throw new Error('Invalid response format from attendance API');
    }
    
    console.log('Raw attendance data received:', response.data);
    
    // Transform API response to our internal format
    const transformedData = response.data.map(transformApiRecordToAttendanceRecord);
    
    console.log('Transformed attendance data:', transformedData);
    return transformedData;
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    return handleApiError(error, 'Failed to fetch attendance for date');
  }
};

// Get employee attendance
export const getEmployeeAttendance = async (employeeId: string): Promise<AttendanceRecord[]> => {
  try {
    const response = await fetchWithCache<ApiResponse<ApiAttendanceRecord[]>>(
      `${ATTENDANCE_API_BASE_URL}/api/attendance/employee/${employeeId}`
    );
    
    if (!response.data) {
      throw new Error('Invalid response format from attendance API');
    }
    
    // Transform API response to our internal format
    return response.data.map(transformApiRecordToAttendanceRecord);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch employee attendance');
  }
};

// Get all attendance for a specific date
export const getAllAttendanceForDate = async (date: string): Promise<DailyAttendance[]> => {
  try {
    const response = await fetchWithCache<ApiResponse<ApiAttendanceRecord[]>>(
      `${ATTENDANCE_API_BASE_URL}/api/attendance/date?date=${date}`
    );
    
    if (!response.data) {
      throw new Error('Invalid response format from attendance API');
    }
    
    // Transform to our internal format
    return response.data.map(record => ({
      employee_id: record.employee_id || '',
      employee_name: record.employee_name || 'Unknown Employee',
      status: record.status || '',
      check_in: record.clock_in || '',
      check_out: record.clock_out || '',
      hours_worked: record.hours_worked || 0,
      notes: ''
    }));
  } catch (error) {
    return handleApiError(error, 'Failed to fetch attendance for date');
  }
};
