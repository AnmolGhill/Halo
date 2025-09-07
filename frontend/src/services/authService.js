import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { authAPI } from './api';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.authStateListeners = [];
    
    // Listen to auth state changes
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      this.authStateListeners.forEach(callback => callback(user));
    });
  }

  // Register new user
  async register(userData) {
    try {
      const { email, password, firstName, lastName, phone } = userData;
      
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update display name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });
      
      // Send email verification
      await sendEmailVerification(user);
      
      // Register user in backend
      await authAPI.register({
        email,
        password,
        firstName,
        lastName,
        phone
      });
      
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified
        }
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // Login user
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get ID token and send to backend
      const idToken = await user.getIdToken();
      const backendResponse = await authAPI.login(idToken);
      
      return {
        success: true,
        user: backendResponse.user,
        token: idToken
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // Logout user
  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // Send email verification
  async sendEmailVerification() {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        return { success: true };
      }
      return { success: false, error: 'No user logged in' };
    } catch (error) {
      console.error('Email verification error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!auth.currentUser;
  }

  // Get user token
  async getUserToken() {
    try {
      if (auth.currentUser) {
        return await auth.currentUser.getIdToken();
      }
      return null;
    } catch (error) {
      console.error('Get token error:', error);
      return null;
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback) {
    this.authStateListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  // Get user profile from backend
  async getUserProfile() {
    try {
      const response = await authAPI.getProfile();
      return response;
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // Update user profile
  async updateUserProfile(profileData) {
    try {
      const response = await authAPI.updateProfile(profileData);
      
      // Update Firebase Auth profile if display name changed
      if (profileData.firstName || profileData.lastName) {
        const displayName = `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim();
        if (auth.currentUser && displayName) {
          await updateProfile(auth.currentUser, { displayName });
        }
      }
      
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // Delete user account
  async deleteAccount() {
    try {
      // Delete from backend first
      await authAPI.deleteAccount();
      
      // Delete from Firebase Auth
      if (auth.currentUser) {
        await auth.currentUser.delete();
      }
      
      return { success: true };
    } catch (error) {
      console.error('Delete account error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // Get user-friendly error messages
  getErrorMessage(error) {
    const errorCode = error.code || error.message;
    
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No user found with this email address';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/email-already-in-use':
        return 'Email address is already registered';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      case 'auth/requires-recent-login':
        return 'Please log in again to perform this action';
      default:
        return error.message || 'An error occurred. Please try again';
    }
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;
