import { supabase } from './supabaseClient';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-29b58f9a`;

const supabaseUrl = `https://${projectId}.supabase.co`;

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

// Helper function to decode JWT and check if it's expired
function isTokenExpired(token: string): boolean {
  try {
    // JWT format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT format');
      return true; // Treat invalid tokens as expired
    }
    
    // Decode the payload (base64url)
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    
    // Check expiry (exp is in seconds, Date.now() is in milliseconds)
    const expiryTime = payload.exp * 1000;
    const now = Date.now();
    const bufferMs = 5 * 60 * 1000; // 5 minute buffer
    
    const isExpired = expiryTime <= now + bufferMs;
    
    if (isExpired) {
      const minutesAgo = Math.round((now - expiryTime) / 1000 / 60);
      console.warn(`[Auth] Token expired ${minutesAgo} minutes ago`);
    } else {
      const minutesLeft = Math.round((expiryTime - now) / 1000 / 60);
      console.log(`[Auth] Token valid for ${minutesLeft} more minutes`);
    }
    
    return isExpired;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return true; // Treat decode errors as expired
  }
}

// Sign up new user
export async function signUp(email: string, password: string, name: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ email, password, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Sign up failed');
  }

  const data = await response.json();
  
  // After signup, sign in to get the access token
  const authData = await signIn(email, password);
  return authData.user;
}

// Sign in user
export async function signIn(email: string, password: string): Promise<AuthState> {
  console.log('Attempting Supabase sign in with:', email);
  console.log('Supabase URL:', supabaseUrl);
  console.log('Public Key exists:', !!publicAnonKey);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Supabase sign in error:', error);
    throw new Error(error.message || 'Sign in failed');
  }

  if (!data.session) {
    console.error('No session returned from Supabase');
    throw new Error('Sign in failed - no session');
  }

  console.log('Sign in successful:', data.user.email);

  const user: User = {
    id: data.user.id,
    email: data.user.email!,
    name: data.user.user_metadata.name || data.user.email!.split('@')[0],
  };

  // Store auth state
  localStorage.setItem('auth_token', data.session.access_token);
  localStorage.setItem('user', JSON.stringify(user));
  sessionStorage.setItem('access_token', data.session.access_token);

  return {
    user,
    accessToken: data.session.access_token,
    isAuthenticated: true,
  };
}

// Sign out user
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('access_token');
}

// Get current session
export async function getCurrentSession(): Promise<AuthState> {
  try {
    // First try to refresh the session to ensure we have a valid token
    console.log('[Auth] Getting current session - attempting refresh first...');
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();

    // If refresh works, validate and use the refreshed session
    if (!refreshError && refreshData.session && refreshData.session.access_token) {
      // Validate the token before using it
      if (isTokenExpired(refreshData.session.access_token)) {
        console.error('[Auth] Refreshed token is STILL expired - refresh token must be invalid');
        console.error('[Auth] This means both access and refresh tokens are expired - forcing sign out');
        
        // Force a complete sign out to clear all Supabase state
        await supabase.auth.signOut();
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('access_token');
        
        return {
          user: null,
          accessToken: null,
          isAuthenticated: false,
        };
      }
      
      console.log('[Auth] Session refreshed successfully with valid token');
      
      const user: User = {
        id: refreshData.session.user.id,
        email: refreshData.session.user.email!,
        name: refreshData.session.user.user_metadata.name || refreshData.session.user.email!.split('@')[0],
      };

      // Update localStorage with fresh token
      localStorage.setItem('auth_token', refreshData.session.access_token);
      localStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('access_token', refreshData.session.access_token);

      return {
        user,
        accessToken: refreshData.session.access_token,
        isAuthenticated: true,
      };
    }

    // If refresh failed, try to get existing session (but don't use if expired)
    console.log('[Auth] Refresh failed, trying to get existing session...');
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('[Auth] Session retrieval error:', error);
      // Force sign out and clear invalid session data
      await supabase.auth.signOut();
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('access_token');
      
      return {
        user: null,
        accessToken: null,
        isAuthenticated: false,
      };
    }

    if (!data.session || !data.session.access_token) {
      // No active session - clear stored data
      console.log('[Auth] No active session found');
      await supabase.auth.signOut();
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('access_token');
      
      return {
        user: null,
        accessToken: null,
        isAuthenticated: false,
      };
    }

    // Validate the existing token - DON'T use it if it's expired
    if (isTokenExpired(data.session.access_token)) {
      console.error('[Auth] Existing session token is also expired - forcing sign out');
      await supabase.auth.signOut();
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('access_token');
      
      return {
        user: null,
        accessToken: null,
        isAuthenticated: false,
      };
    }

    // Valid session with non-expired token
    console.log('[Auth] Using existing session with valid token');
    const user: User = {
      id: data.session.user.id,
      email: data.session.user.email!,
      name: data.session.user.user_metadata.name || data.session.user.email!.split('@')[0],
    };

    // Update localStorage with token
    localStorage.setItem('auth_token', data.session.access_token);
    localStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('access_token', data.session.access_token);

    return {
      user,
      accessToken: data.session.access_token,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error('[Auth] Error in getCurrentSession:', error);
    // Clear all auth data on any error
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('access_token');
    
    return {
      user: null,
      accessToken: null,
      isAuthenticated: false,
    };
  }
}

// Get access token for API requests
// NOTE: This returns cached token from localStorage which may be expired.
// For fresh tokens, use getCurrentSession() or supabase.auth.getSession()
export function getAccessToken(): string | null {
  return localStorage.getItem('auth_token');
}

// Send password reset email
export async function sendPasswordResetEmail(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/login?reset=true`,
  });

  if (error) {
    // Don't log SMTP configuration errors as they're expected when SMTP is not set up
    const errorMessage = error.message || '';
    const isSMTPError = errorMessage.includes('sending') || 
                        errorMessage.includes('recovery email') || 
                        errorMessage.includes('SMTP') ||
                        errorMessage.includes('mail');
    
    if (!isSMTPError) {
      console.error('Password reset error:', error);
    }
    
    // Check if it's an SMTP configuration error
    if (isSMTPError) {
      throw new Error('Email service not configured. Please contact support or use your existing password to sign in.');
    }
    
    // Check if user doesn't exist
    if (errorMessage.includes('not found') || errorMessage.includes('User not found')) {
      throw new Error('No account found with this email address.');
    }
    
    throw new Error(errorMessage || 'Failed to send password reset email');
  }
}

// Update password (used after clicking the reset link)
export async function updatePassword(newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error('Password update error:', error);
    throw new Error(error.message || 'Failed to update password');
  }
}

// ========================================
// OTP-BASED PASSWORD RESET
// ========================================

// Request password reset OTP (sends 6-digit code via email)
export async function requestPasswordResetOTP(email: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/request-password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send password reset code');
  }

  const data = await response.json();
  return data;
}

// Verify OTP and reset password
export async function verifyOTPAndResetPassword(
  email: string, 
  otp: string, 
  newPassword: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/verify-otp-and-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ email, otp, newPassword }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to reset password');
  }

  const data = await response.json();
  return data;
}