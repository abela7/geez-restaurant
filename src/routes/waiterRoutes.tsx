
import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import WaiterDashboard from "../pages/waiter/WaiterDashboard";
import TableManagement from "../pages/waiter/TableManagement";
import OrderManagement from "../pages/waiter/OrderManagement";
import PaymentProcessing from "../pages/waiter/PaymentProcessing";
import WaiterTasks from "../pages/waiter/WaiterTasks";
import WaiterFoodSafety from "../pages/waiter/WaiterFoodSafety";
import NotFound from "@/pages/NotFound";
import { CartProvider } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";

const WaiterRoutes = () => {
  const { user, isLoading } = useAuth();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }
  
  // Check if user exists and has waiter role
  if (!user || user.role !== 'waiter') {
    return <Navigate to="/login" replace />;
  }

  return (
    <CartProvider>
      <Routes>
        <Route element={<Layout interface="waiter" />}>
          <Route index element={<WaiterDashboard />} />
          <Route path="/tables" element={<TableManagement />} />
          <Route path="/orders/*" element={<OrderManagement />} />
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
