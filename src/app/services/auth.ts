import { supabase } from './supabaseClient';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { PricingPlan, DEFAULT_PLAN } from '../constants/pricing';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-29b58f9a`;

const supabaseUrl = `https://${projectId}.supabase.co`;

export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  plan: PricingPlan;
  hasSelectedPlan?: boolean;
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
      return true; // Treat invalid tokens as expired
    }
    
    // Decode the payload (base64url)
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    
    // Check expiry (exp is in seconds, Date.now() is in milliseconds)
    const expiryTime = payload.exp * 1000;
    const now = Date.now();
    const bufferMs = 5 * 60 * 1000; // 5 minute buffer
    
    return expiryTime <= now + bufferMs;
  } catch (error) {
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
  // We add a small delay to ensure database propagation
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    const authData = await signIn(email, password);
    return authData.user;
  } catch (error) {
    console.warn('[Auth] Auto-login after signup failed:', error);
    // If auto-login fails, return the created user object anyway
    // The user will be redirected to login page by the app flow
    return {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      plan: DEFAULT_PLAN,
      hasSelectedPlan: false,
    };
  }
}

// Sign in user
export async function signIn(email: string, password: string): Promise<AuthState> {
  console.log('Attempting Supabase sign in with:', email);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Suppress console error for expected invalid credentials to reduce noise
    if (error.message === 'Invalid login credentials') {
       console.log('[Auth] Invalid login credentials for:', email);
    } else {
       console.error('Supabase sign in error:', error);
    }
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
    plan: (data.user.user_metadata.plan as PricingPlan) || DEFAULT_PLAN,
    hasSelectedPlan: !!data.user.user_metadata.plan_selected,
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
    const storedToken = localStorage.getItem('auth_token');
    
    // Check for Custom KV Auth Token
    if (storedToken && storedToken.startsWith('access_')) {
        console.log('[Auth] Detected custom auth token, verifying...');
        
        // Verify against backend
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
            headers: {
                'Authorization': `Bearer ${publicAnonKey}`,
                'x-custom-auth-token': storedToken
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const user: User = {
                id: data.user.id,
                email: data.user.mobile_number || data.user.email,
                name: data.user.name || data.user.mobile_number,
                plan: (data.user.plan as PricingPlan) || DEFAULT_PLAN,
                hasSelectedPlan: !!data.user.plan_selected,
            };
            
            // Update storage
            localStorage.setItem('user', JSON.stringify(user));
            
            return {
                user,
                accessToken: storedToken,
                isAuthenticated: true
            };
        } else {
            // Only clear session if it's explicitly invalid (401/403)
            // For 500s or network errors, we might want to keep the session locally 
            // but we can't verify it. 
            // The safest approach for "redirect to login" issues is to only logout on 401.
            
            if (response.status === 401 || response.status === 403) {
                // Attempt to refresh the KV token before giving up
                try {
                    const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${publicAnonKey}`,
                        },
                        body: JSON.stringify({ token: storedToken }),
                    });
                    if (refreshRes.ok) {
                        const refreshData = await refreshRes.json();
                        const newToken = refreshData.session?.access_token;
                        if (newToken) {
                            console.log('[Auth] KV token refreshed during session check');
                            localStorage.setItem('auth_token', newToken);
                            sessionStorage.setItem('access_token', newToken);
                            // Retry profile fetch with new token
                            const retryRes = await fetch(`${API_BASE_URL}/user/profile`, {
                                headers: {
                                    'Authorization': `Bearer ${publicAnonKey}`,
                                    'x-custom-auth-token': newToken,
                                },
                            });
                            if (retryRes.ok) {
                                const retryData = await retryRes.json();
                                const user: User = {
                                    id: retryData.user.id,
                                    email: retryData.user.mobile_number || retryData.user.email,
                                    name: retryData.user.name || retryData.user.mobile_number,
                                    plan: (retryData.user.plan as PricingPlan) || DEFAULT_PLAN,
                                    hasSelectedPlan: !!retryData.user.plan_selected,
                                };
                                localStorage.setItem('user', JSON.stringify(user));
                                return { user, accessToken: newToken, isAuthenticated: true };
                            }
                        }
                    }
                } catch (refreshErr) {
                    console.log('[Auth] KV token refresh failed during session check:', refreshErr);
                }
                // Refresh didn't work — clear session
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
                return { user: null, accessToken: null, isAuthenticated: false };
            } else {
                console.warn(`[Auth] Backend verification failed with status ${response.status}. Preserving local session.`);
                // Return existing local user if available, otherwise fail
                const localUserStr = localStorage.getItem('user');
                if (localUserStr) {
                    try {
                        const localUser = JSON.parse(localUserStr);
                        return {
                            user: localUser,
                            accessToken: storedToken,
                            isAuthenticated: true
                        };
                    } catch (e) {
                         // Corrupt local data
                         localStorage.removeItem('auth_token');
                         localStorage.removeItem('user');
                         return { user: null, accessToken: null, isAuthenticated: false };
                    }
                }
                return { user: null, accessToken: null, isAuthenticated: false };
            }
        }
    }

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
        plan: (refreshData.session.user.user_metadata.plan as PricingPlan) || DEFAULT_PLAN,
        hasSelectedPlan: !!refreshData.session.user.user_metadata.plan_selected,
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
      plan: (data.session.user.user_metadata.plan as PricingPlan) || DEFAULT_PLAN,
      hasSelectedPlan: !!data.session.user.user_metadata.plan_selected,
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

// ========================================
// PHONE AUTHENTICATION (CUSTOM KV BACKEND)
// ========================================

// Sign in with Phone (Sends OTP)
export async function signInWithPhone(phone: string): Promise<void> {
  const cleanPhone = phone.trim();
  console.log('[Auth] Attempting custom phone sign in with:', cleanPhone);

  const response = await fetch(`${API_BASE_URL}/auth/otp/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ mobile_number: cleanPhone }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Phone sign in error:', data);
    throw new Error(data.error || 'Failed to send OTP');
  }
  
  // Return early success. The UI will handle showing the OTP input.
  // Note: The backend returns { success: true, otp: "..." } in dev mode.
  if (data.otp) {
    console.log('DEV OTP:', data.otp);
    // We can't easily return the OTP to the UI without changing the interface, 
    // but the console log will help for testing.
  }
}

// Verify Phone OTP
export async function verifyPhoneOtp(phone: string, token: string): Promise<AuthState> {
  const cleanPhone = phone.trim();
  
  const response = await fetch(`${API_BASE_URL}/auth/otp/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ mobile_number: cleanPhone, otp: token }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Verify Phone OTP error:', data);
    throw new Error(data.error || 'Invalid code');
  }

  // Initial user mapping from verify response
  let user: User = {
    id: data.user.id,
    email: data.user.mobile_number, 
    phone: data.user.mobile_number,
    name: data.user.mobile_number, 
    plan: DEFAULT_PLAN,
    hasSelectedPlan: false,
  };

  // FETCH FULL PROFILE to get correct plan/name details
  // The verify endpoint returns a minimal user object, so we need to fetch the full profile
  // from the KV store to ensure we have the correct plan state.
  try {
      const accessToken = data.session.access_token;
      const profileResponse = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'x-custom-auth-token': accessToken
        }
      });
      
      if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          user = {
            ...user,
            id: profileData.user.id || user.id,
            name: profileData.user.name || user.name,
            plan: (profileData.user.plan as PricingPlan) || DEFAULT_PLAN,
            hasSelectedPlan: !!profileData.user.plan_selected,
          };
          console.log('[Auth] Fetched full profile for phone user:', user.email);
      }
  } catch (err) {
      console.warn('[Auth] Failed to fetch full profile after phone login, using defaults:', err);
  }

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

// Update User Profile (Plan Selection)
export async function updateUserProfile(updates: Partial<User> & { plan_selected?: boolean }): Promise<User> {
  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error('No auth token found');

  // If using Supabase Auth (token doesn't start with access_), use Supabase API
  // However, Supabase updateUser only updates user_metadata.
  if (!token.startsWith('access_')) {
    const metadataUpdates: any = {};
    if (updates.plan) metadataUpdates.plan = updates.plan;
    if (updates.plan_selected !== undefined) metadataUpdates.plan_selected = updates.plan_selected;
    if (updates.name) metadataUpdates.name = updates.name;

    const { data, error } = await supabase.auth.updateUser({
      data: metadataUpdates
    });
    
    if (error) throw error;
    
    // Construct updated user from Supabase response
    const updatedUser: User = {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata.name || data.user.email!.split('@')[0],
        plan: (data.user.user_metadata.plan as PricingPlan) || DEFAULT_PLAN,
        hasSelectedPlan: !!data.user.user_metadata.plan_selected,
    };
    return updatedUser;
  }

  // Use Custom Backend for KV users
  // Note: We MUST pass the publicAnonKey in Authorization header to pass Supabase Gateway
  // and pass our custom token in a separate header to avoid "Invalid JWT" errors from the gateway.
  const response = await fetch(`${API_BASE_URL}/user/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`, 
      'x-custom-auth-token': token,
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data.details 
      ? `${data.error}: ${data.details}` 
      : (data.error || 'Failed to update profile');
    
    console.error('Backend update profile error:', data);
    throw new Error(errorMsg);
  }
  
  // Correctly map backend user response to frontend User interface
  const backendUser = data.user;
  const updatedUser: User = {
      id: backendUser.id,
      email: backendUser.mobile_number || backendUser.email || '',
      name: backendUser.name || backendUser.mobile_number || '',
      plan: (backendUser.plan as PricingPlan) || DEFAULT_PLAN,
      hasSelectedPlan: !!backendUser.plan_selected,
      phone: backendUser.mobile_number
  };
  
  return updatedUser;
}