
import { ExpenseWithCategory, ExpenseCategory } from "./types";
import { format, parseISO } from "date-fns";

/**
 * Formats expense data for export to CSV
 */
export const formatExpensesForExport = (expenses: ExpenseWithCategory[]): string => {
  if (!expenses.length) return "";
  
  // Define headers
  const headers = [
    "Date", 
    "Category", 
    "Amount (£)", 
    "Payee", 
    "Payment Method", 
    "Reference", 
    "Inventory Item",
    "Quantity",
    "Unit",
    "Description"
  ];
  
  // Format data
  const rows = expenses.map(expense => [
    format(parseISO(expense.date), "yyyy-MM-dd"),
    expense.category?.name || "Uncategorized",
    parseFloat(expense.amount.toString()).toFixed(2),
    expense.payee,
    expense.payment_method,
    expense.reference || "",
    expense.ingredient_id ? "Yes" : "No",
    expense.quantity || "",
    expense.unit || "",
    expense.description || ""
  ]);
  
  // Combine headers and rows
  return [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
};

/**
 * Formats expense categories for export to CSV
 */
export const formatCategoriesForExport = (categories: ExpenseCategory[]): string => {
  if (!categories.length) return "";
  
  // Define headers
  const headers = ["Name", "Type", "Description"];
  
  // Format data
  const rows = categories.map(category => [
    category.name,
    category.type.charAt(0).toUpperCase() + category.type.slice(1),
    category.description || ""
  ]);
  
  // Combine headers and rows
  return [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
};

/**
 * Exports data to CSV file
 */
export const exportToCSV = (data: string, filename: string): void => {
  const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
