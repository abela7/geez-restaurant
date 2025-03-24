
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Filter, X, Check, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface PayrollFilterOptions {
  period?: string;
  status?: string;
  staffName?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

interface PayrollFilterProps {
  onFilter: (filters: PayrollFilterOptions) => void;
  onReset: () => void;
}

const PayrollFilter: React.FC<PayrollFilterProps> = ({ onFilter, onReset }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<PayrollFilterOptions>({});
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  const handleApplyFilters = () => {
    onFilter({
      ...filters,
      dateFrom,
      dateTo
    });
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({});
    setDateFrom(undefined);
    setDateTo(undefined);
    onReset();
    setIsOpen(false);
  };

  const updateFilter = (key: keyof PayrollFilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-9">
          <Filter className="mr-2 h-4 w-4" />
          <T text="Filter" />
          {Object.keys(filters).length > 0 && (
            <span className="ml-1 rounded-full bg-primary w-5 h-5 text-[10px] flex items-center justify-center text-primary-foreground">
              {Object.keys(filters).length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <h3 className="font-medium text-sm"><T text="Filter Payroll Records" /></h3>
          
          <div>
            <Label htmlFor="period"><T text="Pay Period" /></Label>
            <Input
              id="period"
              value={filters.period || ""}
              onChange={(e) => updateFilter("period", e.target.value)}
              placeholder={t("Search by period")}
              className="h-8 mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="status"><T text="Payment Status" /></Label>
            <Select 
              value={filters.status || "all"}  // Changed default value to "all" instead of ""
              onValueChange={(value) => updateFilter("status", value)}
            >
              <SelectTrigger id="status" className="h-8 mt-1">
                <SelectValue placeholder={t("All statuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all"><T text="All statuses" /></SelectItem>
                <SelectItem value="Paid"><T text="Paid" /></SelectItem>
                <SelectItem value="Pending"><T text="Pending" /></SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="staffName"><T text="Staff Name" /></Label>
            <Input
              id="staffName"
              value={filters.staffName || ""}
              onChange={(e) => updateFilter("staffName", e.target.value)}
              placeholder={t("Search by name")}
              className="h-8 mt-1"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label><T text="From Date" /></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal h-8 mt-1",
                      !dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                    {dateFrom ? format(dateFrom, "PPP") : <span>{t("Pick a date")}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label><T text="To Date" /></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal h-8 mt-1",
                      !dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                    {dateTo ? format(dateTo, "PPP") : <span>{t("Pick a date")}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleResetFilters}
            >
              <X className="mr-2 h-3.5 w-3.5" />
              <T text="Reset" />
            </Button>
            <Button 
              size="sm"
              onClick={handleApplyFilters}
            >
              <Check className="mr-2 h-3.5 w-3.5" />
              <T text="Apply Filters" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PayrollFilter;
