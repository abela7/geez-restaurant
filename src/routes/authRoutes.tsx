
import { Navigate } from "react-router-dom";

const AuthRoutes = () => {
  // For development, always redirect to waiter dashboard
  return <Navigate to="/waiter" replace />;
};

export default AuthRoutes;
