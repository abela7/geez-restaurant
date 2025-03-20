
import { Route, Routes } from "react-router-dom";

// Kitchen Staff Interface
import KitchenDashboard from "../pages/kitchen/KitchenDashboard";
import RecipeViewer from "../pages/kitchen/RecipeViewer";
import InventoryCheck from "../pages/kitchen/InventoryCheck";
import KitchenTasks from "../pages/kitchen/KitchenTasks";

const KitchenRoutes = () => {
  return (
    <Routes>
      {/* Kitchen Staff Interface Routes */}
      <Route path="/kitchen" element={<KitchenDashboard />} />
      <Route path="/kitchen/recipes" element={<RecipeViewer />} />
      <Route path="/kitchen/inventory" element={<InventoryCheck />} />
      <Route path="/kitchen/tasks" element={<KitchenTasks />} />
    </Routes>
  );
};

export default KitchenRoutes;
