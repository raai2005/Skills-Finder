import { TeamMember } from '../models/TeamMember';
import TeamMemberService from './TeamMemberService';

// Simple authentication states
export type AuthStatus = 'unauthenticated' | 'authenticated' | 'admin';

// Interface for authenticated user
export interface AuthUser {
  id: string;
  name: string;
  role?: 'admin' | 'user' | 'manager';
  isAuthenticated: boolean;
  isAdmin: boolean;
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
   * Login with username and password
   * @param username User's email or username
   * @param password User's password
   * @returns Auth status
   */
  public login(username: string, password: string): { success: boolean; message: string } {
    // In a real app, this would validate against a backend service
    // For demo purposes, we'll use these hardcoded credentials
    if (username === 'admin' && password === 'admin123') {
      // Find admin in team members
      const adminMember = this.teamMemberService.getAllMembers().find(m => m.role === 'admin');
      
      if (adminMember) {
        this.currentUser = {
          id: adminMember.id,
          name: adminMember.name,
          role: 'admin',
          isAuthenticated: true,
          isAdmin: true
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
      m.name.toLowerCase() === username.toLowerCase() && password === 'user123'
    );
    
    if (matchedMember) {
      this.currentUser = {
        id: matchedMember.id,
        name: matchedMember.name,
        role: matchedMember.role || 'user',
        isAuthenticated: true,
        isAdmin: matchedMember.role === 'admin'
      };
      
      // Update last active time
      matchedMember.lastActive = new Date();
      this.teamMemberService.updateMember(matchedMember);
      
      return { success: true, message: 'Login successful!' };
    }
    
    return { success: false, message: 'Invalid username or password' };
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
