
import { Route, Routes } from "react-router-dom";

// Customer Interface
import CustomerMenu from "../pages/customer/CustomerMenu";
import CustomerFeedbackPage from "../pages/customer/CustomerFeedback";
import PromotionsPage from "../pages/customer/Promotions";

const CustomerRoutes = () => {
  return (
    <Routes>
      {/* Customer Interface Routes */}
      <Route path="/menu" element={<CustomerMenu />} />
      <Route path="/feedback" element={<CustomerFeedbackPage />} />
      <Route path="/promotions" element={<PromotionsPage />} />
    </Routes>
  );
};

export default CustomerRoutes;
