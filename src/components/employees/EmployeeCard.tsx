import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Employee } from '@/lib/api';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Briefcase, Mail, Phone } from 'lucide-react';

interface EmployeeCardProps {
  employee: Employee;
}

const EmployeeCard = ({ employee }: EmployeeCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatShiftType = () => {
    if (typeof employee.employee_shift_hours === 'string') {
      return employee.employee_shift_hours;
    } else if (employee.employee_shift_hours && typeof employee.employee_shift_hours === 'object') {
      const { start, end } = employee.employee_shift_hours;
      return `${start} - ${end}`;
    }
    return 'Regular Shift';
  };

  return (
    <Card className="glass overflow-hidden card-hover h-full animate-scale-in">
      <CardContent className="p-0">
        <div className="relative h-24 bg-gradient-to-r from-primary/20 to-primary/10">
          <div className="absolute -bottom-10 left-6">
            <Avatar className="h-20 w-20 border-4 border-background">
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(employee.name)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        <div className="pt-12 pb-4 px-6 space-y-4">
          <div>
            <h3 className="font-semibold text-lg leading-tight">{employee.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{employee.designation}</span>
            </div>
            <div className="mt-1">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {employee.department}
              </Badge>
            </div>
          </div>
          
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            {formatShiftType()}
          </Badge>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="truncate text-muted-foreground">{employee.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{employee.phone_number}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeCard;