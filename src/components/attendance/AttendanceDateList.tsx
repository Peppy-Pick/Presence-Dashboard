
import React from 'react';
import { Card } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import { AttendanceDate } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface AttendanceDateListProps {
  dates: AttendanceDate[];
  isLoading: boolean;
}

const AttendanceDateList = ({ dates, isLoading }: AttendanceDateListProps) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
        {Array(8)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="bg-slate-200 dark:bg-slate-800 h-32 rounded-lg"></div>
          ))}
      </div>
    );
  }

  if (dates.length === 0) {
    return (
      <div className="text-center py-12">
        <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">No attendance records found</h3>
        <p className="text-muted-foreground">No attendance data is available for the selected period.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {dates.map((date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const dateObj = new Date(date.date);
        dateObj.setHours(0, 0, 0, 0);
        
        const isToday = dateObj.getTime() === today.getTime();
        
        return (
          <Card 
            key={date.date} 
            className="cursor-pointer hover:shadow-md transition-all bg-blue-50 dark:bg-blue-900/20"
            onClick={() => navigate(`/attendance/${date.date}`)}
          >
            <div className="p-6 flex justify-between items-center">
              <div>
                <p className="text-gray-600 dark:text-gray-400">{date.day}</p>
                <p className="text-4xl font-bold mt-1">{dateObj.getDate()}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div>
                <CalendarDays className="h-10 w-10 text-blue-400" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default AttendanceDateList;
