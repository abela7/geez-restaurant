
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { FileDown, Check } from "lucide-react";

interface InventoryExportProps {
  onExport: (format: string, includeTransactions?: boolean) => void;
  isLoading?: boolean;
}

export const InventoryExport: React.FC<InventoryExportProps> = ({
  onExport,
  isLoading = false
}) => {
  const { t } = useLanguage();
  const [exportFormat, setExportFormat] = useState("csv");
  const [includeTransactions, setIncludeTransactions] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExported, setIsExported] = useState(false);

  const handleExport = () => {
    onExport(exportFormat, includeTransactions);
    setIsExported(true);
    
    // Reset after a delay
    setTimeout(() => {
      setIsExported(false);
      setIsDialogOpen(false);
    }, 1500);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileDown className="mr-2 h-4 w-4" />
          <T text="Export" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle><T text="Export Inventory Data" /></DialogTitle>
          <DialogDescription>
            <T text="Choose your export options below." />
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="format"><T text="Export Format" /></Label>
            <Select
              value={exportFormat}
              onValueChange={setExportFormat}
            >
              <SelectTrigger id="format">
                <SelectValue placeholder={t("Select format")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="transactions"
              checked={includeTransactions}
              onCheckedChange={(checked) => setIncludeTransactions(checked as boolean)}
            />
            <Label htmlFor="transactions">
              <T text="Include transaction history" />
            </Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            onClick={handleExport}
            disabled={isLoading || isExported}
          >
            {isExported ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                <T text="Exported!" />
              </>
            ) : isLoading ? (
              <T text="Exporting..." />
            ) : (
              <>
                <FileDown className="mr-2 h-4 w-4" />
                <T text="Export Data" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
