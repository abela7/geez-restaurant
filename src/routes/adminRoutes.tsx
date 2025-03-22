
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import Layout from "@/components/Layout";
import NotFound from "@/pages/NotFound";

// Import Admin Pages
import Dashboard from "@/components/Dashboard";
import StaffManagement from "@/pages/admin/StaffManagement";
import MenuManagement from "@/pages/admin/MenuManagement";
import InventoryControl from "@/pages/admin/InventoryControl";
import FinancialManagement from "@/pages/admin/FinancialManagement";
import Reports from "@/pages/admin/Reports";
import Customers from "@/pages/admin/Customers";
import Communication from "@/pages/admin/Communication";
import TaskManagement from "@/pages/admin/TaskManagement";
import FoodSafety from "@/pages/admin/FoodSafety";
import ActivityLog from "@/pages/admin/ActivityLog";
import Settings from "@/pages/admin/Settings";
import LanguageManagement from "@/pages/admin/LanguageManagement";

// Import Admin Settings Pages
import RestaurantProfile from "@/pages/admin/settings/RestaurantProfile";
import UserAccess from "@/pages/admin/settings/UserAccess";
import PrintersDevices from "@/pages/admin/settings/PrintersDevices";
import Integrations from "@/pages/admin/settings/Integrations";
import SystemLogs from "@/pages/admin/settings/SystemLogs";
import ThemeSettings from "@/pages/admin/settings/ThemeSettings";

// Import Staff Management Pages
import Directory from "@/pages/admin/staff/Directory";
import NewStaff from "@/pages/admin/staff/NewStaff";
import EditStaff from "@/pages/admin/staff/EditStaff";
import StaffProfile from "@/pages/admin/staff/StaffProfile";
import Attendance from "@/pages/admin/staff/Attendance";
import Payroll from "@/pages/admin/staff/Payroll";
import Performance from "@/pages/admin/staff/Performance";
import Tasks from "@/pages/admin/staff/Tasks";

// Import Menu Management Pages
import Categories from "@/pages/admin/menu/Categories";
import Dishes from "@/pages/admin/menu/Dishes";
import Modifiers from "@/pages/admin/menu/Modifiers";
import Pricing from "@/pages/admin/menu/Pricing";
import RecipeManagement from "@/pages/admin/menu/RecipeManagement";
import FoodManagement from "@/pages/admin/menu/FoodManagement";
import MenuDesign from "@/pages/admin/menu/MenuDesign";

// Import Inventory Pages
import Ingredients from "@/pages/admin/inventory/Ingredients";
import StockLevels from "@/pages/admin/inventory/StockLevels";
import PurchaseOrders from "@/pages/admin/inventory/PurchaseOrders";
import Suppliers from "@/pages/admin/inventory/Suppliers";
import Recipes from "@/pages/admin/inventory/Recipes";
import InventoryReports from "@/pages/admin/inventory/InventoryReports";

// Import Finance Pages
import DailySales from "@/pages/admin/finance/DailySales";
import Expenses from "@/pages/admin/finance/Expenses";
import Budgeting from "@/pages/admin/finance/Budgeting";
import PaymentManagement from "@/pages/admin/finance/PaymentManagement";
import FinancialReports from "@/pages/admin/finance/FinancialReports";

// Import Reports Pages
import SalesAnalytics from "@/pages/admin/reports/SalesAnalytics";
import CustomerInsights from "@/pages/admin/reports/CustomerInsights";
import StaffReports from "@/pages/admin/reports/StaffReports";
import InventoryReportsPage from "@/pages/admin/reports/InventoryReports";
import CustomReports from "@/pages/admin/reports/CustomReports";

// Import Customer Pages
import CustomerDatabase from "@/pages/admin/customers/CustomerDatabase";
import Feedback from "@/pages/admin/customers/Feedback";
import Promotions from "@/pages/admin/customers/Promotions";
import LoyaltyProgram from "@/pages/admin/customers/LoyaltyProgram";

// Import Food Safety Pages
import Checklists from "@/pages/admin/food-safety/Checklists";
import NewChecklist from "@/pages/admin/food-safety/NewChecklist";

// Import Table Management
import TableManagement from "@/pages/admin/general/TableManagement";

const AdminRoutes = () => {
  // Check if user exists and has admin role
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route element={<Layout interface="admin"><Outlet /></Layout>}>
        <Route index element={<Dashboard />} />
        
        {/* Staff Management Routes */}
        <Route path="/staff" element={<StaffManagement />} />
        <Route path="/staff/directory" element={<Directory />} />
        <Route path="/staff/new" element={<NewStaff />} />
        <Route path="/staff/edit/:id" element={<EditStaff />} />
        <Route path="/staff/profile/:id" element={<StaffProfile />} />
        <Route path="/staff/attendance" element={<Attendance />} />
        <Route path="/staff/payroll" element={<Payroll />} />
        <Route path="/staff/performance" element={<Performance />} />
        <Route path="/staff/tasks" element={<Tasks />} />
        
        {/* Menu Management Routes */}
        <Route path="/menu" element={<MenuManagement />} />
        <Route path="/menu/categories" element={<Categories />} />
        <Route path="/menu/dishes" element={<Dishes />} />
        <Route path="/menu/modifiers" element={<Modifiers />} />
        <Route path="/menu/pricing" element={<Pricing />} />
        <Route path="/menu/recipes" element={<RecipeManagement />} />
        <Route path="/menu/food" element={<FoodManagement />} />
        <Route path="/menu/design" element={<MenuDesign />} />
        
        {/* Inventory Control Routes */}
        <Route path="/inventory" element={<InventoryControl />} />
        <Route path="/inventory/ingredients" element={<Ingredients />} />
        <Route path="/inventory/stock" element={<StockLevels />} />
        <Route path="/inventory/purchase-orders" element={<PurchaseOrders />} />
        <Route path="/inventory/suppliers" element={<Suppliers />} />
        <Route path="/inventory/recipes" element={<Recipes />} />
        <Route path="/inventory/reports" element={<InventoryReports />} />
        
        {/* Financial Management Routes */}
        <Route path="/finance" element={<FinancialManagement />} />
        <Route path="/finance/daily-sales" element={<DailySales />} />
        <Route path="/finance/expenses" element={<Expenses />} />
        <Route path="/finance/budgeting" element={<Budgeting />} />
        <Route path="/finance/payment-management" element={<PaymentManagement />} />
        <Route path="/finance/reports" element={<FinancialReports />} />
        
        {/* Reports Routes */}
        <Route path="/reports" element={<Reports />} />
        <Route path="/reports/sales" element={<SalesAnalytics />} />
        <Route path="/reports/customers" element={<CustomerInsights />} />
        <Route path="/reports/staff" element={<StaffReports />} />
        <Route path="/reports/inventory" element={<InventoryReportsPage />} />
        <Route path="/reports/custom" element={<CustomReports />} />
        
        {/* Customer Management Routes */}
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/database" element={<CustomerDatabase />} />
        <Route path="/customers/feedback" element={<Feedback />} />
        <Route path="/customers/promotions" element={<Promotions />} />
        <Route path="/customers/loyalty" element={<LoyaltyProgram />} />
        
        {/* Communication Routes */}
        <Route path="/communication" element={<Communication />} />
        
        {/* Task Management Routes */}
        <Route path="/tasks" element={<TaskManagement />} />
        
        {/* Food Safety Routes */}
        <Route path="/food-safety" element={<FoodSafety />} />
        <Route path="/food-safety/checklists" element={<Checklists />} />
        <Route path="/food-safety/new-checklist" element={<NewChecklist />} />
        
        {/* Table Management */}
        <Route path="/tables" element={<TableManagement />} />
        
        {/* Activity Log Routes */}
        <Route path="/activity-log" element={<ActivityLog />} />
        
        {/* Settings Routes */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/profile" element={<RestaurantProfile />} />
        <Route path="/settings/users" element={<UserAccess />} />
        <Route path="/settings/printers" element={<PrintersDevices />} />
        <Route path="/settings/integrations" element={<Integrations />} />
        <Route path="/settings/system-logs" element={<SystemLogs />} />
        <Route path="/settings/themes" element={<ThemeSettings />} />
        
        {/* Language Management Routes */}
        <Route path="/language" element={<LanguageManagement />} />
      </Route>
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRoutes;
