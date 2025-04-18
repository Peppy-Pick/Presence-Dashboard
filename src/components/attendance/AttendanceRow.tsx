import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { AttendanceRecord } from '@/lib/api/attendance';
import { Clock, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LocationBadge, StatusBadge } from './AttendanceBadges';

interface AttendanceRowProps {
  record: AttendanceRecord;
}

const AttendanceRow = ({ record }: AttendanceRowProps) => {
  // Format time to IST (Indian Standard Time, UTC+5:30)
  const formatClockTimeIST = (timeString: string | null) => {
    if (!timeString || timeString === '-') return '-';
    
    try {
      // Try to parse as date
      let date = new Date(timeString);
      
      // Check if date parsing was successful
      if (isNaN(date.getTime())) {
        // If we couldn't parse it as a date, manually add +5:30 if it looks like a time
        if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(timeString)) {
          // It looks like a 24-hour time format, let's try to parse it and add offset
          const [hours, minutes] = timeString.split(':').map(Number);
          
          // Create today's date with the specified time
          date = new Date();
          date.setHours(hours + 5); // Add 5 hours for IST
          date.setMinutes(minutes + 30); // Add 30 minutes for IST
          date.setSeconds(0);
        } else {
          // We couldn't parse it at all, return as is
          return timeString;
        }
      } else {
        // If we did parse it as a date, add the IST offset (+5:30)
        date = new Date(date.getTime() + (5 * 60 + 30) * 60 * 1000);
      }
      
      // Format options for time display
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      
      return new Intl.DateTimeFormat('en-IN', options).format(date);
    } catch (error) {
      console.error("Error formatting time:", error);
      return timeString;
    }
  };

  return (
    <TableRow className="hover:bg-muted/20 transition-colors">
      <TableCell>
        <Link to={`/employees/${record.employeeId}`} className="hover:text-primary transition-colors font-medium flex items-center gap-2">
          <div className="bg-muted rounded-full p-1.5">
            <UserRound className="h-4 w-4" />
          </div>
          {record.employeeName || 'Unknown Employee'}
        </Link>
      </TableCell>
      <TableCell><StatusBadge status={record.status} /></TableCell>
      <TableCell>
        {record.status !== 'ABSENT' && record.status !== 'LEAVE' && 
          record.location && record.location.type && 
          <LocationBadge locationType={record.location.type} />
        }
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{formatClockTimeIST(record.clock_in)}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{formatClockTimeIST(record.clock_out)}</span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/employees/${record.employeeId}`}>
            View Details
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default AttendanceRow;