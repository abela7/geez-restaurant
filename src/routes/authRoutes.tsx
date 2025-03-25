
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

const AuthRoutes = () => {
  useEffect(() => {
    // Debug when AuthRoutes component mounts
    console.log("AuthRoutes component mounted - redirecting to waiter dashboard");
  }, []);
  
  // For development, always redirect to waiter dashboard
  return <Navigate to="/waiter" replace />;
};

export default AuthRoutes;
