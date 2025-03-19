
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, Search, ChevronRight, Star, TrendingUp, TrendingDown, BarChart,
  Award, ThumbsUp, User, Users
} from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample staff data
const staffMembers = [
  { 
    id: 1, 
    name: "Abebe Kebede", 
    role: "Chef", 
    department: "Kitchen",
    overallRating: 95,
    customerService: 90,
    teamwork: 97,
    efficiency: 94,
    quality: 96,
    trend: "up",
    image: "/placeholder.svg" 
  },
  { 
    id: 2, 
    name: "Makeda Haile", 
    role: "Chef", 
    department: "Kitchen",
    overallRating: 88,
    customerService: 85,
    teamwork: 90,
    efficiency: 87,
    quality: 90,
    trend: "stable",
    image: "/placeholder.svg" 
  },
  { 
    id: 3, 
    name: "Dawit Tadesse", 
    role: "Waiter", 
    department: "Front of House",
    overallRating: 92,
    customerService: 95,
    teamwork: 88,
    efficiency: 93,
    quality: 90,
    trend: "up",
    image: "/placeholder.svg" 
  },
  { 
    id: 4, 
    name: "Sara Mengistu", 
    role: "Manager", 
    department: "Management",
    overallRating: 98,
    customerService: 96,
    teamwork: 99,
    efficiency: 97,
    quality: 98,
    trend: "up",
    image: "/placeholder.svg" 
  },
];

// Performance categories for detailed view
const performanceCategories = [
  { name: "Customer Service", description: "Interaction with and service to customers" },
  { name: "Team Collaboration", description: "Ability to work effectively with colleagues" },
  { name: "Speed & Efficiency", description: "Pace and resource utilization in completing tasks" },
  { name: "Quality of Work", description: "Precision, attention to detail, and consistency" },
  { name: "Adaptability", description: "Ability to handle changes and unexpected situations" },
];

const StaffPerformance = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredStaff = staffMembers.filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <span className="h-4 w-4">—</span>;
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-amber-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-green-600";
    if (score >= 80) return "bg-amber-600";
    return "bg-red-600";
  };

  return (
    <Layout interface="admin">
      <PageHeader 
        heading={<T text="Staff Performance" />}
        description={<T text="Track and analyze staff performance metrics" />}
        actions={
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => navigate("/admin/staff")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <T text="Back to Staff" />
            </Button>
            <Button>
              <Award className="mr-2 h-4 w-4" />
              <T text="Issue Recognition" />
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground"><T text="Team Average" /></p>
              <h3 className="text-2xl font-bold">
                {Math.round(staffMembers.reduce((acc, staff) => acc + staff.overallRating, 0) / staffMembers.length)}%
              </h3>
            </div>
            <div className="bg-primary/10 p-2 rounded-full">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground"><T text="Top Performer" /></p>
              <h3 className="text-lg font-bold">
                {staffMembers.sort((a, b) => b.overallRating - a.overallRating)[0].name}
              </h3>
            </div>
            <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
              <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground"><T text="Most Improved" /></p>
              <h3 className="text-lg font-bold">
                {staffMembers.filter(staff => staff.trend === "up")[0]?.name || "N/A"}
              </h3>
            </div>
            <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-full">
              <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search staff..."
            className="w-full pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all"><T text="All Departments" /></SelectItem>
            <SelectItem value="kitchen"><T text="Kitchen" /></SelectItem>
            <SelectItem value="front"><T text="Front of House" /></SelectItem>
            <SelectItem value="management"><T text="Management" /></SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview"><T text="Performance Overview" /></TabsTrigger>
          <TabsTrigger value="detailed"><T text="Detailed Metrics" /></TabsTrigger>
          <TabsTrigger value="trends"><T text="Performance Trends" /></TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Staff Member" /></TableHead>
                  <TableHead><T text="Department" /></TableHead>
                  <TableHead><T text="Overall Rating" /></TableHead>
                  <TableHead><T text="Trend" /></TableHead>
                  <TableHead className="text-right"><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <img
                            src={staff.image}
                            alt={staff.name}
                            className="aspect-square h-10 w-10 object-cover"
                          />
                        </Avatar>
                        <div>
                          {staff.name}
                          <div className="text-sm text-muted-foreground">{staff.role}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{staff.department}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className={getPerformanceColor(staff.overallRating)}>{staff.overallRating}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(staff.trend)}
                        <span className="capitalize">{staff.trend}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/admin/staff/profile/${staff.id}`)}
                      >
                        <T text="View Profile" />
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
        
        <TabsContent value="detailed">
          <Card>
            <CardHeader>
              <CardTitle><T text="Performance Breakdown" /></CardTitle>
              <CardDescription>
                <T text="Detailed performance metrics by category" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><T text="Staff Member" /></TableHead>
                    <TableHead><T text="Customer Service" /></TableHead>
                    <TableHead><T text="Team Collaboration" /></TableHead>
                    <TableHead><T text="Efficiency" /></TableHead>
                    <TableHead><T text="Quality" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <img
                              src={staff.image}
                              alt={staff.name}
                              className="aspect-square h-10 w-10 object-cover"
                            />
                          </Avatar>
                          <div>
                            {staff.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-[100px] flex items-center gap-2">
                          <Progress 
                            value={staff.customerService} 
                            className="h-2" 
                            indicatorClassName={getProgressColor(staff.customerService)}
                          />
                          <span className="text-sm">{staff.customerService}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-[100px] flex items-center gap-2">
                          <Progress 
                            value={staff.teamwork} 
                            className="h-2"
                            indicatorClassName={getProgressColor(staff.teamwork)}
                          />
                          <span className="text-sm">{staff.teamwork}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-[100px] flex items-center gap-2">
                          <Progress 
                            value={staff.efficiency} 
                            className="h-2"
                            indicatorClassName={getProgressColor(staff.efficiency)}
                          />
                          <span className="text-sm">{staff.efficiency}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-[100px] flex items-center gap-2">
                          <Progress 
                            value={staff.quality} 
                            className="h-2"
                            indicatorClassName={getProgressColor(staff.quality)}
                          />
                          <span className="text-sm">{staff.quality}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle><T text="Performance Categories" /></CardTitle>
              <CardDescription>
                <T text="Explore detailed descriptions of each performance metric" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {performanceCategories.map((category, index) => (
                  <Card key={index} className="bg-accent/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{category.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle><T text="Performance Improvement Tips" /></CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <ThumbsUp className="h-5 w-5 text-primary mt-0.5" />
                    <span><T text="Regular feedback sessions can improve staff performance by up to 30%" /></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ThumbsUp className="h-5 w-5 text-primary mt-0.5" />
                    <span><T text="Recognition programs boost motivation and retention rates" /></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ThumbsUp className="h-5 w-5 text-primary mt-0.5" />
                    <span><T text="Staff training in weak performance areas can lead to significant improvements" /></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ThumbsUp className="h-5 w-5 text-primary mt-0.5" />
                    <span><T text="Setting clear expectations helps staff understand performance goals" /></span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default StaffPerformance;
