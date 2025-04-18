
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmployeeProfile from '@/components/employees/EmployeeProfile';
import { Employee, AttendanceRecord, getEmployeeById, getEmployeeAttendance } from '@/lib/api';
import { toast } from 'sonner';

const EmployeeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const [employeeData, attendanceData] = await Promise.all([
          getEmployeeById(id),
          getEmployeeAttendance(id)
        ]);
        
        // Process attendance records to ensure all times are in IST format
        const processedAttendanceData = attendanceData.map(record => ({
          ...record,
          // Leave clock_in and clock_out as is - they'll be formatted in the EmployeeProfile component
        }));
        
        setEmployee(employeeData);
        setAttendanceRecords(processedAttendanceData);
      } catch (error) {
        console.error('Error fetching employee data:', error);
        toast.error('Failed to load employee data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployeeData();
  }, [id]);
  
  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => navigate('/employees')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Employee Profile</h1>
      </div>
      
      {employee ? (
        <EmployeeProfile 
          employee={employee} 
          attendanceRecords={attendanceRecords} 
          isLoading={isLoading} 
        />
      ) : isLoading ? (
        <div className="animate-pulse h-96 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Employee not found.</p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => navigate('/employees')}
          >
            Back to Employees
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetail;
