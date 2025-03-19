
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { 
  ArrowLeft, PhoneCall, Mail, Clock, DollarSign, Calendar, 
  Star, BarChart, Clock3, ChevronRight, CalendarDays, Award
} from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample staff data (would normally come from an API)
const staffMembers = [
  { 
    id: 1, 
    name: "Abebe Kebede", 
    role: "Chef", 
    department: "Kitchen",
    email: "abebe.kebede@example.com",
    phone: "+251 91 234 5678",
    address: "Addis Ababa, Ethiopia",
    attendance: "Present", 
    performance: 95,
    wage: 6,
    hourlyRate: "£6.00/hr",
    startDate: "2021-05-15",
    image: "/placeholder.svg",
    bio: "Abebe is an experienced chef specializing in traditional Ethiopian cuisine. He has over 5 years of experience in high-volume restaurants.",
    skills: ["Ethiopian Cuisine", "Menu Planning", "Food Safety", "Inventory Management"],
    recentShifts: [
      { date: "2023-06-01", hours: 8, status: "Completed" },
      { date: "2023-06-02", hours: 7.5, status: "Completed" },
      { date: "2023-06-03", hours: 8, status: "Completed" },
      { date: "2023-06-04", hours: 0, status: "Day Off" },
      { date: "2023-06-05", hours: 8, status: "Scheduled" },
    ]
  },
  { 
    id: 2, 
    name: "Makeda Haile", 
    role: "Chef", 
    department: "Kitchen",
    email: "makeda.haile@example.com",
    phone: "+251 91 987 6543",
    address: "Bahir Dar, Ethiopia",
    attendance: "Late", 
    performance: 88,
    wage: 6,
    hourlyRate: "£6.00/hr",
    startDate: "2022-01-10",
    image: "/placeholder.svg",
    bio: "Makeda is passionate about authentic East African flavors. She brings creativity and attention to detail to every dish she prepares.",
    skills: ["Pastry", "Vegetarian Cuisine", "Food Presentation", "Baking"],
    recentShifts: [
      { date: "2023-06-01", hours: 8, status: "Completed" },
      { date: "2023-06-02", hours: 8, status: "Completed" },
      { date: "2023-06-03", hours: 0, status: "Day Off" },
      { date: "2023-06-04", hours: 8, status: "Completed" },
      { date: "2023-06-05", hours: 8, status: "Scheduled" },
    ]
  },
  { 
    id: 3, 
    name: "Dawit Tadesse", 
    role: "Waiter", 
    department: "Front of House",
    email: "dawit.tadesse@example.com",
    phone: "+251 91 345 6789",
    address: "Hawassa, Ethiopia",
    attendance: "Present", 
    performance: 92,
    wage: 6,
    hourlyRate: "£6.00/hr",
    startDate: "2022-03-22",
    image: "/placeholder.svg",
    bio: "Dawit provides exceptional customer service with a friendly demeanor. He has excellent memory for orders and customer preferences.",
    skills: ["Customer Service", "Menu Knowledge", "Upselling", "Conflict Resolution"],
    recentShifts: [
      { date: "2023-06-01", hours: 6, status: "Completed" },
      { date: "2023-06-02", hours: 6, status: "Completed" },
      { date: "2023-06-03", hours: 6, status: "Completed" },
      { date: "2023-06-04", hours: 6, status: "Completed" },
      { date: "2023-06-05", hours: 6, status: "Scheduled" },
    ]
  },
  { 
    id: 4, 
    name: "Sara Mengistu", 
    role: "Manager", 
    department: "Management",
    email: "sara.mengistu@example.com",
    phone: "+251 91 567 8901",
    address: "Dire Dawa, Ethiopia",
    attendance: "Present", 
    performance: 98,
    wage: 8,
    hourlyRate: "£8.00/hr",
    startDate: "2020-11-05",
    image: "/placeholder.svg",
    bio: "Sara is an experienced restaurant manager with a focus on team development and operational excellence. She ensures smooth restaurant operations daily.",
    skills: ["Team Leadership", "Budgeting", "Conflict Resolution", "Scheduling", "Strategic Planning"],
    recentShifts: [
      { date: "2023-06-01", hours: 9, status: "Completed" },
      { date: "2023-06-02", hours: 9, status: "Completed" },
      { date: "2023-06-03", hours: 5, status: "Completed" },
      { date: "2023-06-04", hours: 0, status: "Day Off" },
      { date: "2023-06-05", hours: 9, status: "Scheduled" },
    ]
  },
];

const StaffProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const staffMember = staffMembers.find(staff => staff.id === Number(id));
  
  if (!staffMember) {
    return (
      <Layout interface="admin">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold"><T text="Staff member not found" /></h2>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate("/admin/staff")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <T text="Back to Staff Management" />
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout interface="admin">
      <PageHeader 
        heading={<T text="Staff Profile" />}
        description={<T text="View and manage staff details" />}
        actions={
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => navigate("/admin/staff")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <T text="Back" />
            </Button>
            <Button 
              onClick={() => navigate(`/admin/staff/edit/${id}`)}
            >
              <T text="Edit Profile" />
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <img
                    src={staffMember.image}
                    alt={staffMember.name}
                    className="aspect-square h-full w-full object-cover"
                  />
                </Avatar>
                <h2 className="text-xl font-bold">{staffMember.name}</h2>
                <div className="mt-1 flex items-center">
                  <Badge>{staffMember.role}</Badge>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{staffMember.bio}</p>
                
                <div className="mt-6 w-full space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <PhoneCall className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{staffMember.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{staffMember.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm"><T text="Started on" /> {new Date(staffMember.startDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{staffMember.hourlyRate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle><T text="Skills & Expertise" /></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {staffMember.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="mr-2 mb-2">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Tabs defaultValue="performance">
            <TabsList className="mb-4">
              <TabsTrigger value="performance"><T text="Performance" /></TabsTrigger>
              <TabsTrigger value="attendance"><T text="Attendance" /></TabsTrigger>
              <TabsTrigger value="schedule"><T text="Schedule" /></TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base"><T text="Overall Performance" /></CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{staffMember.performance}%</span>
                        </div>
                      </div>
                      <Progress value={staffMember.performance} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base"><T text="Current Status" /></CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant={staffMember.attendance === "Present" ? "default" : 
                                       staffMember.attendance === "Late" ? "outline" : 
                                       "destructive"}>
                          {staffMember.attendance}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle><T text="Performance Metrics" /></CardTitle>
                  <CardDescription><T text="Last 30 days performance" /></CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <div className="text-sm font-medium"><T text="Customer Service" /></div>
                        <div className="text-sm text-muted-foreground">92%</div>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <div className="text-sm font-medium"><T text="Team Collaboration" /></div>
                        <div className="text-sm text-muted-foreground">88%</div>
                      </div>
                      <Progress value={88} className="h-2" />
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <div className="text-sm font-medium"><T text="Speed & Efficiency" /></div>
                        <div className="text-sm text-muted-foreground">95%</div>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <div className="text-sm font-medium"><T text="Quality of Work" /></div>
                        <div className="text-sm text-muted-foreground">96%</div>
                      </div>
                      <Progress value={96} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="attendance">
              <Card>
                <CardHeader>
                  <CardTitle><T text="Recent Attendance" /></CardTitle>
                  <CardDescription><T text="Staff check-in and check-out times" /></CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead><T text="Date" /></TableHead>
                        <TableHead><T text="Status" /></TableHead>
                        <TableHead><T text="Check In" /></TableHead>
                        <TableHead><T text="Check Out" /></TableHead>
                        <TableHead><T text="Hours" /></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { date: "2023-06-01", status: "Present", checkIn: "08:55", checkOut: "17:03", hours: "8.1" },
                        { date: "2023-06-02", status: "Present", checkIn: "08:50", checkOut: "17:00", hours: "8.2" },
                        { date: "2023-06-03", status: "Late", checkIn: "09:15", checkOut: "17:15", hours: "8.0" },
                        { date: "2023-06-04", status: "Absent", checkIn: "-", checkOut: "-", hours: "0" },
                        { date: "2023-06-05", status: "Present", checkIn: "08:45", checkOut: "17:00", hours: "8.3" },
                      ].map((record, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {new Date(record.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={record.status === "Present" ? "default" : 
                                          record.status === "Late" ? "outline" : 
                                          "destructive"}>
                              {record.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{record.checkIn}</TableCell>
                          <TableCell>{record.checkOut}</TableCell>
                          <TableCell>{record.hours}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle><T text="Upcoming Schedule" /></CardTitle>
                  <CardDescription><T text="Staff shift schedule" /></CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead><T text="Date" /></TableHead>
                        <TableHead><T text="Shift" /></TableHead>
                        <TableHead><T text="Hours" /></TableHead>
                        <TableHead><T text="Status" /></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staffMember.recentShifts.map((shift, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {new Date(shift.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {shift.status !== "Day Off" ? "Regular" : "-"}
                          </TableCell>
                          <TableCell>{shift.hours}</TableCell>
                          <TableCell>
                            <Badge variant={shift.status === "Completed" ? "default" : 
                                          shift.status === "Scheduled" ? "outline" : 
                                          "secondary"}>
                              {shift.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default StaffProfile;
