
import React, { useState, useEffect } from "react";
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
  Award, ThumbsUp, User, Users, AlertCircle, Loader2
} from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Define the staff member type
type StaffMember = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  department: string | null;
  performance: number | null;
  image_url: string | null;
  customer_service_rating?: number;
  teamwork_rating?: number;
  efficiency_rating?: number;
  quality_rating?: number;
  trend?: "up" | "down" | "stable";
};

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
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Function to fetch staff data from the database
  const fetchStaffData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      // Enhance the data with additional performance metrics and trend
      const enhancedData = (data || []).map(staff => {
        // Generate random ratings for demo purposes
        // In a real app, these would come from a proper performance tracking table
        const performance = staff.performance || Math.floor(70 + Math.random() * 30);
        const customerServiceRating = Math.floor(performance - 5 + Math.random() * 10);
        const teamworkRating = Math.floor(performance - 5 + Math.random() * 10);
        const efficiencyRating = Math.floor(performance - 5 + Math.random() * 10);
        const qualityRating = Math.floor(performance - 5 + Math.random() * 10);
        
        // Generate a random trend
        const trends = ["up", "down", "stable"];
        const trend = trends[Math.floor(Math.random() * trends.length)] as "up" | "down" | "stable";
        
        return {
          ...staff,
          performance,
          customer_service_rating: customerServiceRating,
          teamwork_rating: teamworkRating,
          efficiency_rating: efficiencyRating,
          quality_rating: qualityRating,
          trend
        };
      });
      
      setStaffMembers(enhancedData);
    } catch (err: any) {
      console.error('Error fetching staff:', err);
      setError(err.message || 'Failed to load staff data');
      toast({
        title: "Error",
        description: `Failed to load staff data: ${err.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update staff performance rating
  const updatePerformanceRating = async (staffId: string, rating: number) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ performance: rating })
        .eq('id', staffId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setStaffMembers(staffMembers.map(staff => 
        staff.id === staffId ? { ...staff, performance: rating } : staff
      ));
      
      toast({
        title: "Success",
        description: `Staff performance rating updated to ${rating}%`,
      });
    } catch (err: any) {
      console.error('Error updating performance:', err);
      toast({
        title: "Error",
        description: `Failed to update performance: ${err.message}`,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  const filteredStaff = staffMembers.filter(staff => {
    const fullName = `${staff.first_name || ""} ${staff.last_name || ""}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
      (staff.role || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    if (departmentFilter === "all") return matchesSearch;
    return matchesSearch && (staff.department || "").toLowerCase() === departmentFilter.toLowerCase();
  });

  const getFullName = (staff: StaffMember) => {
    return `${staff.first_name || ""} ${staff.last_name || ""}`.trim() || "No Name";
  };

  const getTrendIcon = (trend: string | undefined) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <span className="h-4 w-4">—</span>;
    }
  };

  const getPerformanceColor = (score: number | null) => {
    if (!score) return "text-gray-500";
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-amber-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number | null) => {
    if (!score) return "bg-gray-300";
    if (score >= 90) return "bg-green-600";
    if (score >= 80) return "bg-amber-600";
    return "bg-red-600";
  };

  // Calculate statistics for dashboard cards
  const teamAverage = Math.round(
    staffMembers.reduce((acc, staff) => acc + (staff.performance || 0), 0) / 
    (staffMembers.length || 1)
  );
  
  const topPerformer = staffMembers.length > 0 
    ? staffMembers.sort((a, b) => (b.performance || 0) - (a.performance || 0))[0]
    : null;
    
  const mostImproved = staffMembers.filter(staff => staff.trend === "up").length > 0
    ? staffMembers.filter(staff => staff.trend === "up").sort((a, b) => (b.performance || 0) - (a.performance || 0))[0]
    : null;

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

      {error && (
        <Card className="mb-6 border-red-300 bg-red-50 dark:bg-red-950/20">
          <div className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-500">{error}</p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground"><T text="Team Average" /></p>
              <h3 className="text-2xl font-bold">{teamAverage}%</h3>
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
                {topPerformer ? getFullName(topPerformer) : "N/A"}
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
                {mostImproved ? getFullName(mostImproved) : "N/A"}
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
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all"><T text="All Departments" /></SelectItem>
            <SelectItem value="kitchen"><T text="Kitchen" /></SelectItem>
            <SelectItem value="front of house"><T text="Front of House" /></SelectItem>
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
            {isLoading ? (
              <div className="p-4">
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              </div>
            ) : filteredStaff.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground"><T text="No staff members found" /></p>
              </div>
            ) : (
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
                              src={staff.image_url || "/placeholder.svg"}
                              alt={getFullName(staff)}
                              className="aspect-square h-10 w-10 object-cover"
                            />
                          </Avatar>
                          <div>
                            {getFullName(staff)}
                            <div className="text-sm text-muted-foreground">{staff.role}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{staff.department}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Select 
                            value={String(staff.performance || 0)} 
                            onValueChange={(value) => updatePerformanceRating(staff.id, parseInt(value))}
                          >
                            <SelectTrigger className="w-[80px] h-7">
                              <span className={getPerformanceColor(staff.performance)}>{staff.performance}%</span>
                            </SelectTrigger>
                            <SelectContent>
                              {[100, 95, 90, 85, 80, 75, 70, 65, 60].map(rating => (
                                <SelectItem key={rating} value={String(rating)}>{rating}%</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(staff.trend)}
                          <span className="capitalize">{staff.trend || "stable"}</span>
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
            )}
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
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
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
                                src={staff.image_url || "/placeholder.svg"}
                                alt={getFullName(staff)}
                                className="aspect-square h-10 w-10 object-cover"
                              />
                            </Avatar>
                            <div>
                              {getFullName(staff)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-[100px] flex items-center gap-2">
                            <Progress 
                              value={staff.customer_service_rating} 
                              className="h-2" 
                              indicatorClassName={getProgressColor(staff.customer_service_rating)}
                            />
                            <span className="text-sm">{staff.customer_service_rating}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-[100px] flex items-center gap-2">
                            <Progress 
                              value={staff.teamwork_rating} 
                              className="h-2"
                              indicatorClassName={getProgressColor(staff.teamwork_rating)}
                            />
                            <span className="text-sm">{staff.teamwork_rating}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-[100px] flex items-center gap-2">
                            <Progress 
                              value={staff.efficiency_rating} 
                              className="h-2"
                              indicatorClassName={getProgressColor(staff.efficiency_rating)}
                            />
                            <span className="text-sm">{staff.efficiency_rating}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-[100px] flex items-center gap-2">
                            <Progress 
                              value={staff.quality_rating} 
                              className="h-2"
                              indicatorClassName={getProgressColor(staff.quality_rating)}
                            />
                            <span className="text-sm">{staff.quality_rating}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
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
