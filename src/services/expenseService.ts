
import { supabase } from "@/integrations/supabase/client";

export type ExpenseCategory = {
  id: string;
  name: string;
  description: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type Expense = {
  id: string;
  category_id: string;
  amount: number;
  payee: string;
  payment_method: string;
  reference: string | null;
  description: string | null;
  date: string;
  created_at: string | null;
  updated_at: string | null;
  category?: ExpenseCategory;
};

export type ExpenseWithCategory = Expense & {
  category: ExpenseCategory;
};

export const fetchExpenseCategories = async (): Promise<ExpenseCategory[]> => {
  const { data, error } = await supabase
    .from("expense_categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching expense categories:", error);
    throw new Error(error.message);
  }

  return data;
};

export const fetchExpenses = async (
  searchTerm = "",
  categoryFilter = "All",
  dateFilter = "All"
): Promise<ExpenseWithCategory[]> => {
  let query = supabase
    .from("expenses")
    .select(`*, category:expense_categories(*)`)
    .order("date", { ascending: false });

  // Apply search filter
  if (searchTerm) {
    query = query.or(
      `payee.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,reference.ilike.%${searchTerm}%`
    );
  }

  // Apply category filter
  if (categoryFilter !== "All") {
    query = query.eq("category_id", categoryFilter);
  }

  // Apply date filter
  const now = new Date();
  if (dateFilter === "Today") {
    const today = new Date().toISOString().split("T")[0];
    query = query.gte("date", `${today}T00:00:00Z`).lt("date", `${today}T23:59:59Z`);
  } else if (dateFilter === "This Week") {
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    query = query.gte("date", oneWeekAgo);
  } else if (dateFilter === "This Month") {
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    query = query.gte("date", firstDayOfMonth);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching expenses:", error);
    throw new Error(error.message);
  }

  return data as ExpenseWithCategory[];
};

export const addExpense = async (expense: Omit<Expense, "id" | "created_at" | "updated_at">): Promise<Expense> => {
  const { data, error } = await supabase
    .from("expenses")
    .insert(expense)
    .select()
    .single();

  if (error) {
    console.error("Error adding expense:", error);
    throw new Error(error.message);
  }

  return data;
};

export const deleteExpense = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting expense:", error);
    throw new Error(error.message);
  }
};

export const addExpenseCategory = async (
  category: Omit<ExpenseCategory, "id" | "created_at" | "updated_at">
): Promise<ExpenseCategory> => {
  const { data, error } = await supabase
    .from("expense_categories")
    .insert(category)
    .select()
    .single();

  if (error) {
    console.error("Error adding expense category:", error);
    throw new Error(error.message);
  }

  return data;
};

export const updateExpenseCategory = async (
  id: string,
  updates: Partial<Omit<ExpenseCategory, "id" | "created_at" | "updated_at">>
): Promise<ExpenseCategory> => {
  const { data, error } = await supabase
    .from("expense_categories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating expense category:", error);
    throw new Error(error.message);
  }

  return data;
};

export const deleteExpenseCategory = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("expense_categories")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting expense category:", error);
    throw new Error(error.message);
  }
};

export const getExpensesGroupedByCategory = async (timePeriod = "year"): Promise<any[]> => {
  // Get date range based on selected time period
  const now = new Date();
  let startDate = new Date();
  
  if (timePeriod === 'month') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (timePeriod === 'quarter') {
    const quarter = Math.floor(now.getMonth() / 3);
    startDate = new Date(now.getFullYear(), quarter * 3, 1);
  } else if (timePeriod === 'year') {
    startDate = new Date(now.getFullYear(), 0, 1);
  }
  
  const { data, error } = await supabase
    .from("expenses")
    .select(`
      amount,
      category:expense_categories(id, name)
    `)
    .gte("date", startDate.toISOString());

  if (error) {
    console.error("Error fetching expenses by category:", error);
    throw new Error(error.message);
  }

  // Group expenses by category
  const groupedExpenses = data.reduce((acc: Record<string, number>, expense) => {
    const categoryName = expense.category?.name || "Uncategorized";
    if (!acc[categoryName]) {
      acc[categoryName] = 0;
    }
    acc[categoryName] += parseFloat(expense.amount);
    return acc;
  }, {});

  // Format data for chart
  return Object.entries(groupedExpenses).map(([name, value]) => ({
    name,
    value,
  }));
};

export const getExpensesByMonth = async (): Promise<any[]> => {
  // Get data for the past 8 months
  const now = new Date();
  const eightMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 7, 1);
  
  const { data, error } = await supabase
    .from("expenses")
    .select(`
      amount,
      date,
      category:expense_categories(id, name)
    `)
    .gte("date", eightMonthsAgo.toISOString())
    .order("date");

  if (error) {
    console.error("Error fetching monthly expenses:", error);
    throw new Error(error.message);
  }

  // Group expenses by month and category type
  const months: Record<string, any> = {};
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  data.forEach(expense => {
    const date = new Date(expense.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    const monthName = monthNames[date.getMonth()];
    
    if (!months[monthKey]) {
      months[monthKey] = {
        name: monthName,
        fixed: 0,
        variable: 0,
        operational: 0,
        total: 0,
      };
    }
    
    const categoryName = expense.category?.name || "";
    const amount = parseFloat(expense.amount);
    
    // Categorize expenses (simplified for demo)
    if (categoryName === "Rent" || categoryName === "Licenses") {
      months[monthKey].fixed += amount;
    } else if (categoryName === "Ingredients" || categoryName === "Transport") {
      months[monthKey].variable += amount;
    } else {
      months[monthKey].operational += amount;
    }
    
    months[monthKey].total += amount;
  });

  // Convert to array sorted by date
  return Object.entries(months)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([_, monthData]) => monthData);
};

export const getProfitMarginData = async (): Promise<any[]> => {
  // For a complete implementation, we would need revenue data
  // For demo, we'll use expense data and generate revenue with multiplier
  
  // Get data for the past 8 months
  const now = new Date();
  const eightMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 7, 1);
  
  const { data, error } = await supabase
    .from("expenses")
    .select(`amount, date`)
    .gte("date", eightMonthsAgo.toISOString());

  if (error) {
    console.error("Error fetching expense data for profit calculation:", error);
    throw new Error(error.message);
  }

  // Group expenses by month
  const monthlyExpenses: Record<string, number> = {};
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  data.forEach(expense => {
    const date = new Date(expense.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    
    if (!monthlyExpenses[monthKey]) {
      monthlyExpenses[monthKey] = 0;
    }
    
    monthlyExpenses[monthKey] += parseFloat(expense.amount);
  });

  // Generate profit data with simulated revenue
  const profitData = Object.entries(monthlyExpenses)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, expenses]) => {
      const [year, month] = key.split('-').map(Number);
      
      // Simulate revenue (for demo purposes)
      const variability = 0.1 * (Math.random() - 0.5); // -5% to +5%
      const revenueMultiplier = 2.5 + variability;
      const revenue = Math.round(expenses * revenueMultiplier);
      
      const profit = revenue - expenses;
      const margin = Math.round((profit / revenue) * 100 * 10) / 10;
      
      return {
        name: monthNames[month],
        revenue,
        expenses,
        profit,
        margin,
      };
    });

  return profitData;
};
