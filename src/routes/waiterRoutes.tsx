
import { Route, Routes } from "react-router-dom";

// Waiter Interface
import WaiterDashboard from "../pages/waiter/WaiterDashboard";
import WaiterTableManagement from "../pages/waiter/TableManagement";
import OrderManagement from "../pages/waiter/OrderManagement";
import PaymentProcessing from "../pages/waiter/PaymentProcessing";
import WaiterTasks from "../pages/waiter/WaiterTasks";

const WaiterRoutes = () => {
  return (
    <Routes>
      {/* Waiter Interface Routes */}
      <Route path="/waiter" element={<WaiterDashboard />} />
      <Route path="/waiter/tables" element={<WaiterTableManagement />} />
      <Route path="/waiter/orders" element={<OrderManagement />} />
      <Route path="/waiter/payments" element={<PaymentProcessing />} />
      <Route path="/waiter/tasks" element={<WaiterTasks />} />
    </Routes>
  );
};

export default WaiterRoutes;
