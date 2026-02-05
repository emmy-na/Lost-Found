import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { authService } from '../services/authService';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkAuthStatus = async () => {
      console.log('Checking authentication status...');
      const token = localStorage.getItem('authToken');
      console.log('Token found in localStorage:', token);
      
      if (!token) {
        console.log('No token found, setting user to null');
        setUser(null);
        setLoading(false);
        return;
      }
      
      try {
        console.log('Attempting to fetch current user...');
        const userData = await authService.getCurrentUser();
        console.log('User data received:', userData);
        setUser(userData.user);
      } catch (error) {
        console.log('Error fetching user data:', error);
        // User is not authenticated or token is invalid
        console.log('Clearing auth token and setting user to null');
        localStorage.removeItem('authToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setUser(response.user);
  };

  const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    const response = await authService.register({ name, email, password, password_confirmation: passwordConfirmation });
    setUser(response.user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};