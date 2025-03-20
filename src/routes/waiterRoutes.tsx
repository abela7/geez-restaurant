
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import Layout from "@/components/Layout";
import WaiterDashboard from "@/pages/waiter/WaiterDashboard";
import TableManagement from "@/pages/waiter/TableManagement";
import OrderManagement from "@/pages/waiter/OrderManagement";
import PaymentProcessing from "@/pages/waiter/PaymentProcessing";
import WaiterTasks from "@/pages/waiter/WaiterTasks";
import WaiterFoodSafety from "@/pages/waiter/WaiterFoodSafety";
import UserProfile from "@/pages/UserProfile";
import NotFound from "@/pages/NotFound";

// Protected route component
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
        <Route path="tables" element={<TableManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="payments" element={<PaymentProcessing />} />
        <Route path="tasks" element={<WaiterTasks />} />
        <Route path="food-safety" element={<WaiterFoodSafety />} />
      </Route>
      <Route path="profile" element={<UserProfile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default WaiterRoutes;
