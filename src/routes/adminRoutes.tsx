
import { lazy } from "react";
import { Navigate } from "react-router-dom";

// Lazy load admin pages
const Dashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const Settings = lazy(() => import("@/pages/admin/Settings"));
const MenuCategories = lazy(() => import("@/pages/admin/menu/Categories"));
const FoodManagement = lazy(() => import("@/pages/admin/menu/FoodManagement"));
const Dishes = lazy(() => import("@/pages/admin/menu/Dishes"));
const Reports = lazy(() => import("@/pages/admin/Reports"));
const CustomReports = lazy(() => import("@/pages/admin/reports/CustomReports"));
const CustomerInsights = lazy(() => import("@/pages/admin/reports/CustomerInsights"));
const InventoryReports = lazy(() => import("@/pages/admin/reports/InventoryReports"));
const DishCostList = lazy(() => import("@/pages/admin/menu/DishCost"));
const DishCostForm = lazy(() => import("@/pages/admin/menu/DishCost"));
import DishProfile from "@/pages/admin/menu/DishProfile";

// Remove the Users component import since it doesn't exist
// We can either create the component or remove its route

// Define admin routes
export const adminRoutes = [
  {
    path: "/admin",
    element: <Dashboard />,
  },
  // Removing the users route since the component doesn't exist
  // {
  //   path: "/admin/users",
  //   element: <Users />,
  // },
  {
    path: "/admin/settings",
    element: <Settings />,
  },
  {
    path: "/admin/menu",
    element: <MenuCategories />,
  },
  {
    path: "/admin/menu/categories",
    element: <MenuCategories />,
  },
  {
    path: "/admin/menu/food",
    element: <FoodManagement />,
  },
  {
    path: "/admin/menu/dishes",
    element: <Dishes />,
  },
  {
    path: "/admin/menu/dishes/:id",
    element: <DishProfile />,
  },
  {
    path: "/admin/reports",
    element: <Reports />,
  },
  {
    path: "/admin/reports/custom",
    element: <CustomReports />,
  },
  {
    path: "/admin/reports/customer-insights",
    element: <CustomerInsights />,
  },
  {
    path: "/admin/reports/inventory",
    element: <InventoryReports />,
  },
  {
    path: "/admin/dish-cost",
    element: <DishCostList />,
  },
  {
    path: "/admin/dish-cost/new",
    element: <DishCostForm />,
  },
  {
    path: "/admin/dish-cost/:id",
    element: <DishCostForm />,
  },
];

// Default export for the AdminRoutes component
const AdminRoutes = () => {
  return (
    <Navigate to="/admin" />
  );
};

export default AdminRoutes;
