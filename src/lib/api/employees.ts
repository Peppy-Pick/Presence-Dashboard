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
}

// In-memory cache for employees
let employeeCache: Employee[] | null = null;

// Get all employees
export const getAllEmployees = async (): Promise<Employee[]> => {
  try {
    if (employeeCache) {
      console.log('Using cached employees data');
      return employeeCache;
    }
    
    console.log('Fetching all employees from API');
    const response = await fetchWithCache<ApiResponse<Employee[]>>(
      `${EMPLOYEE_API_BASE_URL}/api/employee/all`,
      { cacheTTL: 5 * 60 * 1000 }
    );
    
    if (!response.data) {
      throw new Error('Invalid response format from API');
    }
    
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

// Update employee details
export const updateEmployee = async (id: string, data: Partial<Employee>): Promise<Employee> => {
  try {
    const response = await fetch(`${EMPLOYEE_API_BASE_URL}/api/employee/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update employee: ${response.status}`);
    }

    const result = await response.json();
    
    // Clear cache to ensure fresh data
    resetApiCache();
    employeeCache = null;

    return result.data;
  } catch (error) {
    return handleApiError(error, 'Failed to update employee');
  }
};

// Delete an employee
export const deleteEmployee = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${EMPLOYEE_API_BASE_URL}/api/employee/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete employee: ${response.status}`);
    }
    
    resetApiCache();
    employeeCache = null;
  } catch (error) {
    return handleApiError(error, 'Failed to delete employee');
  }
};

// Reset employee password
export const resetEmployeePassword = async (id: string, newPassword: string): Promise<void> => {
  try {
    const response = await fetch(`${EMPLOYEE_API_BASE_URL}/api/employee/${id}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newPassword }),
    });

    if (!response.ok) {
      throw new Error(`Failed to reset password: ${response.status}`);
    }
  } catch (error) {
    return handleApiError(error, 'Failed to reset employee password');
  }
};

// Clear employee cache specifically
export const clearEmployeeCache = () => {
  employeeCache = null;
};