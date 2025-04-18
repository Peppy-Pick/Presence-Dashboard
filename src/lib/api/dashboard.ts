import {
  ApiResponse,
  ATTENDANCE_API_BASE_URL,
  fetchWithCache,
  resetApiCache
} from "./utils";

// Dashboard types
export interface WeeklyOverviewItem {
  date: string;
  display_date: string;
  present: number;
  total: number;
}

export interface RecentActivityItem {
  employee_id: string;
  name: string;
  action: string;
  time: string;
  is_late: boolean;
  employee_name: string;
}

export interface AttendanceSummary {
  date: string;
  total_employees: number;
  present_count: number;
  late_count: number;
  absent_count: number;
  present_percentage: number;
  late_percentage: number;
  absent_percentage: number;
}

export interface DashboardData {
  attendance_summary: AttendanceSummary;
  recent_activity: RecentActivityItem[];
  weekly_overview: WeeklyOverviewItem[];
}

// In-memory cache for dashboard data
let dashboardCache: DashboardData | null = null;

// Get dashboard data
export const getDashboardData = async (): Promise<DashboardData> => {
  // Check if we have cached data
  if (dashboardCache) {
    console.log("Using cached dashboard data");
    return dashboardCache;
  }

  try {
    console.log("Fetching dashboard data from API...");
    const response = await fetchWithCache<ApiResponse<DashboardData>>(
      `${ATTENDANCE_API_BASE_URL}/api/dashboard`,
      { cacheTTL: 5 * 60 * 1000 }
    );

    if (!response.data) {
      throw new Error("API returned null data");
    }

    // Cache the dashboard data
    dashboardCache = response.data;
    return response.data;
  } catch (error) {
    console.error("Failed to fetch dashboard data from API");
  }
};

// Clear dashboard cache
export const clearDashboardCache = () => {
  console.log("Clearing dashboard cache");
  dashboardCache = null;
  resetApiCache();
};
