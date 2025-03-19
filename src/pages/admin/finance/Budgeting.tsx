
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Import refactored components
import BudgetingHeader from "@/components/admin/finance/BudgetingHeader";
import BudgetSummary from "@/components/admin/finance/BudgetSummary";
import BudgetOverview from "@/components/admin/finance/BudgetOverview";
import ExpensesBudget from "@/components/admin/finance/ExpensesBudget";
import RevenueBudget from "@/components/admin/finance/RevenueBudget";
import ForecastChart from "@/components/admin/finance/ForecastChart";
import ForecastDetails from "@/components/admin/finance/ForecastDetails";
import ForecastParameters from "@/components/admin/finance/ForecastParameters";

const Budgeting = () => {
  const [editingMode, setEditingMode] = useState(false);
  const { currentLanguage } = useLanguage();

  const toggleEditMode = () => {
    setEditingMode(!editingMode);
  };

  return (
    <Layout interface="admin">
      <div className="container mx-auto p-4 md:p-6">
        <BudgetingHeader editingMode={editingMode} toggleEditMode={toggleEditMode} />
        <BudgetSummary />

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="mb-4">
            <TabsTrigger value="overview"><T text="Overview" /></TabsTrigger>
            <TabsTrigger value="expenses"><T text="Expenses" /></TabsTrigger>
            <TabsTrigger value="revenue"><T text="Revenue" /></TabsTrigger>
            <TabsTrigger value="forecast"><T text="Forecasting" /></TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <BudgetOverview />
          </TabsContent>
          
          <TabsContent value="expenses">
            <ExpensesBudget editingMode={editingMode} />
          </TabsContent>
          
          <TabsContent value="revenue">
            <RevenueBudget editingMode={editingMode} />
          </TabsContent>
          
          <TabsContent value="forecast">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ForecastChart />
              <ForecastDetails />
            </div>
            <ForecastParameters />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Budgeting;
