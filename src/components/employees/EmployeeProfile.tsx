import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Employee, AttendanceRecord } from '@/lib/api';
import { 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase, 
  Building, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  Home,
  Droplet,
  Pencil
} from 'lucide-react';
import EditEmployeeForm from './EditEmployeeForm';

interface EmployeeProfileProps {
  employee: Employee;
  attendanceRecords: AttendanceRecord[];
  isLoading: boolean;
  onEmployeeUpdated?: () => void;
}

const EmployeeProfile = ({ employee, attendanceRecords, isLoading, onEmployeeUpdated }: EmployeeProfileProps) => {
  const [showEditForm, setShowEditForm] = useState(false);

  if (isLoading) {
    return (
      <div className="grid gap-6 animate-pulse">
        <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        <div className="h-60 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
      </div>
    );
  }
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const presentDays = attendanceRecords.filter(r => r.status === 'present').length;
  const lateDays = attendanceRecords.filter(r => r.status === 'late').length;
  const absentDays = attendanceRecords.filter(r => r.status === 'absent').length;
  const leaveDays = attendanceRecords.filter(r => r.status === 'leave').length;
  
  const totalDays = presentDays + lateDays + absentDays + leaveDays;
  const attendanceRate = totalDays > 0 ? ((presentDays + lateDays) / totalDays) * 100 : 0;
  const punctualityRate = (presentDays + lateDays) > 0 ? (presentDays / (presentDays + lateDays)) * 100 : 0;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatTimeToIST = (timeString: string | null) => {
    if (!timeString || timeString === '-') return timeString;
    
    try {
      if (/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(timeString)) {
        const [time, period] = timeString.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        
        if (period && period.toUpperCase() === 'PM' && hours < 12) {
          hours += 12;
        } else if (period && period.toUpperCase() === 'AM' && hours === 12) {
          hours = 0;
        }
        
        const date = new Date();
        date.setHours(hours + 5);
        date.setMinutes(minutes + 30);
        date.setSeconds(0);
        
        const options: Intl.DateTimeFormatOptions = {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        };
        
        return new Intl.DateTimeFormat('en-IN', options).format(date);
      }

      let date = new Date(timeString);
      
      if (isNaN(date.getTime())) {
        if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(timeString)) {
          const [hours, minutes] = timeString.split(':').map(Number);
          
          date = new Date();
          date.setHours(hours + 5);
          date.setMinutes(minutes + 30);
          date.setSeconds(0);
        } else {
          return timeString;
        }
      } else {
        date = new Date(date.getTime() + (5 * 60 + 30) * 60 * 1000);
      }
      
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

  const formatDateWithTime = (dateString: string, timeString: string | null) => {
    if (!timeString || timeString === '-') {
      return `${formatDate(dateString)} (no time recorded)`;
    }
    
    const formattedTime = formatTimeToIST(timeString);
    return `${formatDate(dateString)} (${formattedTime})`;
  };

  const formatShiftHours = () => {
    if (typeof employee.employee_shift_hours === 'string') {
      return employee.employee_shift_hours;
    }
    
    const shift = employee.employee_shift_hours;
    const formattedStart = formatTimeToIST(shift.start);
    const formattedEnd = formatTimeToIST(shift.end);
    return `${formattedStart} - ${formattedEnd} (${shift.hours} Hours)`;
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-500">Present</Badge>;
      case 'late':
        return <Badge className="bg-amber-500">Late</Badge>;
      case 'absent':
        return <Badge className="bg-red-500">Absent</Badge>;
      case 'leave':
        return <Badge className="bg-purple-500">Leave</Badge>;
      default:
        return null;
    }
  };
  
  const getLocationBadge = (type: string) => {
    if (type === 'inside') {
      return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">Office</Badge>;
    }
    return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">Remote</Badge>;
  };

  const formatCTC = (ctc: any) => {
    if (typeof ctc === 'number') {
      return `$${ctc.toLocaleString()}`;
    } else if (ctc && typeof ctc === 'object' && ctc.amount) {
      return `${ctc.currency || '$'}${ctc.amount.toLocaleString()} ${ctc.frequency || ''}`.trim();
    }
    return '$0';
  };
  
  return (
    <div className="grid gap-6">
      <Card className="glass overflow-hidden animate-fade-in">
        <div className="relative h-32 bg-gradient-to-r from-primary/20 to-primary/10">
          <div className="absolute -bottom-16 left-8">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarFallback className="bg-primary/10 text-primary text-4xl">
                {getInitials(employee.name)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        <CardContent className="pt-20 pb-6 px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h2 className="text-2xl font-bold">{employee.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{employee.designation}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowEditForm(true)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
              <Button variant="outline" size="sm" className="rounded-full">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button size="sm" className="rounded-full">
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Employee ID</p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span>{employee.id}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>{employee.email}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Phone</p>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>{employee.phone_number}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{formatDate(employee.date_of_birth)} ({employee.age} years)</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Blood Type</p>
              <div className="flex items-center gap-2">
                <Droplet className="h-4 w-4 text-primary" />
                <span>{employee.blood_type}</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Address</p>
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-primary" />
                <span className="truncate">{employee.address}</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Shift Hours</p>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{formatShiftHours()}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">CTC</p>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-primary" />
                <span>{formatCTC(employee.ctc)}</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Department</p>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-primary" />
                <span>{employee.department}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass animate-fade-in [animation-delay:100ms]">
        <CardHeader>
          <CardTitle>Attendance Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-green-500/10 flex flex-col items-center text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
              <span className="text-2xl font-bold">{presentDays}</span>
              <span className="text-sm text-muted-foreground">Present Days</span>
            </div>
            
            <div className="p-4 rounded-lg bg-amber-500/10 flex flex-col items-center text-center">
              <Clock className="h-8 w-8 text-amber-500 mb-2" />
              <span className="text-2xl font-bold">{lateDays}</span>
              <span className="text-sm text-muted-foreground">Late Days</span>
            </div>
            
            <div className="p-4 rounded-lg bg-red-500/10 flex flex-col items-center text-center">
              <XCircle className="h-8 w-8 text-red-500 mb-2" />
              <span className="text-2xl font-bold">{absentDays}</span>
              <span className="text-sm text-muted-foreground">Absent Days</span>
            </div>
            
            <div className="p-4 rounded-lg bg-purple-500/10 flex flex-col items-center text-center">
              <Calendar className="h-8 w-8 text-purple-500 mb-2" />
              <span className="text-2xl font-bold">{leaveDays}</span>
              <span className="text-sm text-muted-foreground">Leave Days</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Attendance Rate</span>
                <span className="text-sm">{attendanceRate.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${attendanceRate}%` }}
                />
              </div>
            </div>
            
            <div className="p-4 rounded-lg border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Punctuality Rate</span>
                <span className="text-sm">{punctualityRate.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: `${punctualityRate}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass animate-fade-in [animation-delay:200ms]">
        <CardHeader>
          <CardTitle>Recent Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          {attendanceRecords.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">No attendance records found.</p>
          ) : (
            <div className="space-y-4">
              {attendanceRecords.slice(0, 5).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {formatDate(record.date)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(record.status)}
                        {record.location && record.location.type && getLocationBadge(record.location.type)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {record.status !== 'absent' && record.status !== 'leave' 
                          ? formatTimeToIST(record.clock_in) 
                          : '-'}
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-1 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {record.clock_out 
                          ? formatTimeToIST(record.clock_out)
                          : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <EditEmployeeForm
        open={showEditForm}
        onOpenChange={setShowEditForm}
        employee={employee}
        onEmployeeUpdated={() => {
          if (onEmployeeUpdated) {
            onEmployeeUpdated();
          }
        }}
      />
    </div>
  );
};

export default EmployeeProfile;