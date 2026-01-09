/**
 * API client for CozEats backend
 */

const API_BASE_URL = 'http://0.0.0.0:8000';

export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ApiError {
  detail: string;
}

export interface Group {
  groupId: string;
  name: string;
}

/**
 * Get all groups that a user belongs to
 * Endpoint: GET /users/{userId}/groups
 */
export async function getUserGroups(userId: string): Promise<Group[]> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/groups`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.detail || 'Failed to fetch user groups');
  }

  return response.json();
}

/**
 * Sign up a new user
 */
export async function signup(data: SignupData): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.detail || 'Failed to create account');
  }

  return response.json();
}

/**
 * Login user
 * Note: This is a temporary implementation that verifies credentials
 * by fetching all users. You should implement a proper login endpoint
 * in your backend that returns a JWT token or session.
 */
export async function login(data: LoginData): Promise<User> {
  // TODO: Replace this with actual login endpoint when available
  // For now, this is a placeholder that will need backend implementation
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.detail || 'Invalid email or password');
  }

  return response.json();
}

/**
 * Update user name
 * Endpoint: PUT /users/{userId}/name
 */
export async function updateUserName(
  userId: string,
  name: string
): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/name`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.detail || 'Failed to update user name');
  }

  return response.json();
}

/**
 * Change user password
 * Endpoint: PUT /users/{userId}/password
 */
export async function changePassword(
  userId: string,
  originalPassword: string,
  newPassword: string
): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ originalPassword, newPassword }),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.detail || 'Failed to change password');
  }

  return response.json();
}

