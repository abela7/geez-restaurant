
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import { useEffect, useState } from "react";

const AuthRoutes = () => {
  const [user, setUser] = useState<{ username: string, role: string } | null>(null);

  useEffect(() => {
    // Check for user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user from localStorage", error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Redirect based on user role
  if (user) {
    if (user.role === 'waiter') {
      return <Navigate to="/waiter" replace />;
    } else if (user.role === 'kitchen') {
      return <Navigate to="/kitchen" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/" replace />;
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
