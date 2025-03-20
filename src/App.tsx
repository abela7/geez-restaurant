
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Administrative Portal
import Index from "./pages/Index";
import Reports from "./pages/admin/Reports";
import StaffManagement from "./pages/admin/StaffManagement";
import InventoryControl from "./pages/admin/InventoryControl";
import MenuManagement from "./pages/admin/MenuManagement";
import TaskManagement from "./pages/admin/TaskManagement";
import Communication from "./pages/admin/Communication";
import FinancialManagement from "./pages/admin/FinancialManagement";
import LanguageManagement from "./pages/admin/LanguageManagement";

// Menu Management Subpages
import RecipeManagement from "./pages/admin/menu/RecipeManagement";
import FoodManagement from "./pages/admin/menu/FoodManagement";
import MenuDesign from "./pages/admin/menu/MenuDesign";
import Categories from "./pages/admin/menu/Categories";
import Modifiers from "./pages/admin/menu/Modifiers";
import Pricing from "./pages/admin/menu/Pricing";

// Finance Subpages
import DailySales from "./pages/admin/finance/DailySales";
import FinancialReports from "./pages/admin/finance/FinancialReports";
import PaymentManagement from "./pages/admin/finance/PaymentManagement";
import Budgeting from "./pages/admin/finance/Budgeting";

// Inventory Subpages
import StockLevels from "./pages/admin/inventory/StockLevels";
import Ingredients from "./pages/admin/inventory/Ingredients";
import Recipes from "./pages/admin/inventory/Recipes";
import Suppliers from "./pages/admin/inventory/Suppliers";
import PurchaseOrders from "./pages/admin/inventory/PurchaseOrders";

// New Admin Routes
import AdminCustomers from "./pages/admin/Customers";
import AdminSettings from "./pages/admin/Settings";
import AdminActivity from "./pages/admin/ActivityLog";

// Admin Subroutes
import SalesAnalytics from "./pages/admin/reports/SalesAnalytics";
import StaffReports from "./pages/admin/reports/StaffReports";
import InventoryReports from "./pages/admin/reports/InventoryReports";
import CustomerInsights from "./pages/admin/reports/CustomerInsights";
import CustomReports from "./pages/admin/reports/CustomReports";

// Customer Pages
import CustomerFeedback from "./pages/admin/customers/Feedback";
import CustomerDatabase from "./pages/admin/customers/CustomerDatabase";
import Promotions from "./pages/admin/customers/Promotions";
import LoyaltyProgram from "./pages/admin/customers/LoyaltyProgram";

// Settings Pages
import RestaurantProfile from "./pages/admin/settings/RestaurantProfile";
import UserAccess from "./pages/admin/settings/UserAccess";
import PrintersDevices from "./pages/admin/settings/PrintersDevices";
import SystemLogs from "./pages/admin/settings/SystemLogs";
import Integrations from "./pages/admin/settings/Integrations";

// Staff Management Pages
import StaffProfile from "./pages/admin/staff/StaffProfile";
import StaffAttendance from "./pages/admin/staff/Attendance";
import StaffPerformance from "./pages/admin/staff/Performance";
import NewStaff from "./pages/admin/staff/NewStaff";
import Directory from "./pages/admin/staff/Directory";
import Tasks from "./pages/admin/staff/Tasks";
import Payroll from "./pages/admin/staff/Payroll";

// Waiter Interface
import WaiterDashboard from "./pages/waiter/WaiterDashboard";
import TableManagement from "./pages/waiter/TableManagement";
import OrderManagement from "./pages/waiter/OrderManagement";
import PaymentProcessing from "./pages/waiter/PaymentProcessing";
import WaiterTasks from "./pages/waiter/WaiterTasks";

// Kitchen Staff Interface
import KitchenDashboard from "./pages/kitchen/KitchenDashboard";
import RecipeViewer from "./pages/kitchen/RecipeViewer";
import InventoryCheck from "./pages/kitchen/InventoryCheck";
import KitchenTasks from "./pages/kitchen/KitchenTasks";

// Customer Interface
import CustomerMenu from "./pages/customer/CustomerMenu";
import CustomerFeedbackPage from "./pages/customer/CustomerFeedback";
import PromotionsPage from "./pages/customer/Promotions";

// System Administration Interface
import SystemDashboard from "./pages/system/SystemDashboard";
import ErrorLogs from "./pages/system/ErrorLogs";
import UserManagement from "./pages/system/UserManagement";
import Documentation from "./pages/system/Documentation";

// Auth
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              
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
              <Route path="/admin/finance/budgeting" element={<Budgeting />} />
              
              {/* Staff Management */}
              <Route path="/admin/staff" element={<StaffManagement />} />
              <Route path="/admin/staff/profile/:id" element={<StaffProfile />} />
              <Route path="/admin/staff/attendance" element={<StaffAttendance />} />
              <Route path="/admin/staff/performance" element={<StaffPerformance />} />
              <Route path="/admin/staff/new" element={<NewStaff />} />
              <Route path="/admin/staff/directory" element={<Directory />} />
              <Route path="/admin/staff/tasks" element={<Tasks />} />
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
              <Route path="/admin/menu/categories" element={<Categories />} />
              <Route path="/admin/menu/modifiers" element={<Modifiers />} />
              <Route path="/admin/menu/pricing" element={<Pricing />} />
              <Route path="/admin/menu/design" element={<MenuDesign />} />
              
              {/* Tasks */}
              <Route path="/admin/tasks" element={<TaskManagement />} />
              
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
              
              {/* Waiter Interface Routes */}
              <Route path="/waiter" element={<WaiterDashboard />} />
              <Route path="/waiter/tables" element={<TableManagement />} />
              <Route path="/waiter/orders" element={<OrderManagement />} />
              <Route path="/waiter/payments" element={<PaymentProcessing />} />
              <Route path="/waiter/tasks" element={<WaiterTasks />} />
              
              {/* Kitchen Staff Interface Routes */}
              <Route path="/kitchen" element={<KitchenDashboard />} />
              <Route path="/kitchen/recipes" element={<RecipeViewer />} />
              <Route path="/kitchen/inventory" element={<InventoryCheck />} />
              <Route path="/kitchen/tasks" element={<KitchenTasks />} />
              
              {/* Customer Interface Routes */}
              <Route path="/menu" element={<CustomerMenu />} />
              <Route path="/feedback" element={<CustomerFeedbackPage />} />
              <Route path="/promotions" element={<PromotionsPage />} />
              
              {/* System Administration Interface Routes */}
              <Route path="/system" element={<SystemDashboard />} />
              <Route path="/system/errors" element={<ErrorLogs />} />
              <Route path="/system/users" element={<UserManagement />} />
              <Route path="/system/docs" element={<Documentation />} />
              
              {/* Catch All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
