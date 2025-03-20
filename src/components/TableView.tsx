
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table as TableType, TableWithDetails } from "@/services/table/types";
import { getTablesWithDetails } from "@/services/table/tableDetailsService";
import TableStat from "@/components/tables/TableStat";
import { getTableStats } from "@/services/table/tableStatsService";
import TableGrid from "@/components/tables/TableGrid";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, T } from "@/contexts/LanguageContext";

const TableView = () => {
  const [tables, setTables] = useState<TableWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    occupied: 0,
    reserved: 0,
    cleaning: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch tables with details
        const tableData = await getTablesWithDetails();
        setTables(tableData);
        
        // Fetch summary stats
        const tableStats = await getTableStats();
        setStats(tableStats);
      } catch (error) {
        console.error("Error fetching table data:", error);
        toast({
          title: t("Error"),
          description: t("Failed to load tables. Please try again."),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [toast, t]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        <TableStat title={t("Total")} value={stats.total} />
        <TableStat title={t("Available")} value={stats.available} color="green" />
        <TableStat title={t("Occupied")} value={stats.occupied} color="red" />
        <TableStat title={t("Reserved")} value={stats.reserved} color="blue" />
        <TableStat title={t("Cleaning")} value={stats.cleaning} color="yellow" />
      </div>
      
      <Card>
        <CardContent className="pt-6">
          {tables.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <LayoutGrid className="h-12 w-12 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium mb-1"><T text="No Tables Found" /></h3>
              <p className="text-muted-foreground">
                <T text="You haven't added any tables yet. Create tables in the Table Management section." />
              </p>
            </div>
          ) : (
            <TableGrid tables={tables} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TableView;
