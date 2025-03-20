
import { Route, Routes } from "react-router-dom";

import WaiterDashboard from "../pages/waiter/WaiterDashboard";
import OrderManagement from "../pages/waiter/OrderManagement";
import PaymentProcessing from "../pages/waiter/PaymentProcessing";
import TableManagement from "../pages/waiter/TableManagement";
import WaiterTasks from "../pages/waiter/WaiterTasks";
import WaiterFoodSafety from "../pages/waiter/WaiterFoodSafety";

const WaiterRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<WaiterDashboard />} />
      <Route path="/orders" element={<OrderManagement />} />
      <Route path="/payments" element={<PaymentProcessing />} />
      <Route path="/tables" element={<TableManagement />} />
      <Route path="/tasks" element={<WaiterTasks />} />
      <Route path="/food-safety" element={<WaiterFoodSafety />} />
    </Routes>
  );
};

export default WaiterRoutes;
