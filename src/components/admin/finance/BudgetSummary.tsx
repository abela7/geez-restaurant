
import React from "react";
import { StatCard } from "@/components/ui/card-stat";
import { Calculator, TrendingUp, TrendingDown, PieChart } from "lucide-react";

const BudgetSummary: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Monthly Budget"
        value="$19,000"
        icon={<Calculator className="h-5 w-5 text-amber-600" />}
        className="p-4"
      />
      
      <StatCard
        title="MTD Revenue"
        value="$4,500"
        trendText="24% of budget"
        positive={true}
        icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
        className="p-4"
      />
      
      <StatCard
        title="MTD Expenses"
        value="$3,100"
        trendText="22% of budget"
        positive={false}
        icon={<TrendingDown className="h-5 w-5 text-red-600" />}
        className="p-4"
      />
      
      <StatCard
        title="MTD Profit"
        value="$1,400"
        trendText="29% of budget"
        positive={true}
        icon={<PieChart className="h-5 w-5 text-green-600" />}
        className="p-4"
      />
    </div>
  );
};

export default BudgetSummary;
