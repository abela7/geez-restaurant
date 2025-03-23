
import React from "react";
import { T } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, PieChart, LineChart } from "recharts";
import { BarChartIcon, ChefHat, Clock, Users, Check, ShoppingCart } from "lucide-react";
import { StaffMember } from "@/hooks/useStaffMembers";

interface PerformanceMetricsProps {
  staff: StaffMember;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ staff }) => {
  // Sample data for charts - in real app would use actual data from database
  const attendanceData = [
    { name: 'Jan', value: 97 },
    { name: 'Feb', value: 95 },
    { name: 'Mar', value: 98 },
    { name: 'Apr', value: 96 },
    { name: 'May', value: 99 },
    { name: 'Jun', value: 97 },
  ];

  const taskCompletionData = [
    { name: 'Completed', value: staff.completed_tasks || 0 },
    { name: 'Pending', value: staff.pending_tasks || 0 },
  ];

  // Metrics to display based on department/role
  const getMetrics = () => {
    if (staff.department === 'Kitchen') {
      return [
        { 
          icon: <ChefHat className="h-8 w-8 text-primary" />,
          title: <T text="Dishes Prepared" />,
          value: staff.dishes_prepared || 0,
          unit: ""
        },
        { 
          icon: <Clock className="h-8 w-8 text-primary" />,
          title: <T text="Hours Worked" />,
          value: staff.total_hours_worked || 0,
          unit: "hrs"
        },
        { 
          icon: <BarChartIcon className="h-8 w-8 text-primary" />,
          title: <T text="Efficiency Rating" />,
          value: staff.efficiency_rating || 0,
          unit: "%"
        }
      ];
    } else if (staff.department === 'Front of House') {
      return [
        { 
          icon: <Users className="h-8 w-8 text-primary" />,
          title: <T text="Customers Served" />,
          value: staff.total_customers_served || 0,
          unit: ""
        },
        { 
          icon: <ShoppingCart className="h-8 w-8 text-primary" />,
          title: <T text="Orders Completed" />,
          value: staff.total_orders_completed || 0,
          unit: ""
        },
        { 
          icon: <Clock className="h-8 w-8 text-primary" />,
          title: <T text="Hours Worked" />,
          value: staff.total_hours_worked || 0,
          unit: "hrs"
        }
      ];
    } else {
      return [
        { 
          icon: <Clock className="h-8 w-8 text-primary" />,
          title: <T text="Hours Worked" />,
          value: staff.total_hours_worked || 0,
          unit: "hrs"
        },
        { 
          icon: <Check className="h-8 w-8 text-primary" />,
          title: <T text="Tasks Completed" />,
          value: staff.completed_tasks || 0,
          unit: ""
        },
        { 
          icon: <BarChartIcon className="h-8 w-8 text-primary" />,
          title: <T text="On-time Rate" />,
          value: staff.on_time_percentage || 0,
          unit: "%"
        }
      ];
    }
  };

  const metrics = getMetrics();

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center">
          <BarChartIcon className="mr-2 h-5 w-5" />
          <T text="Performance Metrics" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="p-4 border border-border/50 shadow-none">
              <div className="flex flex-col items-center justify-center text-center h-full">
                {metric.icon}
                <h3 className="mt-2 text-sm font-medium text-muted-foreground">{metric.title}</h3>
                <p className="text-3xl font-bold mt-1">{metric.value}{metric.unit}</p>
              </div>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="overview"><T text="Overview" /></TabsTrigger>
            <TabsTrigger value="attendance"><T text="Attendance" /></TabsTrigger>
            <TabsTrigger value="tasks"><T text="Tasks" /></TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <span className="text-sm"><T text="Total Hours Worked" /></span>
                <span className="font-medium">{staff.total_hours_worked || 0} hrs</span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full" 
                  style={{ width: `${Math.min(100, (staff.total_hours_worked || 0) / 1.5)}%` }} 
                />
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <span className="text-sm"><T text="Tasks Completion Rate" /></span>
                <span className="font-medium">{staff.on_time_percentage || 0}%</span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full" 
                  style={{ width: `${staff.on_time_percentage || 0}%` }} 
                />
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <span className="text-sm"><T text="Performance Rating" /></span>
                <span className="font-medium">{staff.performance || 0}%</span>
              </div>
              <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full" 
                  style={{ width: `${staff.performance || 0}%` }} 
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="attendance">
            <div className="h-60 w-full">
              <BarChart
                width={500}
                height={200}
                data={attendanceData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <text x="50%" y="15" textAnchor="middle" dominantBaseline="middle">
                  Monthly Attendance Rate (%)
                </text>
              </BarChart>
            </div>
          </TabsContent>
          
          <TabsContent value="tasks">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 border border-border/50 shadow-none">
                <h3 className="text-sm font-medium mb-2 text-center"><T text="Task Status" /></h3>
                <div className="flex justify-around">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-500">{staff.completed_tasks || 0}</p>
                    <p className="text-xs text-muted-foreground"><T text="Completed" /></p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-500">{staff.pending_tasks || 0}</p>
                    <p className="text-xs text-muted-foreground"><T text="Pending" /></p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 border border-border/50 shadow-none">
                <h3 className="text-sm font-medium mb-2 text-center"><T text="Completion Rate" /></h3>
                <div className="flex items-center justify-center">
                  <div className="relative flex items-center justify-center">
                    <svg className="w-20 h-20">
                      <circle
                        className="text-muted stroke-current"
                        strokeWidth="5"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="40"
                        cy="40"
                      />
                      <circle
                        className="text-primary stroke-current"
                        strokeWidth="5"
                        strokeDasharray={30 * 2 * Math.PI}
                        strokeDashoffset={30 * 2 * Math.PI * (1 - (staff.on_time_percentage || 0) / 100)}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="40"
                        cy="40"
                      />
                    </svg>
                    <span className="absolute text-xl font-bold">{staff.on_time_percentage || 0}%</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
