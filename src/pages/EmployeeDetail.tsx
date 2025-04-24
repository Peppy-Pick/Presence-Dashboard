import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Key, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import EmployeeProfile from '@/components/employees/EmployeeProfile';
import { Employee, getEmployeeById, getEmployeeAttendance, deleteEmployee, resetEmployeePassword } from '@/lib/api';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const EmployeeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  
  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        // First fetch employee data
        const employeeData = await getEmployeeById(id);
        setEmployee(employeeData);
        
        // Then try to fetch attendance data
        try {
          const attendanceData = await getEmployeeAttendance(id);
          setAttendanceRecords(attendanceData);
        } catch (error) {
          console.error('Error fetching attendance data:', error);
          // Don't show error toast for attendance - just log it
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
        toast.error('Failed to load employee data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployeeData();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await deleteEmployee(id);
      toast.success('Employee deleted successfully');
      navigate('/employees');
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('Failed to delete employee');
    }
  };

  const handlePasswordReset = async () => {
    if (!id || !newPassword) {
      toast.error('Please enter a new password');
      return;
    }
    
    setIsResettingPassword(true);
    try {
      await resetEmployeePassword(id, newPassword);
      toast.success('Password reset successfully');
      setNewPassword('');
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Failed to reset password');
    } finally {
      setIsResettingPassword(false);
    }
  };
  
  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
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

        {employee && (
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Key className="h-4 w-4" />
                  Reset Password
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Password</AlertDialogTitle>
                  <AlertDialogDescription>
                    Enter a new password for {employee.name}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="mt-2"
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handlePasswordReset}
                    disabled={isResettingPassword || !newPassword}
                  >
                    {isResettingPassword ? 'Resetting...' : 'Reset Password'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Employee
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Employee</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {employee.name}? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
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