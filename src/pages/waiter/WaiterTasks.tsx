
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Plus, Clock, Calendar, CheckSquare, AlertCircle, ClipboardList, Filter } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import ConfirmDialog from "@/components/ui/confirm-dialog";

// Sample tasks data
const tasks = [
  { 
    id: 1, 
    title: "Process end-of-shift report", 
    status: "Pending", 
    priority: "High", 
    category: "Administrative", 
    due: "Today at 10:00 PM", 
    assigned_by: "Manager",
    description: "Complete the end-of-shift report including cash reconciliation and tips distribution."
  },
  { 
    id: 2, 
    title: "Restock service stations", 
    status: "In Progress", 
    priority: "Medium", 
    category: "Preparation", 
    due: "Today at 4:30 PM", 
    assigned_by: "Self",
    description: "Restock napkins, straws, and condiments at all service stations."
  },
  { 
    id: 3, 
    title: "Check restroom supplies", 
    status: "Pending", 
    priority: "Low", 
    category: "Maintenance", 
    due: "Today at 6:00 PM", 
    assigned_by: "Manager",
    description: "Ensure restrooms are stocked with paper towels, toilet paper, and soap."
  },
  { 
    id: 4, 
    title: "Train new server on POS system", 
    status: "Pending", 
    priority: "Medium", 
    category: "Training", 
    due: "Tomorrow at 2:00 PM", 
    assigned_by: "Manager",
    description: "Provide a 30-minute training session for the new server on using the POS system."
  },
  { 
    id: 5, 
    title: "Deep clean coffee station", 
    status: "Pending", 
    priority: "Medium", 
    category: "Cleaning", 
    due: "Tomorrow at 11:00 AM", 
    assigned_by: "Manager",
    description: "Thoroughly clean the coffee station, including machines, grinders, and surrounding area."
  },
  { 
    id: 6, 
    title: "Assist with table setting", 
    status: "Completed", 
    priority: "High", 
    category: "Preparation", 
    due: "Today at 4:00 PM", 
    assigned_by: "Manager",
    completed_at: "Today at 4:30 PM",
    description: "Help set tables for the evening service with proper place settings."
  },
  { 
    id: 7, 
    title: "Update specials menu board", 
    status: "Completed", 
    priority: "Medium", 
    category: "Administrative", 
    due: "Today at 3:00 PM", 
    assigned_by: "Self",
    completed_at: "Today at 3:15 PM",
    description: "Write today's specials on the menu board with descriptions and prices."
  }
];

const WaiterTasks = () => {
  const { t } = useLanguage();
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<"view" | "create" | "edit">("view");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const openTaskDialog = (task: any = null, mode: "view" | "create" | "edit" = "view") => {
    setSelectedTask(task);
    setDialogMode(mode);
    setShowTaskDialog(true);
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-red-600 bg-red-100 border-red-200";
      case "Medium": return "text-amber-600 bg-amber-100 border-amber-200";
      case "Low": return "text-blue-600 bg-blue-100 border-blue-200";
      default: return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800 border-green-300";
      case "In Progress": return "bg-blue-100 text-blue-800 border-blue-300";
      case "Pending": return "bg-amber-100 text-amber-800 border-amber-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };
  
  const filteredTasks = tasks.filter(task => {
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });
  
  const pendingTasks = filteredTasks.filter(task => task.status !== "Completed");
  const completedTasks = filteredTasks.filter(task => task.status === "Completed");
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title={t("My Tasks")} 
        description={t("Manage and track your assigned tasks")}
        actions={
          <Button onClick={() => openTaskDialog(null, "create")}>
            <Plus className="mr-2 h-4 w-4" />
            <T text="Create Task" />
          </Button>
        }
      />
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("Search tasks...")}
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <span>{filterPriority === "all" ? t("All Priorities") : t(filterPriority)}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("All Priorities")}</SelectItem>
              <SelectItem value="High">{t("High")}</SelectItem>
              <SelectItem value="Medium">{t("Medium")}</SelectItem>
              <SelectItem value="Low">{t("Low")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">
            <ClipboardList className="h-4 w-4 mr-2" />
            <T text="Pending Tasks" />
          </TabsTrigger>
          <TabsTrigger value="completed">
            <CheckSquare className="h-4 w-4 mr-2" />
            <T text="Completed Tasks" />
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <div className="space-y-4">
            {pendingTasks.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <CheckSquare className="h-10 w-10 mb-2" />
                  <p>{t("No pending tasks")}</p>
                  <p className="text-sm">{t("All caught up! Create a new task or take a moment to relax.")}</p>
                  <Button className="mt-4" onClick={() => openTaskDialog(null, "create")}>
                    <Plus className="mr-2 h-4 w-4" />
                    <T text="Create Task" />
                  </Button>
                </CardContent>
              </Card>
            ) : (
              pendingTasks.map((task) => (
                <Card key={task.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="p-4 cursor-pointer" onClick={() => openTaskDialog(task)}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-start gap-2">
                        <Badge className={`mt-0.5 ${getPriorityColor(task.priority)}`}>
                          {t(task.priority)}
                        </Badge>
                        <h3 className="font-medium">{t(task.title)}</h3>
                      </div>
                      <Badge className={getStatusColor(task.status)}>
                        {t(task.status)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {task.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>{t("Due")}: {task.due}</span>
                      </div>
                      <div className="flex items-center">
                        <AlertCircle className="h-3.5 w-3.5 mr-1" />
                        <span>{t("Category")}: {t(task.category)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>{t("Assigned by")}: {t(task.assigned_by)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-4 py-3 bg-muted/40 border-t flex justify-end gap-2">
                    {task.status === "Pending" ? (
                      <Button size="sm" onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTask(task);
                        setShowConfirmDialog(true);
                      }}>
                        <CheckSquare className="h-4 w-4 mr-2" />
                        <T text="Mark Complete" />
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline">
                        <T text="Continue Working" />
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        openTaskDialog(task, "edit");
                      }}
                    >
                      <T text="Edit" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="completed">
          <div className="space-y-4">
            {completedTasks.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <ClipboardList className="h-10 w-10 mb-2" />
                  <p>{t("No completed tasks")}</p>
                  <p className="text-sm">{t("Complete tasks will appear here so you can track your accomplishments.")}</p>
                </CardContent>
              </Card>
            ) : (
              completedTasks.map((task) => (
                <Card key={task.id} className="overflow-hidden opacity-80 hover:opacity-100 transition-opacity duration-200">
                  <div className="p-4 cursor-pointer" onClick={() => openTaskDialog(task)}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-start gap-2">
                        <Badge className={`mt-0.5 ${getPriorityColor(task.priority)}`}>
                          {t(task.priority)}
                        </Badge>
                        <h3 className="font-medium">{t(task.title)}</h3>
                      </div>
                      <Badge className={getStatusColor(task.status)}>
                        {t(task.status)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {task.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>{t("Due")}: {task.due}</span>
                      </div>
                      <div className="flex items-center">
                        <CheckSquare className="h-3.5 w-3.5 mr-1" />
                        <span>{t("Completed")}: {task.completed_at}</span>
                      </div>
                      <div className="flex items-center">
                        <AlertCircle className="h-3.5 w-3.5 mr-1" />
                        <span>{t("Category")}: {t(task.category)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Task Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" ? t("Create New Task") : 
               dialogMode === "edit" ? t("Edit Task") : 
               t("Task Details")}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {dialogMode !== "view" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="title">{t("Task Title")}</Label>
                  <Input 
                    id="title" 
                    defaultValue={selectedTask?.title} 
                    placeholder={t("Enter task title")} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">{t("Description")}</Label>
                  <Textarea 
                    id="description" 
                    defaultValue={selectedTask?.description} 
                    placeholder={t("Enter task description")} 
                    rows={3} 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">{t("Priority")}</Label>
                    <Select defaultValue={selectedTask?.priority || "Medium"}>
                      <SelectTrigger id="priority">
                        <SelectValue placeholder={t("Select priority")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">{t("High")}</SelectItem>
                        <SelectItem value="Medium">{t("Medium")}</SelectItem>
                        <SelectItem value="Low">{t("Low")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">{t("Category")}</Label>
                    <Select defaultValue={selectedTask?.category || "Administrative"}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder={t("Select category")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Administrative">{t("Administrative")}</SelectItem>
                        <SelectItem value="Preparation">{t("Preparation")}</SelectItem>
                        <SelectItem value="Cleaning">{t("Cleaning")}</SelectItem>
                        <SelectItem value="Maintenance">{t("Maintenance")}</SelectItem>
                        <SelectItem value="Training">{t("Training")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="due">{t("Due Date & Time")}</Label>
                  <Input 
                    id="due" 
                    type="datetime-local" 
                    defaultValue={new Date().toISOString().slice(0, 16)} 
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getPriorityColor(selectedTask?.priority)}>
                      {t(selectedTask?.priority)}
                    </Badge>
                    <Badge className={getStatusColor(selectedTask?.status)}>
                      {t(selectedTask?.status)}
                    </Badge>
                  </div>
                  <h2 className="text-xl font-medium mb-2">{selectedTask?.title}</h2>
                  <p className="text-sm mb-4">{selectedTask?.description}</p>
                  
                  <Separator className="my-3" />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <Calendar className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{t("Due")}</p>
                        <p className="text-muted-foreground">{selectedTask?.due}</p>
                      </div>
                    </div>
                    
                    {selectedTask?.status === "Completed" && selectedTask?.completed_at && (
                      <div className="flex items-start">
                        <CheckSquare className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{t("Completed")}</p>
                          <p className="text-muted-foreground">{selectedTask?.completed_at}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start">
                      <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{t("Category")}</p>
                        <p className="text-muted-foreground">{t(selectedTask?.category)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{t("Assigned by")}</p>
                        <p className="text-muted-foreground">{t(selectedTask?.assigned_by)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            {dialogMode === "view" ? (
              <div className="flex w-full justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setShowTaskDialog(false)}
                >
                  <T text="Close" />
                </Button>
                
                <div className="flex gap-2">
                  {selectedTask?.status !== "Completed" && (
                    <Button 
                      variant="default"
                      onClick={() => {
                        setShowTaskDialog(false);
                        setShowConfirmDialog(true);
                      }}
                    >
                      <CheckSquare className="mr-2 h-4 w-4" />
                      <T text="Mark Complete" />
                    </Button>
                  )}
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setDialogMode("edit");
                    }}
                  >
                    <T text="Edit Task" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (dialogMode === "edit" && selectedTask) {
                      setDialogMode("view");
                    } else {
                      setShowTaskDialog(false);
                    }
                  }}
                >
                  <T text="Cancel" />
                </Button>
                <Button onClick={() => setShowTaskDialog(false)}>
                  {dialogMode === "create" ? t("Create Task") : t("Save Changes")}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Confirm Complete Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={() => {
          // Here we would update the task status to completed
          // Then close the dialog
          setShowConfirmDialog(false);
        }}
        title={t("Complete Task")}
        description={t("Are you sure you want to mark this task as complete?")}
        confirmLabel={t("Mark Complete")}
        cancelLabel={t("Cancel")}
      />
    </div>
  );
};

export default WaiterTasks;
