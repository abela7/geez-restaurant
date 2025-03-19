
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronRight, Phone, Mail, FilterX } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

// Sample staff data - using the same data structure as in other staff pages
const staffMembers = [
  { 
    id: 1, 
    name: "Abebe Kebede", 
    role: "Chef", 
    department: "Kitchen",
    email: "abebe.k@habesha.com",
    phone: "+251 911 234 567",
    attendance: "Present", 
    performance: 95, 
    wage: 6,
    hourlyRate: "£6.00/hr",
    image: "/placeholder.svg",
    joinDate: "2021-03-15" 
  },
  { 
    id: 2, 
    name: "Makeda Haile", 
    role: "Chef", 
    department: "Kitchen",
    email: "makeda.h@habesha.com",
    phone: "+251 922 345 678",
    attendance: "Late", 
    performance: 88, 
    wage: 6,
    hourlyRate: "£6.00/hr",
    image: "/placeholder.svg",
    joinDate: "2021-06-22" 
  },
  { 
    id: 3, 
    name: "Dawit Tadesse", 
    role: "Waiter", 
    department: "Front of House",
    email: "dawit.t@habesha.com",
    phone: "+251 933 456 789",
    attendance: "Present", 
    performance: 92, 
    wage: 6,
    hourlyRate: "£6.00/hr",
    image: "/placeholder.svg",
    joinDate: "2022-01-10" 
  },
  { 
    id: 4, 
    name: "Sara Mengistu", 
    role: "Manager", 
    department: "Management",
    email: "sara.m@habesha.com",
    phone: "+251 944 567 890",
    attendance: "Present", 
    performance: 98, 
    wage: 8,
    hourlyRate: "£8.00/hr",
    image: "/placeholder.svg",
    joinDate: "2020-11-05" 
  },
];

const Directory = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = 
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.phone.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && staff.department.toLowerCase() === activeTab.toLowerCase();
  });

  const handleViewStaff = (id: number) => {
    navigate(`/admin/staff/profile/${id}`);
  };

  return (
    <Layout interface="admin">
      <PageHeader 
        heading={<T text="Staff Directory" />}
        description={<T text="View and manage all restaurant staff members" />}
        actions={
          <Button onClick={() => navigate("/admin/staff/new")}>
            <T text="Add New Staff" />
          </Button>
        }
      />

      <div className="mb-6">
        <div className="relative w-full max-w-md mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("Search by name, role, email...")}
            className="w-full pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all"><T text="All Staff" /></TabsTrigger>
            <TabsTrigger value="Kitchen"><T text="Kitchen" /></TabsTrigger>
            <TabsTrigger value="Front of House"><T text="Front of House" /></TabsTrigger>
            <TabsTrigger value="Management"><T text="Management" /></TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredStaff.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <FilterX className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2"><T text="No staff members found" /></h3>
            <p className="text-muted-foreground mb-4">
              <T text="Try adjusting your search or filter criteria" />
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setActiveTab("all");
            }}>
              <T text="Clear Filters" />
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.map((staff) => (
            <Card key={staff.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <img 
                        src={staff.image} 
                        alt={staff.name} 
                        className="aspect-square h-full w-full object-cover"
                      />
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{staff.name}</h3>
                      <p className="text-muted-foreground">{staff.role}</p>
                      <Badge 
                        variant="outline" 
                        className="mt-1"
                      >
                        {staff.department}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{staff.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{staff.phone}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <Badge 
                      variant={
                        staff.attendance === "Present" ? "default" : 
                        staff.attendance === "Late" ? "secondary" : 
                        "destructive"
                      }
                    >
                      {staff.attendance}
                    </Badge>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleViewStaff(staff.id)}
                  >
                    <T text="View Profile" />
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Directory;
