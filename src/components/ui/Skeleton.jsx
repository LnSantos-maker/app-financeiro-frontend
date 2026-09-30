import React from 'react';

export const Skeleton = ({ className = '', style }) => {
  return (
    <div 
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md ${className}`}
      style={style}
    ></div>
  );
};

export const DashboardSkeleton = () => (
  <div className="w-full h-screen p-6 space-y-6">
    {/* Header Skeleton */}
    <div className="flex justify-between items-center w-full">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
    
    {/* Stats row Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
    
    {/* Main content Skeleton */}
    <Skeleton className="h-96 w-full" />
  </div>
);
