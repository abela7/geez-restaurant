
import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import SystemDashboard from "../pages/system/SystemDashboard";
import ErrorLogs from "../pages/system/ErrorLogs";
import UserManagement from "../pages/system/UserManagement";
import Documentation from "../pages/system/Documentation";
import NotFound from "@/pages/NotFound";

const SystemRoutes = () => {
  // Check if user exists and has system role
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  
  if (!user || user.role !== 'system') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route element={<Layout interface="system" />}>
        <Route index element={<SystemDashboard />} />
        <Route path="/errors" element={<ErrorLogs />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/docs" element={<Documentation />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default SystemRoutes;
