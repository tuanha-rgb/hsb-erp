// Frontend API client for Zoho integration
// Calls our backend proxy server instead of Zoho directly to avoid CORS issues

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface ZohoUser {
  // Standard fields
  ID?: string;
  Name?: string;
  Email?: string;
  Phone?: string;
  Role?: string;
  Department?: string;
  Status?: string;
  Last_Login?: string;
  Created_Time?: string;

  // Student Profile specific fields
  Student_Code?: string;
  Gender?: string;
  Date_of_Birth?: string;
  Program?: string;
  Cohort?: string;
  Group?: string;
  Image?: string;
  Program_Name_English?: string;
  Cohort_Begin?: string;
  Degree?: string;

  [key: string]: any;
}

export interface ZohoResponse<T> {
  data?: T;
  code?: number;
  message?: string;
}

export interface GetUsersOptions {
  type?: 'students' | 'lecturers';  // Which custom function to call
}

/**
 * Get all users from Zoho via our backend proxy (using custom Zoho Creator functions)
 */
export async function getZohoUsers(options?: GetUsersOptions): Promise<ZohoUser[]> {
  try {
    const {
      type = 'students'
    } = options || {};

    console.log('[Zoho API] Fetching users from backend proxy...', { type });

    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('type', type);

    const url = `${API_BASE_URL}/zoho/users?${queryParams.toString()}`;
    console.log('[Zoho API] Request URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('[Zoho API] Error response:', errorData);
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data: ZohoResponse<ZohoUser[]> = await response.json();
    console.log('[Zoho API] Users fetched successfully:', data.data?.length || 0);

    return data.data || [];
  } catch (error) {
    console.error('[Zoho API] Error fetching users:', error);
    throw error;
  }
}

/**
 * Get specific user by ID
 */
export async function getZohoUserById(id: string): Promise<ZohoUser | null> {
  try {
    console.log('[Zoho API] Fetching user:', id);

    const response = await fetch(`${API_BASE_URL}/zoho/users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: ZohoResponse<ZohoUser> = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('[Zoho API] Error fetching user:', error);
    throw error;
  }
}

/**
 * Create new user in Zoho
 */
export async function createZohoUser(userData: Partial<ZohoUser>): Promise<ZohoUser> {
  try {
    console.log('[Zoho API] Creating user:', userData);

    const response = await fetch(`${API_BASE_URL}/zoho/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data: ZohoResponse<ZohoUser> = await response.json();
    console.log('[Zoho API] User created successfully');

    if (!data.data) {
      throw new Error('No data returned from create operation');
    }

    return data.data;
  } catch (error) {
    console.error('[Zoho API] Error creating user:', error);
    throw error;
  }
}

/**
 * Update user in Zoho
 */
export async function updateZohoUser(id: string, userData: Partial<ZohoUser>): Promise<ZohoUser> {
  try {
    console.log('[Zoho API] Updating user:', id, userData);

    const response = await fetch(`${API_BASE_URL}/zoho/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data: ZohoResponse<ZohoUser> = await response.json();
    console.log('[Zoho API] User updated successfully');

    if (!data.data) {
      throw new Error('No data returned from update operation');
    }

    return data.data;
  } catch (error) {
    console.error('[Zoho API] Error updating user:', error);
    throw error;
  }
}

/**
 * Delete user from Zoho
 */
export async function deleteZohoUser(id: string): Promise<boolean> {
  try {
    console.log('[Zoho API] Deleting user:', id);

    const response = await fetch(`${API_BASE_URL}/zoho/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    console.log('[Zoho API] User deleted successfully');
    return true;
  } catch (error) {
    console.error('[Zoho API] Error deleting user:', error);
    throw error;
  }
}

/**
 * Check if backend server is healthy
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    console.log('[Zoho API] Backend health check:', data);
    return data.status === 'ok';
  } catch (error) {
    console.error('[Zoho API] Backend health check failed:', error);
    return false;
  }
}

/**
 * List all available reports in the Zoho app
 */
export async function listZohoReports(): Promise<any> {
  try {
    console.log('[Zoho API] Listing available reports...');

    const response = await fetch(`${API_BASE_URL}/zoho/reports`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('[Zoho API] Error listing reports:', errorData);
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[Zoho API] Available reports:', data);
    return data;
  } catch (error) {
    console.error('[Zoho API] Error listing reports:', error);
    throw error;
  }
}
