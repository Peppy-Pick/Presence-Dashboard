
import React, { useState, useEffect } from 'react';
import EmployeeList from '@/components/employees/EmployeeList';
import AddEmployeeForm from '@/components/employees/AddEmployeeForm';
import { Employee } from '@/lib/api';
import { toast } from 'sonner';
import { Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchAllEmployees } from '@/store/slices/employeeSlice';

const Employees = () => {
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const { setCurrentPage } = useAppContext();
  
  const dispatch = useAppDispatch();
  const { employees = [], isLoading, error } = useAppSelector((state) => state.employees);
  
  useEffect(() => {
    setCurrentPage('employees');
    dispatch(fetchAllEmployees());
  }, [setCurrentPage, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error || 'Failed to load employees');
    }
  }, [error]);
  
  const handleEmployeeAdded = () => {
    dispatch(fetchAllEmployees());
  };
  
  return (
    <div className="space-y-6 pb-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700/50 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gradient">Employee Directory</h1>
              <p className="text-muted-foreground">
                Manage your employees and view their profiles.
              </p>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowAddEmployeeForm(true)}
            className="w-full md:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Employee
          </Button>
        </div>
      </div>
      
      <div className="animate-content-fade-in animate-delay-200">
        <EmployeeList 
          employees={employees} 
          isLoading={isLoading} 
        />
      </div>
      
      <AddEmployeeForm 
        open={showAddEmployeeForm} 
        onOpenChange={setShowAddEmployeeForm}
        onEmployeeAdded={handleEmployeeAdded}
      />
    </div>
  );
};

export default Employees;
