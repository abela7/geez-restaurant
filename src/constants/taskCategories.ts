
// Define the TaskCategory type
export type TaskCategory = {
  id: string;
  name: string;
  color: string;
};

// Define all task categories
export const taskCategories: TaskCategory[] = [
  {
    id: 'inventory',
    name: 'Inventory',
    color: 'text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
  },
  {
    id: 'training',
    name: 'Training',
    color: 'text-purple-600 border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800'
  },
  {
    id: 'menu',
    name: 'Menu',
    color: 'text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    color: 'text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    color: 'text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
  },
  {
    id: 'admin',
    name: 'Admin',
    color: 'text-gray-600 border-gray-200 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
  }
];

export const getCategoryName = (category: string) => {
  switch (category) {
    case 'inventory':
      return 'Inventory';
    case 'training':
      return 'Training';
    case 'menu':
      return 'Menu';
    case 'cleaning':
      return 'Cleaning';
    case 'maintenance':
      return 'Maintenance';
    case 'admin':
      return 'Admin';
    default:
      return category;
  }
};

export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'inventory':
      return 'text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
    case 'training':
      return 'text-purple-600 border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800';
    case 'menu':
      return 'text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
    case 'cleaning':
      return 'text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
    case 'maintenance':
      return 'text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
    case 'admin':
      return 'text-gray-600 border-gray-200 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
    default:
      return 'text-gray-600 border-gray-200 bg-gray-50 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
  }
};
