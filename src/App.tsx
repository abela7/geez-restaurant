import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/hooks/useAuth";
import { Suspense, useEffect, useState } from "react";

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
import WaiterDashboard from "./pages/waiter/WaiterDashboard";

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

// Component to handle direct route rendering
const IndexRedirect = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Add console log for debugging
    console.log("Index page loaded, redirecting to waiter dashboard");
    
    // Simulate a small delay to ensure routing works properly
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return <LoadingFallback />;
  }
  
  return <Navigate to="/waiter" replace />;
};

const App = () => {
  useEffect(() => {
    // Add console log for debugging when App component mounts
    console.log("App component mounted, current path:", window.location.pathname);
  }, []);

  return (
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
                      {/* Root path - redirect to waiter dashboard */}
                      <Route path="/" element={<IndexRedirect />} />
                      
                      {/* Direct route to waiter dashboard for immediate access */}
                      <Route path="/waiter" element={<WaiterDashboard />} />
                      
                      {/* Other waiter routes */}
                      <Route path="/waiter/*" element={<WaiterRoutes />} />
                      
                      {/* Map all admin routes */}
                      {adminRoutes.map((route) => (
                        <Route key={route.path} path={route.path} element={route.element} />
                      ))}
                      
                      {/* Other interface routes */}
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
};

export default App;
