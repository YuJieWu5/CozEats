/**
 * Authentication context for managing user state across the app
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, getUserGroups } from './api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = '@cozeats_user';
const SELECTED_GROUP_KEY = '@cozeats_selected_group';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from storage on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: User) => {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
      
      // Fetch user's groups and set the first group as selected
      const groups = await getUserGroups(userData.id);
      if (groups.length > 0) {
        await AsyncStorage.setItem(SELECTED_GROUP_KEY, groups[0].groupId);
      }
    } catch (error) {
      console.error('Failed to save user:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      await AsyncStorage.removeItem(SELECTED_GROUP_KEY);
      setUser(null);
    } catch (error) {
      console.error('Failed to logout:', error);
      throw error;
    }
  };

  const updateUser = async (userData: User) => {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

