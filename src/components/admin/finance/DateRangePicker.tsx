
import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

interface DateRangePickerProps {
  onDateRangeChange: (range: DateRange | undefined) => void;
  className?: string;
}

export function DateRangePicker({ onDateRangeChange, className }: DateRangePickerProps) {
  const { t } = useLanguage();
  const [date, setDate] = useState<DateRange | undefined>();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selectedDate: DateRange) => {
    setDate(selectedDate);
    
    // Only apply when both dates are selected
    if (selectedDate.from && selectedDate.to) {
      onDateRangeChange(selectedDate);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setDate(undefined);
    onDateRangeChange(undefined);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal", 
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <T text="Select date range" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-2 border-b">
          <div className="flex justify-between items-center">
            <h4 className="font-medium"><T text="Date Range" /></h4>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <T text="Clear" />
            </Button>
          </div>
        </div>
        <Calendar
          mode="range"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
}
