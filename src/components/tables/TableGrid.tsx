
import React from "react";
import { TableWithDetails } from "@/services/table/types";
import { Badge } from "@/components/ui/badge";
import { useLanguage, T } from "@/contexts/LanguageContext";

interface TableGridProps {
  tables: TableWithDetails[];
}

const TableGrid = ({ tables }: TableGridProps) => {
  const { t } = useLanguage();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "occupied": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "reserved": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "cleaning": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {tables.map((table) => (
        <div 
          key={table.id}
          className={`border rounded-lg p-4 flex flex-col ${getStatusColor(table.status)}`}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg">
              <T text="Table" /> {table.table_number}
            </h3>
            <Badge variant="outline">{table.capacity} <T text="seats" /></Badge>
          </div>
          
          <div className="text-sm space-y-1 mt-auto">
            {table.status === "occupied" && table.currentGuests && (
              <p><T text="Guests" />: {table.currentGuests}</p>
            )}
            {table.status === "occupied" && table.occupiedSince && (
              <p><T text="Since" />: {new Date(table.occupiedSince).toLocaleTimeString()}</p>
            )}
            {table.status === "occupied" && table.server && (
              <p><T text="Server" />: {table.server}</p>
            )}
            {table.status === "reserved" && table.reservedFor && (
              <p><T text="Reserved for" />: {table.reservedFor}</p>
            )}
            {table.status === "reserved" && table.reservationTime && (
              <p><T text="Time" />: {new Date(table.reservationTime).toLocaleTimeString()}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableGrid;
