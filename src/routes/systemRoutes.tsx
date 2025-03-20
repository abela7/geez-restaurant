
import { Route, Routes } from "react-router-dom";

// System Administration Interface
import SystemDashboard from "../pages/system/SystemDashboard";
import ErrorLogs from "../pages/system/ErrorLogs";
import UserManagement from "../pages/system/UserManagement";
import Documentation from "../pages/system/Documentation";

const SystemRoutes = () => {
  return (
    <Routes>
      {/* System Administration Interface Routes */}
      <Route path="/system" element={<SystemDashboard />} />
      <Route path="/system/errors" element={<ErrorLogs />} />
      <Route path="/system/users" element={<UserManagement />} />
      <Route path="/system/docs" element={<Documentation />} />
    </Routes>
  );
};

export default SystemRoutes;
