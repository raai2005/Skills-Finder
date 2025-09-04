import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AuthService, { AuthUser } from '../services/AuthService';
import { TeamMember } from '@/models/TeamMember';

// Define the shape of the auth context
interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  loginWithGithub: () => Promise<{ success: boolean; message: string; user?: AuthUser }>;
  loginWithGoogle: () => Promise<{ success: boolean; message: string; user?: AuthUser }>;
  register: (userData: RegisterUserData) => Promise<{ success: boolean; message: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyResetToken: (token: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<AuthUser>) => Promise<boolean>;
  findUsersBySkills: (skills: string[]) => Promise<AuthUser[]>;
}

// Register user data interface
export interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  skills: string[];
  tools: string[];
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => ({ success: false, message: 'Not implemented' }),
  loginWithGithub: async () => ({ success: false, message: 'Not implemented' }),
  loginWithGoogle: async () => ({ success: false, message: 'Not implemented' }),
  register: async () => ({ success: false, message: 'Not implemented' }),
  forgotPassword: async () => ({ success: false, message: 'Not implemented' }),
  verifyResetToken: async () => ({ success: false, message: 'Not implemented' }),
  resetPassword: async () => ({ success: false, message: 'Not implemented' }),
  logout: async () => {},
  updateProfile: async () => false,
  findUsersBySkills: async () => [],
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
    const result = await authService.login(email, password);
    
    if (result.success) {
      setUser(authService.getCurrentUser());
    }
    
    return result;
  };
  
  // GitHub login function
  const loginWithGithub = async () => {
    const result = await authService.loginWithGithub();
    
    if (result.success && result.user) {
      setUser(result.user);
    }
    
    return result;
  };
  
  // Google login function
  const loginWithGoogle = async () => {
    const result = await authService.loginWithGoogle();
    
    if (result.success && result.user) {
      setUser(result.user);
    }
    
    return result;
  };

  // Register function
  const register = async (userData: RegisterUserData) => {
    const result = await authService.register(userData);
    
    if (result.success) {
      setUser(authService.getCurrentUser());
    }
    
    return result;
  };

  // Forgot password function
  const forgotPassword = async (email: string) => {
    return await authService.forgotPassword(email);
  };

  // Logout function
  const logout = async () => {
    await authService.logout();
    setUser(null);
  };
  
  // Update profile function
  const updateProfile = async (profileData: Partial<AuthUser>) => {
    if (!user) return false;
    
    const success = await authService.updateUserProfile(user.id, profileData);
    
    if (success) {
      // Refresh user data
      setUser(authService.getCurrentUser());
    }
    
    return success;
  };
  
  // Find users by skills
  const findUsersBySkills = async (skills: string[]) => {
    return await authService.findUsersBySkills(skills);
  };
  
  // Verify reset token
  const verifyResetToken = async (token: string) => {
    return await authService.verifyResetToken(token);
  };
  
  // Reset password
  const resetPassword = async (token: string, newPassword: string) => {
    return await authService.resetPassword(token, newPassword);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    login,
    loginWithGithub,
    loginWithGoogle,
    register,
    forgotPassword,
    verifyResetToken,
    resetPassword,
    logout,
    updateProfile,
    findUsersBySkills,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
