import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock } from 'lucide-react';

const AttendanceTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[200px]">Employee</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Location</TableHead>
        <TableHead>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Clock In</span>
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Clock Out</span>
          </div>
        </TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default AttendanceTableHeader;