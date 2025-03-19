
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
import CustomerFeedback from "./pages/customer/CustomerFeedback";
import Promotions from "./pages/customer/Promotions";

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
              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/admin/staff" element={<StaffManagement />} />
              <Route path="/admin/inventory" element={<InventoryControl />} />
              <Route path="/admin/menu" element={<MenuManagement />} />
              <Route path="/admin/tasks" element={<TaskManagement />} />
              <Route path="/admin/communication" element={<Communication />} />
              <Route path="/admin/finance" element={<FinancialManagement />} />
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
              <Route path="/feedback" element={<CustomerFeedback />} />
              <Route path="/promotions" element={<Promotions />} />
              
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
