
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, LineChart, Activity, Calendar, Users, Download, Filter, ChefHat, Coffee, Clock } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart as RechartsLineChart, Line } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Fake data for demonstration
const staffPerformanceData = [
  { name: 'Jan', attendance: 98, tasks: 92, efficiency: 85 },
  { name: 'Feb', attendance: 96, tasks: 88, efficiency: 82 },
  { name: 'Mar', attendance: 99, tasks: 95, efficiency: 90 },
  { name: 'Apr', attendance: 97, tasks: 90, efficiency: 86 },
  { name: 'May', attendance: 95, tasks: 87, efficiency: 81 },
  { name: 'Jun', attendance: 98, tasks: 93, efficiency: 89 },
];

const attendanceData = [
  { name: 'Kitchen', onTime: 28, late: 2, absent: 1 },
  { name: 'Waiters', onTime: 32, late: 5, absent: 0 },
  { name: 'Management', onTime: 12, late: 1, absent: 0 },
];

const taskCompletionData = [
  { name: 'Kitchen', completed: 156, pending: 12, late: 8 },
  { name: 'Waiters', completed: 142, pending: 15, late: 10 },
  { name: 'Management', completed: 78, pending: 5, late: 3 },
];

const Performance = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [timePeriod, setTimePeriod] = useState("month");
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState("all");

  const fetchPerformanceData = () => {
    setLoading(true);
    // In a real implementation, this would fetch actual data from the database
    // For now, we're just simulating the loading state
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchPerformanceData();
  }, [timePeriod, department]);

  return (
    <div className="space-y-4">
      {/* Top controls and filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-card p-3 rounded-lg border border-border shadow-sm">
        <div className="flex items-center">
          <h1 className="text-xl font-bold mr-2"><T text="Staff Performance" /></h1>
          <Badge className="bg-primary">{loading ? <T text="Loading..." /> : <T text="Live" />}</Badge>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week"><T text="This Week" /></SelectItem>
              <SelectItem value="month"><T text="This Month" /></SelectItem>
              <SelectItem value="quarter"><T text="This Quarter" /></SelectItem>
              <SelectItem value="year"><T text="This Year" /></SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"><T text="All Staff" /></SelectItem>
              <SelectItem value="kitchen"><T text="Kitchen" /></SelectItem>
              <SelectItem value="waiters"><T text="Waiters" /></SelectItem>
              <SelectItem value="management"><T text="Management" /></SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            <T text="More Filters" />
          </Button>
          
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            <T text="Export" />
          </Button>
        </div>
      </div>

      {/* Key metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <ChefHat className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-1"><T text="Kitchen Efficiency" /></h3>
              <p className="text-3xl font-bold text-primary">87%</p>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="text-green-500">↑ 3%</span> <T text="vs last month" />
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <Coffee className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-1"><T text="Server Performance" /></h3>
              <p className="text-3xl font-bold text-primary">92%</p>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="text-green-500">↑ 2%</span> <T text="vs last month" />
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-3">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-1"><T text="Overall Attendance" /></h3>
              <p className="text-3xl font-bold text-primary">96%</p>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="text-amber-500">↔ 0%</span> <T text="vs last month" />
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-3 sm:flex sm:w-auto">
          <TabsTrigger value="overview">
            <Activity className="mr-2 h-4 w-4 hidden sm:inline-block" />
            <T text="Overview" />
          </TabsTrigger>
          <TabsTrigger value="attendance">
            <Calendar className="mr-2 h-4 w-4 hidden sm:inline-block" />
            <T text="Attendance" />
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <Users className="mr-2 h-4 w-4 hidden sm:inline-block" />
            <T text="Tasks" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg font-medium mb-4">
                <T text="Performance Trends" />
              </h3>
              
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={staffPerformanceData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="attendance"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      name={t("Attendance")}
                    />
                    <Line
                      type="monotone"
                      dataKey="tasks"
                      stroke="#82ca9d"
                      name={t("Task Completion")}
                    />
                    <Line
                      type="monotone"
                      dataKey="efficiency"
                      stroke="#ffc658"
                      name={t("Efficiency")}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 border border-border/70 shadow-none">
                  <h4 className="text-sm font-medium mb-1 text-muted-foreground">
                    <T text="Top Performer" />
                  </h4>
                  <p className="font-semibold">Aida Mekonnen</p>
                  <p className="text-xs text-muted-foreground">
                    <T text="Kitchen Staff | 97% Efficiency" />
                  </p>
                </Card>
                
                <Card className="p-4 border border-border/70 shadow-none">
                  <h4 className="text-sm font-medium mb-1 text-muted-foreground">
                    <T text="Most Improved" />
                  </h4>
                  <p className="font-semibold">Dawit Hagos</p>
                  <p className="text-xs text-muted-foreground">
                    <T text="Waiter | +12% Improvement" />
                  </p>
                </Card>
                
                <Card className="p-4 border border-border/70 shadow-none">
                  <h4 className="text-sm font-medium mb-1 text-muted-foreground">
                    <T text="Needs Attention" />
                  </h4>
                  <p className="font-semibold">Selam Tesfaye</p>
                  <p className="text-xs text-muted-foreground">
                    <T text="Server | 3 Late Arrivals" />
                  </p>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg font-medium mb-4">
                <T text="Attendance by Department" />
              </h3>
              
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={attendanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="onTime" stackId="a" fill="#82ca9d" name={t("On Time")} />
                    <Bar dataKey="late" stackId="a" fill="#ffc658" name={t("Late")} />
                    <Bar dataKey="absent" stackId="a" fill="#ff8042" name={t("Absent")} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 border border-border/70 shadow-none">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      <T text="Working Days" />
                    </h4>
                    <Badge variant="outline">
                      <T text="This Month" />
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold mt-2">22</p>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <span className="text-green-500 mr-1">↑</span>
                    <T text="2 days more than last month" />
                  </div>
                </Card>
                
                <Card className="p-4 border border-border/70 shadow-none">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      <T text="On Time Rate" />
                    </h4>
                    <Badge className="bg-green-500">96%</Badge>
                  </div>
                  <p className="text-2xl font-bold mt-2">72</p>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <span className="text-green-500 mr-1">↑</span>
                    <T text="2% better than target" />
                  </div>
                </Card>
                
                <Card className="p-4 border border-border/70 shadow-none">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      <T text="Late Arrivals" />
                    </h4>
                    <Badge className="bg-amber-500">3.5%</Badge>
                  </div>
                  <p className="text-2xl font-bold mt-2">8</p>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <span className="text-amber-500 mr-1">↔</span>
                    <T text="Same as last month" />
                  </div>
                </Card>
                
                <Card className="p-4 border border-border/70 shadow-none">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      <T text="Absences" />
                    </h4>
                    <Badge className="bg-red-500">0.5%</Badge>
                  </div>
                  <p className="text-2xl font-bold mt-2">1</p>
                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                    <span className="text-green-500 mr-1">↓</span>
                    <T text="2 less than last month" />
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg font-medium mb-4">
                <T text="Task Performance by Department" />
              </h3>
              
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={taskCompletionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" fill="#82ca9d" name={t("Completed")} />
                    <Bar dataKey="pending" fill="#8884d8" name={t("Pending")} />
                    <Bar dataKey="late" fill="#ff8042" name={t("Late")} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 space-y-4">
                <h4 className="text-sm font-medium">
                  <T text="Task Completion Rate by Category" />
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm"><T text="Food Preparation" /></span>
                      <span className="text-sm font-medium">95%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm"><T text="Cleaning Tasks" /></span>
                      <span className="text-sm font-medium">88%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm"><T text="Inventory Management" /></span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm"><T text="Customer Service" /></span>
                      <span className="text-sm font-medium">97%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '97%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Performance;
