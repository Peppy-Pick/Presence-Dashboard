
import { fetchWithCache, handleApiError, ApiResponse, EMPLOYEE_API_BASE_URL, resetApiCache } from './utils';

// Employee type definition
export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone_number: string;
  job_title: string;
  department: string;
  location: string;
  hire_date: string;
  salary: number;
  designation: string;
  employee_shift_hours: {
    start: string;
    end: string;
    hours: number;
    days: string[];
  };
  address: string;
  date_of_birth: string;
  age: number;
  blood_type: string;
  ctc: {
    amount: number;
    currency: string;
    frequency: string;
  };
  // Add other employee properties as needed
}

// In-memory cache for employees
let employeeCache: Employee[] | null = null;

// Get all employees
export const getAllEmployees = async (): Promise<Employee[]> => {
  try {
    // Check if we have cached data
    if (employeeCache) {
      console.log('Using cached employees data');
      return employeeCache;
    }
    
    console.log('Fetching all employees from API - this should only be called when needed');
    const response = await fetchWithCache<ApiResponse<Employee[]>>(
      `${EMPLOYEE_API_BASE_URL}/api/employee/all`,
      { cacheTTL: 5 * 60 * 1000 } // Cache for 5 minutes
    );
    
    if (!response.data) {
      throw new Error('Invalid response format from API');
    }
    
    // Cache the employees data
    employeeCache = response.data;
    console.log('Fetched employees from API:', response.data);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch employees');
  }
};

// Get employee by ID
export const getEmployeeById = async (id: string): Promise<Employee> => {
  try {
    const response = await fetchWithCache<ApiResponse<Employee>>(
      `${EMPLOYEE_API_BASE_URL}/api/employee/${id}`,
      { cacheTTL: 5 * 60 * 1000 }
    );
    
    if (!response.data) {
      throw new Error('Invalid response format from API');
    }
    
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch employee details');
  }
};

// Create a new employee
export const createEmployee = async (employeeData: Omit<Employee, 'id'>): Promise<Employee> => {
  try {
    const response = await fetch(`${EMPLOYEE_API_BASE_URL}/api/employee/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create employee: ${response.status}`);
    }

    const responseData: ApiResponse<Employee> = await response.json();

    if (!responseData.data) {
      throw new Error('Invalid response format from API');
    }
    
    // Clear the employee cache so that the new employee is fetched
    resetApiCache();
    employeeCache = null;
    
    return responseData.data;
  } catch (error) {
    return handleApiError(error, 'Failed to create employee');
  }
};

// Update an employee
export const updateEmployee = async (id: string, employeeData: Partial<Employee>): Promise<Employee> => {
  try {
    const response = await fetch(`${EMPLOYEE_API_BASE_URL}/api/employee/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update employee: ${response.status}`);
    }

    const responseData: ApiResponse<Employee> = await response.json();

     if (!responseData.data) {
      throw new Error('Invalid response format from API');
    }
    
    // Clear the employee cache so that the updated employee is fetched
    resetApiCache();
    employeeCache = null;

    return responseData.data;
  } catch (error) {
    return handleApiError(error, 'Failed to update employee');
  }
};

// Delete an employee
export const deleteEmployee = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${EMPLOYEE_API_BASE_URL}/api/employee/delete/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete employee: ${response.status}`);
    }
    
    // Clear the employee cache so that the employee list is refreshed
    resetApiCache();
    employeeCache = null;
  } catch (error) {
    return handleApiError(error, 'Failed to delete employee');
  }
};

// Clear employee cache specifically
export const clearEmployeeCache = () => {
  employeeCache = null;
};
