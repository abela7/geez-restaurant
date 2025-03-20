import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Import routes
import AdminRoutes from "./routes/adminRoutes";
import WaiterRoutes from "./routes/waiterRoutes";
import KitchenRoutes from "./routes/kitchenRoutes";
import CustomerRoutes from "./routes/customerRoutes";
import SystemRoutes from "./routes/systemRoutes";
import AuthRoutes from "./routes/authRoutes";

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
              {/* Main route path */}
              <Route path="/*" element={<AdminRoutes />} />
              
              {/* Other interface routes */}
              <Route path="/waiter/*" element={<WaiterRoutes />} />
              <Route path="/kitchen/*" element={<KitchenRoutes />} />
              <Route path="/menu/*" element={<CustomerRoutes />} />
              <Route path="/feedback/*" element={<CustomerRoutes />} />
              <Route path="/promotions/*" element={<CustomerRoutes />} />
              <Route path="/system/*" element={<SystemRoutes />} />
              
              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Catch All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

// Import the storage setup
import "@/integrations/supabase/setup-storage";

// Import these here since they're used directly in the App component
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

export default App;
