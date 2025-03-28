
// Define the TaskCategory type and export it
export type TaskCategory = {
  id: string;
  name: string;
  color: string;
};

export const taskCategories: TaskCategory[] = [
  { id: "1", name: "Kitchen", color: "bg-amber-500" },
  { id: "2", name: "Service", color: "bg-blue-500" },
  { id: "3", name: "Cleaning", color: "bg-green-500" },
  { id: "4", name: "Inventory", color: "bg-purple-500" },
  { id: "5", name: "Administration", color: "bg-slate-500" },
  { id: "6", name: "Training", color: "bg-rose-500" },
  { id: "7", name: "Maintenance", color: "bg-cyan-500" },
];

export const getCategoryName = (categoryId?: string | null) => {
  if (!categoryId) return "";
  const category = taskCategories.find(cat => cat.id === categoryId.toString());
  return category ? category.name : "";
};

export const getCategoryColor = (categoryId?: string | null) => {
  if (!categoryId) return "bg-gray-500";
  const category = taskCategories.find(cat => cat.id === categoryId.toString());
  return category ? category.color : "bg-gray-500";
};
