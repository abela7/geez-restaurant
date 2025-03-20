
import React from "react";

const StaffLoadingState: React.FC = () => {
  return (
    <div className="p-4">
      <div className="animate-pulse space-y-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-24 w-24"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
        
        <div className="space-y-2 mt-6">
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-4 w-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-4 w-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-4 w-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
        
        <div className="pt-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="flex flex-wrap">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 mr-2 mb-2"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 mr-2 mb-2"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20 mr-2 mb-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffLoadingState;
