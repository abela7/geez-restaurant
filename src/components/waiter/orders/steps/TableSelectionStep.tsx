
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { cn } from '@/lib/utils';

interface Table {
  id: string;
  table_number: number;
  capacity: number;
  status: string;
  location?: string;
}

interface TableSelectionStepProps {
  tables: Table[];
  selectedTable: string;
  setSelectedTable: (tableId: string) => void;
}

export const TableSelectionStep: React.FC<TableSelectionStepProps> = ({
  tables,
  selectedTable,
  setSelectedTable
}) => {
  const { t } = useLanguage();
  
  const availableTables = tables.filter(table => table.status === 'available');
  
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-4">
          <T text="Select Table" />
        </h3>
        
        {availableTables.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground border border-dashed rounded-md">
            <T text="No available tables" />
          </div>
        ) : (
          <ScrollArea className="h-[320px]">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {availableTables
                .sort((a, b) => a.table_number - b.table_number)
                .map((table) => (
                  <div
                    key={table.id}
                    className={cn(
                      "border rounded-md p-3 cursor-pointer hover:bg-accent/10 transition-colors",
                      selectedTable === table.id && "border-primary bg-primary/10"
                    )}
                    onClick={() => setSelectedTable(table.id)}
                  >
                    <div className="text-center">
                      <h4 className="font-medium text-lg">Table {table.table_number}</h4>
                      <Badge variant="outline">{table.capacity} seats</Badge>
                      {table.location && (
                        <p className="text-xs text-muted-foreground mt-1">{table.location}</p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
