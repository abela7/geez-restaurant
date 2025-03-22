
import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import KitchenDashboard from "../pages/kitchen/KitchenDashboard";
import OrderProcessing from "../pages/kitchen/OrderProcessing";
import InventoryCheck from "../pages/kitchen/InventoryCheck";
import KitchenTasks from "../pages/kitchen/KitchenTasks";
import KitchenFoodSafety from "../pages/kitchen/KitchenFoodSafety";
import MenuAvailability from "../pages/kitchen/MenuAvailability";
import NotFound from "@/pages/NotFound";

const KitchenRoutes = () => {
  // Check if user exists and has kitchen role
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  
  if (!user || user.role !== 'kitchen') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout interface="kitchen"><KitchenDashboard /></Layout>} />
      <Route path="/orders" element={<Layout interface="kitchen"><OrderProcessing /></Layout>} />
      <Route path="/inventory" element={<Layout interface="kitchen"><InventoryCheck /></Layout>} />
      <Route path="/menu-availability" element={<Layout interface="kitchen"><MenuAvailability /></Layout>} />
      <Route path="/tasks" element={<Layout interface="kitchen"><KitchenTasks /></Layout>} />
      <Route path="/food-safety" element={<Layout interface="kitchen"><KitchenFoodSafety /></Layout>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default KitchenRoutes;
