
import { supabase } from "@/integrations/supabase/client";

/**
 * Gets expenses grouped by category for a specific time period
 */
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
    acc[categoryName] += parseFloat(String(expense.amount));
    return acc;
  }, {});

  // Format data for chart
  return Object.entries(groupedExpenses).map(([name, value]) => ({
    name,
    value,
  }));
};

/**
 * Gets expenses by month with breakdown by expense type
 */
export const getExpensesByMonth = async (): Promise<any[]> => {
  // Get data for the past 8 months
  const now = new Date();
  const eightMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 7, 1);
  
  const { data, error } = await supabase
    .from("expenses")
    .select(`
      amount,
      date,
      category:expense_categories(id, name, type)
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
    const amount = parseFloat(String(expense.amount));
    
    // Categorize expenses based on category type
    const categoryType = expense.category?.type || "operational";
    
    if (categoryType === "fixed") {
      months[monthKey].fixed += amount;
    } else if (categoryType === "variable") {
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

/**
 * Gets profit margin data by simulating revenue based on expenses
 */
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
    
    monthlyExpenses[monthKey] += parseFloat(String(expense.amount));
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
