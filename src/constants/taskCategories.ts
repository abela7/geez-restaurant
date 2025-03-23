
export type TaskCategory = {
  id: string;
  name: string;
  color: string;
};

export const taskCategories = [
  {
    id: "general",
    name: "General",
    color: "bg-gray-500"
  },
  {
    id: "food_prep",
    name: "Food Preparation",
    color: "bg-yellow-500"
  },
  {
    id: "cleaning",
    name: "Cleaning",
    color: "bg-green-500"
  },
  {
    id: "inventory",
    name: "Inventory",
    color: "bg-blue-500"
  },
  {
    id: "service",
    name: "Customer Service",
    color: "bg-purple-500"
  },
  {
    id: "maintenance",
    name: "Maintenance",
    color: "bg-red-500"
  },
  {
    id: "admin",
    name: "Administration",
    color: "bg-indigo-500"
  },
  {
    id: "training",
    name: "Training",
    color: "bg-pink-500"
  }
];

// Helper functions to get category properties by ID
export const getCategoryName = (categoryId: string): string => {
  const category = taskCategories.find(cat => cat.id === categoryId);
  return category ? category.name : "Uncategorized";
};

export const getCategoryColor = (categoryId: string): string => {
  const category = taskCategories.find(cat => cat.id === categoryId);
  return category ? category.color : "bg-gray-500";
};
