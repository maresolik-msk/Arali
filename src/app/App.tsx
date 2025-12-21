import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate, useRouteError, Outlet } from 'react-router-dom';
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
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'sonner';

// Error Boundary Component
function ErrorBoundary() {
  const error = useRouteError();
  console.error('Route error:', error);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F9FC] via-[#EBF4FA] to-[#F5F9FC]">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white/80 backdrop-blur-xl border border-[#0F4C81]/20 rounded-2xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <h2 className="text-[#0F4C81] mb-2">Oops! Something went wrong</h2>
          <p className="text-muted-foreground mb-6">
            We encountered an error while loading this page.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-[#0F4C81] text-white rounded-full hover:bg-[#0F4C81]/90 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute() {
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

  return <Outlet />;
}

// Root component to provide context
function Root() {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster />
    </AuthProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "how-it-works",
            element: <HowItWorks />,
          },
          {
            path: "features",
            element: <Features />,
          },
          {
            path: "why-arali",
            element: <WhyArali />,
          },
          {
            path: "story",
            element: <Story />,
          },
          {
            path: "faq",
            element: <FAQ />,
          },
          {
            path: "get-started",
            element: <GetStarted />,
          },
        ],
      },
      {
        path: "/dashboard",
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                index: true,
                element: <Dashboard />,
              },
              {
                path: "inventory",
                element: <Inventory />,
              },
              {
                path: "orders",
                element: <Orders />,
              },
              {
                path: "customers",
                element: <Customers />,
              },
              {
                path: "vendors",
                element: <Vendors />,
              },
              {
                path: "analytics",
                element: <Analytics />,
              },
              {
                path: "settings",
                element: <DashboardSettings />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}