import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/hooks/useAuth";
import { Suspense } from "react";

// Import routes
import { adminRoutes } from "./routes/adminRoutes";
import AdminRoutes from "./routes/adminRoutes"; // Import default export correctly
import WaiterRoutes from "./routes/waiterRoutes";
import KitchenRoutes from "./routes/kitchenRoutes";
import CustomerRoutes from "./routes/customerRoutes";
import SystemRoutes from "./routes/systemRoutes";
import AuthRoutes from "./routes/authRoutes";

// Import pages used directly in App.tsx
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Import the storage setup
import "@/integrations/supabase/setup-storage";

// Create a new query client with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <ThemeProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthProvider>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    {/* Map all admin routes */}
                    {adminRoutes.map((route) => (
                      <Route key={route.path} path={route.path} element={route.element} />
                    ))}
                    
                    {/* Redirect / to /admin for now */}
                    <Route path="/" element={<Navigate to="/admin" replace />} />
                    
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
                </Suspense>
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
