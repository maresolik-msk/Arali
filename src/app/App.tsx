import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Home } from './pages/Home';
import { HowItWorks } from './pages/HowItWorks';
import { Features } from './pages/Features';
import { WhyArali } from './pages/WhyArali';
import { Story } from './pages/Story';
import { FAQ } from './pages/FAQ';
import { GetStarted } from './pages/GetStarted';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Orders } from './pages/Orders';
import { Customers } from './pages/Customers';
import { Vendors } from './pages/Vendors';
import { Analytics } from './pages/Analytics';
import { DashboardSettings } from './pages/DashboardSettings';
import { AIInsights } from './pages/AIInsights';
import { ProductDetail } from './pages/ProductDetail';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'sonner';

// Arali - Premium Retail Management App v2.3 - Fixed Router and Supabase Client
// Last updated: December 21, 2024

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Add error boundary for hot reload issues
  try {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-[#0F4C81]/20 border-t-[#0F4C81] rounded-full animate-spin" />
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
  } catch (error) {
    console.error('ProtectedRoute error:', error);
    // Fallback to login on any error
    return <Navigate to="/login" replace />;
  }
}

// Login Route Component - redirects to dashboard if already authenticated
function LoginRoute() {
  try {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-[#0F4C81]/20 border-t-[#0F4C81] rounded-full animate-spin" />
        </div>
      );
    }

    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }

    return <Login />;
  } catch (error) {
    console.error('LoginRoute error:', error);
    // During hot reload, the context might be temporarily unavailable
    // Show a loading state and reload will fix it
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F4C81]/5 via-white to-[#0F4C81]/5">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0F4C81]/20 border-t-[#0F4C81] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#0F4C81]/60">Loading authentication...</p>
        </div>
      </div>
    );
  }
}

// Define the router configuration
const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginRoute />
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "how-it-works", element: <HowItWorks /> },
      { path: "features", element: <Features /> },
      { path: "why-arali", element: <WhyArali /> },
      { path: "story", element: <Story /> },
      { path: "faq", element: <FAQ /> },
      { path: "get-started", element: <GetStarted /> },
    ]
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "inventory", element: <Inventory /> },
      { path: "inventory/:productId", element: <ProductDetail /> },
      { path: "orders", element: <Orders /> },
      { path: "customers", element: <Customers /> },
      { path: "vendors", element: <Vendors /> },
      { path: "analytics", element: <Analytics /> },
      { path: "ai-insights", element: <AIInsights /> },
      { path: "settings", element: <DashboardSettings /> },
    ]
  }
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}
