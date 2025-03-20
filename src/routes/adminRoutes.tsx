
import { Route, Routes } from "react-router-dom";

// Administrative Portal
import Index from "../pages/Index";
import Reports from "../pages/admin/Reports";
import StaffManagement from "../pages/admin/StaffManagement";
import InventoryControl from "../pages/admin/InventoryControl";
import MenuManagement from "../pages/admin/MenuManagement";
import AdminTaskManagement from "../pages/admin/TaskManagement";
import Communication from "../pages/admin/Communication";
import FinancialManagement from "../pages/admin/FinancialManagement";
import LanguageManagement from "../pages/admin/LanguageManagement";
import FoodSafety from "../pages/admin/FoodSafety";

// Menu Management Subpages
import RecipeManagement from "../pages/admin/menu/RecipeManagement";
import FoodManagement from "../pages/admin/menu/FoodManagement";
import MenuDesign from "../pages/admin/menu/MenuDesign";
import Categories from "../pages/admin/menu/Categories";
import Modifiers from "../pages/admin/menu/Modifiers";
import Pricing from "../pages/admin/menu/Pricing";
import Dishes from "../pages/admin/menu/Dishes";

// Finance Subpages
import DailySales from "../pages/admin/finance/DailySales";
import FinancialReports from "../pages/admin/finance/FinancialReports";
import PaymentManagement from "../pages/admin/finance/PaymentManagement";
import Expenses from "../pages/admin/finance/Expenses";
import Budgeting from "../pages/admin/finance/Budgeting";

// Inventory Subpages
import StockLevels from "../pages/admin/inventory/StockLevels";
import Ingredients from "../pages/admin/inventory/Ingredients";
import Recipes from "../pages/admin/inventory/Recipes";
import Suppliers from "../pages/admin/inventory/Suppliers";
import PurchaseOrders from "../pages/admin/inventory/PurchaseOrders";

// Food Safety Subpages
import Checklists from "../pages/admin/food-safety/Checklists";
import NewChecklist from "../pages/admin/food-safety/NewChecklist";

// New Admin Routes
import AdminCustomers from "../pages/admin/Customers";
import AdminSettings from "../pages/admin/Settings";
import AdminActivity from "../pages/admin/ActivityLog";

// Admin Subroutes
import SalesAnalytics from "../pages/admin/reports/SalesAnalytics";
import StaffReports from "../pages/admin/reports/StaffReports";
import InventoryReports from "../pages/admin/reports/InventoryReports";
import CustomerInsights from "../pages/admin/reports/CustomerInsights";
import CustomReports from "../pages/admin/reports/CustomReports";

// Customer Pages
import CustomerFeedback from "../pages/admin/customers/Feedback";
import CustomerDatabase from "../pages/admin/customers/CustomerDatabase";
import Promotions from "../pages/admin/customers/Promotions";
import LoyaltyProgram from "../pages/admin/customers/LoyaltyProgram";

// Settings Pages
import RestaurantProfile from "../pages/admin/settings/RestaurantProfile";
import UserAccess from "../pages/admin/settings/UserAccess";
import PrintersDevices from "../pages/admin/settings/PrintersDevices";
import SystemLogs from "../pages/admin/settings/SystemLogs";
import Integrations from "../pages/admin/settings/Integrations";

// Staff Management Pages
import StaffProfile from "../pages/admin/staff/StaffProfile";
import StaffAttendance from "../pages/admin/staff/Attendance";
import StaffPerformance from "../pages/admin/staff/Performance";
import NewStaff from "../pages/admin/staff/NewStaff";
import EditStaff from "../pages/admin/staff/EditStaff";
import Directory from "../pages/admin/staff/Directory";
import Tasks from "../pages/admin/staff/Tasks";
import Payroll from "../pages/admin/staff/Payroll";
import StaffTaskManagement from "../pages/admin/staff/TaskManagement";

// General Section
import GeneralTableManagement from "../pages/admin/general/TableManagement";

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Admin Portal Routes */}
      <Route path="/" element={<Index />} />
      
      {/* Reports Section */}
      <Route path="/admin/reports" element={<Reports />} />
      <Route path="/admin/reports/sales" element={<SalesAnalytics />} />
      <Route path="/admin/reports/staff" element={<StaffReports />} />
      <Route path="/admin/reports/inventory" element={<InventoryReports />} />
      <Route path="/admin/reports/customers" element={<CustomerInsights />} />
      <Route path="/admin/reports/custom" element={<CustomReports />} />
      
      {/* Finance Section */}
      <Route path="/admin/finance" element={<FinancialManagement />} />
      <Route path="/admin/finance/daily-sales" element={<DailySales />} />
      <Route path="/admin/finance/financial-reports" element={<FinancialReports />} />
      <Route path="/admin/finance/payment-management" element={<PaymentManagement />} />
      <Route path="/admin/finance/expenses" element={<Expenses />} />
      <Route path="/admin/finance/budgeting" element={<Budgeting />} />
      
      {/* Staff Management */}
      <Route path="/admin/staff" element={<StaffManagement />} />
      <Route path="/admin/staff/profile/:id" element={<StaffProfile />} />
      <Route path="/admin/staff/attendance" element={<StaffAttendance />} />
      <Route path="/admin/staff/performance" element={<StaffPerformance />} />
      <Route path="/admin/staff/new" element={<NewStaff />} />
      <Route path="/admin/staff/directory" element={<Directory />} />
      <Route path="/admin/staff/edit/:id" element={<EditStaff />} />
      <Route path="/admin/staff/tasks" element={<StaffTaskManagement />} />
      <Route path="/admin/staff/payroll" element={<Payroll />} />
      
      {/* Inventory Management */}
      <Route path="/admin/inventory" element={<InventoryControl />} />
      <Route path="/admin/inventory/stock" element={<StockLevels />} />
      <Route path="/admin/inventory/ingredients" element={<Ingredients />} />
      <Route path="/admin/inventory/recipes" element={<Recipes />} />
      <Route path="/admin/inventory/suppliers" element={<Suppliers />} />
      <Route path="/admin/inventory/purchase-orders" element={<PurchaseOrders />} />
      
      {/* Menu Management */}
      <Route path="/admin/menu" element={<MenuManagement />} />
      <Route path="/admin/menu/recipes" element={<RecipeManagement />} />
      <Route path="/admin/menu/food" element={<FoodManagement />} />
      <Route path="/admin/menu/dishes" element={<Dishes />} />
      <Route path="/admin/menu/categories" element={<Categories />} />
      <Route path="/admin/menu/modifiers" element={<Modifiers />} />
      <Route path="/admin/menu/pricing" element={<Pricing />} />
      <Route path="/admin/menu/design" element={<MenuDesign />} />
      
      {/* Tasks */}
      <Route path="/admin/tasks" element={<AdminTaskManagement />} />
      
      {/* Food Safety */}
      <Route path="/admin/food-safety" element={<FoodSafety />} />
      <Route path="/admin/food-safety/checklists" element={<Checklists />} />
      <Route path="/admin/food-safety/checklists/new" element={<NewChecklist />} />
      
      {/* Communication */}
      <Route path="/admin/communication" element={<Communication />} />
      
      {/* Customers Section */}
      <Route path="/admin/customers" element={<AdminCustomers />} />
      <Route path="/admin/customers/feedback" element={<CustomerFeedback />} />
      <Route path="/admin/customers/database" element={<CustomerDatabase />} />
      <Route path="/admin/customers/promotions" element={<Promotions />} />
      <Route path="/admin/customers/loyalty" element={<LoyaltyProgram />} />
      
      {/* Settings Section */}
      <Route path="/admin/settings" element={<AdminSettings />} />
      <Route path="/admin/settings/profile" element={<RestaurantProfile />} />
      <Route path="/admin/settings/users" element={<UserAccess />} />
      <Route path="/admin/settings/devices" element={<PrintersDevices />} />
      <Route path="/admin/settings/logs" element={<SystemLogs />} />
      <Route path="/admin/settings/integrations" element={<Integrations />} />
      
      {/* Activity Log */}
      <Route path="/admin/activity" element={<AdminActivity />} />
      
      {/* Language Management */}
      <Route path="/admin/language" element={<LanguageManagement />} />
      
      {/* General Section */}
      <Route path="/admin/general/table-management" element={<GeneralTableManagement />} />
    </Routes>
  );
};

export default AdminRoutes;
