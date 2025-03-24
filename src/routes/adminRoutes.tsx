
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";

// Import admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import FinancialManagement from "@/pages/admin/FinancialManagement";
import MenuManagement from "@/pages/admin/MenuManagement";
import StaffManagement from "@/pages/admin/StaffManagement";
import InventoryControl from "@/pages/admin/InventoryControl";
import FoodSafety from "@/pages/admin/FoodSafety";
import Reports from "@/pages/admin/Reports";
import Settings from "@/pages/admin/Settings";
import Customers from "@/pages/admin/Customers";
import ActivityLog from "@/pages/admin/ActivityLog";
import TaskManagement from "@/pages/admin/TaskManagement";
import Communication from "@/pages/admin/Communication";
import LanguageManagement from "@/pages/admin/LanguageManagement";
import NotFound from "@/pages/NotFound";
import TableManagement from "@/pages/admin/general/TableManagement";

// Import finance pages
import DailySales from "@/pages/admin/finance/DailySales";
import FinancialReports from "@/pages/admin/finance/FinancialReports";
import PaymentManagement from "@/pages/admin/finance/PaymentManagement";
import Budgeting from "@/pages/admin/finance/Budgeting";
import Expenses from "@/pages/admin/finance/Expenses";

// Import menu pages
import FoodManagement from "@/pages/admin/menu/FoodManagement";
import Categories from "@/pages/admin/menu/Categories";
import Modifiers from "@/pages/admin/menu/Modifiers";
import Pricing from "@/pages/admin/menu/Pricing";
import MenuDesign from "@/pages/admin/menu/MenuDesign";
import RecipeManagement from "@/pages/admin/menu/RecipeManagement";
import Dishes from "@/pages/admin/menu/Dishes";

// Import staff pages
import Directory from "@/pages/admin/staff/Directory";
import Performance from "@/pages/admin/staff/Performance";
import Attendance from "@/pages/admin/staff/Attendance";
import Tasks from "@/pages/admin/staff/Tasks";
import Payroll from "@/pages/admin/staff/Payroll";
import NewStaff from "@/pages/admin/staff/NewStaff";
import EditStaff from "@/pages/admin/staff/EditStaff";
import StaffProfile from "@/pages/admin/staff/StaffProfile";

// Import customer pages
import Feedback from "@/pages/admin/customers/Feedback";
import CustomerDatabase from "@/pages/admin/customers/CustomerDatabase";
import Promotions from "@/pages/admin/customers/Promotions";
import LoyaltyProgram from "@/pages/admin/customers/LoyaltyProgram";

// Import inventory pages
import StockLevels from "@/pages/admin/inventory/StockLevels";
import Ingredients from "@/pages/admin/inventory/Ingredients";
import Recipes from "@/pages/admin/inventory/Recipes";
import Suppliers from "@/pages/admin/inventory/Suppliers";
import PurchaseOrders from "@/pages/admin/inventory/PurchaseOrders";
import InventoryReports from "@/pages/admin/inventory/InventoryReports";

// Import reports pages
import SalesAnalytics from "@/pages/admin/reports/SalesAnalytics";
import StaffReports from "@/pages/admin/reports/StaffReports";
import { default as ReportsInventory } from "@/pages/admin/reports/InventoryReports";
import CustomerInsights from "@/pages/admin/reports/CustomerInsights";
import CustomReports from "@/pages/admin/reports/CustomReports";

// Import settings pages
import RestaurantProfile from "@/pages/admin/settings/RestaurantProfile";
import UserAccess from "@/pages/admin/settings/UserAccess";
import PrintersDevices from "@/pages/admin/settings/PrintersDevices";
import SystemLogs from "@/pages/admin/settings/SystemLogs";
import Integrations from "@/pages/admin/settings/Integrations";
import ThemeSettings from "@/pages/admin/settings/ThemeSettings";

// Import food safety pages
import Checklists from "@/pages/admin/food-safety/Checklists";
import NewChecklist from "@/pages/admin/food-safety/NewChecklist";

const AdminRoutes = () => {
  // Check if user exists and has admin role
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route element={<Layout interface="admin" />}>
        <Route index element={<AdminDashboard />} />

        {/* Finance Routes */}
        <Route path="finance" element={<FinancialManagement />} />
        <Route path="finance/daily-sales" element={<DailySales />} />
        <Route path="finance/financial-reports" element={<FinancialReports />} />
        <Route path="finance/payment-management" element={<PaymentManagement />} />
        <Route path="finance/budgeting" element={<Budgeting />} />
        <Route path="finance/expenses" element={<Expenses />} />

        {/* Menu Routes */}
        <Route path="menu" element={<MenuManagement />} />
        <Route path="menu/food" element={<FoodManagement />} />
        <Route path="menu/dishes" element={<Dishes />} />
        <Route path="menu/categories" element={<Categories />} />
        <Route path="menu/recipes" element={<RecipeManagement />} />
        <Route path="menu/modifiers" element={<Modifiers />} />
        <Route path="menu/pricing" element={<Pricing />} />
        <Route path="menu/design" element={<MenuDesign />} />

        {/* Staff Routes */}
        <Route path="staff" element={<StaffManagement />} />
        <Route path="staff/directory" element={<Directory />} />
        <Route path="staff/performance" element={<Performance />} />
        <Route path="staff/attendance" element={<Attendance />} />
        <Route path="staff/tasks" element={<Tasks />} />
        <Route path="staff/payroll" element={<Payroll />} />
        <Route path="staff/new" element={<NewStaff />} />
        <Route path="staff/edit/:id" element={<EditStaff />} />
        <Route path="staff/profile/:id" element={<StaffProfile />} />

        {/* Inventory Routes */}
        <Route path="inventory" element={<InventoryControl />} />
        <Route path="inventory/stock" element={<StockLevels />} />
        <Route path="inventory/ingredients" element={<Ingredients />} />
        <Route path="inventory/recipes" element={<Recipes />} />
        <Route path="inventory/suppliers" element={<Suppliers />} />
        <Route path="inventory/purchase-orders" element={<PurchaseOrders />} />
        <Route path="inventory/reports" element={<InventoryReports />} />

        {/* Reports Routes */}
        <Route path="reports" element={<Reports />} />
        <Route path="reports/sales" element={<SalesAnalytics />} />
        <Route path="reports/staff" element={<StaffReports />} />
        <Route path="reports/inventory" element={<ReportsInventory />} />
        <Route path="reports/customers" element={<CustomerInsights />} />
        <Route path="reports/custom" element={<CustomReports />} />

        {/* Customer Routes */}
        <Route path="customers" element={<Customers />} />
        <Route path="customers/feedback" element={<Feedback />} />
        <Route path="customers/database" element={<CustomerDatabase />} />
        <Route path="customers/promotions" element={<Promotions />} />
        <Route path="customers/loyalty" element={<LoyaltyProgram />} />

        {/* Settings Routes */}
        <Route path="settings" element={<Settings />} />
        <Route path="settings/profile" element={<RestaurantProfile />} />
        <Route path="settings/users" element={<UserAccess />} />
        <Route path="settings/devices" element={<PrintersDevices />} />
        <Route path="settings/logs" element={<SystemLogs />} />
        <Route path="settings/integrations" element={<Integrations />} />
        <Route path="settings/theme" element={<ThemeSettings />} />

        {/* General Routes */}
        <Route path="tables" element={<TableManagement />} />
        <Route path="activity" element={<ActivityLog />} />
        <Route path="tasks" element={<TaskManagement />} />
        <Route path="communication" element={<Communication />} />
        <Route path="language" element={<LanguageManagement />} />
        
        {/* Food Safety Routes */}
        <Route path="food-safety" element={<FoodSafety />} />
        <Route path="food-safety/checklists" element={<Checklists />} />
        <Route path="food-safety/new-checklist" element={<NewChecklist />} />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
