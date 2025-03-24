
import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Layout from "@/components/Layout";

// Lazy load admin pages
const Dashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const Settings = lazy(() => import("@/pages/admin/Settings"));
const Reports = lazy(() => import("@/pages/admin/Reports"));
const StaffManagement = lazy(() => import("@/pages/admin/StaffManagement"));
const Customers = lazy(() => import("@/pages/admin/Customers"));
const InventoryControl = lazy(() => import("@/pages/admin/InventoryControl"));
const FinancialManagement = lazy(() => import("@/pages/admin/FinancialManagement"));
const FoodSafety = lazy(() => import("@/pages/admin/FoodSafety"));
const TaskManagement = lazy(() => import("@/pages/admin/TaskManagement"));
const ActivityLog = lazy(() => import("@/pages/admin/ActivityLog"));
const LanguageManagement = lazy(() => import("@/pages/admin/LanguageManagement"));
const MenuManagement = lazy(() => import("@/pages/admin/MenuManagement"));

// Menu Management Pages
const MenuCategories = lazy(() => import("@/pages/admin/menu/Categories"));
const FoodManagement = lazy(() => import("@/pages/admin/menu/FoodManagement"));
const Dishes = lazy(() => import("@/pages/admin/menu/Dishes"));
const DishProfile = lazy(() => import("@/pages/admin/menu/DishProfile"));
const CustomReports = lazy(() => import("@/pages/admin/reports/CustomReports"));
const CustomerInsights = lazy(() => import("@/pages/admin/reports/CustomerInsights"));
const InventoryReports = lazy(() => import("@/pages/admin/reports/InventoryReports"));
const DishCost = lazy(() => import("@/pages/admin/menu/DishCost"));
const Pricing = lazy(() => import("@/pages/admin/menu/Pricing"));
const Modifiers = lazy(() => import("@/pages/admin/menu/Modifiers"));
const MenuDesign = lazy(() => import("@/pages/admin/menu/MenuDesign"));

// Finance Pages
const DailySales = lazy(() => import("@/pages/admin/finance/DailySales"));
const FinancialReports = lazy(() => import("@/pages/admin/finance/FinancialReports"));
const PaymentManagement = lazy(() => import("@/pages/admin/finance/PaymentManagement"));
const Expenses = lazy(() => import("@/pages/admin/finance/Expenses"));
const Budgeting = lazy(() => import("@/pages/admin/finance/Budgeting"));

// Staff Management Pages
const Directory = lazy(() => import("@/pages/admin/staff/Directory"));
const Performance = lazy(() => import("@/pages/admin/staff/Performance"));
const Attendance = lazy(() => import("@/pages/admin/staff/Attendance"));
const Tasks = lazy(() => import("@/pages/admin/staff/Tasks"));
const Payroll = lazy(() => import("@/pages/admin/staff/Payroll"));

// Inventory Pages
const StockLevels = lazy(() => import("@/pages/admin/inventory/StockLevels"));
const Ingredients = lazy(() => import("@/pages/admin/inventory/Ingredients"));

// Food Safety Pages
const Checklists = lazy(() => import("@/pages/admin/food-safety/Checklists"));

// General Pages
const TableManagement = lazy(() => import("@/pages/admin/general/TableManagement"));

// Wrap components with Layout
const withLayout = (Component: React.ComponentType) => (
  <Layout interface="admin">
    <Component />
  </Layout>
);

// Define admin routes
export const adminRoutes = [
  // Dashboard
  {
    path: "/admin",
    element: withLayout(Dashboard),
  },
  
  // Main sections
  {
    path: "/admin/settings",
    element: withLayout(Settings),
  },
  {
    path: "/admin/reports",
    element: withLayout(Reports),
  },
  {
    path: "/admin/staff",
    element: withLayout(StaffManagement),
  },
  {
    path: "/admin/customers",
    element: withLayout(Customers),
  },
  {
    path: "/admin/inventory",
    element: withLayout(InventoryControl),
  },
  {
    path: "/admin/finance",
    element: withLayout(FinancialManagement),
  },
  {
    path: "/admin/food-safety",
    element: withLayout(FoodSafety),
  },
  {
    path: "/admin/tasks",
    element: withLayout(TaskManagement),
  },
  {
    path: "/admin/activity",
    element: withLayout(ActivityLog),
  },
  {
    path: "/admin/language",
    element: withLayout(LanguageManagement),
  },
  {
    path: "/admin/menu",
    element: withLayout(MenuManagement),
  },
  
  // Menu routes
  {
    path: "/admin/menu/categories",
    element: withLayout(MenuCategories),
  },
  {
    path: "/admin/menu/food",
    element: withLayout(FoodManagement),
  },
  {
    path: "/admin/menu/dishes",
    element: withLayout(Dishes),
  },
  {
    path: "/admin/menu/dishes/:id",
    element: withLayout(DishProfile),
  },
  {
    path: "/admin/dish-cost",
    element: withLayout(DishCost),
  },
  {
    path: "/admin/dish-cost/new",
    element: withLayout(DishCost),
  },
  {
    path: "/admin/dish-cost/:id",
    element: withLayout(DishCost),
  },
  {
    path: "/admin/menu/pricing",
    element: withLayout(Pricing),
  },
  {
    path: "/admin/menu/modifiers",
    element: withLayout(Modifiers),
  },
  {
    path: "/admin/menu/design",
    element: withLayout(MenuDesign),
  },
  
  // Report routes
  {
    path: "/admin/reports/custom",
    element: withLayout(CustomReports),
  },
  {
    path: "/admin/reports/customer-insights",
    element: withLayout(CustomerInsights),
  },
  {
    path: "/admin/reports/inventory",
    element: withLayout(InventoryReports),
  },
  
  // Finance routes
  {
    path: "/admin/finance/daily-sales",
    element: withLayout(DailySales),
  },
  {
    path: "/admin/finance/financial-reports",
    element: withLayout(FinancialReports),
  },
  {
    path: "/admin/finance/payment-management",
    element: withLayout(PaymentManagement),
  },
  {
    path: "/admin/finance/expenses",
    element: withLayout(Expenses),
  },
  {
    path: "/admin/finance/budgeting",
    element: withLayout(Budgeting),
  },
  
  // Staff routes
  {
    path: "/admin/staff/directory",
    element: withLayout(Directory),
  },
  {
    path: "/admin/staff/performance",
    element: withLayout(Performance),
  },
  {
    path: "/admin/staff/attendance",
    element: withLayout(Attendance),
  },
  {
    path: "/admin/staff/tasks",
    element: withLayout(Tasks),
  },
  {
    path: "/admin/staff/payroll",
    element: withLayout(Payroll),
  },
  
  // Inventory routes
  {
    path: "/admin/inventory/stock",
    element: withLayout(StockLevels),
  },
  {
    path: "/admin/inventory/ingredients",
    element: withLayout(Ingredients),
  },
  
  // Food Safety routes
  {
    path: "/admin/food-safety/checklists",
    element: withLayout(Checklists),
  },
  
  // General routes
  {
    path: "/admin/general/table-management",
    element: withLayout(TableManagement),
  },
];

// Default export for the AdminRoutes component
const AdminRoutes = () => {
  return (
    <Navigate to="/admin" />
  );
};

export default AdminRoutes;
