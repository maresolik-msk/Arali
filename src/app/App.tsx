import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router';
import { Layout } from './components/layout/Layout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Home } from './pages/Home';
import { HowItWorks } from './pages/HowItWorks';
import { Features } from './pages/Features';
import { WhyArali } from './pages/WhyArali';
import { Story } from './pages/Story';
import { FAQ } from './pages/FAQ';
import { GetStarted } from './pages/GetStarted';
import { PricingPage } from './pages/PricingPage';
import { Login } from './pages/Login';
import { SelectPlan } from './pages/SelectPlan';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { POS } from './pages/POS';
import { Orders } from './pages/Orders';
import { Customers } from './pages/Customers';
import { Vendors } from './pages/Vendors';
import { Analytics } from './pages/Analytics';
import { DashboardSettings } from './pages/DashboardSettings';
import { AIInsights } from './pages/AIInsights';
import { ProductDetail } from './pages/ProductDetail';
import { SmartSalesNotepad } from './pages/SmartSalesNotepad';
import { SmartPurchaseNotepad } from './pages/SmartPurchaseNotepad';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'sonner';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ErrorPage } from './components/ErrorPage';
import { NotFound } from './pages/NotFound';
import { BlogList } from './pages/BlogList';
import { BlogPost } from './pages/BlogPost';
import { FeatureGuard } from './components/FeatureGuard';

// Arali - Premium Retail Management PWA v3.0
// Progressive Web App with offline support, installable on iOS/Android/Desktop
// Built with Digital Craftsmanship | MARESOLIK INC
// Last updated: January 11, 2026

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePlan?: boolean;
}

function ProtectedRoute({ children, requirePlan = true }: ProtectedRouteProps) {
  // Add error boundary for hot reload issues
  try {
    const { isAuthenticated, isLoading, user } = useAuth();

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

    // Force plan selection if not yet done
    if (requirePlan && !user?.hasSelectedPlan) {
      return <Navigate to="/select-plan" replace />;
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
    element: <LoginRoute />,
    errorElement: <ErrorPage />
  },
  {
    path: "/select-plan",
    element: (
      <ProtectedRoute requirePlan={false}>
        <SelectPlan />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />
  },
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "how-it-works", element: <HowItWorks /> },
      { path: "features", element: <Features /> },
      { path: "pricing", element: <PricingPage /> },
      { path: "why-arali", element: <WhyArali /> },
      { path: "story", element: <Story /> },
      { path: "faq", element: <FAQ /> },
      { path: "get-started", element: <GetStarted /> },
      { path: "blog", element: <BlogList /> },
      { path: "blog/:slug", element: <BlogPost /> },
      { path: "*", element: <NotFound /> }
    ]
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "pos", element: <POS /> },
      { path: "inventory", element: <Inventory /> },
      { path: "inventory/:productId", element: <ProductDetail /> },
      { path: "notepad", element: <SmartSalesNotepad /> },
      { path: "purchase-notepad", element: <SmartPurchaseNotepad /> },
      { path: "orders", element: <Orders /> },
      { path: "customers", element: <Customers /> },
      { path: "vendors", element: <Vendors /> },
      { 
        path: "analytics", 
        element: (
          <FeatureGuard 
            feature="canViewReports" 
            title="Analytics Locked" 
            description="Gain deep insights into your business performance with advanced analytics."
          >
            <Analytics />
          </FeatureGuard>
        ) 
      },
      { 
        path: "insights", 
        element: (
          <FeatureGuard 
            feature="canForecast" 
            title="AI Insights Locked" 
            description="Predict trends and optimize inventory with AI-powered forecasting."
          >
            <AIInsights />
          </FeatureGuard>
        ) 
      },
      { path: "settings", element: <DashboardSettings /> },
      { path: "*", element: <NotFound /> }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
      <PWAInstallPrompt />
      <OfflineIndicator />
    </AuthProvider>
  );
}