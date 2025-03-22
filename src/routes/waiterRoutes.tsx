
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import Layout from "@/components/Layout";
import WaiterDashboard from "../pages/waiter/WaiterDashboard";
import OrderManagement from "../pages/waiter/OrderManagement";
import TableManagement from "../pages/waiter/TableManagement";
import PaymentProcessing from "../pages/waiter/PaymentProcessing";
import WaiterTasks from "../pages/waiter/WaiterTasks";
import WaiterFoodSafety from "../pages/waiter/WaiterFoodSafety";
import NotFound from "@/pages/NotFound";

const WaiterRoutes = () => {
  // Check if user exists and has waiter role
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  
  if (!user || user.role !== 'waiter') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route element={<Layout interface="waiter"><Outlet /></Layout>}>
        <Route index element={<WaiterDashboard />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/orders/new" element={<OrderManagement />} />
        <Route path="/orders/search" element={<OrderManagement />} />
        <Route path="/tables" element={<TableManagement />} />
        <Route path="/payments" element={<PaymentProcessing />} />
        <Route path="/tasks" element={<WaiterTasks />} />
        <Route path="/food-safety" element={<WaiterFoodSafety />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default WaiterRoutes;
