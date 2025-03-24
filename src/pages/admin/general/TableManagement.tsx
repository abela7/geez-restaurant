
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { LayoutGrid, MapPin, Grid } from "lucide-react";

// Import table management components
import TablesView from "@/components/tables/TablesView";
import RoomsView from "@/components/tables/RoomsView";
import TableGroupsView from "@/components/tables/TableGroupsView";

const TableManagement = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("tables");

  return (
    <Layout interface="admin">
      <PageHeader
        heading={<T text="Table Management" />}
        description={<T text="Manage restaurant tables, rooms and seating arrangements" />}
        icon={<LayoutGrid className="h-6 w-6" />}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tables" data-testid="tables-tab">
            <Grid className="h-4 w-4 mr-2" />
            <T text="Tables" />
          </TabsTrigger>
          <TabsTrigger value="rooms" data-testid="rooms-tab">
            <MapPin className="h-4 w-4 mr-2" />
            <T text="Rooms" />
          </TabsTrigger>
          <TabsTrigger value="groups" data-testid="groups-tab">
            <LayoutGrid className="h-4 w-4 mr-2" />
            <T text="Table Groups" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tables">
          <TablesView />
        </TabsContent>

        <TabsContent value="rooms">
          <RoomsView />
        </TabsContent>

        <TabsContent value="groups">
          <TableGroupsView />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default TableManagement;
