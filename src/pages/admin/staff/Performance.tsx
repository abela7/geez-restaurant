import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, LineChart, Activity, Calendar, Users } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

const Performance = () => {
  const { t } = useLanguage();

  return (
    <>
      <PageHeader 
        heading={<T text="Staff Performance" />}
        description={<T text="Track and manage staff performance metrics" />}
        actions={
          <Button>
            <T text="Export Report" />
          </Button>
        }
      />

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">
            <Activity className="mr-2 h-4 w-4" />
            <T text="Overview" />
          </TabsTrigger>
          <TabsTrigger value="attendance">
            <Calendar className="mr-2 h-4 w-4" />
            <T text="Attendance" />
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <Users className="mr-2 h-4 w-4" />
            <T text="Tasks" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg font-medium">
                <Activity className="mr-2 h-5 w-5" />
                <T text="Performance Metrics" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <Card className="p-4">
                  <BarChart className="h-10 w-10 mx-auto mb-2 text-primary" />
                  <h3 className="text-lg font-medium mb-1"><T text="Attendance Rate" /></h3>
                  <p className="text-3xl font-bold text-primary">96%</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <T text="Last 30 days" />
                  </p>
                </Card>
                
                <Card className="p-4">
                  <LineChart className="h-10 w-10 mx-auto mb-2 text-primary" />
                  <h3 className="text-lg font-medium mb-1"><T text="Task Completion" /></h3>
                  <p className="text-3xl font-bold text-primary">92%</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <T text="Last 30 days" />
                  </p>
                </Card>
              </div>
              
              <div className="mt-4 text-center p-4 border rounded-md border-dashed">
                <p className="text-muted-foreground">
                  <T text="More detailed performance metrics will be available soon." />
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle><T text="Attendance Records" /></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                <T text="Attendance records will be displayed here." />
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle><T text="Task Performance" /></CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                <T text="Task performance metrics will be displayed here." />
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Performance;
