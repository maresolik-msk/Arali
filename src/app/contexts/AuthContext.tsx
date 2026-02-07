import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getCurrentSession, 
  signIn as authSignIn, 
  signUp as authSignUp, 
  signOut as authSignOut, 
  sendPasswordResetEmail, 
  updatePassword, 
  requestPasswordResetOTP as authRequestPasswordResetOTP, 
  verifyOTPAndResetPassword as authVerifyOTPAndResetPassword, 
  signInWithPhone as authSignInWithPhone,
  verifyPhoneOtp as authVerifyPhoneOtp,
  type User, 
  type AuthState 
} from '../services/auth';
import { PricingPlan, DEFAULT_PLAN } from '../constants/pricing';
import { supabase } from '../services/supabaseClient';
import { toast } from 'sonner';
import { clearTokenCache } from '../services/api';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  requestPasswordResetOTP: (email: string) => Promise<void>;
  verifyOTPAndResetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
  signInWithPhone: (phone: string) => Promise<void>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getCurrentSession();
        setUser(session.user);
        setAccessToken(session.accessToken);
        setIsAuthenticated(session.isAuthenticated);
      } catch (error) {
        console.error('Error checking session:', error);
        // Clear auth state on error
        setUser(null);
        setAccessToken(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Set up auth state change listener for automatic token refresh
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        // Clear auth state
        setUser(null);
        setAccessToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('access_token');
        clearTokenCache();
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Update auth state with new/refreshed token
        if (session) {
          const user: User = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata.name || session.user.email!.split('@')[0],
            plan: (session.user.user_metadata.plan as PricingPlan) || DEFAULT_PLAN,
            hasSelectedPlan: !!session.user.user_metadata.plan_selected,
          };
          
          setUser(user);
          setAccessToken(session.access_token);
          setIsAuthenticated(true);
          
          // Update storage
          localStorage.setItem('auth_token', session.access_token);
          localStorage.setItem('user', JSON.stringify(user));
          sessionStorage.setItem('access_token', session.access_token);
        }
      } else if (event === 'USER_UPDATED') {
        // Update user info
        if (session) {
          const user: User = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata.name || session.user.email!.split('@')[0],
            plan: (session.user.user_metadata.plan as PricingPlan) || DEFAULT_PLAN,
            hasSelectedPlan: !!session.user.user_metadata.plan_selected,
          };
          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
        }
      }
    });

    // Cleanup listener on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const authState = await authSignIn(email, password);
      setUser(authState.user);
      setAccessToken(authState.accessToken);
      setIsAuthenticated(true);
      toast.success('Welcome back!');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const user = await authSignUp(email, password, name);
      // signUp already calls signIn internally
      const session = await getCurrentSession();
      setUser(session.user);
      setAccessToken(session.accessToken);
      setIsAuthenticated(true);
      toast.success('Account created successfully!');
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authSignOut();
      setUser(null);
      setAccessToken(null);
      setIsAuthenticated(false);
      toast.success('Signed out successfully');
      // Redirect to landing page after successful logout
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(email);
    } catch (error) {
      // Don't log SMTP configuration errors as they're expected
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (!errorMessage.includes('Email service not configured') && !errorMessage.includes('sending recovery email')) {
        console.error('Reset password error:', error);
      }
      throw error;
    }
  };

  const changePassword = async (newPassword: string) => {
    try {
      await updatePassword(newPassword);
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  };

  const requestPasswordResetOTP = async (email: string) => {
    try {
      await authRequestPasswordResetOTP(email);
    } catch (error) {
      console.error('Request password reset OTP error:', error);
      throw error;
    }
  };

  const verifyOTPAndResetPassword = async (email: string, otp: string, newPassword: string) => {
    try {
      await authVerifyOTPAndResetPassword(email, otp, newPassword);
    } catch (error) {
      console.error('Verify OTP and reset password error:', error);
      throw error;
    }
  };

  const signInWithPhone = async (phone: string) => {
    try {
      await authSignInWithPhone(phone);
    } catch (error) {
      console.error('Phone sign in error:', error);
      throw error;
    }
  };

  const verifyPhoneOtp = async (phone: string, token: string) => {
    try {
      const authState = await authVerifyPhoneOtp(phone, token);
      setUser(authState.user);
      setAccessToken(authState.accessToken);
      setIsAuthenticated(true);
      toast.success('Welcome back!');
    } catch (error) {
      console.error('Phone verification error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        changePassword,
        requestPasswordResetOTP,
        verifyOTPAndResetPassword,
        signInWithPhone,
        verifyPhoneOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // During hot module reload, context might be temporarily unavailable
    // Return a safe default that shows loading state instead of crashing
    // console.debug('useAuth called outside AuthProvider - returning loading state');
    return {
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true, // This will cause components to show loading spinner
      signIn: async () => { throw new Error('Auth not initialized'); },
      signUp: async () => { throw new Error('Auth not initialized'); },
      signOut: async () => { throw new Error('Auth not initialized'); },
      resetPassword: async () => { throw new Error('Auth not initialized'); },
      changePassword: async () => { throw new Error('Auth not initialized'); },
      requestPasswordResetOTP: async () => { throw new Error('Auth not initialized'); },
      verifyOTPAndResetPassword: async () => { throw new Error('Auth not initialized'); },
      signInWithPhone: async () => { throw new Error('Auth not initialized'); },
      verifyPhoneOtp: async () => { throw new Error('Auth not initialized'); },
    };
  }
  return context;
}

// Export AuthContext for debugging if needed
export { AuthContext };