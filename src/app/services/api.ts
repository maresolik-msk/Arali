import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { supabase } from './supabaseClient';
import type { Product, ProductVariant, Customer, Order, RevenueSource, Notification, Vendor, Purchase, Loss } from '../data/dashboardData';

export interface DailyMission {
  id: string;
  type: 'LOW_STOCK' | 'EXPIRY' | 'VENDOR_PAYMENT' | 'SALES_GOAL';
  title: string;
  description: string;
  action: 'REORDER' | 'DISCOUNT' | 'PAY' | 'REVIEW';
  targetId?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  completed?: boolean;
}

export interface StoreHealth {
  score: number;
  status: 'HEALTHY' | 'NEEDS_ATTENTION' | 'RISK';
  metrics: {
    lowStock: number;
    expiring: number;
    salesTrend: number;
  };
}

export interface EndOfDaySummary {
  sales: number;
  profit_estimate: number;
  wastage: number;
  best_seller: string;
  missed_sales: string[];
}

export interface ShopSettings {
  shopName: string;
  shopAddress: string;
  contactEmail: string;
  shopLogoUrl?: string;
  gstIn?: string; // Added for Invoice logic
  updatedAt?: string;
  verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'UNVERIFIED';
  verificationLevel?: 'BASIC' | 'DOCUMENT';
  verificationMessage?: string; // Reason for rejection
}

// ========================================
// BUSINESS VERIFICATION API
// ========================================

export const businessVerificationApi = {
  verify: async (data: {
    documentType: 'GST' | 'UDYAM' | 'SHOP_LICENSE' | 'TRADE_LICENSE';
    documentNumber?: string;
    file?: File;
  }): Promise<{ success: boolean; status: string; message?: string }> => {
    const accessToken = await getAccessToken();
    const formData = new FormData();
    formData.append('documentType', data.documentType);
    if (data.documentNumber) formData.append('documentNumber', data.documentNumber);
    if (data.file) formData.append('file', data.file);

    const headers: Record<string, string> = {};
    if (accessToken && accessToken.startsWith('access_')) {
        headers['Authorization'] = `Bearer ${publicAnonKey}`;
        headers['x-custom-auth-token'] = accessToken;
    } else {
        headers['Authorization'] = `Bearer ${accessToken || publicAnonKey}`;
    }

    const response = await fetch(`${API_BASE_URL}/business/verify`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Verification failed';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }

    return await response.json();
  },
  
  getStatus: async (): Promise<{ status: string; level: string }> => {
    return await apiRequest('/business/verification-status');
  }
};

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-29b58f9a`;

// Token cache to avoid refreshing on every call
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

// Guard against concurrent refresh attempts — stores the in-flight promise
let refreshInProgress: Promise<string | null> | null = null;

// Helper function to decode JWT and check if it's expired
// `silent` suppresses console output (used when the caller will handle logging)
function isTokenExpired(token: string, silent = false): boolean {
  try {
    if (token.startsWith('access_')) {
      return false; // Custom tokens don't have JWT expiry structure
    }

    // JWT format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      if (!silent) console.error('Invalid JWT format');
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
    if (!silent) console.error('Error decoding JWT:', error);
    return true; // Treat decode errors as expired
  }
}

// Clear token cache (call this on logout)
export function clearTokenCache(): void {
  cachedToken = null;
  tokenExpiry = 0;
  refreshInProgress = null;
}

// Core refresh logic — extracted so it can be deduplicated
async function doRefreshToken(): Promise<string | null> {
  // 1. Try refreshSession first (handles expired refresh tokens internally)
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (!error && session) {
      cachedToken = session.access_token;
      tokenExpiry = session.expires_at ? session.expires_at * 1000 : 0;
      localStorage.setItem('auth_token', session.access_token);
      sessionStorage.setItem('access_token', session.access_token);
      return session.access_token;
    }
  } catch (e) {
    // refreshSession can throw on network errors; fall through to getSession
  }

  // 2. Fallback: getSession (may have a valid session from another tab)
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (!error && session && session.access_token && !isTokenExpired(session.access_token, true)) {
      cachedToken = session.access_token;
      tokenExpiry = session.expires_at ? session.expires_at * 1000 : 0;
      return session.access_token;
    }
  } catch (e) {
    // getSession failed too
  }

  return null;
}

// Helper function to get access token for API requests
async function getAccessToken(): Promise<string | null> {
  // Check if we're in the browser environment
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    // 1. Check for custom KV auth token first (starts with access_)
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken && storedToken.startsWith('access_')) {
        cachedToken = storedToken;
        tokenExpiry = Date.now() + 86400000; // Assume valid for 24h
        return storedToken;
    }

    // 2. Check cached JWT token — single call to isTokenExpired
    if (cachedToken && !isTokenExpired(cachedToken, true)) {
      return cachedToken;
    }

    // 3. Token is missing or expired — refresh.
    //    Deduplicate: if a refresh is already in-flight, piggyback on it.
    if (refreshInProgress) {
      return refreshInProgress;
    }

    refreshInProgress = doRefreshToken().finally(() => {
      refreshInProgress = null;
    });

    return refreshInProgress;

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
    // Create an abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    // Handle Custom Auth Tokens
    if (accessToken && accessToken.startsWith('access_')) {
        headers['Authorization'] = `Bearer ${publicAnonKey}`;
        headers['x-custom-auth-token'] = accessToken;
    } else {
        headers['Authorization'] = `Bearer ${accessToken || publicAnonKey}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers,
      });

      // Handle 401 Unauthorized - token might be expired, try to refresh
      if (response.status === 401 && retryCount === 0) {
        console.log('Received 401, attempting to refresh session and retry...');
        
        // For KV auth users (custom phone auth), try refreshing the token first
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken && storedToken.startsWith('access_')) {
          console.log('[API] KV auth token rejected (401). Attempting token refresh...');
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
                console.log('[API] KV token refreshed successfully');
                localStorage.setItem('auth_token', newToken);
                sessionStorage.setItem('access_token', newToken);
                cachedToken = newToken;
                tokenExpiry = 0; // Reset — KV tokens don't have JWT expiry
                // Retry the original request with the new token
                return apiRequest<T>(endpoint, options, retryCount + 1);
              }
            }
            
            // Refresh failed — redirect to login
            console.warn('[API] KV token refresh failed. Redirecting to login.');
          } catch (refreshErr) {
            console.error('[API] Token refresh request failed:', refreshErr);
          }

          // If we get here, refresh didn't work
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          sessionStorage.removeItem('access_token');
          clearTokenCache();
          window.location.href = '/login';
          throw new Error('Session expired. Please log in again.');
        }

        // For Supabase auth users, try refreshing the session
        const { data: { session }, error } = await supabase.auth.refreshSession();
        
        if (error || !session) {
          console.error('Session refresh failed:', error);
          // Clear auth data and redirect to login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          sessionStorage.removeItem('access_token');
          clearTokenCache();
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
      // Retry on network error (TypeError: Failed to fetch)
      if (retryCount < 3 && (error.name === 'TypeError' || error.message === 'Failed to fetch')) {
        console.log(`Network error (${endpoint}), retrying (${retryCount + 1}/3)...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
        return apiRequest<T>(endpoint, options, retryCount + 1);
      }

      // Handle timeout errors gracefully
      if (error.name === 'AbortError' || error.message?.includes('aborted')) {
        console.warn(`API Request timeout (${endpoint})`);
        throw new Error('Request timeout');
      }

      // Only log non-critical endpoint errors in development
      const isCriticalEndpoint = !endpoint.includes('unread-count');
      // Skip logging for unread-count to avoid console spam
      if (isCriticalEndpoint && (process.env.NODE_ENV === 'development' || isCriticalEndpoint)) {
        console.error(`API Request failed (${endpoint}):`, error);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
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
  restock: async (id: number, quantity: number, batchNumber?: string, expiryDate?: string): Promise<Product> => {
    const data = await apiRequest<{ product: Product }>(`/products/${id}/restock`, {
      method: 'POST',
      body: JSON.stringify({ quantity, batchNumber, expiryDate }),
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

  // Process expired products (remove from stock and record loss)
  processExpiry: async (): Promise<{ processedCount: number; totalLoss: number }> => {
    const data = await apiRequest<{ processedCount: number; totalLoss: number }>('/products/process-expired', {
      method: 'POST',
    });
    return data;
  },

  // Batch Sales (Atomic)
  batchSales: async (items: { productId: number; quantity: number }[]): Promise<{ success: boolean; transactionId: string }> => {
    const data = await apiRequest<{ success: boolean; transactionId: string }>('/sales/batch', {
        method: 'POST',
        body: JSON.stringify({ items })
    });
    return data;
  },

  // Batch Purchase/Restock
  batchRestock: async (items: { productId: number; quantity: number; costPrice: number }[]): Promise<{ success: boolean; transactionId: string }> => {
    const data = await apiRequest<{ success: boolean; transactionId: string }>('/purchases/batch', {
        method: 'POST',
        body: JSON.stringify({ items })
    });
    return data;
  },

  // Undo Sales Transaction
  undoSales: async (transactionId: string): Promise<void> => {
      await apiRequest('/sales/undo', {
          method: 'POST',
          body: JSON.stringify({ transactionId })
      });
  },

  // Adjust stock manually (Wastage, Damage, Correction)
  adjustStock: async (id: number, quantity: number, type: string, reason?: string, batchId?: string): Promise<Product> => {
    const data = await apiRequest<{ product: Product }>(`/products/${id}/adjust-stock`, {
      method: 'POST',
      body: JSON.stringify({ quantity, type, reason, batchId }),
    });
    return data.product;
  },

  // Get inventory movements history
  getMovements: async (productId: number): Promise<any[]> => {
    const data = await apiRequest<{ movements: any[] }>(`/inventory/movements/${productId}`);
    return data.movements;
  },

  // Get losses history
  getLosses: async (): Promise<Loss[]> => {
    const data = await apiRequest<{ losses: Loss[] }>('/losses');
    return data.losses;
  },
};

// ========================================
// VARIANTS API
// ========================================

export const variantsApi = {
  // Get all active variants for a product
  getAll: async (productId: number): Promise<{ variants: ProductVariant[]; baseUnit: string }> => {
    return await apiRequest<{ variants: ProductVariant[]; baseUnit: string }>(`/products/${productId}/variants`);
  },

  // Add a variant to a product
  add: async (productId: number, variant: Partial<ProductVariant> & { baseUnit?: string }): Promise<{ variant: ProductVariant; product: Product }> => {
    return await apiRequest<{ variant: ProductVariant; product: Product }>(`/products/${productId}/variants`, {
      method: 'POST',
      body: JSON.stringify(variant),
    });
  },

  // Update a variant
  update: async (productId: number, variantId: string, updates: Partial<ProductVariant>): Promise<{ variant: ProductVariant; product: Product }> => {
    return await apiRequest<{ variant: ProductVariant; product: Product }>(`/products/${productId}/variants/${variantId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Soft-delete a variant
  delete: async (productId: number, variantId: string): Promise<{ success: boolean; product: Product }> => {
    return await apiRequest<{ success: boolean; product: Product }>(`/products/${productId}/variants/${variantId}`, {
      method: 'DELETE',
    });
  },

  // Restock a variant
  restock: async (productId: number, variantId: string, quantity: number, unitLabel?: string): Promise<{ variant: ProductVariant; product: Product }> => {
    return await apiRequest<{ variant: ProductVariant; product: Product }>(`/products/${productId}/variants/${variantId}/restock`, {
      method: 'POST',
      body: JSON.stringify({ quantity, unitLabel }),
    });
  },

  // Sell from a variant
  sell: async (productId: number, variantId: string, quantity?: number, looseQuantityInBaseUnit?: number): Promise<{ variant: ProductVariant; product: Product; revenue: number }> => {
    return await apiRequest<{ variant: ProductVariant; product: Product; revenue: number }>(`/products/${productId}/variants/${variantId}/sell`, {
      method: 'POST',
      body: JSON.stringify({ quantity, looseQuantityInBaseUnit }),
    });
  },

  // Migrate a product to the variant system
  migrate: async (productId: number, baseUnit?: string): Promise<{ product: Product }> => {
    return await apiRequest<{ product: Product }>(`/products/${productId}/migrate-variants`, {
      method: 'POST',
      body: JSON.stringify({ baseUnit }),
    });
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
// INVOICES API
// ========================================

export const invoicesApi = {
  create: async (invoice: any): Promise<any> => {
    const data = await apiRequest<{ invoice: any }>('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoice),
    });
    return data.invoice;
  },
  
  getByOrder: async (orderId: string): Promise<any> => {
    const data = await apiRequest<{ invoice: any }>(`/invoices/order/${orderId}`);
    return data.invoice;
  }
};

// ========================================
// HELD BILLS API
// ========================================

export const heldBillsApi = {
  getAll: async (): Promise<any[]> => {
    const data = await apiRequest<{ bills: any[] }>('/held-bills');
    return data.bills;
  },

  add: async (bill: any): Promise<any> => {
    const data = await apiRequest<{ bill: any }>('/held-bills', {
      method: 'POST',
      body: JSON.stringify(bill),
    });
    return data.bill;
  },

  delete: async (id: string): Promise<void> => {
    await apiRequest(`/held-bills/${id}`, {
      method: 'DELETE',
    });
  }
};

// ========================================
// AUDIT LOGS API
// ========================================

export const auditLogsApi = {
  log: async (entry: any): Promise<void> => {
    await apiRequest('/audit-logs', {
      method: 'POST',
      body: JSON.stringify(entry),
    });
  }
};

// ========================================
// PURCHASES API
// ========================================

export const purchasesApi = {
  // Get all purchases
  getAll: async (): Promise<Purchase[]> => {
    const data = await apiRequest<{ purchases: Purchase[] }>('/purchases');
    return data.purchases;
  },

  // Add new purchase
  add: async (purchase: Purchase): Promise<Purchase> => {
    const data = await apiRequest<{ purchase: Purchase }>('/purchases', {
      method: 'POST',
      body: JSON.stringify(purchase),
    });
    return data.purchase;
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
// ANALYTICS & AI INSIGHTS API
// ========================================

export const analyticsInsightsApi = {
  getInsights: async (): Promise<any> => {
    return await apiRequest('/analytics/ai-insights');
  },

  recordFeedback: async (insightId: string, status: 'seen' | 'ignored' | 'acted'): Promise<void> => {
    await apiRequest('/analytics/ai-insights/feedback', {
        method: 'POST',
        body: JSON.stringify({ insightId, status })
    });
  }
};

// ========================================
// AI API
// ========================================

export const aiApi = {
  parseSalesNote: async (note: string, products?: Product[]): Promise<any> => {
     // Optimize payload: only send necessary fields if passing products
     const productContext = products?.map(p => ({
         id: p.id, 
         name: p.name, 
         unit: p.unit, 
         price: p.price 
     }));
     
     const data = await apiRequest<any>('/ai/parse-sales-note', {
       method: 'POST',
       body: JSON.stringify({ note, products: productContext }),
     });
     return data;
  },

  parsePurchaseNote: async (note: string, products?: Product[]): Promise<any> => {
     const productContext = products?.map(p => ({
         id: p.id, 
         name: p.name, 
         unit: p.unit, 
         costPrice: p.costPrice 
     }));
     
     const data = await apiRequest<any>('/ai/parse-purchase-note', {
       method: 'POST',
       body: JSON.stringify({ note, products: productContext }),
     });
     return data;
  }
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

  // Upload shop logo
  uploadLogo: async (file: File): Promise<string> => {
    const accessToken = await getAccessToken();
    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {};
    if (accessToken && accessToken.startsWith('access_')) {
        headers['Authorization'] = `Bearer ${publicAnonKey}`;
        headers['x-custom-auth-token'] = accessToken;
    } else {
        headers['Authorization'] = `Bearer ${accessToken || publicAnonKey}`;
    }

    const response = await fetch(`${API_BASE_URL}/shop-settings/logo`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload logo');
    }

    const data = await response.json();
    return data.url;
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
    try {
      const data = await apiRequest<{ count: number }>('/notifications/unread-count');
      return data.count;
    } catch {
      return 0;
    }
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
// EXPRESS MODE API
// ========================================

export const expressApi = {
  // Get express config
  getConfig: async (): Promise<{ pinnedItemIds: number[] }> => {
    const data = await apiRequest<{ config: { pinnedItemIds: number[] } }>('/express/config');
    return data.config;
  },

  // Update express config
  updateConfig: async (pinnedItemIds: number[]): Promise<void> => {
    await apiRequest('/express/config', {
      method: 'POST',
      body: JSON.stringify({ pinnedItemIds }),
    });
  },

  // Record express sale (supports legacy + variant-based)
  recordSale: async (
    productId: number,
    quantity: number = 1,
    variantId?: string,
    looseQuantityInBaseUnit?: number
  ): Promise<{ success: boolean; transactionId: string; newStock: number; variant?: ProductVariant; product?: Product }> => {
    return await apiRequest<{ success: boolean; transactionId: string; newStock: number; variant?: ProductVariant; product?: Product }>('/express/sale', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, variantId, looseQuantityInBaseUnit }),
    });
  },

  // Get AI suggestions
  getSuggestions: async (): Promise<number[]> => {
    const data = await apiRequest<{ suggestions: number[] }>('/express/suggestions');
    return data.suggestions;
  }
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

// ========================================
// DASHBOARD API
// ========================================

export const dashboardApi = {
  getDailyMissions: async (): Promise<DailyMission[]> => {
    const data = await apiRequest<{ missions: DailyMission[] }>('/dashboard/daily-missions');
    return data.missions;
  },

  getStoreHealth: async (): Promise<StoreHealth> => {
    const data = await apiRequest<{ health: StoreHealth }>('/dashboard/store-health');
    return data.health;
  },

  getEndOfDaySummary: async (): Promise<EndOfDaySummary> => {
    const data = await apiRequest<{ summary: EndOfDaySummary }>('/dashboard/end-of-day-summary');
    return data.summary;
  }
};