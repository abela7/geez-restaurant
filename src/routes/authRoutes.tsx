
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";

const AuthRoutes = () => {
  // For development, always redirect to waiter dashboard
  return <Navigate to="/waiter" replace />;
};

export default AuthRoutes;
