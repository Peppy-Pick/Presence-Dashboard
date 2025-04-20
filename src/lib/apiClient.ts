import { toast } from "sonner";

type CacheItem<T> = {
  data: T;
  timestamp: number;
};

// Cache for storing API responses
const apiCache: Map<string, CacheItem<any>> = new Map();
const pendingRequests: Map<string, Promise<any>> = new Map();

// Cache expiration time in milliseconds (5 minutes)
const CACHE_EXPIRATION = 5 * 60 * 1000; 

// Updated config API URL to match the new domain
export const CONFIG_API_URL = 'https://api.peppypresence.com/api/config';

export interface ApiClientOptions {
  useCache?: boolean;
  cacheTTL?: number;
  errorMessage?: string;
  forceRefresh?: boolean;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface ConfigData {
  created_at: string;
  id: string;
  last_modified: string;
  office_location: {
    latitude: number;
    longitude: number;
  };
  last_modified_by: string;
  enforce_geofence: boolean;
  allowed_radius_km: number;
  googleMapsApiKey: string;
}

export interface CreateCompanyRequest {
  companyName: string;
  companySize: string;
  adminName: string;
  adminEmail: string;
  password: string;
}

/**
 * Creates a cache key from the URL and any body data
 */
function createCacheKey(url: string, body?: any): string {
  if (!body) return url;
  return `${url}-${JSON.stringify(body)}`;
}

/**
 * Optimized fetch function with caching and request deduplication
 */
export async function fetchWithCache<T>(
  url: string, 
  options?: RequestInit & ApiClientOptions
): Promise<ApiResponse<T>> {
  const { 
    useCache = true, 
    cacheTTL = CACHE_EXPIRATION, 
    errorMessage = 'An error occurred', 
    forceRefresh = false,
    ...fetchOptions 
  } = options || {};
  
  // Create a cache key based on URL and request body
  const isGet = !fetchOptions.method || fetchOptions.method === 'GET';
  const canCache = isGet && useCache;
  const cacheKey = createCacheKey(url, fetchOptions.body);
  
  // Check if we can use cached data and not forcing refresh
  if (canCache && !forceRefresh) {
    const cachedItem = apiCache.get(cacheKey);
    if (cachedItem && Date.now() - cachedItem.timestamp < cacheTTL) {
      console.log(`Using cached data for: ${url}`);
      return cachedItem.data;
    }
  }
  
  // Check if there's already a pending request for this URL
  if (pendingRequests.has(cacheKey) && !forceRefresh) {
    console.log(`Using pending request for: ${url}`);
    return pendingRequests.get(cacheKey) as Promise<ApiResponse<T>>;
  }
  
  // Create and store the request promise
  const fetchPromise = (async () => {
    try {
      console.log(`Making network request to: ${url}`);
      const response = await fetch(url, fetchOptions);
      
      // Remove from pending requests
      pendingRequests.delete(cacheKey);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Cache the response if it's a GET request
      if (canCache) {
        apiCache.set(cacheKey, { data, timestamp: Date.now() });
      }
      
      return data;
    } catch (error) {
      pendingRequests.delete(cacheKey);
      
      console.error(`API error for ${url}:`, error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(errorMessage);
      }
      
      throw error;
    }
  })();
  
  // Store the promise for deduplication
  pendingRequests.set(cacheKey, fetchPromise);
  
  return fetchPromise;
}

/**
 * Clear the entire API cache or just for a specific URL
 */
export function clearApiCache(url?: string): void {
  if (url) {
    // Clear all entries that start with this URL
    for (const key of apiCache.keys()) {
      if (key.startsWith(url)) {
        apiCache.delete(key);
      }
    }
  } else {
    apiCache.clear();
  }
}

/**
 * Dedicated function to fetch app configuration that can be used across the app
 */
export async function fetchAppConfig(forceRefresh = false): Promise<ApiResponse<ConfigData>> {
  console.log(`Fetching app config${forceRefresh ? ' (forced refresh)' : ''}`);
  return fetchWithCache<ConfigData>(CONFIG_API_URL, { 
    forceRefresh,
    errorMessage: 'Failed to load application configuration'
  });
}

// Add this function to handle company creation
export async function createCompany(data: CreateCompanyRequest): Promise<ApiResponse<any>> {
  try {
    const response = await fetch('https://api.peppypresence.com/api/attendance/createCompany', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
}