
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface TableStatProps {
  title: string;
  value: number;
  color?: "default" | "green" | "red" | "blue" | "yellow";
}

const TableStat = ({ title, value, color = "default" }: TableStatProps) => {
  const { t } = useLanguage();
  
  const getColorClass = () => {
    switch (color) {
      case "green": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "red": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "blue": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "yellow": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Card className={`${getColorClass()} border-0`}>
      <CardContent className="p-4 flex flex-col items-center justify-center text-center">
        <p className="text-sm font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
};

export default TableStat;
