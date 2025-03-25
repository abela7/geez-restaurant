
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import { useAuth } from "@/hooks/useAuth";

const AuthRoutes = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // Redirect based on user role
  if (user) {
    if (user.role === 'waiter') {
      return <Navigate to="/waiter" replace />;
    } else if (user.role === 'kitchen') {
      return <Navigate to="/kitchen" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      {/* Catch All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AuthRoutes;
