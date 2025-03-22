
import React from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Loader2 } from 'lucide-react';
import { Table } from '@/services/table/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TableSelectionStepProps {
  tables: Table[];
  isLoading: boolean;
  onSelectTable: (tableId: string) => void;
}

export const TableSelectionStep: React.FC<TableSelectionStepProps> = ({ 
  tables, 
  isLoading, 
  onSelectTable 
}) => {
  const { t } = useLanguage();
  
  return (
    <Card className="mb-4 mt-4">
      <CardHeader>
        <CardTitle><T text="Select Table" /></CardTitle>
        <CardDescription><T text="Choose an available table for the dine-in order." /></CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : tables.length > 0 ? (
          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {tables.map(table => (
                <Button 
                  key={table.id} 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => onSelectTable(table.id)}
                >
                  <span className="font-medium text-lg">Table {table.table_number}</span>
                  <span className="text-sm text-muted-foreground">{table.capacity} seats</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="p-8 text-center border border-dashed rounded-md">
            <p className="text-muted-foreground"><T text="No tables available at the moment." /></p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
