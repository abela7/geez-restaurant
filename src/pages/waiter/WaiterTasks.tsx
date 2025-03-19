
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Search, CheckCircle, Clock, Plus, MessageSquare, Calendar } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample tasks data
const tasks = [
  { id: 1, title: "Process end-of-shift report", priority: "High", due: "Today, 10:00 PM", status: "Pending", notes: "Submit before leaving" },
  { id: 2, title: "Restock service stations", priority: "Medium", due: "Today, 4:30 PM", status: "Pending", notes: "Check napkins, condiments, and silverware" },
  { id: 3, title: "Train new waiter on POS system", priority: "Medium", due: "Tomorrow, 2:00 PM", status: "Pending", notes: "Focus on order entry and payment processing" },
  { id: 4, title: "Deep clean section 2", priority: "Low", due: "Friday, 11:00 AM", status: "Pending", notes: "Include under tables and booth seating" },
  { id: 5, title: "Staff meeting", priority: "High", due: "Thursday, 9:00 AM", status: "Pending", notes: "New menu items will be discussed" },
  { id: 6, title: "Update table chart", priority: "Low", due: "Today, 5:00 PM", status: "Completed", notes: "Mark tables that need maintenance" },
  { id: 7, title: "Complete customer feedback review", priority: "Medium", due: "Yesterday", status: "Overdue", notes: "Identify areas for improvement" },
];

const WaiterTasks = () => {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title="My Tasks" 
        description="Manage your assigned tasks and track completion"
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
            className="pl-9 w-full"
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
          <TabsTrigger value="completed"><T text="Completed" /></TabsTrigger>
          <TabsTrigger value="overdue"><T text="Overdue" /></TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Task" /></TableHead>
                  <TableHead><T text="Priority" /></TableHead>
                  <TableHead><T text="Due" /></TableHead>
                  <TableHead><T text="Status" /></TableHead>
                  <TableHead><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground">{task.notes}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          task.priority === "High" ? "destructive" : 
                          task.priority === "Medium" ? "default" : 
                          "outline"
                        }
                      >
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{task.due}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          task.status === "Completed" ? "default" : 
                          task.status === "Overdue" ? "destructive" : 
                          "secondary"
                        }
                      >
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          <T text="Notes" />
                        </Button>
                        {task.status !== "Completed" && (
                          <Button size="sm">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            <T text="Complete" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card className="p-4">
            <div className="text-center p-8 text-muted-foreground">
              <T text="Filtered view of pending tasks would appear here" />
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

        <TabsContent value="overdue">
          <Card className="p-4">
            <div className="text-center p-8 text-muted-foreground">
              <T text="Filtered view of overdue tasks would appear here" />
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Card>
          <div className="p-4 border-b">
            <h3 className="font-medium text-lg"><T text="Task Calendar" /></h3>
          </div>
          <div className="p-6 text-center">
            <p className="text-muted-foreground"><T text="A calendar view showing all tasks would be displayed here" /></p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WaiterTasks;
