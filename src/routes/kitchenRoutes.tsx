
import { Route, Routes } from "react-router-dom";

import KitchenDashboard from "../pages/kitchen/KitchenDashboard";
import OrderProcessing from "../pages/kitchen/OrderProcessing";
import InventoryCheck from "../pages/kitchen/InventoryCheck";
import KitchenTasks from "../pages/kitchen/KitchenTasks";
import KitchenFoodSafety from "../pages/kitchen/KitchenFoodSafety";

const KitchenRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<KitchenDashboard />} />
      <Route path="/orders" element={<OrderProcessing />} />
      <Route path="/inventory" element={<InventoryCheck />} />
      <Route path="/tasks" element={<KitchenTasks />} />
      <Route path="/food-safety" element={<KitchenFoodSafety />} />
    </Routes>
  );
};

export default KitchenRoutes;
