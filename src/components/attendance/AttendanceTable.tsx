
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { AttendanceRecord } from '@/lib/api/attendance';
import AttendanceFilters from './AttendanceFilters';
import AttendanceTableHeader from './AttendanceTableHeader';
import AttendanceRow from './AttendanceRow';

interface AttendanceTableProps {
  records: AttendanceRecord[];
  date: string;
  isLoading: boolean;
}

const AttendanceTable = ({ records, date, isLoading }: AttendanceTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  
  // Ensure we're working with valid records
  const validRecords = Array.isArray(records) ? records : [];
  
  // De-duplicate records by employee ID
  const uniqueEmployeeIds = new Set<string>();
  const uniqueRecords = validRecords.filter(record => {
    if (!record.employeeId) return false;
    if (uniqueEmployeeIds.has(record.employeeId)) {
      return false;
    }
    uniqueEmployeeIds.add(record.employeeId);
    return true;
  });
  
  // Filter records based on user selections
  const filteredRecords = uniqueRecords.filter((record) => {
    // Add null checks before filtering
    const employeeName = record.employeeName || '';
    const recordStatus = record.status || '';
    const matchesSearch = employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || recordStatus === statusFilter;
    
    // Handle location filtering
    let locationType = '';
    if (record.location && record.location.type) {
      locationType = record.location.type;
    }
    
    const matchesLocation = locationFilter === 'all' || locationType === locationFilter;
    
    return matchesSearch && matchesStatus && matchesLocation;
  });
  
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse p-4">
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 animate-fade-in p-4">
      <AttendanceFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
      />
      
      <div className="rounded-lg glass overflow-hidden border border-slate-200 dark:border-slate-700/50">
        <Table>
          <AttendanceTableHeader />
          <TableBody>
            {filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No attendance records found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredRecords.map((record) => (
                <AttendanceRow key={record.id} record={record} />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AttendanceTable;
