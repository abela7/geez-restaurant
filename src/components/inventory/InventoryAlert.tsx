
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

interface InventoryAlertProps {
  count: number;
}

const InventoryAlert: React.FC<InventoryAlertProps> = ({ count }) => {
  if (count === 0) return null;
  
  return (
    <Alert variant="destructive" className="mb-4 bg-destructive/10 border-destructive/50 text-destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <T text={`There are ${count} ingredients that need attention`} />
      </AlertDescription>
    </Alert>
  );
};

export default InventoryAlert;
