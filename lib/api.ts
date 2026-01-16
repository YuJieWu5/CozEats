/**
 * API client for CozEats backend
 */

// const API_BASE_URL = 'http://0.0.0.0:8000';
const API_BASE_URL = 'https://coz-eats-server.vercel.app';

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

export interface GroupMemberInfo {
  userName: string | null;
  userEmail: string;
  role: string;
}

export interface GroupDetailResponse {
  groupId: string;
  groupName: string;
  members: GroupMemberInfo[];
  mealCount: number;
  groceryCount: number;
}

export interface GroupCreateData {
  userId: string;
  groupName: string;
}

export interface GroupCreateResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface InviteCreateData {
  groupId: string;
  createdById: string;
}

export interface InviteResponse {
  id: string;
  code: string;
  groupId: string;
  createdById: string;
  expiresAt: string;
  usedBy: string | null;
  createdAt: string;
}

export interface InviteJoinData {
  code: string;
  userId: string;
}

export interface InviteJoinResponse {
  message: string;
  groupId: string;
  groupName: string;
}

/**
 * Create a new group with the user as admin
 * Endpoint: POST /groups
 */
export async function createGroup(data: GroupCreateData): Promise<GroupCreateResponse> {
  const response = await fetch(`${API_BASE_URL}/groups/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.detail || 'Failed to create group');
  }

  return response.json();
}

/**
 * Generate a 6-character invite code for a group with 7-day expiration
 * Endpoint: POST /groups/{groupId}/invite
 */
export async function createGroupInvite(groupId: string, data: InviteCreateData): Promise<InviteResponse> {
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}/invite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.detail || 'Failed to create invite code');
  }

  return response.json();
}

/**
 * Join a group using an invite code
 * Endpoint: POST /groups/invites/join
 */
export async function joinGroupWithInvite(data: InviteJoinData): Promise<InviteJoinResponse> {
  const response = await fetch(`${API_BASE_URL}/groups/invites/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.detail || 'Failed to join group');
  }

  return response.json();
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
 * Get detailed information about a group
 * Endpoint: GET /groups/{groupId}
 */
export async function getGroupDetail(groupId: string): Promise<GroupDetailResponse> {
  const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.detail || 'Failed to fetch group details');
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
 * Sign in user with email and password
 * Endpoint: POST /users/signin
 * Validates credentials using bcrypt and returns user information if successful
 */
export async function login(data: LoginData): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/signin`, {
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

// ==================== Meal APIs ====================

export interface MealResponse {
  id: string;
  name: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  date: string;
  creatorName: string | null;
  createdAt: string;
}

export interface MealCreateData {
  name: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  date: string; // ISO 8601 format
  createdBy: string;
  groupId: string;
}

export interface MealUpdateData {
  name?: string;
  mealType?: 'breakfast' | 'lunch' | 'dinner';
  date?: string; // ISO 8601 format
}

/**
 * Get meals for a specific group, optionally filtered by date
 * Endpoint: GET /meals?groupId={groupId}&date={YYYY-MM-DD}
 */
export async function getMeals(
  groupId: string,
  date?: string
): Promise<MealResponse[]> {
  const params = new URLSearchParams({ groupId });
  if (date) {
    params.append('date', date);
  }

  const response = await fetch(`${API_BASE_URL}/meals?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.detail || 'Failed to fetch meals');
  }

  return response.json();
}

/**
 * Create a new meal
 * Endpoint: POST /meals
 */
export async function createMeal(data: MealCreateData): Promise<MealResponse> {
  const response = await fetch(`${API_BASE_URL}/meals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.detail || 'Failed to create meal');
  }

  return response.json();
}

/**
 * Update a meal
 * Endpoint: PUT /meals/{mealId}
 */
export async function updateMeal(
  mealId: string,
  data: MealUpdateData
): Promise<MealResponse> {
  const response = await fetch(`${API_BASE_URL}/meals/${mealId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.detail || 'Failed to update meal');
  }

  return response.json();
}

/**
 * Delete a meal
 * Endpoint: DELETE /meals/{mealId}
 */
export async function deleteMeal(mealId: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/meals/${mealId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.detail || 'Failed to delete meal');
  }

  return response.json();
}

// ==================== Grocery APIs ====================

export interface GroceryResponse {
  id: string;
  item: string;
  completed: boolean;
  groupId: string;
  completedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GroceryCreateData {
  item: string;
  groupId: string;
}

export interface GroceryUpdateData {
  userId: string;
}

/**
 * Get all grocery items for a specific group
 * Endpoint: GET /groceries?groupId={groupId}
 */
export async function getGroceries(groupId: string): Promise<GroceryResponse[]> {
  const params = new URLSearchParams({ groupId });
  
  const response = await fetch(`${API_BASE_URL}/groceries?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.detail || 'Failed to fetch groceries');
  }

  return response.json();
}

/**
 * Create a new grocery item
 * Endpoint: POST /groceries
 */
export async function createGrocery(data: GroceryCreateData): Promise<GroceryResponse> {
  const response = await fetch(`${API_BASE_URL}/groceries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.detail || 'Failed to create grocery item');
  }

  return response.json();
}

/**
 * Update a grocery item (mark as completed)
 * Endpoint: PUT /groceries/{groceryId}
 */
export async function updateGrocery(
  groceryId: string,
  data: GroceryUpdateData
): Promise<GroceryResponse> {
  const response = await fetch(`${API_BASE_URL}/groceries/${groceryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.detail || 'Failed to update grocery item');
  }

  return response.json();
}

/**
 * Delete a single grocery item
 * Endpoint: DELETE /groceries/{groceryId}
 */
export async function deleteGrocery(groceryId: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/groceries/${groceryId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.detail || 'Failed to delete grocery item');
  }

  return response.json();
}

/**
 * Delete all grocery items for a group
 * Endpoint: DELETE /groceries/group/{groupId}
 */
export async function deleteAllGroceries(groupId: string): Promise<{ message: string; deletedCount: number }> {
  const response = await fetch(`${API_BASE_URL}/groceries/group/${groupId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error: ApiError = await response.json();
    throw new Error(error.detail || 'Failed to delete all groceries');
  }

  return response.json();
}
