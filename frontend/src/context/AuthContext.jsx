import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user profile from backend
          const profileResponse = await authService.getUserProfile();
          if (profileResponse.success) {
            setUser(profileResponse.user);
            setIsAuthenticated(true);
          } else {
            // If backend profile doesn't exist, use Firebase user data
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              emailVerified: firebaseUser.emailVerified
            });
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Fallback to Firebase user data
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            emailVerified: firebaseUser.emailVerified
          });
          setIsAuthenticated(true);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (userData) => {
    setLoading(true);
    try {
      const result = await authService.register(userData);
      if (result.success) {
        // User will be set through auth state listener
        return result;
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await authService.login(email, password);
      if (result.success) {
        // User will be set through auth state listener
        return result;
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const result = await authService.logout();
      // User will be cleared through auth state listener
      return result;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const result = await authService.updateUserProfile(profileData);
      if (result.success) {
        // Refresh user profile
        const profileResponse = await authService.getUserProfile();
        if (profileResponse.success) {
          setUser(profileResponse.user);
        }
      }
      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  };

  const sendEmailVerification = async () => {
    return await authService.sendEmailVerification();
  };

  const sendPasswordResetEmail = async (email) => {
    return await authService.sendPasswordResetEmail(email);
  };

  const deleteAccount = async () => {
    return await authService.deleteAccount();
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    register,
    login,
    logout,
    updateProfile,
    sendEmailVerification,
    sendPasswordResetEmail,
    deleteAccount,
    getCurrentUser: () => authService.getCurrentUser(),
    getUserToken: () => authService.getUserToken()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
