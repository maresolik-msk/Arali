import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { supabase } from './supabaseClient';
import type { Product, Customer, Order, RevenueSource, Notification, Vendor } from '../data/dashboardData';

export interface ShopSettings {
  shopName: string;
  shopAddress: string;
  contactEmail: string;
  updatedAt?: string;
}

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-29b58f9a`;

// Token cache to avoid refreshing on every call
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

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
      console.warn(`Token is expired or expires soon (expired ${minutesAgo} minutes ago)`);
    } else {
      const minutesLeft = Math.round((expiryTime - now) / 1000 / 60);
      console.log(`Token is valid (expires in ${minutesLeft} minutes)`);
    }
    
    return isExpired;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return true; // Treat decode errors as expired
  }
}

// Clear token cache (call this on logout)
export function clearTokenCache(): void {
  cachedToken = null;
  tokenExpiry = 0;
  console.log('Token cache cleared');
}

// Helper function to get access token for API requests
async function getAccessToken(): Promise<string | null> {
  // Check if we're in the browser environment
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    // Check if we have a cached token that's still valid (with 5 minute buffer)
    const now = Date.now();
    const bufferMs = 5 * 60 * 1000; // 5 minutes buffer
    
    if (cachedToken && !isTokenExpired(cachedToken)) {
      console.log('Using cached token (valid for', Math.round((tokenExpiry - now) / 1000 / 60), 'more minutes)');
      return cachedToken;
    }
    
    // Token is expired or about to expire, refresh it
    console.log('Token expired or about to expire, refreshing session...');
    const { data: { session }, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('Session refresh error:', error);
      
      // If refresh fails, try to get existing session as fallback
      const { data: fallbackData } = await supabase.auth.getSession();
      
      if (fallbackData.session && fallbackData.session.access_token) {
        // Validate the fallback token - don't use it if it's expired
        if (isTokenExpired(fallbackData.session.access_token)) {
          console.error('Fallback token is also expired - forcing complete sign out');
          
          // Force sign out to clear all Supabase state
          await supabase.auth.signOut();
          cachedToken = null;
          tokenExpiry = 0;
          localStorage.removeItem('auth_token');
          sessionStorage.removeItem('access_token');
          localStorage.removeItem('user');
          
          // Redirect to login
          window.location.href = '/login';
          return null;
        }
        
        console.log('Using existing session as fallback (token is valid)');
        
        // Cache the token
        cachedToken = fallbackData.session.access_token;
        tokenExpiry = fallbackData.session.expires_at ? fallbackData.session.expires_at * 1000 : 0;
        
        localStorage.setItem('auth_token', fallbackData.session.access_token);
        sessionStorage.setItem('access_token', fallbackData.session.access_token);
        return fallbackData.session.access_token;
      }
      
      // No valid session available - force sign out
      console.error('No valid session available - forcing sign out');
      await supabase.auth.signOut();
      cachedToken = null;
      tokenExpiry = 0;
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('access_token');
      localStorage.removeItem('user');
      
      // Redirect to login
      window.location.href = '/login';
      return null;
    }
    
    if (!session) {
      console.warn('No active session after refresh - forcing sign out');
      await supabase.auth.signOut();
      cachedToken = null;
      tokenExpiry = 0;
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('access_token');
      localStorage.removeItem('user');
      
      // Redirect to login
      window.location.href = '/login';
      return null;
    }
    
    // Validate the refreshed token before caching it
    if (isTokenExpired(session.access_token)) {
      console.error('Refreshed token is STILL expired - refresh token must be invalid!');
      console.error('This should not happen - forcing complete sign out');
      
      // Force sign out to clear all Supabase state
      await supabase.auth.signOut();
      cachedToken = null;
      tokenExpiry = 0;
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('access_token');
      localStorage.removeItem('user');
      
      // Redirect to login
      window.location.href = '/login';
      return null;
    }
    
    // Cache the token and its expiry
    cachedToken = session.access_token;
    tokenExpiry = session.expires_at ? session.expires_at * 1000 : 0;
    
    // Update local storage with fresh token
    localStorage.setItem('auth_token', session.access_token);
    sessionStorage.setItem('access_token', session.access_token);
    
    console.log('Fresh token obtained, expires at:', new Date(tokenExpiry).toLocaleString());
    
    // Return the fresh access token
    return session.access_token;
  } catch (error) {
    console.error('Error retrieving access token:', error);
    cachedToken = null;
    tokenExpiry = 0;
    return null;
  }
}

// Helper function to make API requests
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {},
  retryCount = 0
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const accessToken = await getAccessToken();
  
  // Log warning if no access token found
  if (!accessToken) {
    console.warn('No access token found. User may need to sign in.');
  }
  
  try {
    // Create an abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken || publicAnonKey}`,
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    // Handle 401 Unauthorized - token might be expired, try to refresh
    if (response.status === 401 && retryCount === 0) {
      console.log('Received 401, attempting to refresh session and retry...');
      
      // Force refresh the session
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error || !session) {
        console.error('Session refresh failed:', error);
        // Clear auth data and redirect to login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('access_token');
        window.location.href = '/login';
        throw new Error('Session expired. Please log in again.');
      }
      
      // Update stored tokens
      localStorage.setItem('auth_token', session.access_token);
      sessionStorage.setItem('access_token', session.access_token);
      
      // Retry the request with the new token (only once)
      return apiRequest<T>(endpoint, options, retryCount + 1);
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Unknown error';
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorJson.message || errorMessage;
      } catch {
        errorMessage = errorText || `Request failed with status ${response.status}`;
      }
      
      // Only log errors in development or for critical endpoints
      const isCriticalEndpoint = !endpoint.includes('unread-count');
      if (process.env.NODE_ENV === 'development' || isCriticalEndpoint) {
        console.error(`API Error (${endpoint}):`, {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage
        });
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data as T;
  } catch (error: any) {
    // Handle timeout errors gracefully
    if (error.name === 'AbortError') {
      console.warn(`API Request timeout (${endpoint})`);
      throw new Error('Request timeout');
    }

    // Only log non-critical endpoint errors in development
    const isCriticalEndpoint = !endpoint.includes('unread-count');
    if (process.env.NODE_ENV === 'development' || isCriticalEndpoint) {
      console.error(`API Request failed (${endpoint}):`, error);
    }
    throw error;
  }
}

// ========================================
// PRODUCTS API
// ========================================

export const productsApi = {
  // Get all products
  getAll: async (): Promise<Product[]> => {
    const data = await apiRequest<{ products: Product[] }>('/products');
    return data.products;
  },

  // Add new product
  add: async (product: Product): Promise<Product> => {
    const data = await apiRequest<{ product: Product }>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
    return data.product;
  },

  // Update product
  update: async (id: number, updates: Partial<Product>): Promise<Product> => {
    const data = await apiRequest<{ product: Product }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.product;
  },

  // Delete product
  delete: async (id: number): Promise<void> => {
    await apiRequest<{ success: boolean }>(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Restock product
  restock: async (id: number, quantity: number): Promise<Product> => {
    const data = await apiRequest<{ product: Product }>(`/products/${id}/restock`, {
      method: 'POST',
      body: JSON.stringify({ quantity }),
    });
    return data.product;
  },

  // Record sales for a product
  recordSales: async (id: number, quantitySold: number): Promise<Product> => {
    const data = await apiRequest<{ product: Product }>(`/products/${id}/record-sales`, {
      method: 'POST',
      body: JSON.stringify({ quantitySold }),
    });
    return data.product;
  },
};

// ========================================
// CUSTOMERS API
// ========================================

export const customersApi = {
  // Get all customers
  getAll: async (): Promise<Customer[]> => {
    const data = await apiRequest<{ customers: Customer[] }>('/customers');
    return data.customers;
  },

  // Add new customer
  add: async (customer: Customer): Promise<Customer> => {
    const data = await apiRequest<{ customer: Customer }>('/customers', {
      method: 'POST',
      body: JSON.stringify(customer),
    });
    return data.customer;
  },

  // Update customer
  update: async (id: number, updates: Partial<Customer>): Promise<Customer> => {
    const data = await apiRequest<{ customer: Customer }>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.customer;
  },

  // Delete customer
  delete: async (id: number): Promise<void> => {
    await apiRequest<{ success: boolean }>(`/customers/${id}`, {
      method: 'DELETE',
    });
  },
};

// ========================================
// ORDERS API
// ========================================

export const ordersApi = {
  // Get all orders
  getAll: async (): Promise<Order[]> => {
    const data = await apiRequest<{ orders: Order[] }>('/orders');
    return data.orders;
  },

  // Add new order
  add: async (order: Order): Promise<Order> => {
    const data = await apiRequest<{ order: Order }>('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
    return data.order;
  },

  // Update order status
  updateStatus: async (id: string, status: Order['status']): Promise<Order> => {
    const data = await apiRequest<{ order: Order }>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    return data.order;
  },
};

// ========================================
// REVENUE SOURCES API
// ========================================

export const revenueSourcesApi = {
  // Get all revenue sources
  getAll: async (): Promise<RevenueSource[]> => {
    const data = await apiRequest<{ revenueSources: RevenueSource[] }>('/revenue-sources');
    return data.revenueSources;
  },

  // Update revenue source
  update: async (id: number, updates: Partial<RevenueSource>): Promise<RevenueSource> => {
    const data = await apiRequest<{ revenueSource: RevenueSource }>(`/revenue-sources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.revenueSource;
  },
};

// ========================================
// INITIALIZATION API
// ========================================

export const initApi = {
  // Initialize database with default data
  initialize: async (data: {
    products: Product[];
    customers: Customer[];
    orders: Order[];
    revenueSources: RevenueSource[];
  }): Promise<void> => {
    await apiRequest('/init', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Initialize demo user
  initDemoUser: async (): Promise<void> => {
    await apiRequest('/auth/init-demo', {
      method: 'POST',
    });
  },
};

// ========================================
// SHOP SETTINGS API
// ========================================

export const shopSettingsApi = {
  // Get shop settings
  get: async (): Promise<ShopSettings> => {
    const data = await apiRequest<{ settings: ShopSettings }>('/shop-settings');
    return data.settings;
  },

  // Update shop settings
  update: async (updates: Partial<ShopSettings>): Promise<ShopSettings> => {
    const data = await apiRequest<{ settings: ShopSettings }>('/shop-settings', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.settings;
  },
};

// ========================================
// NOTIFICATIONS API
// ========================================

export const notificationsApi = {
  // Get all notifications
  getAll: async (): Promise<Notification[]> => {
    const data = await apiRequest<{ notifications: Notification[] }>('/notifications');
    return data.notifications;
  },

  // Get unread count
  getUnreadCount: async (): Promise<number> => {
    const data = await apiRequest<{ count: number }>('/notifications/unread-count');
    return data.count;
  },

  // Create notification
  create: async (notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> => {
    const data = await apiRequest<{ notification: Notification }>('/notifications', {
      method: 'POST',
      body: JSON.stringify(notification),
    });
    return data.notification;
  },

  // Mark notification as read
  markAsRead: async (id: string): Promise<Notification> => {
    const data = await apiRequest<{ notification: Notification }>(`/notifications/${id}/read`, {
      method: 'PUT',
    });
    return data.notification;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    await apiRequest<{ success: boolean }>('/notifications/mark-all-read', {
      method: 'PUT',
    });
  },

  // Delete notification
  delete: async (id: string): Promise<void> => {
    await apiRequest<{ success: boolean }>(`/notifications/${id}`, {
      method: 'DELETE',
    });
  },

  // Send email notification (requires email service configuration)
  sendEmail: async (notificationId: string): Promise<void> => {
    await apiRequest<{ success: boolean }>(`/notifications/${notificationId}/send-email`, {
      method: 'POST',
    });
  },
};

// ========================================
// VENDORS API
// ========================================

export const vendorsApi = {
  // Get all vendors
  getAll: async (): Promise<Vendor[]> => {
    const data = await apiRequest<{ vendors: Vendor[] }>('/vendors');
    return data.vendors;
  },

  // Add new vendor
  add: async (vendor: Vendor): Promise<Vendor> => {
    const data = await apiRequest<{ vendor: Vendor }>('/vendors', {
      method: 'POST',
      body: JSON.stringify(vendor),
    });
    return data.vendor;
  },

  // Update vendor
  update: async (id: number, updates: Partial<Vendor>): Promise<Vendor> => {
    const data = await apiRequest<{ vendor: Vendor }>(`/vendors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.vendor;
  },

  // Delete vendor
  delete: async (id: number): Promise<void> => {
    await apiRequest<{ success: boolean }>(`/vendors/${id}`, {
      method: 'DELETE',
    });
  },
};