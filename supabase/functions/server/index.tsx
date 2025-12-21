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

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  
  if (error || !user) {
    return { user: null, error: "Invalid or expired token" };
  }

  return { user, error: null };
}