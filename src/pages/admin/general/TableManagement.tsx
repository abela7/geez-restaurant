
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { LayoutGrid, MapPin, Grid, Map } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InformationCircle } from "lucide-react";

// Import table management components
import TablesView from "@/components/tables/TablesView";
import RoomsView from "@/components/tables/RoomsView";
import TableGroupsView from "@/components/tables/TableGroupsView";
import FloorPlanView from "@/components/tables/FloorPlanView";

const TableManagement = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("floor-plan");

  return (
    <div className="space-y-6">
      <PageHeader
        heading={<T text="Table Management" />}
        description={<T text="Manage restaurant tables, rooms and seating arrangements" />}
        icon={<LayoutGrid className="h-6 w-6" />}
      />

      <Alert>
        <InformationCircle className="h-4 w-4" />
        <AlertTitle><T text="How to use the table management" /></AlertTitle>
        <AlertDescription>
          <T text="Start by creating rooms, then add tables to those rooms. Use the floor plan view to arrange tables visually by dragging them to their positions. Don't forget to save your changes!" />
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="floor-plan" data-testid="floor-plan-tab">
            <Map className="h-4 w-4 mr-2" />
            <T text="Floor Plan" />
          </TabsTrigger>
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

        <TabsContent value="floor-plan" className="h-[calc(100vh-320px)]">
          <FloorPlanView />
        </TabsContent>

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
    </div>
  );
};

export default TableManagement;
