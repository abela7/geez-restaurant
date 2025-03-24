
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

interface EmptyStateProps {
  onAddExpense: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddExpense }) => {
  return (
    <Card className="bg-muted/40">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">
          <T text="No Expenses Found" />
        </h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          <T text="You haven't added any ingredient expenses yet. Tracking ingredient expenses helps calculate accurate recipe costs." />
        </p>
        <Button onClick={onAddExpense}>
          <Plus className="h-4 w-4 mr-2" />
          <T text="Add Your First Expense" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
