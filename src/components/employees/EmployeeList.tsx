
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import EmployeeCard from './EmployeeCard';
import { Employee } from '@/lib/api';

interface EmployeeListProps {
  employees: Employee[];
  isLoading: boolean;
}

const EmployeeList = ({ employees, isLoading }: EmployeeListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [designationFilter, setDesignationFilter] = useState('all');
  
  // Ensure employees array exists before filtering
  const filteredEmployees = employees ? employees.filter((employee) => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.designation.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDesignation = designationFilter === 'all' || employee.designation === designationFilter;
    
    return matchesSearch && matchesDesignation;
  }) : [];
  
  // Extract unique designations for the filter from non-null employees array
  const designations = employees ? Array.from(new Set(employees.map(e => e.designation))) : [];
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
        {Array(8)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="bg-slate-200 dark:bg-slate-800 h-48 rounded-lg"></div>
          ))}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={designationFilter} onValueChange={setDesignationFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Designation" />
              </div>
            </SelectTrigger>
            <SelectContent className="glass">
              <SelectItem value="all">All Designations</SelectItem>
              {designations.map((designation) => (
                <SelectItem key={designation} value={designation}>
                  {designation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredEmployees.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No employees found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEmployees.map((employee) => (
            <Link to={`/employees/${employee.id}`} key={employee.id} className="block">
              <EmployeeCard employee={employee} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
