
import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import WaiterDashboard from "../pages/waiter/WaiterDashboard";
import OrderManagement from "../pages/waiter/OrderManagement";
import TableManagement from "../pages/waiter/TableManagement";
import PaymentProcessing from "../pages/waiter/PaymentProcessing";
import WaiterTasks from "../pages/waiter/WaiterTasks";
import WaiterFoodSafety from "../pages/waiter/WaiterFoodSafety";
import NotFound from "@/pages/NotFound";
import { CartProvider } from "@/contexts/CartContext";

const WaiterRoutes = () => {
  // Check if user exists and has waiter role
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  
  if (!user || user.role !== 'waiter') {
    return <Navigate to="/login" replace />;
  }

  return (
    <CartProvider>
      <Layout interface="waiter">
        <Routes>
          <Route index element={<WaiterDashboard />} />
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/orders/new" element={<OrderManagement newOrder={true} />} />
          <Route path="/orders/search" element={<OrderManagement search={true} />} />
          <Route path="/tables" element={<TableManagement />} />
          <Route path="/payments" element={<PaymentProcessing />} />
          <Route path="/tasks" element={<WaiterTasks />} />
          <Route path="/food-safety" element={<WaiterFoodSafety />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </CartProvider>
  );
};

export default WaiterRoutes;
