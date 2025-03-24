
import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Layout from "@/components/Layout";

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
const DishCost = lazy(() => import("@/pages/admin/menu/DishCost"));
const Pricing = lazy(() => import("@/pages/admin/menu/Pricing"));
const Modifiers = lazy(() => import("@/pages/admin/menu/Modifiers"));
const MenuDesign = lazy(() => import("@/pages/admin/menu/MenuDesign"));
import DishProfile from "@/pages/admin/menu/DishProfile";

// Wrap components with Layout
const withLayout = (Component: React.ComponentType) => (
  <Layout interface="admin">
    <Component />
  </Layout>
);

// Define admin routes
export const adminRoutes = [
  {
    path: "/admin",
    element: withLayout(Dashboard),
  },
  {
    path: "/admin/settings",
    element: withLayout(Settings),
  },
  {
    path: "/admin/menu",
    element: withLayout(MenuCategories),
  },
  {
    path: "/admin/menu/categories",
    element: withLayout(MenuCategories),
  },
  {
    path: "/admin/menu/food",
    element: withLayout(FoodManagement),
  },
  {
    path: "/admin/menu/dishes",
    element: withLayout(Dishes),
  },
  {
    path: "/admin/menu/dishes/:id",
    element: withLayout(DishProfile),
  },
  {
    path: "/admin/reports",
    element: withLayout(Reports),
  },
  {
    path: "/admin/reports/custom",
    element: withLayout(CustomReports),
  },
  {
    path: "/admin/reports/customer-insights",
    element: withLayout(CustomerInsights),
  },
  {
    path: "/admin/reports/inventory",
    element: withLayout(InventoryReports),
  },
  {
    path: "/admin/dish-cost",
    element: withLayout(DishCost),
  },
  {
    path: "/admin/dish-cost/new",
    element: withLayout(DishCost),
  },
  {
    path: "/admin/dish-cost/:id",
    element: withLayout(DishCost),
  },
  {
    path: "/admin/menu/pricing",
    element: withLayout(Pricing),
  },
  {
    path: "/admin/menu/modifiers",
    element: withLayout(Modifiers),
  },
  {
    path: "/admin/menu/design",
    element: withLayout(MenuDesign),
  },
];

// Default export for the AdminRoutes component
const AdminRoutes = () => {
  return (
    <Navigate to="/admin" />
  );
};

export default AdminRoutes;
