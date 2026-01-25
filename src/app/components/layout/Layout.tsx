import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Outlet, ScrollRestoration } from 'react-router';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F9FC] text-[#082032] font-sans antialiased selection:bg-[#0F4C81]/20">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
