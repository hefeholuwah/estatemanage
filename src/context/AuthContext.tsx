import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextData {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userId: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (error) {
      console.log('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userId: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login(userId, password);
      setUser(response.user);
      setIsLoading(false);
      return response;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.log('Error logging out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}; 