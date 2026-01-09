import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen" role="status" aria-label="Loading">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 absolute top-0 left-0"></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">Loading products...</p>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
