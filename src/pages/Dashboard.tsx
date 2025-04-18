
import React, { useEffect } from 'react';
import EmployeeStats from '@/components/dashboard/EmployeeStats';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { toast } from 'sonner';
import { useAppContext } from '@/context/AppContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDashboardData, clearDashboardCache } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const { setCurrentPage } = useAppContext();
  const queryClient = useQueryClient();
  
  useEffect(() => {
    setCurrentPage('dashboard');
  }, [setCurrentPage]);

  // Use react-query to fetch dashboard data with better error handling
  const { data: dashboardData, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: async () => {
      try {
        console.log('Fetching dashboard data...');
        const data = await getDashboardData();
        console.log('Dashboard data fetched successfully:', data);
        return data;
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Show toast notification if there's an error
  useEffect(() => {
    if (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data. Please try again later.');
    }
  }, [error]);

  const handleRefresh = () => {
    clearDashboardCache();
    queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
    toast.success('Refreshing dashboard data...');
    refetch();
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-8 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-start">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Welcome to the HR Admin Portal. Here's an overview of your employee attendance.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto mt-3 sm:mt-0">
          <Button 
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="text-xs flex-1 sm:flex-none"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>
      </div>
      
      <EmployeeStats 
        totalEmployees={dashboardData?.attendance_summary?.total_employees || 0}
        presentToday={dashboardData?.attendance_summary?.present_count || 0}
        lateToday={dashboardData?.attendance_summary?.late_count || 0}
        absentToday={dashboardData?.attendance_summary?.absent_count || 0}
        presentPercentage={dashboardData?.attendance_summary?.present_percentage}
        latePercentage={dashboardData?.attendance_summary?.late_percentage}
        absentPercentage={dashboardData?.attendance_summary?.absent_percentage}
        isLoading={isLoading}
      />
      
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <RecentActivity 
          activities={dashboardData?.recent_activity || []}
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
};

export default Dashboard;
