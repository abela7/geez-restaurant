import { lazy } from "react";
import { AuthProvider } from "@/components/auth/AuthProvider";

const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const Users = lazy(() => import("../pages/admin/Users"));
const Settings = lazy(() => import("../pages/admin/Settings"));
const MenuCategories = lazy(() => import("../pages/admin/menu/MenuCategories"));
const FoodManagement = lazy(() => import("../pages/admin/menu/FoodManagement"));
const Dishes = lazy(() => import("../pages/admin/menu/Dishes"));
const Reports = lazy(() => import("../pages/admin/Reports"));
const CustomReports = lazy(() => import("../pages/admin/reports/CustomReports"));
const CustomerInsights = lazy(() => import("../pages/admin/reports/CustomerInsights"));
const InventoryReports = lazy(() => import("../pages/admin/reports/InventoryReports"));
const DishCostList = lazy(() => import("../pages/admin/dish-cost/DishCostList"));
const DishCostForm = lazy(() => import("../pages/admin/dish-cost/DishCostForm"));
import DishProfile from "@/pages/admin/menu/DishProfile";

const authProvider = (element: JSX.Element) => (
  <AuthProvider interface="admin">{element}</AuthProvider>
);

export const adminRoutes = [
  {
    path: "/admin",
    element: authProvider(<Dashboard />),
  },
  {
    path: "/admin/users",
    element: authProvider(<Users />),
  },
  {
    path: "/admin/settings",
    element: authProvider(<Settings />),
  },
  {
    path: "/admin/menu",
    element: authProvider(<MenuCategories />),
  },
  {
    path: "/admin/menu/categories",
    element: authProvider(<MenuCategories />),
  },
  {
    path: "/admin/menu/food",
    element: authProvider(<FoodManagement />),
  },
  {
    path: "/admin/menu/dishes",
    element: authProvider(<Dishes />),
  },
  {
    path: "/admin/menu/dishes/:id",
    element: (
      <AuthProvider interface="admin">
        <DishProfile />
      </AuthProvider>
    ),
  },
  {
    path: "/admin/reports",
    element: authProvider(<Reports />),
  },
  {
    path: "/admin/reports/custom",
    element: authProvider(<CustomReports />),
  },
  {
    path: "/admin/reports/customer-insights",
    element: authProvider(<CustomerInsights />),
  },
  {
    path: "/admin/reports/inventory",
    element: authProvider(<InventoryReports />),
  },
  {
    path: "/admin/dish-cost",
    element: authProvider(<DishCostList />),
  },
  {
    path: "/admin/dish-cost/new",
    element: authProvider(<DishCostForm />),
  },
  {
    path: "/admin/dish-cost/:id",
    element: authProvider(<DishCostForm />),
  },
];
