
import React, { useEffect, useState } from 'react';
import AttendanceDateList from '@/components/attendance/AttendanceDateList';
import { CalendarDays } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { setAttendanceDates, setCurrentPage } from '@/store/slices/attendanceSlice';
import { AttendanceDate } from '@/lib/api';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

// Generate dates for display without API calls
const generateDates = (page: number, pageSize: number): { dates: AttendanceDate[], totalPages: number } => {
  const dates: AttendanceDate[] = [];
  const today = new Date();
  const totalDays = 30; // Show last 30 days
  const totalPages = Math.ceil(totalDays / pageSize);
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalDays);
  
  for (let i = startIndex; i < endIndex; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    const formattedDate = date.toISOString().split('T')[0];
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    
    dates.push({
      date: formattedDate,
      day,
      totalPresent: 0,
      totalAbsent: 0,
      totalLate: 0,
      totalLeave: 0,
      totalEmployees: 0
    });
  }
  
  return { dates, totalPages };
};

const Attendance = () => {
  const { setCurrentPage: setAppCurrentPage } = useAppContext();
  const dispatch = useAppDispatch();
  const { totalPages, currentPage, isLoading } = useAppSelector(state => state.attendance);
  const [initialLoad, setInitialLoad] = useState(true);
  const [displayDates, setDisplayDates] = useState<AttendanceDate[]>([]);
  const [calculatedTotalPages, setCalculatedTotalPages] = useState(1);
  
  useEffect(() => {
    setAppCurrentPage('attendance');
  }, [setAppCurrentPage]);
  
  useEffect(() => {
    // Generate dates client-side without API calls
    const { dates, totalPages } = generateDates(currentPage, 10);
    setDisplayDates(dates);
    setCalculatedTotalPages(totalPages);
    dispatch(setAttendanceDates(dates));
    setInitialLoad(false);
  }, [dispatch, currentPage]);
  
  const handlePageChange = (page: number) => {
    if (page < 1 || page > calculatedTotalPages) return;
    dispatch(setCurrentPage(page));
  };
  
  return (
    <div className="space-y-6 pb-8">
      <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-lg">
        <div className="flex gap-4 items-center">
          <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-full">
            <CalendarDays className="h-8 w-8 text-blue-500 dark:text-blue-300" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Attendance Records</h1>
            <p className="text-gray-500 dark:text-gray-400">
              View and manage employee attendance records by date. Click on a date to see details.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <AttendanceDateList dates={displayDates} isLoading={isLoading && initialLoad} />
        
        {calculatedTotalPages > 1 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }} 
                    />
                  </PaginationItem>
                )}
                
                {Array.from({ length: Math.min(5, calculatedTotalPages) }, (_, i) => {
                  const pageNumber = i + 1;
                  const visiblePages = [1, calculatedTotalPages, currentPage, currentPage - 1, currentPage + 1];
                  
                  if (calculatedTotalPages <= 5 || visiblePages.includes(pageNumber)) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink 
                          href="#" 
                          isActive={pageNumber === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(pageNumber);
                          }}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}
                
                {currentPage < calculatedTotalPages && (
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }} 
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
