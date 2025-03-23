
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, LineChart, Activity, Calendar, Users, Download, Filter, ChefHat, Coffee, Clock, FileDown, Sliders, Loader2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart as RechartsLineChart, Line } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { 
  getStaffPerformanceTrends, 
  getAttendanceByDepartment, 
  getTaskCompletionByDepartment, 
  getTopPerformers,
  getPerformanceMetricsByCategory,
  getAttendanceMetrics,
  exportPerformanceData
} from "@/services/staff/performanceService";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";

const Performance = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [timePeriod, setTimePeriod] = useState("month");
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Performance data states
  const [performanceTrends, setPerformanceTrends] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [taskCompletionData, setTaskCompletionData] = useState([]);
  const [topPerformers, setTopPerformers] = useState<any>({});
  const [categoryMetrics, setCategoryMetrics] = useState([]);
  const [attendanceMetrics, setAttendanceMetrics] = useState<any>({});

  const fetchPerformanceData = async () => {
    setLoading(true);
    try {
      const [trends, attendance, tasks, performers, metrics, attnMetrics] = await Promise.all([
        getStaffPerformanceTrends(timePeriod, department),
        getAttendanceByDepartment(timePeriod),
        getTaskCompletionByDepartment(timePeriod),
        getTopPerformers(),
        getPerformanceMetricsByCategory(),
        getAttendanceMetrics()
      ]);
      
      setPerformanceTrends(trends);
      setAttendanceData(attendance);
      setTaskCompletionData(tasks);
      setTopPerformers(performers);
      setCategoryMetrics(metrics);
      setAttendanceMetrics(attnMetrics);
      
    } catch (error) {
      console.error("Error fetching performance data:", error);
      toast({
        title: "Error loading performance data",
        description: "There was a problem fetching staff performance metrics.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformanceData();
  }, [timePeriod, department]);

  const handleRefresh = () => {
    fetchPerformanceData();
  };

  const handleExport = async () => {
    try {
      await exportPerformanceData();
      toast({
        title: "Export successful",
        description: "Performance data has been exported to CSV.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was a problem exporting the performance data.",
        variant: "destructive",
      });
    }
  };

  const handleFilterApply = () => {
    fetchPerformanceData();
    setFiltersOpen(false);
  };

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
              <SelectItem value="Kitchen"><T text="Kitchen" /></SelectItem>
              <SelectItem value="Front of House"><T text="Waiters" /></SelectItem>
              <SelectItem value="Management"><T text="Management" /></SelectItem>
            </SelectContent>
          </Select>
          
          <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                <T text="More Filters" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium"><T text="Additional Filters" /></h4>
                
                <div className="space-y-2">
                  <Label><T text="Date Range" /></Label>
                  <div className="flex gap-2">
                    <DatePicker 
                      placeholder={t("Start date")} 
                      value={startDate}
                      onChange={setStartDate}
                    />
                    <DatePicker 
                      placeholder={t("End date")} 
                      value={endDate}
                      onChange={setEndDate}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label><T text="Metrics" /></Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="attendance" defaultChecked />
                      <label htmlFor="attendance" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        <T text="Attendance" />
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="tasks" defaultChecked />
                      <label htmlFor="tasks" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        <T text="Tasks" />
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="efficiency" defaultChecked />
                      <label htmlFor="efficiency" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        <T text="Efficiency" />
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setFiltersOpen(false)}>
                    <T text="Cancel" />
                  </Button>
                  <Button size="sm" onClick={handleFilterApply}>
                    <T text="Apply" />
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            <T text="Export" />
          </Button>

          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <Loader2 className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <T text="Refresh" />
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
              <p className="text-3xl font-bold text-primary">{attendanceMetrics?.onTimeRate?.percentage || 96}%</p>
              <p className="text-sm text-muted-foreground mt-1">
                <span className={`text-${attendanceMetrics?.onTimeRate?.trend === 'up' ? 'green' : attendanceMetrics?.onTimeRate?.trend === 'down' ? 'red' : 'amber'}-500`}>
                  {attendanceMetrics?.onTimeRate?.trend === 'up' ? '↑' : attendanceMetrics?.onTimeRate?.trend === 'down' ? '↓' : '↔'} 
                </span> 
                <T text="vs last month" />
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
              
              {loading ? (
                <div className="h-80 w-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={performanceTrends}
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
              )}
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 border border-border/70 shadow-none">
                  <h4 className="text-sm font-medium mb-1 text-muted-foreground">
                    <T text="Top Performer" />
                  </h4>
                  <p className="font-semibold">{topPerformers?.topPerformer?.name || "Loading..."}</p>
                  <p className="text-xs text-muted-foreground">
                    <T text={topPerformers?.topPerformer?.department || ""} /> | {topPerformers?.topPerformer?.efficiency || 0}% <T text="Efficiency" />
                  </p>
                </Card>
                
                <Card className="p-4 border border-border/70 shadow-none">
                  <h4 className="text-sm font-medium mb-1 text-muted-foreground">
                    <T text="Most Improved" />
                  </h4>
                  <p className="font-semibold">{topPerformers?.mostImproved?.name || "Loading..."}</p>
                  <p className="text-xs text-muted-foreground">
                    <T text={topPerformers?.mostImproved?.department || ""} /> | +{topPerformers?.mostImproved?.improvement || 0}% <T text="Improvement" />
                  </p>
                </Card>
                
                <Card className="p-4 border border-border/70 shadow-none">
                  <h4 className="text-sm font-medium mb-1 text-muted-foreground">
                    <T text="Needs Attention" />
                  </h4>
                  <p className="font-semibold">{topPerformers?.needsAttention?.name || "Loading..."}</p>
                  <p className="text-xs text-muted-foreground">
                    <T text={topPerformers?.needsAttention?.department || ""} /> | <T text={topPerformers?.needsAttention?.issue || ""} />
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
              
              {loading ? (
                <div className="h-80 w-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
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
              )}
              
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
                  <p className="text-2xl font-bold mt-2">{attendanceMetrics?.workingDays || 0}</p>
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
                    <Badge className="bg-green-500">{attendanceMetrics?.onTimeRate?.percentage || 0}%</Badge>
                  </div>
                  <p className="text-2xl font-bold mt-2">{attendanceMetrics?.onTimeRate?.count || 0}</p>
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
                    <Badge className="bg-amber-500">{attendanceMetrics?.lateArrivals?.percentage || 0}%</Badge>
                  </div>
                  <p className="text-2xl font-bold mt-2">{attendanceMetrics?.lateArrivals?.count || 0}</p>
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
                    <Badge className="bg-red-500">{attendanceMetrics?.absences?.percentage || 0}%</Badge>
                  </div>
                  <p className="text-2xl font-bold mt-2">{attendanceMetrics?.absences?.count || 0}</p>
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
              
              {loading ? (
                <div className="h-80 w-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
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
              )}
              
              <div className="mt-6 space-y-4">
                <h4 className="text-sm font-medium">
                  <T text="Task Completion Rate by Category" />
                </h4>
                
                <div className="space-y-3">
                  {categoryMetrics.map((metric: any, index: number) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm"><T text={metric.category} /></span>
                        <span className="text-sm font-medium">{metric.completion}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                          className="bg-green-500 h-2.5 rounded-full" 
                          style={{ width: `${metric.completion}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
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
