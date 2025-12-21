import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import type { Product, Customer, Order, RevenueSource, Notification, Vendor } from '../data/dashboardData';

export interface ShopSettings {
  shopName: string;
  shopAddress: string;
  contactEmail: string;
  updatedAt?: string;
}

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-29b58f9a`;

// Get access token from session storage
function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    // Try sessionStorage first, then localStorage as fallback
    return sessionStorage.getItem('access_token') || localStorage.getItem('auth_token');
  }
  return null;
}

// Helper function to make API requests
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const accessToken = getAccessToken();
  
  // Log warning if no access token found
  if (!accessToken) {
    console.warn('No access token found. User may need to sign in.');
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken || publicAnonKey}`,
        ...options.headers,
      },
    });

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
          error: errorMessage,
        });
      }
      
      // Handle authentication errors
      if (response.status === 401) {
        // Clear invalid tokens
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          sessionStorage.removeItem('access_token');
        }
        throw new Error('Authentication required. Please sign in to continue.');
      }
      
      throw new Error(errorMessage);
    }

    const responseText = await response.text();
    
    // Handle empty responses
    if (!responseText) {
      return {} as T;
    }
    
    return JSON.parse(responseText);
  } catch (error) {
    // Only log fetch errors in development or for critical endpoints
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