
import React from "react";
import { Button } from "@/components/ui/button";
import { List, Grid } from "lucide-react";

interface PayrollViewToggleProps {
  viewMode: "list" | "grid";
  onViewChange: (mode: "list" | "grid") => void;
}

const PayrollViewToggle: React.FC<PayrollViewToggleProps> = ({ viewMode, onViewChange }) => {
  return (
    <div className="flex items-center border rounded-md p-1 h-9">
      <Button 
        variant={viewMode === "list" ? "default" : "ghost"} 
        size="sm" 
        className="h-7 w-7 p-0" 
        onClick={() => onViewChange("list")}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button 
        variant={viewMode === "grid" ? "default" : "ghost"} 
        size="sm" 
        className="h-7 w-7 p-0" 
        onClick={() => onViewChange("grid")}
      >
        <Grid className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PayrollViewToggle;
