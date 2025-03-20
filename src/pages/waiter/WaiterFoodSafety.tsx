
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Search, 
  ClipboardCheck, 
  FileText, 
  AlertTriangle, 
  ThermometerSnowflake,
  ThermometerSun,
  Clock,
  Calendar,
  User
} from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample checklists
const checklists = [
  { 
    id: 1, 
    name: "Pre-Service Food Safety Check", 
    frequency: "Daily",
    description: "Verify food safety standards before beginning service",
    due: "Today at 4:00 PM",
    status: "Pending",
    progress: 0,
    assigned_to: "All Waiters",
    total_items: 8,
    completed_items: 0
  },
  { 
    id: 2, 
    name: "Refrigerator Temperature Log", 
    frequency: "Daily",
    description: "Record temperatures of all refrigeration units",
    due: "Today at 10:00 AM",
    status: "Completed",
    progress: 100,
    assigned_to: "Morning Shift",
    completed_by: "Dawit Tadesse",
    completed_at: "Today at 9:45 AM",
    total_items: 5,
    completed_items: 5
  },
  { 
    id: 3, 
    name: "Food Storage Inspection", 
    frequency: "Weekly",
    description: "Check all food storage areas for cleanliness and organization",
    due: "Thursday at 3:00 PM",
    status: "Pending",
    progress: 0,
    assigned_to: "All Staff",
    total_items: 10,
    completed_items: 0
  },
  { 
    id: 4, 
    name: "Service Area Sanitization", 
    frequency: "Daily",
    description: "Sanitize all service areas before and after service",
    due: "Today at 2:00 PM",
    status: "In Progress",
    progress: 60,
    assigned_to: "All Waiters",
    total_items: 5,
    completed_items: 3
  }
];

// Sample for pre-service checklist items
const preServiceItems = [
  { id: 1, description: "Hand washing stations fully stocked and operational", value_type: "boolean", required: true },
  { id: 2, description: "Service area sanitized and clean", value_type: "boolean", required: true },
  { id: 3, description: "Hot holding equipment at proper temperature (above 135°F/57°C)", value_type: "temperature", unit: "°F", required: true },
  { id: 4, description: "Cold holding equipment at proper temperature (below 41°F/5°C)", value_type: "temperature", unit: "°F", required: true },
  { id: 5, description: "All food items properly labeled and dated", value_type: "boolean", required: true },
  { id: 6, description: "Service utensils clean and stored properly", value_type: "boolean", required: true },
  { id: 7, description: "Staff wearing proper attire and practicing good hygiene", value_type: "boolean", required: true },
  { id: 8, description: "Additional notes or observations", value_type: "text", required: false }
];

const WaiterFoodSafety = () => {
  const { t } = useLanguage();
  const [selectedChecklist, setSelectedChecklist] = useState<any>(null);
  const [showChecklistDialog, setShowChecklistDialog] = useState(false);
  const [checklistItems, setChecklistItems] = useState<Record<number, any>>({});
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredChecklists = checklists.filter(checklist => 
    checklist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    checklist.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleChecklistAction = (checklist: any) => {
    setSelectedChecklist(checklist);
    
    // Initialize checklist items
    if (checklist.id === 1) { // Pre-service checklist
      const initialItems: Record<number, any> = {};
      preServiceItems.forEach(item => {
        initialItems[item.id] = item.value_type === 'boolean' ? false : '';
      });
      setChecklistItems(initialItems);
    }
    
    setShowChecklistDialog(true);
  };
  
  const handleChecklistItemChange = (itemId: number, value: any) => {
    setChecklistItems(prev => ({
      ...prev,
      [itemId]: value
    }));
  };
  
  const getPendingChecklists = () => {
    return filteredChecklists.filter(c => c.status === "Pending" || c.status === "In Progress");
  };
  
  const getCompletedChecklists = () => {
    return filteredChecklists.filter(c => c.status === "Completed");
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800 border-green-300";
      case "In Progress": return "bg-blue-100 text-blue-800 border-blue-300";
      case "Pending": return "bg-amber-100 text-amber-800 border-amber-300";
      case "Overdue": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title={t("Food Safety")} 
        description={t("Manage food safety checks and compliance")}
      />
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("Search checklists...")}
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">
            <ClipboardCheck className="h-4 w-4 mr-2" />
            <T text="Pending Checks" />
          </TabsTrigger>
          <TabsTrigger value="completed">
            <FileText className="h-4 w-4 mr-2" />
            <T text="Completed Checks" />
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {getPendingChecklists().length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <ClipboardCheck className="h-10 w-10 mb-2" />
                  <p>{t("No pending food safety checks")}</p>
                  <p className="text-sm">{t("All food safety checks are complete!")}</p>
                </CardContent>
              </Card>
            ) : (
              getPendingChecklists().map((checklist) => (
                <Card key={checklist.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base font-medium">{t(checklist.name)}</CardTitle>
                      <Badge className={getStatusColor(checklist.status)}>
                        {t(checklist.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{t(checklist.description)}</p>
                  </CardHeader>
                  
                  <CardContent className="pb-0">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex gap-1 items-center">
                          <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <T text="Due" />: {checklist.due}
                        </div>
                        <div>
                          {checklist.completed_items} / {checklist.total_items} {t("items")}
                        </div>
                      </div>
                      
                      <Progress value={checklist.progress} className="h-2" />
                      
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <div className="flex gap-1 items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <T text="Frequency" />: {t(checklist.frequency)}
                        </div>
                        <div className="flex gap-1 items-center">
                          <User className="h-3.5 w-3.5 mr-1" />
                          <T text="Assigned" />: {t(checklist.assigned_to)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-4 pb-4">
                    <Button className="w-full" onClick={() => handleChecklistAction(checklist)}>
                      {checklist.status === "In Progress" ? (
                        <T text="Continue Checklist" />
                      ) : (
                        <T text="Start Checklist" />
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="completed">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {getCompletedChecklists().length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <FileText className="h-10 w-10 mb-2" />
                  <p>{t("No completed food safety checks")}</p>
                  <p className="text-sm">{t("Completed food safety checks will appear here.")}</p>
                </CardContent>
              </Card>
            ) : (
              getCompletedChecklists().map((checklist) => (
                <Card key={checklist.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base font-medium">{t(checklist.name)}</CardTitle>
                      <Badge className={getStatusColor(checklist.status)}>
                        {t(checklist.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{t(checklist.description)}</p>
                  </CardHeader>
                  
                  <CardContent className="pb-0">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex gap-1 items-center">
                          <User className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span>{t("Completed by")}: {checklist.completed_by}</span>
                        </div>
                        <div>
                          {checklist.completed_items} / {checklist.total_items} {t("items")}
                        </div>
                      </div>
                      
                      <Progress value={checklist.progress} className="h-2" />
                      
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <div className="flex gap-1 items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>{t("Due")}: {checklist.due}</span>
                        </div>
                        <div className="flex gap-1 items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>{t("Completed at")}: {checklist.completed_at}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-4 pb-4">
                    <Button variant="outline" className="w-full" onClick={() => handleChecklistAction(checklist)}>
                      <T text="View Details" />
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Checklist Dialog */}
      {selectedChecklist && (
        <Dialog open={showChecklistDialog} onOpenChange={setShowChecklistDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t(selectedChecklist.name)}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Badge className={getStatusColor(selectedChecklist.status)}>
                  {t(selectedChecklist.status)}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  {t("Due")}: {selectedChecklist.due}
                </div>
              </div>
              
              <p className="text-sm">{t(selectedChecklist.description)}</p>
              
              <Separator />
              
              {/* Display checklist items based on the selected checklist */}
              {selectedChecklist.id === 1 && ( // Pre-service checklist
                <div className="space-y-4">
                  {preServiceItems.map(item => (
                    <div key={item.id} className="space-y-2">
                      <div className="flex items-start gap-2">
                        {item.value_type === 'boolean' ? (
                          <>
                            <Checkbox 
                              id={`item-${item.id}`} 
                              checked={checklistItems[item.id] || false}
                              onCheckedChange={(checked) => handleChecklistItemChange(item.id, checked)}
                              disabled={selectedChecklist.status === "Completed"}
                            />
                            <Label 
                              htmlFor={`item-${item.id}`}
                              className="text-sm leading-tight"
                            >
                              {t(item.description)}
                              {item.required && <span className="text-red-500 ml-1">*</span>}
                            </Label>
                          </>
                        ) : item.value_type === 'temperature' ? (
                          <div className="w-full">
                            <Label className="text-sm leading-tight mb-1 block">
                              {t(item.description)}
                              {item.required && <span className="text-red-500 ml-1">*</span>}
                            </Label>
                            <div className="flex gap-2 items-center">
                              {item.description.includes("Hot") ? (
                                <ThermometerSun className="h-4 w-4 text-amber-500" />
                              ) : (
                                <ThermometerSnowflake className="h-4 w-4 text-blue-500" />
                              )}
                              <Input 
                                type="number" 
                                className="w-20" 
                                value={checklistItems[item.id] || ''}
                                onChange={(e) => handleChecklistItemChange(item.id, e.target.value)}
                                disabled={selectedChecklist.status === "Completed"}
                              />
                              <span className="text-sm">{item.unit}</span>
                              
                              {item.value_type === 'temperature' && checklistItems[item.id] && (
                                <Badge className={
                                  item.description.includes("Hot") 
                                    ? (Number(checklistItems[item.id]) >= 135 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")
                                    : (Number(checklistItems[item.id]) <= 41 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")
                                }>
                                  {item.description.includes("Hot") 
                                    ? (Number(checklistItems[item.id]) >= 135 ? t("Safe") : t("Unsafe"))
                                    : (Number(checklistItems[item.id]) <= 41 ? t("Safe") : t("Unsafe"))
                                  }
                                </Badge>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="w-full">
                            <Label className="text-sm leading-tight mb-1 block">
                              {t(item.description)}
                              {item.required && <span className="text-red-500 ml-1">*</span>}
                            </Label>
                            <Textarea 
                              value={checklistItems[item.id] || ''}
                              onChange={(e) => handleChecklistItemChange(item.id, e.target.value)}
                              rows={2}
                              disabled={selectedChecklist.status === "Completed"}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {selectedChecklist.status === "Completed" && (
                    <div>
                      <Label className="text-sm font-medium">{t("Completed By")}</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedChecklist.completed_by}</span>
                        <span className="text-sm text-muted-foreground">
                          {selectedChecklist.completed_at}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <DialogFooter>
              {selectedChecklist.status !== "Completed" ? (
                <>
                  <Button variant="outline" onClick={() => setShowChecklistDialog(false)}>
                    <T text="Save Draft" />
                  </Button>
                  <Button onClick={() => setShowChecklistDialog(false)}>
                    <T text="Complete Checklist" />
                  </Button>
                </>
              ) : (
                <Button onClick={() => setShowChecklistDialog(false)}>
                  <T text="Close" />
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default WaiterFoodSafety;
