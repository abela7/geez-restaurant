
import { Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout";
import CustomerMenu from "../pages/customer/CustomerMenu";
import CustomerFeedback from "../pages/customer/CustomerFeedback";
import Promotions from "../pages/customer/Promotions";
import NotFound from "@/pages/NotFound";
import { CartProvider } from "@/contexts/CartContext";

const CustomerRoutes = () => {
  return (
    <CartProvider>
      <Routes>
        <Route element={<Layout interface="customer" />}>
          <Route index element={<CustomerMenu />} />
          <Route path="/menu" element={<CustomerMenu />} />
          <Route path="/feedback" element={<CustomerFeedback />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </CartProvider>
  );
};

export default CustomerRoutes;
