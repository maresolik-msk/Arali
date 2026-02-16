import * as kv from "./kv_store.tsx";

// Token lifetime constants
export const TOKEN_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
export const TOKEN_REFRESH_THRESHOLD_MS = 24 * 60 * 60 * 1000; // Renew when < 1 day remaining

export async function createUser(mobileNumber: string, role = 'shop_owner') {
  const userId = mobileNumber; // Simple ID strategy
  const user = {
    id: userId,
    mobile_number: mobileNumber,
    role,
    created_at: new Date().toISOString(),
  };

  // Index by both mobile and ID
  await kv.set(`user:mobile:${mobileNumber}`, user);
  await kv.set(`user:id:${userId}`, user);
  return user;
}

export async function createAuthTokens(user: any) {
  const accessToken = `access_${user.id}_${Date.now()}_${Math.random().toString(36).substr(2)}`;
  
  // Store token session — 7-day lifetime
  await kv.set(`auth:token:${accessToken}`, {
    user_id: user.id,
    expires_at: new Date(Date.now() + TOKEN_LIFETIME_MS).toISOString()
  });

  return { access_token: accessToken };
}

// Extend an existing token's expiry (sliding window)
export async function extendTokenExpiry(token: string) {
  const session = await kv.get(`auth:token:${token}`);
  if (!session) return false;
  
  session.expires_at = new Date(Date.now() + TOKEN_LIFETIME_MS).toISOString();
  await kv.set(`auth:token:${token}`, session);
  return true;
}

// Refresh: validate old token, issue a brand-new one, delete the old
export async function refreshAuthToken(oldToken: string) {
  const session = await kv.get(`auth:token:${oldToken}`);
  if (!session) {
    return { error: 'Token not found' };
  }

  // Allow refresh even if token expired within the last 7 days (grace period)
  const expiresAt = new Date(session.expires_at);
  const gracePeriodMs = 7 * 24 * 60 * 60 * 1000;
  const now = new Date();
  
  if (expiresAt.getTime() + gracePeriodMs < now.getTime()) {
    return { error: 'Token expired beyond grace period — please log in again' };
  }

  // Load the user
  const user = await kv.get(`user:id:${session.user_id}`);
  if (!user) {
    return { error: 'User not found' };
  }

  // Issue new token
  const newTokens = await createAuthTokens(user);

  // Delete old token
  await kv.del(`auth:token:${oldToken}`);

  return { session: newTokens, user, error: null };
}
