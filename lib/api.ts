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
 * Update user information
 */
export async function updateUser(
  userId: string,
  data: { name?: string; password?: string }
): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.detail || 'Failed to update user');
  }

  return response.json();
}

