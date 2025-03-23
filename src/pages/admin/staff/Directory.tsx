import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronRight, Phone, Mail, FilterX, Trash2, AlertCircle } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import useStaffMembers from "@/hooks/useStaffMembers";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

console.log("Directory component loaded");

const Directory = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null);

  const { 
    data: staffMembers, 
    isLoading, 
    error,
    deleteStaffMember,
    fetchStaffData
  } = useStaffMembers();

  console.log("Staff members in directory:", staffMembers);

  const filteredStaff = staffMembers.filter(staff => {
    const fullName = `${staff.first_name || ""} ${staff.last_name || ""}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(searchTerm.toLowerCase()) ||
      (staff.role || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staff.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staff.phone || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && (staff.department || "").toLowerCase() === activeTab.toLowerCase();
  });

  const handleViewStaff = (id: string) => {
    console.log("Navigating to staff profile with ID:", id);
    navigate(`/admin/staff/profile/${id}`);
  };

  const handleEditStaff = (id: string) => {
    console.log("Navigating to edit staff with ID:", id);
    navigate(`/admin/staff/edit/${id}`);
  };

  const confirmDeleteStaff = (id: string) => {
    setStaffToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteStaff = async () => {
    if (!staffToDelete) return;
    
    const success = await deleteStaffMember(staffToDelete);
    if (success) {
      setDeleteDialogOpen(false);
      setStaffToDelete(null);
    }
  };

  const getFullName = (staff: any) => {
    return `${staff.first_name || ""} ${staff.last_name || ""}`.trim() || "No Name";
  };

  const getInitials = (staff: any) => {
    const firstName = staff.first_name || "";
    const lastName = staff.last_name || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAttendanceVariant = (attendance: string | null) => {
    switch (attendance) {
      case "Present":
        return "default";
      case "Late":
        return "secondary";
      case "Absent":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <>
      <PageHeader 
        heading={<T text="Staff Directory" />}
        description={<T text="View and manage all restaurant staff members" />}
        actions={
          <Button onClick={() => {
            console.log("Navigating to add new staff page");
            navigate("/admin/staff/new");
          }}>
            <T text="Add New Staff" />
          </Button>
        }
      />

      {error && (
        <Card className="mb-6 border-red-300 bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("Search by name, role, email...")}
              className="w-full pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {searchTerm && (
            <Button 
              variant="ghost" 
              onClick={() => setSearchTerm("")}
              size="sm"
              className="self-start"
            >
              <T text="Clear" />
            </Button>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full sm:w-auto flex justify-start overflow-x-auto pb-1">
              <TabsTrigger value="all"><T text="All Staff" /></TabsTrigger>
              <TabsTrigger value="kitchen"><T text="Kitchen" /></TabsTrigger>
              <TabsTrigger value="front of house"><T text="Front of House" /></TabsTrigger>
              <TabsTrigger value="management"><T text="Management" /></TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Card key={n} className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                </div>
                <div className="mt-4 flex justify-between">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredStaff.length === 0 ? (
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
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Avatar className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0">
                      {staff.image_url ? (
                        <AvatarImage 
                          src={staff.image_url} 
                          alt={`${staff.first_name || ""} ${staff.last_name || ""}`.trim()} 
                          className="aspect-square h-full w-full object-cover"
                        />
                      ) : null}
                      <AvatarFallback>{`${staff.first_name?.charAt(0) || ""}${staff.last_name?.charAt(0) || ""}`.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg">{`${staff.first_name || ""} ${staff.last_name || ""}`.trim()}</h3>
                      <p className="text-muted-foreground text-sm">{staff.role}</p>
                      {staff.department && (
                        <Badge 
                          variant="outline" 
                          className="mt-1"
                        >
                          {staff.department}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  {staff.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm truncate">{staff.email}</span>
                    </div>
                  )}
                  {staff.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm">{staff.phone}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div>
                    {staff.attendance && (
                      <Badge variant={staff.attendance === "Present" ? "default" : staff.attendance === "Late" ? "secondary" : "destructive"}>
                        {staff.attendance}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDeleteStaff(staff.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleViewStaff(staff.id)}
                    >
                      <T text="View Profile" />
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle><T text="Are you sure?" /></AlertDialogTitle>
            <AlertDialogDescription>
              <T text="This action cannot be undone. This will permanently delete the staff member from the system." />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel><T text="Cancel" /></AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStaff} className="bg-red-500 hover:bg-red-600">
              <T text="Delete" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Directory;
