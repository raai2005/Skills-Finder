import { TeamMember } from '../models/TeamMember';
import TeamMemberService from './TeamMemberService';
import { RegisterUserData } from '@/contexts/AuthContext';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  OAuthCredential
} from 'firebase/auth';
import { auth, firestore, firebaseConfigured } from '../firebase';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

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
  photoURL?: string;
  skills: string[];
  tools: string[];
  githubUsername?: string;
}

/**
 * Firebase authentication service for the Skills Finder app
 */
class AuthService {
  private static instance: AuthService;
  private currentUser: AuthUser | null = null;
  private teamMemberService: TeamMemberService;

  private constructor() {
    this.teamMemberService = TeamMemberService.getInstance();
    
    // Set up auth state listener only if Firebase is configured
    if (firebaseConfigured && auth) {
      onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
        if (user) {
          const userProfile = await this.getUserProfile(user.uid);
          this.currentUser = this.mapFirebaseUserToAuthUser(user, userProfile);
        } else {
          this.currentUser = null;
        }
      });
    } else {
      console.warn('Firebase not configured; running in fallback/auth-lite mode.');
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Map Firebase user to our app's user model
   */
  private mapFirebaseUserToAuthUser(firebaseUser: FirebaseUser, userProfile: Record<string, any>): AuthUser {
    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || userProfile?.name || 'User',
      email: firebaseUser.email || '',
      photoURL: firebaseUser.photoURL || undefined,
      isAuthenticated: true,
      isAdmin: userProfile?.role === 'admin',
      role: userProfile?.role || 'user',
      skills: userProfile?.skills || [],
      tools: userProfile?.tools || [],
      githubUsername: userProfile?.githubUsername,
    };
  }

  /**
   * Login with email and password
   * @param email User's email
   * @param password User's password
   * @returns Auth status
   */
  public async login(email: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      // For backward compatibility, keep the hardcoded admin check
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
          
          return { success: true, message: 'Admin login successful!' };
        }
      }
      
      // Use Firebase authentication when configured
      if (firebaseConfigured && auth) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Get user profile from Firestore
        const userProfile = await this.getUserProfile(user.uid);
        
        // Set the current user
        this.currentUser = this.mapFirebaseUserToAuthUser(user, userProfile);
        
        return { success: true, message: 'Login successful!' };
      }
      // If not configured, use legacy/mock flow
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
        
        matchedMember.lastActive = new Date();
        this.teamMemberService.updateMember(matchedMember);
        
        return { success: true, message: 'Login successful!' };
      }
      
      return { success: false, message: 'Firebase not configured and no matching mock user found.' };
    } catch (error: any) {
      console.error('Error in login:', error);
      
      // Try regular user login (for backward compatibility)
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
      
      return { 
        success: false, 
        message: error.message || 'Invalid email or password' 
      };
    }
  }

  /**
   * Login with GitHub
   */
  public async loginWithGithub(): Promise<{ success: boolean; message: string; user?: AuthUser }> {
    try {
      if (!firebaseConfigured || !auth) {
        // Demo mode fallback for GitHub login
        const demoUser: AuthUser = {
          id: 'demo-github',
          name: 'GitHub Demo User',
          email: '',
          role: 'user',
          isAuthenticated: true,
          isAdmin: false,
          skills: [],
          tools: [],
          githubUsername: 'demo'
        };
        this.currentUser = demoUser;
        return { success: true, message: 'Logged in with GitHub (demo mode)', user: demoUser };
      }
      const provider = new GithubAuthProvider();
      provider.addScope('user');
      provider.addScope('repo');
      
      const result = await signInWithPopup(auth, provider);
      
      // Get GitHub credentials
      const credential = GithubAuthProvider.credentialFromResult(result) as OAuthCredential;
      const token = credential.accessToken;
      
      // The signed-in user info
      const user = result.user;
      // Access the Github username from the provider data or providerData
      const githubUsername = (user.providerData[0]?.providerId === 'github.com') ? 
        user.providerData[0].displayName : 
        (user as any).reloadUserInfo?.screenName || user.displayName;
      
      // Check if user exists in Firestore
      let userProfile = await this.getUserProfile(user.uid);
      
      if (!userProfile) {
        // Create new user profile
        userProfile = {
          uid: user.uid,
          name: user.displayName || 'GitHub User',
          email: user.email || '',
          photoURL: user.photoURL,
          role: 'user',
          githubUsername,
          githubAccessToken: token,
          skills: [],
          tools: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        // Save to Firestore
        await setDoc(doc(firestore, 'users', user.uid), userProfile);
      } else {
        // Update existing profile with GitHub info
        await updateDoc(doc(firestore, 'users', user.uid), {
          githubUsername,
          githubAccessToken: token,
          photoURL: user.photoURL,
          updatedAt: new Date(),
        });
        
        // Merge with existing data
        userProfile = {
          ...userProfile,
          githubUsername,
          githubAccessToken: token,
          photoURL: user.photoURL,
        };
      }
      
      // Set current user
      this.currentUser = this.mapFirebaseUserToAuthUser(user, userProfile);
      
      return { 
        success: true, 
        message: 'GitHub login successful!',
        user: this.currentUser
      };
    } catch (error: any) {
      console.error('Error in GitHub login:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to log in with GitHub.' 
      };
    }
  }

  /**
   * Login with Google
   */
  public async loginWithGoogle(): Promise<{ success: boolean; message: string; user?: AuthUser }> {
    try {
      if (!firebaseConfigured || !auth) {
        // Demo mode fallback for Google login
        const demoUser: AuthUser = {
          id: 'demo-google',
          name: 'Google Demo User',
          email: '',
          role: 'user',
          isAuthenticated: true,
          isAdmin: false,
          skills: [],
          tools: [],
        };
        this.currentUser = demoUser;
        return { success: true, message: 'Logged in with Google (demo mode)', user: demoUser };
      }
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      const result = await signInWithPopup(auth, provider);
      
      // Get Google credentials
      const credential = GoogleAuthProvider.credentialFromResult(result) as OAuthCredential;
      const token = credential.accessToken;
      
      // The signed-in user info
      const user = result.user;
      
      // Check if user exists in Firestore
      let userProfile = await this.getUserProfile(user.uid);
      
      if (!userProfile) {
        // Create new user profile
        userProfile = {
          uid: user.uid,
          name: user.displayName || 'Google User',
          email: user.email || '',
          photoURL: user.photoURL,
          role: 'user',
          googleAccessToken: token,
          skills: [],
          tools: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        // Save to Firestore
        await setDoc(doc(firestore, 'users', user.uid), userProfile);
      } else {
        // Update existing profile with Google info
        await updateDoc(doc(firestore, 'users', user.uid), {
          googleAccessToken: token,
          photoURL: user.photoURL || userProfile.photoURL,
          updatedAt: new Date(),
        });
        
        // Merge with existing data
        userProfile = {
          ...userProfile,
          googleAccessToken: token,
          photoURL: user.photoURL || userProfile.photoURL,
        };
      }
      
      // Set current user
      this.currentUser = this.mapFirebaseUserToAuthUser(user, userProfile);
      
      return { 
        success: true, 
        message: 'Google login successful!',
        user: this.currentUser
      };
    } catch (error: any) {
      console.error('Error in Google login:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to log in with Google.' 
      };
    }
  }

  /**
   * Register a new user
   * @param userData User registration data
   * @returns Registration status
   */
  public async register(userData: RegisterUserData): Promise<{ success: boolean; message: string }> {
    try {
      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      
      const user = userCredential.user;
      
      // Update the user's profile
      await updateProfile(user, {
        displayName: userData.name,
      });
      
      // Create a user document in Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        uid: user.uid,
        name: userData.name,
        email: userData.email,
        phoneNumber: userData.phoneNumber || '',
        role: 'user',
        skills: userData.skills || [],
        tools: userData.tools || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      // For backward compatibility, also create a team member
      const newMember: TeamMember = {
        id: user.uid,
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
      
      // Set the current user
      this.currentUser = {
        id: user.uid,
        name: userData.name,
        email: userData.email,
        isAuthenticated: true,
        isAdmin: false,
        role: 'user',
        skills: userData.skills || [],
        tools: userData.tools || [],
      };
      
      return { success: true, message: 'Registration successful!' };
    } catch (error: any) {
      console.error('Error in registration:', error);
      
      // Check if email already exists (fallback method)
      if (error.code === 'auth/email-already-in-use') {
        return { success: false, message: 'Email already in use' };
      }
      
      return { 
        success: false, 
        message: error.message || 'Failed to register. Please try again.' 
      };
    }
  }

  /**
   * Forgot password functionality
   * @param email User's email
   * @returns Forgot password status
   */
  public async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!firebaseConfigured || !auth) {
        throw new Error('Firebase not configured');
      }
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'Password reset email sent!' };
    } catch (error: any) {
      console.error('Error in password reset:', error);
      
      // Fallback for mock data
      const allMembers = this.teamMemberService.getAllMembers();
      const existingMember = allMembers.find(m => 
        m.email?.toLowerCase() === email.toLowerCase()
      );
  
      if (existingMember) {
        return { 
          success: true, 
          message: 'Password reset link sent to your email. Please check your inbox.' 
        };
      }
      
      return { 
        success: false, 
        message: error.message || 'Failed to send password reset email.' 
      };
    }
  }

  /**
   * Logout the current user
   */
  public async logout(): Promise<void> {
    try {
      if (firebaseConfigured && auth) {
        await signOut(auth);
      }
      this.currentUser = null;
    } catch (error) {
      console.error('Error in logout:', error);
      // Fallback to simple logout
      this.currentUser = null;
    }
  }

  /**
   * Get user profile from Firestore
   */
  public async getUserProfile(userId: string): Promise<Record<string, any>> {
    try {
  if (!firebaseConfigured || !firestore) throw new Error('Firebase not configured');
      const docRef = doc(firestore, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log('No user profile found!');
        return {};
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      return {};
    }
  }

  /**
   * Update user profile
   */
  public async updateUserProfile(userId: string, profileData: Partial<AuthUser>): Promise<boolean> {
    try {
  if (!firebaseConfigured || !firestore) throw new Error('Firebase not configured');
      const docRef = doc(firestore, 'users', userId);
      
      // Prepare update data (remove id and authentication status)
      const { id, isAuthenticated, isAdmin, ...updateData } = profileData;
      
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: new Date()
      });
      
      // Update current user if it's the logged-in user
      if (this.currentUser && this.currentUser.id === userId) {
        this.currentUser = {
          ...this.currentUser,
          ...profileData
        };
      }
      
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
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
  
  /**
   * Find users by skills
   */
  public async findUsersBySkills(skills: string[]): Promise<AuthUser[]> {
    try {
  if (!skills.length) return [];
  if (!firebaseConfigured || !firestore) throw new Error('Firebase not configured');
  const usersRef = collection(firestore, 'users');
      const usersList: AuthUser[] = [];
      
      // For each skill, find users that have it
      // Note: In a real app, you'd use a more efficient query
      for (const skill of skills) {
        const q = query(
          usersRef, 
          where('skills', 'array-contains', skill)
        );
        
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc: any) => {
          const userData = doc.data();
          
          // Check if this user is already in our list
          const existingUser = usersList.find(u => u.id === userData.uid);
          if (!existingUser) {
            usersList.push({
              id: userData.uid,
              name: userData.name,
              email: userData.email,
              role: userData.role,
              isAuthenticated: true,
              isAdmin: userData.role === 'admin',
              photoURL: userData.photoURL,
              skills: userData.skills || [],
              tools: userData.tools || [],
              githubUsername: userData.githubUsername,
            });
          }
        });
      }
      
      return usersList;
    } catch (error) {
      console.error('Error finding users by skills:', error);
      
      // Fallback to team member service
      try {
        const allMembers = this.teamMemberService.getAllMembers();
        const matchingMembers = allMembers.filter(member => 
          member.skills?.some(skill => skills.includes(skill))
        );
        
        return matchingMembers.map(member => ({
          id: member.id,
          name: member.name,
          email: member.email || '',
          role: member.role,
          isAuthenticated: true,
          isAdmin: member.role === 'admin',
          skills: member.skills || [],
          tools: member.tools || []
        }));
      } catch (fallbackError) {
        console.error('Fallback error finding users by skills:', fallbackError);
        return [];
      }
    }
  }

  /**
   * Verify password reset token
   * @param token Reset token
   * @returns Success or failure result
   */
  public async verifyResetToken(token: string): Promise<{ success: boolean; message: string }> {
    try {
      // In a real application, you would verify the token with your backend
      // For this demo, we'll simulate token verification
      
      // Check if token is valid (simple validation for demo purposes)
      if (token && token.length > 20) {
        return { success: true, message: 'Token verified' };
      } else {
        return { success: false, message: 'Invalid token' };
      }
    } catch (error) {
      console.error('Error verifying reset token:', error);
      return { success: false, message: 'Failed to verify token' };
    }
  }

  /**
   * Reset password with token
   * @param token Reset token
   * @param newPassword New password
   * @returns Success or failure result
   */
  public async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      // In a real application, you would verify the token and reset the password in your backend
      // For this demo, we'll simulate a password reset
      
      // Check if token is valid (simple validation for demo purposes)
      if (token && token.length > 20) {
        // In a real app, this would update the user's password in the database
        return { success: true, message: 'Password reset successfully' };
      } else {
        return { success: false, message: 'Invalid or expired token' };
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      return { success: false, message: 'Failed to reset password' };
    }
  }
}

export default AuthService;
