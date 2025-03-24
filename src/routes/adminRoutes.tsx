import React from "react";
import { RouteObject } from "react-router-dom";
import Dashboard from "@/pages/admin/Dashboard";
import Orders from "@/pages/admin/Orders";
import Tables from "@/pages/admin/Tables";
import Staff from "@/pages/admin/Staff";
import Customers from "@/pages/admin/Customers";
import Inventory from "@/pages/admin/Inventory";
import Finance from "@/pages/admin/Finance";
import MenuManagement from "@/pages/admin/MenuManagement";
import FoodManagement from "@/pages/admin/menu/FoodManagement";
import Categories from "@/pages/admin/Categories";
import RecipeManagement from "@/pages/admin/menu/RecipeManagement";
import Modifiers from "@/pages/admin/Modifiers";
import Pricing from "@/pages/admin/Pricing";
import MenuDesign from "@/pages/admin/MenuDesign";
import Dishes from "@/pages/admin/Dishes";
import Expenses from "@/pages/admin/finance/Expenses";
import Ingredients from "@/pages/admin/inventory/Ingredients";
import Recipes from "@/pages/admin/inventory/Recipes";
import UnitManagement from "@/pages/admin/menu/UnitManagement";
import IngredientManagement from "@/pages/admin/menu/IngredientManagement";
import RecipeCostCalculator from "@/pages/admin/menu/RecipeCostCalculator";

const adminRoutes = [
  {
    path: "/admin",
    element: <Dashboard />,
  },
  {
    path: "/admin/orders",
    element: <Orders />,
  },
  {
    path: "/admin/tables",
    element: <Tables />,
  },
  {
    path: "/admin/staff",
    element: <Staff />,
  },
  {
    path: "/admin/customers",
    element: <Customers />,
  },
  {
    path: "/admin/inventory",
    element: <Inventory />,
  },
  {
    path: "/admin/finance",
    element: <Finance />,
  },
  {
    path: "/admin/finance/expenses",
    element: <Expenses />,
  },
  {
    path: "/admin/inventory/ingredients",
    element: <Ingredients />,
  },
  {
    path: "/admin/inventory/recipes",
    element: <Recipes />,
  },
  
  // Menu Management Routes
  {
    path: "/admin/menu",
    element: <MenuManagement />,
  },
  {
    path: "/admin/menu/food",
    element: <FoodManagement />,
  },
  {
    path: "/admin/menu/categories",
    element: <Categories />,
  },
  {
    path: "/admin/menu/recipes",
    element: <RecipeManagement />,
  },
  {
    path: "/admin/menu/modifiers",
    element: <Modifiers />,
  },
  {
    path: "/admin/menu/pricing",
    element: <Pricing />,
  },
  {
    path: "/admin/menu/design",
    element: <MenuDesign />,
  },
  {
    path: "/admin/menu/dishes",
    element: <Dishes />,
  },
  // Add the new routes for unit and ingredient management
  {
    path: "/admin/menu/units",
    element: <UnitManagement />,
  },
  {
    path: "/admin/menu/ingredients",
    element: <IngredientManagement />,
  },
  {
    path: "/admin/menu/recipe-costs",
    element: <RecipeCostCalculator />,
  },
  
  // Add more routes here
];

export default adminRoutes;
