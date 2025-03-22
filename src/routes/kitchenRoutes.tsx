
import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import KitchenDashboard from "../pages/kitchen/KitchenDashboard";
import OrderProcessing from "../pages/kitchen/OrderProcessing";
import InventoryCheck from "../pages/kitchen/InventoryCheck";
import KitchenTasks from "../pages/kitchen/KitchenTasks";
import KitchenFoodSafety from "../pages/kitchen/KitchenFoodSafety";
import MenuAvailability from "../pages/kitchen/MenuAvailability";
import NotFound from "@/pages/NotFound";
import { CartProvider } from "@/contexts/CartContext";

const KitchenRoutes = () => {
  // Check if user exists and has kitchen role
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  
  if (!user || user.role !== 'kitchen') {
    return <Navigate to="/login" replace />;
  }

  return (
    <CartProvider>
      <Layout interface="kitchen">
        <Routes>
          <Route index element={<KitchenDashboard />} />
          <Route path="/orders" element={<OrderProcessing />} />
          <Route path="/inventory" element={<InventoryCheck />} />
          <Route path="/menu-availability" element={<MenuAvailability />} />
          <Route path="/tasks" element={<KitchenTasks />} />
          <Route path="/food-safety" element={<KitchenFoodSafety />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </CartProvider>
  );
};

export default KitchenRoutes;
