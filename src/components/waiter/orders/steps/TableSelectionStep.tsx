
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Search, Loader2, Table as TableIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Table {
  id: string;
  table_number: number;
  capacity: number;
  status: string;
  room_id?: string;
  location?: string;
  room?: {
    id: string;
    name: string;
  };
}

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
  const [searchQuery, setSearchQuery] = useState('');
  
  // Group tables by room
  const tablesByRoom = tables.reduce((acc: Record<string, Table[]>, table) => {
    const roomName = table.room?.name || 'Unassigned';
    if (!acc[roomName]) {
      acc[roomName] = [];
    }
    acc[roomName].push(table);
    return acc;
  }, {});
  
  const roomNames = Object.keys(tablesByRoom);
  
  const filteredTables = searchQuery
    ? tables.filter(table => 
        table.table_number.toString().includes(searchQuery) || 
        table.capacity.toString().includes(searchQuery))
    : tables;
  
  const renderTableCard = (table: Table) => (
    <Card 
      key={table.id}
      className={`cursor-pointer hover:shadow-md transition-all overflow-hidden ${
        table.status !== 'available' ? 'opacity-50' : ''
      }`}
      onClick={() => table.status === 'available' && onSelectTable(table.id)}
    >
      <CardContent className="p-4">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-2 p-3 rounded-full bg-primary/10">
            <TableIcon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium mb-1">
            <T text="Table" /> {table.table_number}
          </h3>
          <div className="text-sm text-muted-foreground mb-2">
            {table.capacity} <T text="seats" />
          </div>
          <div className={`text-xs rounded-full px-2 py-0.5 ${
            table.status === 'available' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
          }`}>
            {t(table.status)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  if (isLoading) {
    return (
      <div className="space-y-4 mt-6">
        <h2 className="text-xl font-semibold"><T text="Select Table" /></h2>
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-xl font-semibold"><T text="Select Table" /></h2>
      
      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t("Search tables by number or capacity...")}
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {searchQuery ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTables.map(renderTableCard)}
        </div>
      ) : (
        <Tabs defaultValue={roomNames[0] || "all"}>
          <TabsList className="mb-4">
            {roomNames.map(room => (
              <TabsTrigger key={room} value={room}>
                {room}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {roomNames.map(room => (
            <TabsContent key={room} value={room}>
              <ScrollArea className="h-[60vh]">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
                  {tablesByRoom[room]
                    .sort((a, b) => a.table_number - b.table_number)
                    .map(renderTableCard)}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};
