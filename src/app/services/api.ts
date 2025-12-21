import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import type { Product, Customer, Order, RevenueSource } from '../data/dashboardData';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-29b58f9a`;

// Helper function to make API requests
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    console.error(`API Error (${endpoint}):`, error);
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }

  return response.json();
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