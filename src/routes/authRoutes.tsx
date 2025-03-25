
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

const AuthRoutes = () => {
  const isInIframe = window.top !== window.self;

  useEffect(() => {
    // Debug when AuthRoutes component mounts
    console.log("AuthRoutes component mounted - redirecting to waiter dashboard");
    console.log("In iframe:", isInIframe);
  }, [isInIframe]);
  
  // For development, always redirect to waiter dashboard
  return <Navigate to="/waiter" replace />;
};

export default AuthRoutes;
