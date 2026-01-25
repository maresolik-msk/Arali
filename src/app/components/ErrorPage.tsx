import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

export function ErrorPage() {
  const error = useRouteError();
  
  let errorMessage: string;
  let errorTitle: string = "Oops! Something went wrong";
  
  if (isRouteErrorResponse(error)) {
    // 404 or other router errors
    errorTitle = `${error.status} ${error.statusText}`;
    errorMessage = error.data?.message || error.data || "The page you're looking for doesn't exist.";
  } else if (error instanceof Error) {
    // Standard JS errors
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'An unknown error occurred';
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{errorTitle}</h1>
        <p className="text-gray-600 mb-8 break-words">{errorMessage}</p>
        
        <div className="flex justify-center gap-4">
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
          <Button onClick={() => window.location.reload()} className="gap-2 bg-[#0F4C81] hover:bg-[#0F4C81]/90">
            <RefreshCw className="w-4 h-4" />
            Reload
          </Button>
        </div>
      </div>
    </div>
  );
}