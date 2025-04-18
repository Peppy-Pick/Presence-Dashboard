import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  getAttendanceByDate, 
  getEmployeeAttendance,
  AttendanceDate,
  AttendanceRecord,
} from '@/lib/api';
import { toast } from 'sonner';

interface AttendanceState {
  dates: AttendanceDate[];
  totalPages: number;
  currentPage: number;
  records: Record<string, AttendanceRecord[]>; // Records by date
  employeeRecords: Record<string, AttendanceRecord[]>; // Records by employee ID
  isLoading: boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  dates: [],
  totalPages: 1,
  currentPage: 1,
  records: {},
  employeeRecords: {},
  isLoading: false,
  error: null,
};

// Only fetch attendance for a specific date when requested
export const fetchAttendanceByDate = createAsyncThunk(
  'attendance/fetchByDate',
  async (date: string, { rejectWithValue, getState }) => {
    try {
      // First, check if we already have records for this date in our state to avoid redundant API calls
      const state = getState() as { attendance: AttendanceState };
      if (state.attendance.records[date] && state.attendance.records[date].length > 0) {
        console.log('Using cached attendance records for date:', date);
        return { date, records: state.attendance.records[date] };
      }
      
      console.log('Fetching new attendance records for date:', date);
      const records = await getAttendanceByDate(date);
      
      // Validate returned data
      if (!Array.isArray(records)) {
        console.error('Invalid records format:', records);
        return rejectWithValue('Invalid response format: records is not an array');
      }
      
      // Log the fetched records for debugging
      console.log(`Fetched ${records.length} attendance records for date ${date}:`, records);
      
      return { date, records };
    } catch (error) {
      console.error('Error in fetchAttendanceByDate:', error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchEmployeeAttendance = createAsyncThunk(
  'attendance/fetchByEmployee',
  async (employeeId: string, { rejectWithValue, getState }) => {
    try {
      // Check if we already have records for this employee to avoid redundant API calls
      const state = getState() as { attendance: AttendanceState };
      if (state.attendance.employeeRecords[employeeId] && state.attendance.employeeRecords[employeeId].length > 0) {
        console.log('Using cached attendance records for employee:', employeeId);
        return { employeeId, records: state.attendance.employeeRecords[employeeId] };
      }
      
      console.log('Fetching new attendance records for employee:', employeeId);
      const records = await getEmployeeAttendance(employeeId);
      return { employeeId, records };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setAttendanceDates: (state, action: PayloadAction<AttendanceDate[]>) => {
      state.dates = action.payload;
    },
    clearAttendanceData: (state) => {
      state.dates = [];
      state.records = {};
      state.isLoading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch attendance by date
      .addCase(fetchAttendanceByDate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceByDate.fulfilled, (state, action) => {
        const { date, records } = action.payload;
        state.isLoading = false;
        
        if (!records || !Array.isArray(records)) {
          console.error('Invalid records format in reducer:', records);
          state.records[date] = [];
          return;
        }
        
        // Ensure we deduplicate records by employee ID for the current date
        const uniqueEmployeeIds = new Set<string>();
        const uniqueRecords = records.filter(record => {
          if (!record || !record.employeeId) {
            console.warn('Skipping invalid record:', record);
            return false;
          }
          
          if (uniqueEmployeeIds.has(record.employeeId)) {
            return false;
          }
          uniqueEmployeeIds.add(record.employeeId);
          return true;
        });
        
        state.records[date] = uniqueRecords;
        
        console.log(`Loaded ${uniqueRecords.length} attendance records for ${date}`);
      })
      .addCase(fetchAttendanceByDate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(state.error || 'Failed to fetch attendance records');
      })
      // Fetch employee attendance
      .addCase(fetchEmployeeAttendance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeAttendance.fulfilled, (state, action) => {
        const { employeeId, records } = action.payload;
        state.isLoading = false;
        state.employeeRecords[employeeId] = records;
      })
      .addCase(fetchEmployeeAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(state.error || 'Failed to fetch employee attendance');
      });
  },
});

export const { setCurrentPage, clearAttendanceData, setAttendanceDates } = attendanceSlice.actions;
export default attendanceSlice.reducer;
