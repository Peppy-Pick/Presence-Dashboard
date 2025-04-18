
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusUpper = status.toUpperCase();
  
  switch (statusUpper) {
    case 'VALID':
      return <Badge className="bg-green-500 hover:bg-green-600 transition-colors">Present</Badge>;
    case 'LATE':
      return <Badge className="bg-amber-500 hover:bg-amber-600 transition-colors">Late</Badge>;
    case 'ABSENT':
      return <Badge className="bg-red-500 hover:bg-red-600 transition-colors">Absent</Badge>;
    case 'LEAVE':
      return <Badge className="bg-purple-500 hover:bg-purple-600 transition-colors">Leave</Badge>;
    default:
      return <Badge className="bg-slate-500 hover:bg-slate-600 transition-colors">{status || 'Unknown'}</Badge>;
  }
};

interface LocationBadgeProps {
  locationType: string;
}

export const LocationBadge = ({ locationType }: LocationBadgeProps) => {
  if (locationType === 'clock_in') {
    return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500/20 transition-colors">Office</Badge>;
  }
  return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200 hover:bg-blue-500/20 transition-colors">Remote</Badge>;
};
