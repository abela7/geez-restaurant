import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Search, Plus, Calendar, Clock, CheckCircle } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample tasks data
const tasks = [
  { id: 1, title: "Order supplies from vendor", assignee: "Abebe Kebede", due: "Today, 5:00 PM", priority: "High", status: "Pending", category: "Inventory" },
  { id: 2, title: "Clean dining area", assignee: "Dawit Tadesse", due: "Today, 9:00 AM", priority: "Medium", status: "Completed", category: "Cleaning" },
  { id: 3, title: "Staff meeting", assignee: "All Staff", due: "Tomorrow, 8:00 AM", priority: "High", status: "Pending", category: "Meeting" },
  { id: 4, title: "Update menu prices", assignee: "Abebe Kebede", due: "Jul 15, 5:00 PM", priority: "Medium", status: "Pending", category: "Menu" },
  { id: 5, title: "Repair kitchen equipment", assignee: "External", due: "Jul 14, 10:00 AM", priority: "High", status: "In Progress", category: "Maintenance" },
  { id: 6, title: "Train new waitstaff", assignee: "Sara Mengistu", due: "Jul 16, 2:00 PM", priority: "Medium", status: "Pending", category: "Training" },
];

const TaskManagement = () => {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title="Task Management" 
        description="Manage and assign tasks to your restaurant staff"
        actions={
          <Button>
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
            placeholder="Search tasks..."
            className="w-full pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            <T text="Calendar View" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all"><T text="All Tasks" /></TabsTrigger>
          <TabsTrigger value="pending"><T text="Pending" /></TabsTrigger>
          <TabsTrigger value="in-progress"><T text="In Progress" /></TabsTrigger>
          <TabsTrigger value="completed"><T text="Completed" /></TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Task" /></TableHead>
                  <TableHead><T text="Assignee" /></TableHead>
                  <TableHead><T text="Due" /></TableHead>
                  <TableHead><T text="Priority" /></TableHead>
                  <TableHead><T text="Status" /></TableHead>
                  <TableHead><T text="Category" /></TableHead>
                  <TableHead className="text-right"><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell>
                      {task.assignee === "All Staff" ? (
                        <Badge variant="outline">All Staff</Badge>
                      ) : task.assignee === "External" ? (
                        <Badge variant="outline">External</Badge>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <img src="/placeholder.svg" alt={task.assignee} />
                          </Avatar>
                          <span>{task.assignee}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{task.due}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={task.priority === "High" ? "destructive" : 
                                task.priority === "Medium" ? "default" : 
                                "outline"}
                      >
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={task.status === "Completed" ? "default" : 
                                task.status === "In Progress" ? "outline" : 
                                "secondary"}
                      >
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {task.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        disabled={task.status === "Completed"}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        <T text="Complete" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Other tabs would have filtered content */}
        <TabsContent value="pending">
          <Card className="p-4">
            <div className="text-center p-8 text-muted-foreground">
              <T text="Filtered view of pending tasks would appear here" />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="in-progress">
          <Card className="p-4">
            <div className="text-center p-8 text-muted-foreground">
              <T text="Filtered view of in-progress tasks would appear here" />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card className="p-4">
            <div className="text-center p-8 text-muted-foreground">
              <T text="Filtered view of completed tasks would appear here" />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskManagement;
