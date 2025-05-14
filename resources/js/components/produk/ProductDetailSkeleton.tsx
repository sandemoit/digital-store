import React from 'react';

export default function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-md shadow-md p-6 flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <div className="bg-gray-200 h-64 rounded-md"></div>
        </div>
        <div className="md:w-2/3">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="flex gap-2 mt-4">
            <div className="h-10 bg-gray-200 rounded w-20"></div>
            <div className="h-10 bg-gray-200 rounded w-20"></div>
            <div className="h-10 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
