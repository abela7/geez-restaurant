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
import Layout from "@/components/Layout";

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

// Special fallback for editor environments
const EditorFallback = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground p-4">
    <div className="text-3xl font-bold mb-4">Waiter Dashboard</div>
    <div className="text-lg mb-6">Loading restaurant management system...</div>
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-amber-500 mb-6"></div>
    <div className="text-sm text-muted-foreground text-center max-w-md">
      If content doesn't appear, try refreshing or opening in a new tab.
      The dashboard works correctly in standalone browser windows.
    </div>
  </div>
);

// Component to handle direct route rendering
const IndexRedirect = () => {
  const [loading, setLoading] = useState(true);
  const isInEditor = window.top !== window.self;
  
  useEffect(() => {
    // Add console log for debugging
    console.log("Index page loaded, redirecting to waiter dashboard");
    console.log("In editor iframe:", isInEditor);
    
    // Simulate a small delay to ensure routing works properly
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isInEditor]);
  
  if (loading) {
    return isInEditor ? <EditorFallback /> : <LoadingFallback />;
  }
  
  return <Navigate to="/waiter" replace />;
};

// Direct waiter dashboard wrapper to ensure it renders in iframes
const DirectWaiterDashboard = () => {
  const isInEditor = window.top !== window.self;
  
  useEffect(() => {
    console.log("Direct waiter dashboard component mounted");
    console.log("In editor frame:", isInEditor);
  }, [isInEditor]);
  
  return (
    <>
      {isInEditor && 
        <div className="p-2 bg-amber-100 text-amber-800 text-xs fixed top-0 left-0 right-0 z-50">
          Editor preview mode active - some features may be limited
        </div>
      }
      <Layout interface="waiter">
        <WaiterDashboard />
      </Layout>
    </>
  );
};

const App = () => {
  useEffect(() => {
    // Add console log for debugging when App component mounts
    console.log("App component mounted, current path:", window.location.pathname);
    console.log("In iframe:", window.top !== window.self);
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
                      <Route path="/waiter" element={<DirectWaiterDashboard />} />
                      
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
