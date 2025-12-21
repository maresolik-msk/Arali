import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Initialize Supabase clients
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-29b58f9a/health", (c) => {
  return c.json({ status: "ok" });
});

// ========================================
// AUTHENTICATION ENDPOINTS
// ========================================

// Sign up new user
app.post("/make-server-29b58f9a/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    // Validate input
    if (!email || !password || !name) {
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    if (password.length < 6) {
      return c.json({ error: "Password must be at least 6 characters" }, 400);
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUser?.users?.some(user => user.email === email);
    
    if (userExists) {
      return c.json({ error: "User with this email already exists" }, 400);
    }

    // Create user with Supabase Admin
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error("Signup error:", error);
      return c.json({ error: error.message }, 400);
    }

    console.log(`User signed up: ${email}`);
    return c.json({ 
      success: true, 
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name
      }
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return c.json({ error: "Failed to sign up", details: String(error) }, 500);
  }
});

// Initialize demo user
app.post("/make-server-29b58f9a/auth/init-demo", async (c) => {
  try {
    // Check if demo user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const demoUserExists = existingUsers?.users?.some(user => user.email === 'demo@arali.com');
    
    if (demoUserExists) {
      console.log('Demo user already exists');
      return c.json({ success: true, message: 'Demo user already exists' });
    }

    // Create demo user
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: 'demo@arali.com',
      password: 'demo123',
      user_metadata: { name: 'Demo User' },
      email_confirm: true
    });

    if (error) {
      console.error("Error creating demo user:", error);
      return c.json({ error: error.message }, 400);
    }

    console.log('Demo user created successfully');
    return c.json({ 
      success: true, 
      message: 'Demo user created successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata.name
      }
    });
  } catch (error) {
    console.error("Error initializing demo user:", error);
    return c.json({ error: "Failed to initialize demo user", details: String(error) }, 500);
  }
});

// Verify authentication token (middleware helper)
async function verifyAuth(authHeader: string | null) {
  if (!authHeader) {
    return { user: null, error: "No authorization header" };
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return { user: null, error: "Invalid authorization header" };
  }

  // Check if it's the public anon key - this shouldn't be used for auth
  // but we need to handle it gracefully
  const publicAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  if (token === publicAnonKey) {
    return { user: null, error: "Invalid JWT - please sign in to continue" };
  }

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  
  if (error || !user) {
    console.error("Auth verification error:", error?.message || "User not found");
    return { user: null, error: error?.message || "Invalid or expired token" };
  }

  return { user, error: null };
}

// Helper to get user-specific key
function getUserKey(userId: string, key: string): string {
  return `user:${userId}:${key}`;
}

// ========================================
// DATA INITIALIZATION ENDPOINT
// ========================================

app.post("/make-server-29b58f9a/init", async (c) => {
  try {
    const { products, customers, orders, revenueSources } = await c.req.json();
    
    // Store all data in KV store
    await kv.set('products', products);
    await kv.set('customers', customers);
    await kv.set('orders', orders);
    await kv.set('revenueSources', revenueSources);
    
    console.log('Database initialized with default data');
    return c.json({ success: true, message: 'Database initialized' });
  } catch (error) {
    console.error("Error initializing database:", error);
    return c.json({ error: "Failed to initialize database", details: String(error) }, 500);
  }
});

// ========================================
// PRODUCTS ENDPOINTS
// ========================================

app.get("/make-server-29b58f9a/products", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const products = await kv.get(getUserKey(user.id, 'products'));
    // Ensure we always return an array
    return c.json({ products: products || [] });
  } catch (error) {
    console.error("Error fetching products:", error);
    return c.json({ error: "Failed to fetch products", details: String(error) }, 500);
  }
});

app.post("/make-server-29b58f9a/products", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const product = await c.req.json();
    const products = await kv.get(getUserKey(user.id, 'products'));
    const productsList = Array.isArray(products) ? products : [];
    productsList.push(product);
    await kv.set(getUserKey(user.id, 'products'), productsList);
    
    console.log('Product added:', product.name, 'for user:', user.email);
    return c.json({ product });
  } catch (error) {
    console.error("Error adding product:", error);
    return c.json({ error: "Failed to add product", details: String(error) }, 500);
  }
});

app.put("/make-server-29b58f9a/products/:id", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = parseInt(c.req.param('id'));
    const updates = await c.req.json();
    const products = await kv.get(getUserKey(user.id, 'products'));
    const productsList = Array.isArray(products) ? products : [];
    
    const index = productsList.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return c.json({ error: "Product not found" }, 404);
    }
    
    productsList[index] = { ...productsList[index], ...updates };
    await kv.set(getUserKey(user.id, 'products'), productsList);
    
    console.log('Product updated:', id, 'for user:', user.email);
    return c.json({ product: productsList[index] });
  } catch (error) {
    console.error("Error updating product:", error);
    return c.json({ error: "Failed to update product", details: String(error) }, 500);
  }
});

app.delete("/make-server-29b58f9a/products/:id", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = parseInt(c.req.param('id'));
    const products = await kv.get(getUserKey(user.id, 'products'));
    const productsList = Array.isArray(products) ? products : [];
    
    const filteredProducts = productsList.filter((p: any) => p.id !== id);
    await kv.set(getUserKey(user.id, 'products'), filteredProducts);
    
    console.log('Product deleted:', id, 'for user:', user.email);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return c.json({ error: "Failed to delete product", details: String(error) }, 500);
  }
});

app.post("/make-server-29b58f9a/products/:id/restock", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = parseInt(c.req.param('id'));
    const { quantity } = await c.req.json();
    const products = await kv.get(getUserKey(user.id, 'products'));
    const productsList = Array.isArray(products) ? products : [];
    
    const index = productsList.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return c.json({ error: "Product not found" }, 404);
    }
    
    productsList[index].stock += quantity;
    await kv.set(getUserKey(user.id, 'products'), productsList);
    
    console.log('Product restocked:', id, 'Quantity:', quantity, 'for user:', user.email);
    return c.json({ product: productsList[index] });
  } catch (error) {
    console.error("Error restocking product:", error);
    return c.json({ error: "Failed to restock product", details: String(error) }, 500);
  }
});

// Record sales for a product
app.post("/make-server-29b58f9a/products/:id/record-sales", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = parseInt(c.req.param('id'));
    const { quantitySold } = await c.req.json();
    
    // Validate quantity sold
    if (!quantitySold || quantitySold <= 0) {
      return c.json({ error: "Invalid quantity sold" }, 400);
    }

    const products = await kv.get(getUserKey(user.id, 'products'));
    const productsList = Array.isArray(products) ? products : [];
    
    const index = productsList.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return c.json({ error: "Product not found" }, 404);
    }
    
    const product = productsList[index];
    
    // Check if there's enough stock to record the sale
    if (product.stock < quantitySold) {
      return c.json({ 
        error: `Insufficient stock. Current stock: ${product.stock}, trying to sell: ${quantitySold}` 
      }, 400);
    }
    
    // Update product: reduce stock, increase unitsSold, increase revenue
    productsList[index].stock -= quantitySold;
    productsList[index].unitsSold = (productsList[index].unitsSold || 0) + quantitySold;
    productsList[index].revenue = (productsList[index].revenue || 0) + (quantitySold * product.price);
    productsList[index].updatedAt = new Date();
    
    await kv.set(getUserKey(user.id, 'products'), productsList);
    
    console.log('Sales recorded:', id, 'Quantity sold:', quantitySold, 'for user:', user.email);
    return c.json({ product: productsList[index] });
  } catch (error) {
    console.error("Error recording sales:", error);
    return c.json({ error: "Failed to record sales", details: String(error) }, 500);
  }
});

// ========================================
// CUSTOMERS ENDPOINTS
// ========================================

app.get("/make-server-29b58f9a/customers", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const customers = await kv.get(getUserKey(user.id, 'customers'));
    return c.json({ customers: customers || [] });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return c.json({ error: "Failed to fetch customers", details: String(error) }, 500);
  }
});

app.post("/make-server-29b58f9a/customers", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const customer = await c.req.json();
    const customers = await kv.get(getUserKey(user.id, 'customers'));
    const customersList = Array.isArray(customers) ? customers : [];
    customersList.push(customer);
    await kv.set(getUserKey(user.id, 'customers'), customersList);
    
    console.log('Customer added:', customer.name, 'for user:', user.email);
    return c.json({ customer });
  } catch (error) {
    console.error("Error adding customer:", error);
    return c.json({ error: "Failed to add customer", details: String(error) }, 500);
  }
});

app.put("/make-server-29b58f9a/customers/:id", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = parseInt(c.req.param('id'));
    const updates = await c.req.json();
    const customers = await kv.get(getUserKey(user.id, 'customers'));
    const customersList = Array.isArray(customers) ? customers : [];
    
    const index = customersList.findIndex((cust: any) => cust.id === id);
    if (index === -1) {
      return c.json({ error: "Customer not found" }, 404);
    }
    
    customersList[index] = { ...customersList[index], ...updates };
    await kv.set(getUserKey(user.id, 'customers'), customersList);
    
    console.log('Customer updated:', id, 'for user:', user.email);
    return c.json({ customer: customersList[index] });
  } catch (error) {
    console.error("Error updating customer:", error);
    return c.json({ error: "Failed to update customer", details: String(error) }, 500);
  }
});

app.delete("/make-server-29b58f9a/customers/:id", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = parseInt(c.req.param('id'));
    const customers = await kv.get(getUserKey(user.id, 'customers'));
    const customersList = Array.isArray(customers) ? customers : [];
    
    const index = customersList.findIndex((cust: any) => cust.id === id);
    if (index === -1) {
      return c.json({ error: "Customer not found" }, 404);
    }
    
    // Remove customer from list
    const deletedCustomer = customersList.splice(index, 1)[0];
    await kv.set(getUserKey(user.id, 'customers'), customersList);
    
    console.log('Customer deleted:', id, deletedCustomer.name, 'for user:', user.email);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return c.json({ error: "Failed to delete customer", details: String(error) }, 500);
  }
});

// ========================================
// ORDERS ENDPOINTS
// ========================================

app.get("/make-server-29b58f9a/orders", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const orders = await kv.get(getUserKey(user.id, 'orders'));
    return c.json({ orders: orders || [] });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return c.json({ error: "Failed to fetch orders", details: String(error) }, 500);
  }
});

app.post("/make-server-29b58f9a/orders", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const order = await c.req.json();
    const orders = await kv.get(getUserKey(user.id, 'orders'));
    const ordersList = Array.isArray(orders) ? orders : [];
    ordersList.push(order);
    await kv.set(getUserKey(user.id, 'orders'), ordersList);
    
    console.log('Order added:', order.id, 'for user:', user.email);
    return c.json({ order });
  } catch (error) {
    console.error("Error adding order:", error);
    return c.json({ error: "Failed to add order", details: String(error) }, 500);
  }
});

app.put("/make-server-29b58f9a/orders/:id/status", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = c.req.param('id');
    const { status } = await c.req.json();
    const orders = await kv.get(getUserKey(user.id, 'orders'));
    const ordersList = Array.isArray(orders) ? orders : [];
    
    const index = ordersList.findIndex((order: any) => order.id === id);
    if (index === -1) {
      return c.json({ error: "Order not found" }, 404);
    }
    
    ordersList[index].status = status;
    await kv.set(getUserKey(user.id, 'orders'), ordersList);
    
    console.log('Order status updated:', id, 'Status:', status, 'for user:', user.email);
    return c.json({ order: ordersList[index] });
  } catch (error) {
    console.error("Error updating order status:", error);
    return c.json({ error: "Failed to update order status", details: String(error) }, 500);
  }
});

// ========================================
// REVENUE SOURCES ENDPOINTS
// ========================================

app.get("/make-server-29b58f9a/revenue-sources", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const revenueSources = await kv.get(getUserKey(user.id, 'revenueSources'));
    return c.json({ revenueSources: revenueSources || [] });
  } catch (error) {
    console.error("Error fetching revenue sources:", error);
    return c.json({ error: "Failed to fetch revenue sources", details: String(error) }, 500);
  }
});

app.put("/make-server-29b58f9a/revenue-sources/:id", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = parseInt(c.req.param('id'));
    const updates = await c.req.json();
    const revenueSources = await kv.get(getUserKey(user.id, 'revenueSources'));
    const revenueSourcesList = Array.isArray(revenueSources) ? revenueSources : [];
    
    const index = revenueSourcesList.findIndex((source: any) => source.id === id);
    if (index === -1) {
      return c.json({ error: "Revenue source not found" }, 404);
    }
    
    revenueSourcesList[index] = { ...revenueSourcesList[index], ...updates };
    await kv.set(getUserKey(user.id, 'revenueSources'), revenueSourcesList);
    
    console.log('Revenue source updated:', id, 'for user:', user.email);
    return c.json({ revenueSource: revenueSourcesList[index] });
  } catch (error) {
    console.error("Error updating revenue source:", error);
    return c.json({ error: "Failed to update revenue source", details: String(error) }, 500);
  }
});

// ========================================
// SHOP SETTINGS ENDPOINTS
// ========================================

// Get shop settings
app.get("/make-server-29b58f9a/shop-settings", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const settings = await kv.get(getUserKey(user.id, 'shopSettings'));
    
    // Return default settings if none exist
    if (!settings) {
      const defaultSettings = {
        shopName: user.user_metadata?.name ? `${user.user_metadata.name}'s Shop` : 'My Shop',
        shopAddress: '',
        contactEmail: user.email || '',
      };
      return c.json({ settings: defaultSettings });
    }
    
    return c.json({ settings });
  } catch (error) {
    console.error("Error fetching shop settings:", error);
    return c.json({ error: "Failed to fetch shop settings", details: String(error) }, 500);
  }
});

// Update shop settings
app.put("/make-server-29b58f9a/shop-settings", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const updates = await c.req.json();
    
    // Get existing settings or create new ones
    const existingSettings = await kv.get(getUserKey(user.id, 'shopSettings')) || {};
    
    // Merge updates with existing settings
    const updatedSettings = {
      ...existingSettings,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(getUserKey(user.id, 'shopSettings'), updatedSettings);
    
    console.log('Shop settings updated for user:', user.email);
    return c.json({ settings: updatedSettings });
  } catch (error) {
    console.error("Error updating shop settings:", error);
    return c.json({ error: "Failed to update shop settings", details: String(error) }, 500);
  }
});

// ========================================
// NOTIFICATIONS ENDPOINTS
// ========================================

// Get all notifications for user
app.get("/make-server-29b58f9a/notifications", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const notifications = await kv.get(getUserKey(user.id, 'notifications'));
    // Return notifications sorted by createdAt (newest first)
    const notificationsList = Array.isArray(notifications) ? notifications : [];
    notificationsList.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return c.json({ notifications: notificationsList });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return c.json({ error: "Failed to fetch notifications", details: String(error) }, 500);
  }
});

// Get unread count
app.get("/make-server-29b58f9a/notifications/unread-count", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const notifications = await kv.get(getUserKey(user.id, 'notifications'));
    const notificationsList = Array.isArray(notifications) ? notifications : [];
    const unreadCount = notificationsList.filter((n: any) => !n.read).length;
    
    return c.json({ count: unreadCount });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return c.json({ error: "Failed to fetch unread count", details: String(error) }, 500);
  }
});

// Create notification
app.post("/make-server-29b58f9a/notifications", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const notificationData = await c.req.json();
    const notifications = await kv.get(getUserKey(user.id, 'notifications'));
    const notificationsList = Array.isArray(notifications) ? notifications : [];
    
    // Create new notification with unique ID
    const notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      ...notificationData,
      createdAt: new Date().toISOString(),
    };
    
    notificationsList.unshift(notification); // Add to beginning of array
    await kv.set(getUserKey(user.id, 'notifications'), notificationsList);
    
    console.log('Notification created:', notification.type, 'for user:', user.email);
    return c.json({ notification });
  } catch (error) {
    console.error("Error creating notification:", error);
    return c.json({ error: "Failed to create notification", details: String(error) }, 500);
  }
});

// Mark notification as read
app.put("/make-server-29b58f9a/notifications/:id/read", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = c.req.param('id');
    const notifications = await kv.get(getUserKey(user.id, 'notifications'));
    const notificationsList = Array.isArray(notifications) ? notifications : [];
    
    const index = notificationsList.findIndex((n: any) => n.id === id);
    if (index === -1) {
      return c.json({ error: "Notification not found" }, 404);
    }
    
    notificationsList[index].read = true;
    await kv.set(getUserKey(user.id, 'notifications'), notificationsList);
    
    console.log('Notification marked as read:', id, 'for user:', user.email);
    return c.json({ notification: notificationsList[index] });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return c.json({ error: "Failed to mark notification as read", details: String(error) }, 500);
  }
});

// Mark all notifications as read
app.put("/make-server-29b58f9a/notifications/mark-all-read", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const notifications = await kv.get(getUserKey(user.id, 'notifications'));
    const notificationsList = Array.isArray(notifications) ? notifications : [];
    
    // Mark all as read
    const updatedNotifications = notificationsList.map((n: any) => ({ ...n, read: true }));
    await kv.set(getUserKey(user.id, 'notifications'), updatedNotifications);
    
    console.log('All notifications marked as read for user:', user.email);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return c.json({ error: "Failed to mark all notifications as read", details: String(error) }, 500);
  }
});

// Delete notification
app.delete("/make-server-29b58f9a/notifications/:id", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = c.req.param('id');
    const notifications = await kv.get(getUserKey(user.id, 'notifications'));
    const notificationsList = Array.isArray(notifications) ? notifications : [];
    
    const filteredNotifications = notificationsList.filter((n: any) => n.id !== id);
    await kv.set(getUserKey(user.id, 'notifications'), filteredNotifications);
    
    console.log('Notification deleted:', id, 'for user:', user.email);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return c.json({ error: "Failed to delete notification", details: String(error) }, 500);
  }
});

// Send email notification
// Note: This requires email service configuration (Resend, SendGrid, etc.)
app.post("/make-server-29b58f9a/notifications/:id/send-email", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = c.req.param('id');
    const notifications = await kv.get(getUserKey(user.id, 'notifications'));
    const notificationsList = Array.isArray(notifications) ? notifications : [];
    
    const notification = notificationsList.find((n: any) => n.id === id);
    if (!notification) {
      return c.json({ error: "Notification not found" }, 404);
    }

    // Get shop settings to get contact email
    const settings = await kv.get(getUserKey(user.id, 'shopSettings'));
    const contactEmail = settings?.contactEmail || user.email;

    // TODO: Integrate with email service
    // For now, just log that email would be sent
    console.log('Email notification would be sent to:', contactEmail);
    console.log('Notification details:', notification);
    
    // In production, you would integrate with an email service like:
    // - Resend (https://resend.com)
    // - SendGrid (https://sendgrid.com)
    // - Mailgun (https://www.mailgun.com)
    // 
    // Example with Resend (requires RESEND_API_KEY environment variable):
    // const resendApiKey = Deno.env.get('RESEND_API_KEY');
    // if (resendApiKey) {
    //   const response = await fetch('https://api.resend.com/emails', {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${resendApiKey}`,
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       from: 'Arali <notifications@arali.app>',
    //       to: contactEmail,
    //       subject: notification.title,
    //       html: `<p>${notification.message}</p>`,
    //     }),
    //   });
    //   if (!response.ok) {
    //     throw new Error('Failed to send email');
    //   }
    // }
    
    return c.json({ 
      success: true,
      message: 'Email service not configured. To enable email notifications, please set up an email service like Resend, SendGrid, or Mailgun and add the API key to environment variables.'
    });
  } catch (error) {
    console.error("Error sending email notification:", error);
    return c.json({ error: "Failed to send email notification", details: String(error) }, 500);
  }
});

// ========================================
// VENDORS ENDPOINTS
// ========================================

// Get all vendors
app.get("/make-server-29b58f9a/vendors", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const vendors = await kv.get(getUserKey(user.id, 'vendors'));
    return c.json({ vendors: vendors || [] });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return c.json({ error: "Failed to fetch vendors", details: String(error) }, 500);
  }
});

// Add vendor
app.post("/make-server-29b58f9a/vendors", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const vendor = await c.req.json();
    const vendors = await kv.get(getUserKey(user.id, 'vendors'));
    const vendorsList = Array.isArray(vendors) ? vendors : [];
    vendorsList.push(vendor);
    await kv.set(getUserKey(user.id, 'vendors'), vendorsList);
    
    console.log('Vendor added:', vendor.name, 'for user:', user.email);
    return c.json({ vendor });
  } catch (error) {
    console.error("Error adding vendor:", error);
    return c.json({ error: "Failed to add vendor", details: String(error) }, 500);
  }
});

// Update vendor
app.put("/make-server-29b58f9a/vendors/:id", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = parseInt(c.req.param('id'));
    const updates = await c.req.json();
    const vendors = await kv.get(getUserKey(user.id, 'vendors'));
    const vendorsList = Array.isArray(vendors) ? vendors : [];
    
    const index = vendorsList.findIndex((v: any) => v.id === id);
    if (index === -1) {
      return c.json({ error: "Vendor not found" }, 404);
    }
    
    vendorsList[index] = { ...vendorsList[index], ...updates };
    await kv.set(getUserKey(user.id, 'vendors'), vendorsList);
    
    console.log('Vendor updated:', id, 'for user:', user.email);
    return c.json({ vendor: vendorsList[index] });
  } catch (error) {
    console.error("Error updating vendor:", error);
    return c.json({ error: "Failed to update vendor", details: String(error) }, 500);
  }
});

// Delete vendor
app.delete("/make-server-29b58f9a/vendors/:id", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = parseInt(c.req.param('id'));
    const vendors = await kv.get(getUserKey(user.id, 'vendors'));
    const vendorsList = Array.isArray(vendors) ? vendors : [];
    
    const filteredVendors = vendorsList.filter((v: any) => v.id !== id);
    await kv.set(getUserKey(user.id, 'vendors'), filteredVendors);
    
    console.log('Vendor deleted:', id, 'for user:', user.email);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting vendor:", error);
    return c.json({ error: "Failed to delete vendor", details: String(error) }, 500);
  }
});

// Start the server
Deno.serve(app.fetch);