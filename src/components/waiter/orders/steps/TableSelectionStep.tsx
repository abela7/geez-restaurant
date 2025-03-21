
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";

interface Table {
  id: string;
  table_number: number;
  capacity: number;
  status: string;
  location?: string;
  room_id?: string;
}

interface Room {
  id: string;
  name: string;
}

interface TableSelectionStepProps {
  tables: Table[];
  selectedTable: string;
  setSelectedTable: (tableId: string) => void;
  goToNextStep: () => void;
}

export const TableSelectionStep: React.FC<TableSelectionStepProps> = ({
  tables,
  selectedTable,
  setSelectedTable,
  goToNextStep
}) => {
  const { t } = useLanguage();
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [showGuestTableForm, setShowGuestTableForm] = useState(false);
  const [guestTableNumber, setGuestTableNumber] = useState("");
  const [guestCapacity, setGuestCapacity] = useState("2");
  
  // Extract unique rooms from tables
  const rooms: Room[] = React.useMemo(() => {
    const roomMap = new Map<string, Room>();
    
    tables.forEach(table => {
      if (table.room_id && !roomMap.has(table.room_id)) {
        roomMap.set(table.room_id, { 
          id: table.room_id, 
          name: table.location || "Unknown Room" 
        });
      }
    });
    
    return Array.from(roomMap.values());
  }, [tables]);
  
  // Filter available tables by selected room
  const availableTables = React.useMemo(() => {
    return tables.filter(table => {
      const statusMatch = table.status === 'available';
      const roomMatch = selectedRoom === "all" || table.room_id === selectedRoom;
      return statusMatch && roomMatch;
    });
  }, [tables, selectedRoom]);
  
  const handleTableSelect = (tableId: string) => {
    setSelectedTable(tableId);
    // Auto-navigate to the next step after selection
    setTimeout(() => goToNextStep(), 300);
  };
  
  const handleCreateGuestTable = () => {
    // This would typically call an API to create a temporary guest table
    // For now we'll just simulate it by generating a random ID
    const tempId = `guest-${Date.now()}`;
    const tempTable = {
      id: tempId,
      table_number: parseInt(guestTableNumber) || 0,
      capacity: parseInt(guestCapacity) || 2,
      status: 'available',
      location: 'Guest Table',
      isTemporary: true
    };
    
    // In a real implementation, you would add this to your tables state
    // and possibly save it to your backend
    
    // For demo purposes, just select it
    setSelectedTable(tempId);
    setShowGuestTableForm(false);
    
    // Auto-navigate to the next step
    setTimeout(() => goToNextStep(), 300);
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-4">
          <T text="Select Table" />
        </h3>
        
        {/* Room selection */}
        <div className="mb-4">
          <Select value={selectedRoom} onValueChange={setSelectedRoom}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("Select Room")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("All Rooms")}</SelectItem>
              {rooms.map(room => (
                <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Guest table creation button */}
        <Button 
          variant="outline" 
          className="mb-4 w-full"
          onClick={() => setShowGuestTableForm(!showGuestTableForm)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          <T text="Create Guest Table" />
        </Button>
        
        {/* Guest table form */}
        {showGuestTableForm && (
          <div className="border rounded-md p-4 mb-4 space-y-3">
            <h4 className="font-medium"><T text="New Guest Table" /></h4>
            <div>
              <label className="text-sm font-medium mb-1 block">
                <T text="Table Number" />
              </label>
              <Input 
                type="number" 
                value={guestTableNumber}
                onChange={e => setGuestTableNumber(e.target.value)}
                placeholder={t("Enter table number")}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                <T text="Number of Seats" />
              </label>
              <Select value={guestCapacity} onValueChange={setGuestCapacity}>
                <SelectTrigger>
                  <SelectValue placeholder={t("Select capacity")} />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCreateGuestTable} className="w-full">
              <T text="Create and Select" />
            </Button>
          </div>
        )}
        
        {availableTables.length === 0 && !showGuestTableForm ? (
          <div className="p-4 text-center text-muted-foreground border border-dashed rounded-md">
            <T text="No available tables in this room" />
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
                    onClick={() => handleTableSelect(table.id)}
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
