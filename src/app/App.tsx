import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Home } from './pages/Home';
import { HowItWorks } from './pages/HowItWorks';
import { Features } from './pages/Features';
import { WhyArali } from './pages/WhyArali';
import { Story } from './pages/Story';
import { FAQ } from './pages/FAQ';
import { GetStarted } from './pages/GetStarted';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Orders } from './pages/Orders';
import { Customers } from './pages/Customers';
import { Analytics } from './pages/Analytics';
import { DashboardSettings } from './pages/DashboardSettings';

const router = createBrowserRouter([
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
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "settings",
        element: <DashboardSettings />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}