import { fetchWithCache, handleApiError, ApiResponse, ATTENDANCE_API_BASE_URL, clearApiCacheEntry } from './utils';

// Config types
export interface ConfigData {
  googleMapsApiKey: string;
  office_location: {
    latitude: number;
    longitude: number;
  };
  allowed_radius_km: number;
  attendance_settings: {
    late_buffer_minutes: number;
    allow_manual_time: boolean;
    max_time_adjustment: number;
    require_approval: boolean;
  };
  id?: string;
  created_at?: string;
  last_modified?: string;
  last_modified_by?: string;
  enforce_geofence?: boolean;
}

// Get config data
export const getConfigData = async (): Promise<ConfigData> => {
  try {
    const response = await fetchWithCache<ApiResponse<ConfigData>>(
      `${ATTENDANCE_API_BASE_URL}/api/config`,
      { cacheTTL: 60 * 60 * 1000 } // Cache for 1 hour
    );
    
    if (!response.data) {
      throw new Error('Invalid response format from config API');
    }
    
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch config data');
  }
};

// Update config data
export const updateConfigData = async (configData: Partial<ConfigData>): Promise<ConfigData> => {
  try {
    // Fetch current config data first to ensure we have all required fields
    const currentConfig = await getConfigData();
    
    // Merge with current config to ensure all required fields are present
    const updatedConfig = {
      ...currentConfig,
      ...configData,
      last_modified: new Date().toISOString(),
      last_modified_by: "user"
    };
    
    console.log("Sending updated config to API:", updatedConfig);
    
    const response = await fetch(`${ATTENDANCE_API_BASE_URL}/api/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedConfig)
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Clear cache for config endpoint to ensure fresh data on next fetch
    clearApiCacheEntry(`${ATTENDANCE_API_BASE_URL}/api/config`);
    
    return data.data;
  } catch (error) {
    return handleApiError(error, 'Failed to update config data');
  }
};