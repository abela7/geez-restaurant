
// This file is now deprecated and has been split into smaller modules.
// Please import from '@/services/finance' instead.
// This file will be removed in a future update.

import { 
  ExpenseCategory,
  Expense,
  ExpenseWithCategory,
  fetchExpenseCategories,
  fetchExpenses,
  addExpense,
  deleteExpense,
  addExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory,
  getExpensesGroupedByCategory,
  getExpensesByMonth,
  getProfitMarginData
} from './finance';

// Re-export everything from the new modules
export type { ExpenseCategory, Expense, ExpenseWithCategory };
export { 
  fetchExpenseCategories,
  fetchExpenses,
  addExpense,
  deleteExpense,
  addExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory,
  getExpensesGroupedByCategory,
  getExpensesByMonth,
  getProfitMarginData
};
