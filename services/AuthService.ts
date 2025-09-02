import { TeamMember } from '../models/TeamMember';
import TeamMemberService from './TeamMemberService';
import { RegisterUserData } from '@/contexts/AuthContext';

// Simple authentication states
export type AuthStatus = 'unauthenticated' | 'authenticated' | 'admin';

// Interface for authenticated user
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'user' | 'manager';
  isAuthenticated: boolean;
  isAdmin: boolean;
  skills: string[];
  tools: string[];
}

/**
 * Simple authentication service for the Skills Finder app
 * In a real app, this would use secure storage, tokens, etc.
 */
class AuthService {
  private static instance: AuthService;
  private currentUser: AuthUser | null = null;
  private teamMemberService: TeamMemberService;

  private constructor() {
    this.teamMemberService = TeamMemberService.getInstance();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Login with email and password
   * @param email User's email
   * @param password User's password
   * @returns Auth status
   */
  public login(email: string, password: string): { success: boolean; message: string } {
    // In a real app, this would validate against a backend service
    // For demo purposes, we'll use these hardcoded credentials
    if (email === 'admin@example.com' && password === 'admin123') {
      // Find admin in team members
      const adminMember = this.teamMemberService.getAllMembers().find(m => m.role === 'admin');
      
      if (adminMember) {
        this.currentUser = {
          id: adminMember.id,
          name: adminMember.name,
          email: 'admin@example.com',
          role: 'admin',
          isAuthenticated: true,
          isAdmin: true,
          skills: adminMember.skills || [],
          tools: adminMember.tools || []
        };
        
        // Update last active time
        adminMember.lastActive = new Date();
        this.teamMemberService.updateMember(adminMember);
        
        return { success: true, message: 'Login successful!' };
      }
    }
    
    // Try regular user login (for demo only)
    const allMembers = this.teamMemberService.getAllMembers();
    const matchedMember = allMembers.find(m => 
      m.email?.toLowerCase() === email.toLowerCase() && password === 'user123'
    );
    
    if (matchedMember) {
      this.currentUser = {
        id: matchedMember.id,
        name: matchedMember.name,
        email: email,
        role: matchedMember.role || 'user',
        isAuthenticated: true,
        isAdmin: matchedMember.role === 'admin',
        skills: matchedMember.skills || [],
        tools: matchedMember.tools || []
      };
      
      // Update last active time
      matchedMember.lastActive = new Date();
      this.teamMemberService.updateMember(matchedMember);
      
      return { success: true, message: 'Login successful!' };
    }
    
    return { success: false, message: 'Invalid email or password' };
  }

  /**
   * Register a new user
   * @param userData User registration data
   * @returns Registration status
   */
  public register(userData: RegisterUserData): { success: boolean; message: string } {
    // Check if email is already in use
    const allMembers = this.teamMemberService.getAllMembers();
    const existingMember = allMembers.find(m => 
      m.email?.toLowerCase() === userData.email.toLowerCase()
    );

    if (existingMember) {
      return { success: false, message: 'Email already in use' };
    }

    // Create a new team member
    const newMember: TeamMember = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      skills: userData.skills,
      tools: userData.tools,
      willingToHelp: true,
      isActive: true,
      role: 'user',
      lastActive: new Date(),
      borrowedItems: []
    };

    // Add the new member
    this.teamMemberService.addMember(newMember);

    // Auto login the new user
    this.currentUser = {
      id: newMember.id,
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      isAuthenticated: true,
      isAdmin: false,
      skills: newMember.skills,
      tools: newMember.tools
    };

    return { success: true, message: 'Registration successful!' };
  }

  /**
   * Forgot password functionality
   * @param email User's email
   * @returns Forgot password status
   */
  public forgotPassword(email: string): { success: boolean; message: string } {
    // In a real app, this would send a password reset email
    // For demo purposes, we'll just check if the email exists
    const allMembers = this.teamMemberService.getAllMembers();
    const existingMember = allMembers.find(m => 
      m.email?.toLowerCase() === email.toLowerCase()
    );

    if (!existingMember) {
      return { success: false, message: 'Email not found' };
    }

    return { 
      success: true, 
      message: 'Password reset link sent to your email. Please check your inbox.' 
    };
  }

  /**
   * Logout the current user
   */
  public logout(): void {
    this.currentUser = null;
  }

  /**
   * Get the current user
   * @returns Current authenticated user or null
   */
  public getCurrentUser(): AuthUser | null {
    return this.currentUser;
  }

  /**
   * Check if the user is authenticated
   * @returns True if authenticated
   */
  public isAuthenticated(): boolean {
    return this.currentUser !== null && this.currentUser.isAuthenticated;
  }

  /**
   * Check if the user is an admin
   * @returns True if admin
   */
  public isAdmin(): boolean {
    return this.currentUser !== null && this.currentUser.isAdmin;
  }
}

export default AuthService;
