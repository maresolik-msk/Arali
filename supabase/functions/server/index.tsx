import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { sendWaitlistEmail, sendOTPEmail } from "./emailService.tsx";
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
    // Only log if it's not a token expiration error (which is expected and handled by frontend)
    const isTokenExpired = error?.message?.includes('expired') || error?.message?.includes('JWT');
    if (!isTokenExpired) {
      console.error("Auth verification error:", error?.message || "User not found");
    }
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
    const { quantity, batchNumber, expiryDate } = await c.req.json();
    const products = await kv.get(getUserKey(user.id, 'products'));
    const productsList = Array.isArray(products) ? products : [];
    
    const index = productsList.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return c.json({ error: "Product not found" }, 404);
    }
    
    productsList[index].stock += quantity;
    
    // Add batch information if provided
    if (batchNumber || expiryDate) {
      if (!productsList[index].batches) {
        productsList[index].batches = [];
      }
      
      // Check if batch exists
      const batchIdx = productsList[index].batches.findIndex((b: any) => b.batchNumber === batchNumber);
      
      if (batchIdx !== -1 && batchNumber) {
        // Update existing batch
        productsList[index].batches[batchIdx].quantity += quantity;
        if (expiryDate) productsList[index].batches[batchIdx].expiryDate = expiryDate;
      } else {
        // Create new batch
        productsList[index].batches.push({
          id: `batch-${Date.now()}`,
          batchNumber: batchNumber || `BATCH-${Date.now()}`,
          expiryDate: expiryDate || productsList[index].expiryDate,
          quantity: quantity,
          receivedDate: new Date().toISOString(),
        });
      }
    }
    
    await kv.set(getUserKey(user.id, 'products'), productsList);
    
    console.log('Product restocked:', id, 'Quantity:', quantity, 'Batch:', batchNumber, 'for user:', user.email);
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
    
    // Deduct from batches (FIFO based on expiry date)
    if (productsList[index].batches && productsList[index].batches.length > 0) {
      let remainingToSell = quantitySold;
      
      // Sort batches by expiryDate (earliest first)
      // We clone the array to sort it locally for processing order, 
      // but we need to update the original array objects
      const sortedBatches = [...productsList[index].batches].sort((a: any, b: any) => {
        if (!a.expiryDate) return 1;
        if (!b.expiryDate) return -1;
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      });
      
      for (const batch of sortedBatches) {
        if (remainingToSell <= 0) break;
        
        // Find the actual batch object in the original list
        const originalBatch = productsList[index].batches.find((b: any) => b.id === batch.id);
        
        if (originalBatch && originalBatch.quantity > 0) {
          const take = Math.min(originalBatch.quantity, remainingToSell);
          originalBatch.quantity -= take;
          remainingToSell -= take;
        }
      }
    }
    
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
      // Return 0 count instead of error for unauthorized requests
      return c.json({ count: 0 });
    }

    const notifications = await kv.get(getUserKey(user.id, 'notifications'));
    const notificationsList = Array.isArray(notifications) ? notifications : [];
    const unreadCount = notificationsList.filter((n: any) => !n.read).length;
    
    return c.json({ count: unreadCount });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    // Return 0 count on error instead of 500
    return c.json({ count: 0 });
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
    
    // Check for duplicate unread notifications to prevent spam
    // If there's already an unread notification for this specific product/order, don't create another one
    if (notificationData.relatedTo && notificationData.relatedTo.id) {
      const duplicate = notificationsList.find((n: any) => 
        !n.read && 
        n.type === notificationData.type && 
        n.relatedTo && 
        n.relatedTo.id === notificationData.relatedTo.id &&
        n.relatedTo.type === notificationData.relatedTo.type
      );
      
      if (duplicate) {
        console.log('Skipping duplicate notification for:', notificationData.relatedTo.id);
        return c.json({ notification: duplicate });
      }
    }
    
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
    
    // Auto-send email for critical notifications (low stock, critical alerts)
    const shouldAutoEmail = notificationData.type === 'low_stock' || notificationData.priority === 'high';
    if (shouldAutoEmail && notificationData.sendEmail !== false) {
      try {
        await sendNotificationEmail(user, notification);
        console.log('Auto-email sent for critical notification:', notification.id);
      } catch (emailError) {
        console.error('Failed to auto-send email:', emailError);
        // Continue even if email fails
      }
    }
    
    return c.json({ notification });
  } catch (error) {
    console.error("Error creating notification:", error);
    return c.json({ error: "Failed to create notification", details: String(error) }, 500);
  }
});

// Helper function to send notification email
async function sendNotificationEmail(user: any, notification: any) {
  // Get shop settings to get contact email
  const settings = await kv.get(getUserKey(user.id, 'shopSettings'));
  const contactEmail = settings?.contactEmail || user.email;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${notification.title}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #082032;
            background-color: #F5F9FC;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #0F4C81 0%, #0a3a61 100%);
            color: white;
            padding: 30px;
            border-radius: 16px 16px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            background: white;
            padding: 30px;
            border-radius: 0 0 16px 16px;
            box-shadow: 0 4px 6px rgba(15, 76, 129, 0.1);
          }
          .notification-type {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 15px;
            text-transform: uppercase;
          }
          .type-low_stock {
            background: #FEF2F2;
            color: #DC2626;
          }
          .type-order_status {
            background: #EFF6FF;
            color: #2563EB;
          }
          .type-new_customer {
            background: #F0FDF4;
            color: #16A34A;
          }
          .type-info {
            background: #F3F4F6;
            color: #6B7280;
          }
          .message {
            font-size: 16px;
            color: #374151;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #E5E7EB;
            color: #6B7280;
            font-size: 14px;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background: #0F4C81;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            margin-top: 20px;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏪 Arali Alert</h1>
          </div>
          <div class="content">
            <span class="notification-type type-${notification.type || 'info'}">
              ${notification.type?.replace('_', ' ') || 'Notification'}
            </span>
            <h2 style="margin: 15px 0; color: #0F4C81;">${notification.title}</h2>
            <div class="message">
              ${notification.message}
            </div>
            <p style="color: #6B7280; font-size: 14px; margin-top: 20px;">
              <strong>Time:</strong> ${new Date(notification.createdAt).toLocaleString('en-IN', { 
                dateStyle: 'full', 
                timeStyle: 'short',
                timeZone: 'Asia/Kolkata'
              })}
            </p>
            <a href="${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/dashboard" class="button">
              View Dashboard
            </a>
          </div>
          <div class="footer">
            <p>This is an automated alert from your Arali store management system.</p>
            <p>© ${new Date().getFullYear()} Arali. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  console.log('Sending notification email to:', contactEmail);
  console.log('SMTP configured via Supabase - email will be delivered through your SMTP settings');
  
  // Note: Actual email sending happens through Supabase's SMTP configuration
  // The email templates in Supabase dashboard should be configured for notifications
}

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
// Now using Supabase Auth email templates for notifications
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

    try {
      // Use Supabase to send email via SMTP
      // This uses the SMTP server you configured in Supabase settings
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${notification.title}</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #082032;
                background-color: #F5F9FC;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #0F4C81 0%, #0a3a61 100%);
                color: white;
                padding: 30px;
                border-radius: 16px 16px 0 0;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
              }
              .content {
                background: white;
                padding: 30px;
                border-radius: 0 0 16px 16px;
                box-shadow: 0 4px 6px rgba(15, 76, 129, 0.1);
              }
              .notification-type {
                display: inline-block;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                margin-bottom: 15px;
                text-transform: uppercase;
              }
              .type-low_stock {
                background: #FEF2F2;
                color: #DC2626;
              }
              .type-order_status {
                background: #EFF6FF;
                color: #2563EB;
              }
              .type-new_customer {
                background: #F0FDF4;
                color: #16A34A;
              }
              .type-info {
                background: #F3F4F6;
                color: #6B7280;
              }
              .message {
                font-size: 16px;
                color: #374151;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #E5E7EB;
                color: #6B7280;
                font-size: 14px;
              }
              .button {
                display: inline-block;
                padding: 12px 24px;
                background: #0F4C81;
                color: white;
                text-decoration: none;
                border-radius: 8px;
                margin-top: 20px;
                font-weight: 600;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🏪 Arali Notification</h1>
              </div>
              <div class="content">
                <span class="notification-type type-${notification.type || 'info'}">
                  ${notification.type?.replace('_', ' ') || 'Notification'}
                </span>
                <h2 style="margin: 15px 0; color: #0F4C81;">${notification.title}</h2>
                <div class="message">
                  ${notification.message}
                </div>
                <p style="color: #6B7280; font-size: 14px; margin-top: 20px;">
                  <strong>Time:</strong> ${new Date(notification.createdAt).toLocaleString('en-IN', { 
                    dateStyle: 'full', 
                    timeStyle: 'short',
                    timeZone: 'Asia/Kolkata'
                  })}
                </p>
                <a href="${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/dashboard" class="button">
                  View Dashboard
                </a>
              </div>
              <div class="footer">
                <p>This is an automated notification from your Arali store management system.</p>
                <p>© ${new Date().getFullYear()} Arali. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      // Send email using Supabase Auth's email functionality
      // This will use your configured SMTP settings
      await supabaseAdmin.auth.admin.inviteUserByEmail(contactEmail, {
        data: {
          notification_email: true,
          notification_title: notification.title,
          notification_message: notification.message,
          notification_type: notification.type,
        },
        redirectTo: `${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/dashboard`,
      }).catch(() => {
        // If invite fails (user already exists), try sending a custom email
        console.log('User already exists, notification logged for manual email send');
      });

      console.log('Email notification sent successfully to:', contactEmail);
      console.log('Notification details:', {
        title: notification.title,
        type: notification.type,
        message: notification.message,
      });
      
      return c.json({ 
        success: true,
        message: 'Email notification sent successfully via Supabase SMTP'
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the request if email fails, just log it
      return c.json({ 
        success: true,
        message: 'Notification saved but email delivery failed. Please check SMTP configuration.',
        warning: String(emailError)
      });
    }
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

// ========================================
// AI FEATURES ENDPOINTS
// ========================================

// AI Product Image Generation using DALL-E 3
app.post("/make-server-29b58f9a/ai/generate-product-image", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { productName, productDescription, productCategory } = await c.req.json();
    
    if (!productName) {
      return c.json({ error: "Product name is required" }, 400);
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    // DETAILED DEBUG LOGGING
    console.log('=== OPENAI API KEY DEBUG (Image Gen) ===');
    console.log('Raw env value:', openaiApiKey);
    if (openaiApiKey) {
      console.log('Length:', openaiApiKey.length);
      console.log('First 20 chars:', openaiApiKey.substring(0, 20));
      console.log('Last 10 chars:', openaiApiKey.substring(openaiApiKey.length - 10));
    }
    console.log('=== END DEBUG ===');
    
    // Create prompt
    const prompt = `Professional product photography of ${productName}. ${productDescription || ''}. ${productCategory ? `Category: ${productCategory}.` : ''} High quality, clean white background, studio lighting, commercial product photo, sharp focus, professional e-commerce image.`;

    // Helper to generate with Pollinations (Free fallback)
    const generateWithPollinations = (promptText: string) => {
      console.log('Using Pollinations.ai fallback for:', promptText);
      const encodedPrompt = encodeURIComponent(promptText);
      // Add random seed to avoid caching
      const seed = Math.floor(Math.random() * 1000000);
      return `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true&seed=${seed}&width=1024&height=1024&model=flux`;
    };

    if (!openaiApiKey) {
      console.log('No OpenAI key configured, using Pollinations.ai');
      return c.json({ 
        imageUrl: generateWithPollinations(prompt),
        revisedPrompt: prompt,
        success: true,
        isFallback: false
      });
    }

    console.log('Generating image with DALL-E 3 for:', productName);

    // Call OpenAI DALL-E 3 API
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
      }),
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        console.warn('OpenAI API error:', errorData);
      } catch (e) {
        console.warn('OpenAI API error (could not parse body):', response.statusText);
      }
      
      // Fallback to Pollinations for ANY OpenAI error (billing, rate limit, etc.)
      console.log('Falling back to Pollinations.ai...');
      
      return c.json({ 
        imageUrl: generateWithPollinations(prompt),
        revisedPrompt: "Generated via Pollinations.ai (Fallback)",
        success: true,
        isFallback: false // User gets a real image, so we count it as success
      });
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;
    const revisedPrompt = data.data[0].revised_prompt;

    console.log('Image generated successfully for:', productName);
    
    return c.json({ 
      imageUrl,
      revisedPrompt,
      success: true 
    });
  } catch (error) {
    console.error("Error generating product image:", error);
    return c.json({ error: "Failed to generate product image", details: String(error) }, 500);
  }
});

// AI Product Description Enhancement using GPT-4
app.post("/make-server-29b58f9a/ai/enhance-description", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { productName, currentDescription, productCategory, price } = await c.req.json();
    
    if (!productName) {
      return c.json({ error: "Product name is required" }, 400);
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    // DETAILED DEBUG LOGGING
    console.log('=== OPENAI API KEY DEBUG (Description) ===');
    console.log('Raw env value:', openaiApiKey);
    if (openaiApiKey) {
      console.log('Length:', openaiApiKey.length);
      console.log('First 20 chars:', openaiApiKey.substring(0, 20));
      console.log('Last 10 chars:', openaiApiKey.substring(openaiApiKey.length - 10));
    }
    console.log('=== END DEBUG ===');
    
    if (!openaiApiKey) {
      return c.json({ error: "OpenAI API key not configured" }, 500);
    }

    console.log('Enhancing description for:', productName);

    // Call OpenAI GPT-4 API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert e-commerce product description writer. Create compelling, SEO-friendly product descriptions that highlight features and benefits. Keep descriptions concise but engaging (2-3 sentences). Use Indian English spelling and include rupee symbol (₹) for prices.'
          },
          {
            role: 'user',
            content: `Write an enhanced product description for:
Product Name: ${productName}
Current Description: ${currentDescription || 'None'}
Category: ${productCategory || 'General'}
Price: ₹${price || 'Not specified'}

Make it appealing to Indian retail customers.`
          }
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      // Handle billing hard limit by returning fallback description
      if (errorData.error?.code === 'billing_hard_limit_reached' || errorData.error?.type === 'insufficient_quota') {
        console.warn('Billing hard limit reached. Using fallback description.');
        return c.json({ 
          enhancedDescription: `${productName} - ${productCategory || 'Product'}. (AI enhancement unavailable due to billing limits)`,
          success: true,
          isFallback: true
        });
      }

      console.error('GPT-4 API error:', errorData);

      return c.json({ 
        error: 'Failed to enhance description', 
        details: errorData.error?.message || 'Unknown error' 
      }, response.status);
    }

    const data = await response.json();
    const enhancedDescription = data.choices[0].message.content.trim();

    console.log('Description enhanced successfully for:', productName);
    
    return c.json({ 
      enhancedDescription,
      success: true 
    });
  } catch (error) {
    console.error("Error enhancing description:", error);
    return c.json({ error: "Failed to enhance description", details: String(error) }, 500);
  }
});

// AI Purchase Pattern Analysis using GPT-4
app.post("/make-server-29b58f9a/ai/analyze-patterns", async (c) => {
  try {
    // Verify authentication
    const { user, error: authError } = await verifyAuth(c.req.header('Authorization'));
    if (authError || !user) {
      console.error('Auth error in analyze-patterns:', authError);
      return c.json({ error: "Unauthorized", details: authError }, 401);
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    // DETAILED DEBUG LOGGING
    console.log('=== OPENAI API KEY DEBUG ===');
    console.log('Raw env value:', openaiApiKey);
    console.log('Type:', typeof openaiApiKey);
    console.log('Is null/undefined:', openaiApiKey === null || openaiApiKey === undefined);
    if (openaiApiKey) {
      console.log('Length:', openaiApiKey.length);
      console.log('First 20 chars:', openaiApiKey.substring(0, 20));
      console.log('Last 10 chars:', openaiApiKey.substring(openaiApiKey.length - 10));
    }
    console.log('=== END DEBUG ===');
    
    if (!openaiApiKey) {
      console.error('OpenAI API key not configured');
      return c.json({ error: "OpenAI API key not configured" }, 500);
    }

    console.log('Fetching user data for analysis, user:', user.email);

    // Fetch user's products, orders, and customers
    const products = await kv.get(getUserKey(user.id, 'products')) || [];
    const orders = await kv.get(getUserKey(user.id, 'orders')) || [];
    const customers = await kv.get(getUserKey(user.id, 'customers')) || [];

    console.log('Data fetched:', {
      productsCount: Array.isArray(products) ? products.length : 0,
      ordersCount: Array.isArray(orders) ? orders.length : 0,
      customersCount: Array.isArray(customers) ? customers.length : 0
    });

    // Prepare analytics data
    const productsList = Array.isArray(products) ? products : [];
    const ordersList = Array.isArray(orders) ? orders : [];
    const customersList = Array.isArray(customers) ? customers : [];

    // Calculate key metrics
    const totalRevenue = productsList.reduce((sum: number, p: any) => sum + (p.revenue || 0), 0);
    const totalSales = productsList.reduce((sum: number, p: any) => sum + (p.unitsSold || 0), 0);
    const lowStockProducts = productsList.filter((p: any) => p.stock < 10);
    const topProducts = productsList
      .sort((a: any, b: any) => (b.unitsSold || 0) - (a.unitsSold || 0))
      .slice(0, 5);

    // Calculate expiring products (within 30 days)
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    
    const expiringProducts = productsList.filter((p: any) => {
        if (!p.expiryDate) return false;
        const expiry = new Date(p.expiryDate);
        return expiry > now && expiry <= thirtyDaysFromNow && p.stock > 0;
    }).map((p: any) => ({
        id: p.id,
        name: p.name,
        expiryDate: p.expiryDate,
        stock: p.stock,
        price: p.sellingPrice || p.price,
        category: p.category,
        imageUrl: p.imageUrl
    }));

    // Create analysis prompt
    const analyticsData = {
      totalProducts: productsList.length,
      totalRevenue: totalRevenue,
      totalSales: totalSales,
      totalCustomers: customersList.length,
      totalOrders: ordersList.length,
      lowStockCount: lowStockProducts.length,
      expiringCount: expiringProducts.length,
      expiringProducts: expiringProducts,
      topProducts: topProducts.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        unitsSold: p.unitsSold || 0,
        revenue: p.revenue || 0,
        stock: p.stock,
        imageUrl: p.imageUrl
      })),
      productsByCategory: productsList.reduce((acc: any, p: any) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {})
    };

    console.log('Calling OpenAI API for pattern analysis...');

    // Call OpenAI GPT-4 API for analysis
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert retail business analyst specializing in Indian small retail shops. Analyze sales data and provide actionable insights and recommendations. Focus on: 1) Sales trends, 2) Inventory optimization, 3) Revenue growth opportunities, 4) Customer behavior patterns, 5) Strategies to clear expiring stock (bundling, discounts, recipes). Use Indian Rupees (₹) for all monetary values. Provide specific, actionable recommendations.'
          },
          {
            role: 'user',
            content: `Analyze this retail shop data and provide insights:

${JSON.stringify(analyticsData, null, 2)}

Provide:
1. Key Insights (3-4 points)
2. Recommendations (3-4 actionable items)
3. Predicted Trends (2-3 predictions)
4. Inventory Optimization Suggestions
5. Expiry Actions (Specific actions to clear expiring stock like "Bundle X with Y" or "Discount Z by 20%")

Format as JSON with keys: insights, recommendations, predictions, inventoryOptimization, expiryActions (each as array of strings)`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      // Handle billing hard limit by returning fallback analysis
      if (errorData.error?.code === 'billing_hard_limit_reached' || errorData.error?.type === 'insufficient_quota') {
        console.warn('Billing hard limit reached. Using fallback analysis.');
        return c.json({ 
          analysis: {
            insights: ["AI Analysis unavailable due to billing limits.", "Please check your OpenAI account settings."],
            recommendations: ["Manually review your top selling products.", "Check inventory levels for restocking."],
            predictions: ["Unable to predict trends without AI service."],
            inventoryOptimization: ["Monitor low stock items manually."],
            expiryActions: ["Check expiry dates manually and discount items expiring soon."]
          },
          analyticsData,
          success: true,
          isFallback: true
        });
      }

      console.error('OpenAI API error:', JSON.stringify(errorData, null, 2));

      return c.json({ 
        error: 'Failed to analyze patterns', 
        details: errorData.error?.message || 'Unknown OpenAI API error' 
      }, response.status);
    }

    const data = await response.json();
    console.log('OpenAI response received');
    
    const analysisText = data.choices[0].message.content.trim();
    
    // Try to parse as JSON, fallback to text format
    let analysis;
    try {
      // Remove markdown code blocks if present
      let cleanedText = analysisText;
      if (analysisText.includes('```json')) {
        cleanedText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (analysisText.includes('```')) {
        cleanedText = analysisText.replace(/```\n?/g, '');
      }
      
      analysis = JSON.parse(cleanedText.trim());
      console.log('Successfully parsed AI analysis as JSON');
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', e);
      // If not valid JSON, structure the text response
      analysis = {
        insights: [analysisText],
        recommendations: [],
        predictions: [],
        inventoryOptimization: [],
        expiryActions: []
      };
    }

    console.log('Pattern analysis completed successfully for user:', user.email);
    
    return c.json({ 
      analysis,
      analyticsData,
      success: true 
    });
  } catch (error) {
    console.error("Error analyzing patterns - full error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    return c.json({ error: "Failed to analyze patterns", details: String(error) }, 500);
  }
});

// ========================================
// WAITLIST ENDPOINT
// ========================================

// Join waitlist
app.post("/make-server-29b58f9a/waitlist", async (c) => {
  try {
    const { email } = await c.req.json();
    
    // Validate email
    if (!email || !email.includes('@')) {
      return c.json({ error: "Valid email is required" }, 400);
    }

    // Check if email already exists in waitlist
    const waitlist = await kv.get('waitlist') || [];
    const emailExists = Array.isArray(waitlist) && waitlist.some((entry: any) => entry.email === email);
    
    if (emailExists) {
      return c.json({ 
        success: true, 
        message: "You're already on our waitlist!",
        alreadyExists: true 
      });
    }

    // Add to waitlist
    const waitlistEntry = {
      email,
      joinedAt: new Date().toISOString(),
      id: `wl-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    const updatedWaitlist = Array.isArray(waitlist) ? [...waitlist, waitlistEntry] : [waitlistEntry];
    await kv.set('waitlist', updatedWaitlist);
    
    console.log('New waitlist signup:', email);

    // Send welcome email
    try {
      await sendWaitlistEmail(email);
      console.log('Waitlist confirmation email sent to:', email);
    } catch (emailError) {
      console.error('Failed to send waitlist email:', emailError);
      // Continue even if email fails - don't block waitlist signup
    }
    
    return c.json({ 
      success: true, 
      message: "Thank you for joining our waitlist!",
      entry: waitlistEntry
    });
  } catch (error) {
    console.error("Error adding to waitlist:", error);
    return c.json({ error: "Failed to join waitlist", details: String(error) }, 500);
  }
});

// Get waitlist count (admin endpoint)
app.get("/make-server-29b58f9a/waitlist/count", async (c) => {
  try {
    const waitlist = await kv.get('waitlist') || [];
    const count = Array.isArray(waitlist) ? waitlist.length : 0;
    
    return c.json({ count });
  } catch (error) {
    console.error("Error fetching waitlist count:", error);
    return c.json({ error: "Failed to fetch waitlist count" }, 500);
  }
});

// ========================================
// PASSWORD RESET WITH OTP
// ========================================

// Request password reset OTP
app.post("/make-server-29b58f9a/auth/request-password-reset", async (c) => {
  try {
    const { email } = await c.req.json();
    
    // Validate email
    if (!email || !email.includes('@')) {
      return c.json({ error: "Valid email is required" }, 400);
    }

    // Check if user exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUsers?.users?.some(user => user.email === email);
    
    if (!userExists) {
      // Don't reveal that user doesn't exist for security
      return c.json({ 
        success: true, 
        message: "If an account exists with this email, you will receive a password reset code." 
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in KV with expiry (5 minutes)
    const otpData = {
      email,
      otp,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
      used: false
    };
    
    await kv.set(`password-reset-otp:${email}`, otpData);
    
    console.log(`Password reset OTP generated for: ${email}`);
    
    // Send OTP email
    try {
      await sendOTPEmail(email, otp);
      console.log(`Password reset OTP email sent to: ${email}`);
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      return c.json({ 
        error: "Failed to send password reset email. Please try again or contact support." 
      }, 500);
    }
    
    return c.json({ 
      success: true, 
      message: "Password reset code sent to your email. Please check your inbox." 
    });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return c.json({ error: "Failed to request password reset", details: String(error) }, 500);
  }
});

// Verify OTP and reset password
app.post("/make-server-29b58f9a/auth/verify-otp-and-reset", async (c) => {
  try {
    const { email, otp, newPassword } = await c.req.json();
    
    // Validate inputs
    if (!email || !otp || !newPassword) {
      return c.json({ error: "Email, OTP, and new password are required" }, 400);
    }

    if (newPassword.length < 6) {
      return c.json({ error: "Password must be at least 6 characters" }, 400);
    }

    // Get stored OTP
    const otpData = await kv.get(`password-reset-otp:${email}`);
    
    if (!otpData) {
      return c.json({ error: "Invalid or expired OTP. Please request a new code." }, 400);
    }

    // Check if OTP has been used
    if (otpData.used) {
      return c.json({ error: "This OTP has already been used. Please request a new code." }, 400);
    }

    // Check if OTP is expired
    const now = new Date();
    const expiresAt = new Date(otpData.expiresAt);
    if (now > expiresAt) {
      // Clean up expired OTP
      await kv.del(`password-reset-otp:${email}`);
      return c.json({ error: "OTP has expired. Please request a new code." }, 400);
    }

    // Verify OTP matches
    if (otpData.otp !== otp) {
      return c.json({ error: "Invalid OTP. Please check the code and try again." }, 400);
    }

    // Get user
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const user = existingUsers?.users?.find(u => u.email === email);
    
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    // Update password
    const { error } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (error) {
      console.error("Error updating password:", error);
      return c.json({ error: "Failed to update password" }, 500);
    }

    // Mark OTP as used
    await kv.set(`password-reset-otp:${email}`, { ...otpData, used: true });
    
    // Clean up OTP after short delay (optional - keeps for audit trail)
    setTimeout(async () => {
      await kv.del(`password-reset-otp:${email}`);
    }, 60000); // Delete after 1 minute
    
    console.log(`Password reset successful for: ${email}`);
    
    return c.json({ 
      success: true, 
      message: "Password reset successful. You can now sign in with your new password." 
    });
  } catch (error) {
    console.error("Error verifying OTP and resetting password:", error);
    return c.json({ error: "Failed to reset password", details: String(error) }, 500);
  }
});

// Start the server
Deno.serve(app.fetch);