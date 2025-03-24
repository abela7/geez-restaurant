
import { Ingredient, InventoryTransaction } from "./types";
import { useLanguage } from "@/contexts/LanguageContext";

// Helper to format dates
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
};

// Export inventory to CSV
export const exportInventoryToCSV = (inventory: Ingredient[], filename: string = 'inventory-export.csv'): void => {
  const { t } = useLanguage();
  
  // Define CSV headers
  const headers = [
    'Name',
    'Category',
    'Stock Quantity',
    'Unit',
    'Reorder Level',
    'Cost (£)',
    'Supplier',
    'Type',
    'Origin',
    'Allergens',
    'Dietary Info',
    'Last Updated'
  ];
  
  // Map data to CSV rows
  const rows = inventory.map(item => [
    item.name,
    item.category || '',
    item.stock_quantity?.toString() || '0',
    item.unit,
    item.reorder_level?.toString() || '0',
    item.cost?.toString() || '0',
    item.supplier || '',
    item.type || '',
    item.origin || '',
    (item.allergens || []).join(', '),
    (item.dietary || []).join(', '),
    formatDate(item.updated_at)
  ]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export inventory transactions to CSV
export const exportTransactionsToCSV = (transactions: InventoryTransaction[], filename: string = 'inventory-transactions.csv'): void => {
  // Define CSV headers
  const headers = [
    'Date',
    'Ingredient',
    'Transaction Type',
    'Quantity',
    'Previous Quantity',
    'New Quantity',
    'Unit',
    'Created By',
    'Notes'
  ];
  
  // Map data to CSV rows
  const rows = transactions.map(tx => [
    formatDate(tx.created_at),
    tx.ingredient?.name || tx.ingredient_id,
    tx.transaction_type,
    tx.quantity.toString(),
    tx.previous_quantity.toString(),
    tx.new_quantity.toString(),
    tx.unit,
    tx.created_by || '',
    tx.notes || ''
  ]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');
  
  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export analytics data to CSV
export const exportAnalyticsToCSV = (analytics: any, filename: string = 'inventory-analytics.csv'): void => {
  if (!analytics) return;
  
  // Create sections for different analytics data
  const sections = [];
  
  // Stock Status Section
  if (analytics.stockStatus) {
    sections.push(['Stock Status Summary']);
    sections.push(['Status', 'Count']);
    sections.push(['Normal', analytics.stockStatus.normal || 0]);
    sections.push(['Low Stock', analytics.stockStatus.low || 0]);
    sections.push(['Out of Stock', analytics.stockStatus.outOfStock || 0]);
    sections.push([]);  // Empty row as separator
  }
  
  // Category Counts Section
  if (analytics.categoryCounts) {
    sections.push(['Items by Category']);
    sections.push(['Category', 'Count']);
    Object.entries(analytics.categoryCounts).forEach(([category, count]) => {
      sections.push([category, count]);
    });
    sections.push([]);  // Empty row as separator
  }
  
  // Transaction Types Section
  if (analytics.transactionTypes) {
    sections.push(['Transaction Summary']);
    sections.push(['Type', 'Count']);
    Object.entries(analytics.transactionTypes).forEach(([type, count]) => {
      sections.push([type, count]);
    });
    sections.push([]);  // Empty row as separator
  }
  
  // Create CSV content
  const csvContent = sections.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  
  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
