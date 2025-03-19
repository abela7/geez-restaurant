
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Save, Edit2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

interface BudgetingHeaderProps {
  editingMode: boolean;
  toggleEditMode: () => void;
}

const BudgetingHeader: React.FC<BudgetingHeaderProps> = ({
  editingMode,
  toggleEditMode
}) => {
  return (
    <PageHeader 
      title="Budgeting & Forecasting" 
      description="Manage restaurant budget, track expenses and forecast revenue"
      actions={
        <>
          <Select defaultValue="august">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="january"><T text="January 2023" /></SelectItem>
              <SelectItem value="february"><T text="February 2023" /></SelectItem>
              <SelectItem value="march"><T text="March 2023" /></SelectItem>
              <SelectItem value="april"><T text="April 2023" /></SelectItem>
              <SelectItem value="may"><T text="May 2023" /></SelectItem>
              <SelectItem value="june"><T text="June 2023" /></SelectItem>
              <SelectItem value="july"><T text="July 2023" /></SelectItem>
              <SelectItem value="august"><T text="August 2023" /></SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            <T text="Export" />
          </Button>
          <Button size="sm" onClick={toggleEditMode}>
            {editingMode ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                <T text="Save Changes" />
              </>
            ) : (
              <>
                <Edit2 className="mr-2 h-4 w-4" />
                <T text="Edit Budget" />
              </>
            )}
          </Button>
        </>
      }
    />
  );
};

export default BudgetingHeader;
