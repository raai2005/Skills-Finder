import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AuthService, { AuthUser } from '../services/AuthService';
import { TeamMember } from '@/models/TeamMember';

// Define the shape of the auth context
interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: RegisterUserData) => Promise<{ success: boolean; message: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

// Register user data interface
export interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  skills: string[];
  tools: string[];
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => ({ success: false, message: 'Not implemented' }),
  register: async () => ({ success: false, message: 'Not implemented' }),
  forgotPassword: async () => ({ success: false, message: 'Not implemented' }),
  logout: () => {},
});

// Create a provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const authService = AuthService.getInstance();

  // Check if the user is already authenticated on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    const result = authService.login(email, password);
    
    if (result.success) {
      setUser(authService.getCurrentUser());
    }
    
    return result;
  };

  // Register function
  const register = async (userData: RegisterUserData) => {
    const result = authService.register(userData);
    
    if (result.success) {
      setUser(authService.getCurrentUser());
    }
    
    return result;
  };

  // Forgot password function
  const forgotPassword = async (email: string) => {
    return authService.forgotPassword(email);
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    login,
    register,
    forgotPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
