
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
];

export const getCategoryName = (id?: string | null): string => {
  if (!id) return "";
  const category = taskCategories.find(category => category.id === id);
  return category ? category.name : "";
};

export const getCategoryColor = (id?: string | null): string => {
  if (!id) return "bg-gray-500";
  const category = taskCategories.find(category => category.id === id);
  return category ? category.color : "bg-gray-500";
};
