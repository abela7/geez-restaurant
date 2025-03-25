
import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import SystemDashboard from "../pages/system/SystemDashboard";
import ErrorLogs from "../pages/system/ErrorLogs";
import UserManagement from "../pages/system/UserManagement";
import Documentation from "../pages/system/Documentation";
import NotFound from "@/pages/NotFound";
import { useAuth } from "@/hooks/useAuth";

const SystemRoutes = () => {
  const { user, isLoading } = useAuth();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }
  
  // Check if user exists and has system role
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
