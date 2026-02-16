import React, { useMemo, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
// Only truly critical infrastructure is eagerly imported.
// Everything else is lazy-loaded to keep App.tsx's module graph small
// and prevent Vite HMR timeouts through the Figma Make proxy.
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'sonner';
import { ErrorPage } from './components/ErrorPage';

// --- Lazy-loaded layout components ---
const Layout = React.lazy(() => import('./components/layout/Layout').then(m => ({ default: m.Layout })));
const DashboardLayout = React.lazy(() => import('./components/layout/DashboardLayout').then(m => ({ default: m.DashboardLayout })));
const FeatureGuard = React.lazy(() => import('./components/FeatureGuard').then(m => ({ default: m.FeatureGuard })));
const PWAInstallPrompt = React.lazy(() => import('./components/PWAInstallPrompt').then(m => ({ default: m.PWAInstallPrompt })));
const OfflineIndicator = React.lazy(() => import('./components/OfflineIndicator').then(m => ({ default: m.OfflineIndicator })));

// --- Lazy-loaded page components ---
// Using .then(m => ({ default: m.X })) because pages use named exports
const Home = React.lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const HowItWorks = React.lazy(() => import('./pages/HowItWorks').then(m => ({ default: m.HowItWorks })));
const Features = React.lazy(() => import('./pages/Features').then(m => ({ default: m.Features })));
const WhyArali = React.lazy(() => import('./pages/WhyArali').then(m => ({ default: m.WhyArali })));
const Story = React.lazy(() => import('./pages/Story').then(m => ({ default: m.Story })));
const FAQ = React.lazy(() => import('./pages/FAQ').then(m => ({ default: m.FAQ })));
const GetStarted = React.lazy(() => import('./pages/GetStarted').then(m => ({ default: m.GetStarted })));
const PricingPage = React.lazy(() => import('./pages/PricingPage').then(m => ({ default: m.PricingPage })));
const Login = React.lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const SelectPlan = React.lazy(() => import('./pages/SelectPlan').then(m => ({ default: m.SelectPlan })));
const Dashboard = React.lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Inventory = React.lazy(() => import('./pages/Inventory').then(m => ({ default: m.Inventory })));
const POS = React.lazy(() => import('./pages/POS').then(m => ({ default: m.POS })));
const Orders = React.lazy(() => import('./pages/Orders').then(m => ({ default: m.Orders })));
const Customers = React.lazy(() => import('./pages/Customers').then(m => ({ default: m.Customers })));
const Vendors = React.lazy(() => import('./pages/Vendors').then(m => ({ default: m.Vendors })));
const Analytics = React.lazy(() => import('./pages/Analytics').then(m => ({ default: m.Analytics })));
const RevenueDetailed = React.lazy(() => import('./pages/RevenueDetailed').then(m => ({ default: m.RevenueDetailed })));
const DashboardSettings = React.lazy(() => import('./pages/DashboardSettings').then(m => ({ default: m.DashboardSettings })));
const AIInsights = React.lazy(() => import('./pages/AIInsights').then(m => ({ default: m.AIInsights })));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const SmartSalesNotepad = React.lazy(() => import('./pages/SmartSalesNotepad').then(m => ({ default: m.SmartSalesNotepad })));
const SmartPurchaseNotepad = React.lazy(() => import('./pages/SmartPurchaseNotepad').then(m => ({ default: m.SmartPurchaseNotepad })));
const NotFound = React.lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));
const BlogList = React.lazy(() => import('./pages/BlogList').then(m => ({ default: m.BlogList })));
const BlogPost = React.lazy(() => import('./pages/BlogPost').then(m => ({ default: m.BlogPost })));

// --- Page loading fallback ---
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-[#0F4C81]/20 border-t-[#0F4C81] rounded-full animate-spin" />
    </div>
  );
}

// Suspense wrapper shorthand for route elements
function S({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

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
    // During hot reload or transient errors, show loading instead of
    // aggressively redirecting to login (which caused redirect loops
    // when errors were transient).
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#0F4C81]/20 border-t-[#0F4C81] rounded-full animate-spin" />
      </div>
    );
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

    return <S><Login /></S>;
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

// Create router configuration — defined as a function to be called once
// via useMemo inside the App component. This prevents HMR from recreating
// the router at module scope and causing dynamic import errors.
function createAppRouter() {
  return createBrowserRouter([
    {
      path: "/login",
      element: <LoginRoute />,
      errorElement: <ErrorPage />
    },
    {
      path: "/select-plan",
      element: (
        <ProtectedRoute requirePlan={false}>
          <S><SelectPlan /></S>
        </ProtectedRoute>
      ),
      errorElement: <ErrorPage />
    },
    {
      path: "/",
      element: <S><Layout /></S>,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <S><Home /></S> },
        { path: "how-it-works", element: <S><HowItWorks /></S> },
        { path: "features", element: <S><Features /></S> },
        { path: "pricing", element: <S><PricingPage /></S> },
        { path: "why-arali", element: <S><WhyArali /></S> },
        { path: "story", element: <S><Story /></S> },
        { path: "faq", element: <S><FAQ /></S> },
        { path: "get-started", element: <S><GetStarted /></S> },
        { path: "blog", element: <S><BlogList /></S> },
        { path: "blog/:slug", element: <S><BlogPost /></S> },
        { path: "*", element: <S><NotFound /></S> }
      ]
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <S><DashboardLayout /></S>
        </ProtectedRoute>
      ),
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <S><Dashboard /></S> },
        { path: "pos", element: <S><POS /></S> },
        { path: "inventory", element: <S><Inventory /></S> },
        { path: "inventory/:productId", element: <S><ProductDetail /></S> },
        { path: "notepad", element: <S><SmartSalesNotepad /></S> },
        { path: "express", element: <S><SmartSalesNotepad /></S> },
        { path: "purchase-notepad", element: <S><SmartPurchaseNotepad /></S> },
        { path: "orders", element: <S><Orders /></S> },
        { path: "customers", element: <S><Customers /></S> },
        { path: "vendors", element: <S><Vendors /></S> },
        { 
          path: "analytics", 
          element: (
            <S><FeatureGuard 
              feature="canViewReports" 
              title="Analytics Locked" 
              description="Gain deep insights into your business performance with advanced analytics."
            >
              <S><Analytics /></S>
            </FeatureGuard></S>
          ) 
        },
        { path: "revenue", element: <S><RevenueDetailed /></S> },
        { 
          path: "insights", 
          element: (
            <S><FeatureGuard 
              feature="canForecast" 
              title="AI Insights Locked" 
              description="Predict trends and optimize inventory with AI-powered forecasting."
            >
              <S><AIInsights /></S>
            </FeatureGuard></S>
          ) 
        },
        { path: "settings", element: <S><DashboardSettings /></S> },
        { path: "*", element: <S><NotFound /></S> }
      ]
    },
    {
      path: "*",
      element: <S><NotFound /></S>
    }
  ]);
}

export default function App() {
  // useMemo ensures the router is created once and stable across re-renders.
  // Moving creation here (instead of module scope) prevents HMR from
  // recreating the router instance and causing dynamic import errors.
  const router = useMemo(() => createAppRouter(), []);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
      <S><PWAInstallPrompt /></S>
      <S><OfflineIndicator /></S>
    </AuthProvider>
  );
}