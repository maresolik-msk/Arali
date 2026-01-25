import React from 'react';
import { Link } from 'react-router';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <FileQuestion className="w-12 h-12 text-[#0F4C81]" />
      </div>
      <h1 className="text-3xl font-bold text-[#0F4C81] mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/dashboard">
        <Button className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}