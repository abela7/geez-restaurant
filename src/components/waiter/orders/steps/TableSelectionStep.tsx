
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Table as TableType } from "@/services/table/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Utensils, Grid, LayoutGrid, Table as TableIcon, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import FloorPlanView from "@/components/tables/FloorPlanView";

interface TableSelectionStepProps {
  tables: TableType[];
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
  const [viewMode, setViewMode] = useState<'grid' | 'floor'>('grid');
  
  const filteredTables = tables.filter(table => 
    table.table_number.toString().includes(searchQuery) ||
    (table.location && table.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/10 text-green-700 border-green-500 dark:text-green-300';
      case 'occupied':
        return 'bg-red-500/10 text-red-700 border-red-500 dark:text-red-300';
      case 'reserved':
        return 'bg-blue-500/10 text-blue-700 border-blue-500 dark:text-blue-300';
      case 'cleaning':
        return 'bg-purple-500/10 text-purple-700 border-purple-500 dark:text-purple-300';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500 dark:text-gray-300';
    }
  };

  const groupTablesByRoom = () => {
    const grouped: { [roomId: string]: TableType[] } = {};
    
    filteredTables.forEach(table => {
      const roomId = table.room?.id || 'no-room';
      if (!grouped[roomId]) {
        grouped[roomId] = [];
      }
      grouped[roomId].push(table);
    });
    
    return grouped;
  };
  
  const groupedTables = groupTablesByRoom();
  
  if (isLoading) {
    return (
      <div className="py-8 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 mt-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center">
          <TableIcon className="h-5 w-5 mr-2" />
          <T text="Select a Table" />
        </h2>
        
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            onClick={() => setViewMode('grid')}
            className="h-8"
          >
            <LayoutGrid className="h-4 w-4 mr-1" />
            <T text="Grid" />
          </Button>
          <Button 
            size="sm" 
            variant={viewMode === 'floor' ? 'default' : 'outline'} 
            onClick={() => setViewMode('floor')}
            className="h-8"
          >
            <MapPin className="h-4 w-4 mr-1" />
            <T text="Floor Plan" />
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t("Search tables...")}
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {viewMode === 'grid' ? (
        <ScrollArea className="h-[calc(100vh-320px)]">
          {Object.entries(groupedTables).map(([roomId, roomTables]) => (
            <div key={roomId} className="mb-6">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                {roomId === 'no-room' 
                  ? t('Ungrouped Tables') 
                  : t(roomTables[0]?.room?.name || 'Room')}
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                {roomTables.map(table => (
                  <Card 
                    key={table.id}
                    className={`cursor-pointer hover:shadow-md transition-all ${
                      table.status !== 'available' ? 'opacity-50' : ''
                    }`}
                    onClick={() => table.status === 'available' && onSelectTable(table.id)}
                  >
                    <CardContent className="p-3 text-center">
                      <div className="text-2xl font-bold">{table.table_number}</div>
                      <div className="text-xs text-muted-foreground mb-1">
                        <T text="Capacity" />: {table.capacity}
                      </div>
                      <Badge className={`${getStatusColor(table.status)} text-xs`}>
                        {t(table.status)}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </ScrollArea>
      ) : (
        <div className="h-[calc(100vh-320px)]">
          <FloorPlanView />
        </div>
      )}
    </div>
  );
};
