
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import WaiterDashboard from "../pages/waiter/WaiterDashboard";
import TableManagement from "../pages/waiter/TableManagement";
import OrderManagement from "../pages/waiter/OrderManagement";
import PaymentProcessing from "../pages/waiter/PaymentProcessing";
import WaiterTasks from "../pages/waiter/WaiterTasks";
import WaiterFoodSafety from "../pages/waiter/WaiterFoodSafety";
import NotFound from "@/pages/NotFound";
import { CartProvider } from "@/contexts/CartContext";
import { useEffect } from "react";

const WaiterRoutes = () => {
  const location = useLocation();
  
  // Check if user exists and has waiter role
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  
  // For development purposes, if there's a query param 'bypass', we skip the auth check
  const urlParams = new URLSearchParams(window.location.search);
  const bypass = urlParams.get('bypass') === 'true';
  
  useEffect(() => {
    // Log for debugging
    console.log("WaiterRoutes rendering, location:", location.pathname);
    console.log("User:", user);
  }, [location]);
  
  if (!bypass && (!user || user.role !== 'waiter')) {
    // Redirect to login page
    console.log("Redirecting to login, user not authorized for waiter routes");
    return <Navigate to="/login" replace />;
  }

  // Check if we need to create a new order
  const isNewOrder = location.search.includes('new=true');

  return (
    <CartProvider>
      <Routes>
        <Route element={<Layout interface="waiter" />}>
          <Route index element={<WaiterDashboard />} />
          <Route path="/tables" element={<TableManagement />} />
          <Route path="/orders" element={<OrderManagement newOrder={isNewOrder} />} />
          <Route path="/payments" element={<PaymentProcessing />} />
          <Route path="/tasks" element={<WaiterTasks />} />
          <Route path="/food-safety" element={<WaiterFoodSafety />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </CartProvider>
  );
};

export default WaiterRoutes;
