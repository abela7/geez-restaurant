import { Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout";
import WaiterDashboard from "../pages/waiter/WaiterDashboard";
import TableManagement from "../pages/waiter/TableManagement";
import OrderManagement from "../pages/waiter/OrderManagement";
import PaymentProcessing from "../pages/waiter/PaymentProcessing";
import WaiterTasks from "../pages/waiter/WaiterTasks";
import WaiterFoodSafety from "../pages/waiter/WaiterFoodSafety";
import NotFound from "@/pages/NotFound";
import { CartProvider } from "@/contexts/CartContext";
import { useEffect } from "react";

const WaiterRoutes = () => {
  useEffect(() => {
    // Debug when WaiterRoutes component mounts
    console.log("WaiterRoutes component mounted");
    console.log("In iframe:", window.top !== window.self);
  }, []);

  return (
    <CartProvider>
      <Routes>
        <Route element={<Layout interface="waiter" />}>
          {/* If we're directly at /waiter, show the dashboard */}
          <Route index element={<WaiterDashboard />} />
          {/* Other routes */}
          <Route path="tables" element={<TableManagement />} />
          <Route path="orders/*" element={<OrderManagement />} />
          <Route path="payments" element={<PaymentProcessing />} />
          <Route path="tasks" element={<WaiterTasks />} />
          <Route path="food-safety" element={<WaiterFoodSafety />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </CartProvider>
  );
};

export default WaiterRoutes;
