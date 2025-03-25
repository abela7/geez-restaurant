
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
import { useAuth } from "@/hooks/useAuth";

const KitchenRoutes = () => {
  const { user, isLoading } = useAuth();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }
  
  // Check if user exists and has kitchen role
  if (!user || user.role !== 'kitchen') {
    return <Navigate to="/login" replace />;
  }

  return (
    <CartProvider>
      <Routes>
        <Route element={<Layout interface="kitchen" />}>
          <Route index element={<KitchenDashboard />} />
          <Route path="/orders" element={<OrderProcessing />} />
          <Route path="/inventory" element={<InventoryCheck />} />
          <Route path="/menu-availability" element={<MenuAvailability />} />
          <Route path="/tasks" element={<KitchenTasks />} />
          <Route path="/food-safety" element={<KitchenFoodSafety />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </CartProvider>
  );
};

export default KitchenRoutes;
