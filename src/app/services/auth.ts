import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-29b58f9a`;

// Create Supabase client for auth
const supabaseUrl = `https://${projectId}.supabase.co`;
const supabase = createClient(supabaseUrl, publicAnonKey);

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
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    // Try to get from localStorage as fallback
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        return {
          user,
          accessToken: token,
          isAuthenticated: true,
        };
      } catch {
        return {
          user: null,
          accessToken: null,
          isAuthenticated: false,
        };
      }
    }

    return {
      user: null,
      accessToken: null,
      isAuthenticated: false,
    };
  }

  const user: User = {
    id: data.session.user.id,
    email: data.session.user.email!,
    name: data.session.user.user_metadata.name || data.session.user.email!.split('@')[0],
  };

  // Update localStorage
  localStorage.setItem('auth_token', data.session.access_token);
  localStorage.setItem('user', JSON.stringify(user));
  sessionStorage.setItem('access_token', data.session.access_token);

  return {
    user,
    accessToken: data.session.access_token,
    isAuthenticated: true,
  };
}

// Get access token for API requests
export function getAccessToken(): string | null {
  return localStorage.getItem('auth_token');
}

// Send password reset email
export async function sendPasswordResetEmail(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/login?reset=true`,
  });

  if (error) {
    console.error('Password reset error:', error);
    throw new Error(error.message || 'Failed to send password reset email');
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