// src/api/healthApi.js

// Vite accesses environment variables prefixed with VITE_ via import.meta.env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

if (!API_BASE_URL) {
  console.error("VITE_API_BASE_URL is not set! API calls will fail.");
}

// Utility to handle JSON responses and detailed error reporting
const handleResponse = async (response) => {
  if (response.status === 204) {
    //  No content, but still success
    return null;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    throw errorData;
  }
  return response.json();
};

// --- AUTHENTICATION API CALLS ---

export const registerUser = async (email, password, display_name) => {
  const response = await fetch(`${API_BASE_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, display_name }),
  });
  return handleResponse(response);
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login/`, { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse(response);
  if (data.token) {
    localStorage.setItem('authToken', data.token); 
    // NEW: Store display name from login response
    if (data.display_name) {
      localStorage.setItem('displayName', data.display_name);
    }
  } else {
    throw new Error("Login successful, but no token received.");
  }
  return data;
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// NEW: Utility to get the stored display name
export const getDisplayName = () => {
  return localStorage.getItem('displayName');
};

export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('displayName'); // Clear display name on logout
};

// --- FITNESS ACTIVITY API CALLS ---
const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication token not found. Please log in.");
  }

  const defaultHeaders = {
    "Content-Type": "application/json",
    "Authorization": `Token ${token}`,
  };

  const response = await fetch(url, {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
  });

  return handleResponse(response);
};

export const saveActivity = (activityData) => {
  return fetchWithAuth(`${API_BASE_URL}/activity/`, {
    method: "POST",
    body: JSON.stringify(activityData),
  });
};

export const viewActivities = () => {
  return fetchWithAuth(`${API_BASE_URL}/activity/list/`, {
    method: "GET",
  });
};

export const getOneActivity = (id) => {
  return fetchWithAuth(`${API_BASE_URL}/activity/${id}/`, {
    method: "GET",
  });
};

export const updateActivity = (id, activityData) => {
  return fetchWithAuth(`${API_BASE_URL}/activity/update/${id}/`, {
    method: "PATCH", 
    body: JSON.stringify(activityData),
  });
};

export const updateActivityStatus = (id, status) => {
  return fetchWithAuth(`${API_BASE_URL}/activity/update/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

export const deleteActivity = (id) => {
  return fetchWithAuth(`${API_BASE_URL}/activity/delete/${id}/`, {
    method: "DELETE",
  });
};