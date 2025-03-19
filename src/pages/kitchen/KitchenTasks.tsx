
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { CheckCircle, Clock, AlarmClock, Plus, Calendar, ListChecks } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample tasks data
const tasks = [
  { id: 1, title: "Prepare berbere spice mix", priority: "High", due: "Today, 11:00 AM", status: "Pending", assignee: "Makeda Haile" },
  { id: 2, title: "Clean kitchen equipment", priority: "Medium", due: "Today, 3:00 PM", status: "Pending", assignee: "Kitchen Staff" },
  { id: 3, title: "Inventory check - meats", priority: "High", due: "Today, 5:00 PM", status: "Pending", assignee: "Makeda Haile" },
  { id: 4, title: "Prepare doro wat base sauce", priority: "Medium", due: "Today, 2:00 PM", status: "In Progress", assignee: "Solomon Tadesse" },
  { id: 5, title: "Restock prep station", priority: "Low", due: "Today, 4:30 PM", status: "Pending", assignee: "Kitchen Staff" },
  { id: 6, title: "Prep vegetables for dinner service", priority: "High", due: "Today, 4:00 PM", status: "Pending", assignee: "Kitchen Staff" },
  { id: 7, title: "Check refrigerator temperature", priority: "Medium", due: "Today, 12:00 PM", status: "Completed", assignee: "Makeda Haile" },
  { id: 8, title: "Organize dry storage", priority: "Low", due: "Tomorrow, 10:00 AM", status: "Pending", assignee: "Kitchen Staff" },
];

// Sample daily checklist
const dailyChecklist = [
  { id: 1, title: "Check walk-in refrigerator temperature", time: "8:00 AM", completed: true },
  { id: 2, title: "Clean and sanitize prep surfaces", time: "8:15 AM", completed: true },
  { id: 3, title: "Check inventory of key ingredients", time: "8:30 AM", completed: false },
  { id: 4, title: "Prepare base sauces", time: "9:00 AM", completed: false },
  { id: 5, title: "Staff pre-service meeting", time: "10:00 AM", completed: false },
  { id: 6, title: "Lunch service preparation", time: "10:30 AM", completed: false },
  { id: 7, title: "Mid-day cleanup", time: "2:30 PM", completed: false },
  { id: 8, title: "Dinner service preparation", time: "4:00 PM", completed: false },
  { id: 9, title: "Equipment shutdown and cleaning", time: "10:00 PM", completed: false },
  { id: 10, title: "Final kitchen inspection", time: "10:30 PM", completed: false },
];

const KitchenTasks = () => {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title="Kitchen Tasks" 
        description="Manage and track kitchen preparation tasks"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            <T text="Add Task" />
          </Button>
        }
      />

      <Tabs defaultValue="tasks">
        <TabsList className="mb-4">
          <TabsTrigger value="tasks">
            <ListChecks className="h-4 w-4 mr-2" />
            <T text="Tasks" />
          </TabsTrigger>
          <TabsTrigger value="daily-checklist">
            <Calendar className="h-4 w-4 mr-2" />
            <T text="Daily Checklist" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <Card>
            <Tabs defaultValue="pending" className="w-full">
              <div className="p-4 border-b">
                <TabsList>
                  <TabsTrigger value="pending"><T text="Pending" /></TabsTrigger>
                  <TabsTrigger value="in-progress"><T text="In Progress" /></TabsTrigger>
                  <TabsTrigger value="completed"><T text="Completed" /></TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="pending" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><T text="Task" /></TableHead>
                      <TableHead><T text="Priority" /></TableHead>
                      <TableHead><T text="Due" /></TableHead>
                      <TableHead><T text="Assignee" /></TableHead>
                      <TableHead><T text="Actions" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.filter(task => task.status === "Pending").map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
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
                        <TableCell>{task.assignee}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <T text="Start" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="in-progress" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><T text="Task" /></TableHead>
                      <TableHead><T text="Priority" /></TableHead>
                      <TableHead><T text="Due" /></TableHead>
                      <TableHead><T text="Assignee" /></TableHead>
                      <TableHead><T text="Actions" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.filter(task => task.status === "In Progress").map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
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
                        <TableCell>{task.assignee}</TableCell>
                        <TableCell>
                          <Button size="sm">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            <T text="Complete" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="completed" className="m-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><T text="Task" /></TableHead>
                      <TableHead><T text="Priority" /></TableHead>
                      <TableHead><T text="Due" /></TableHead>
                      <TableHead><T text="Assignee" /></TableHead>
                      <TableHead><T text="Status" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.filter(task => task.status === "Completed").map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
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
                        <TableCell>{task.assignee}</TableCell>
                        <TableCell>
                          <Badge variant="default">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            <T text="Completed" />
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </Card>
        </TabsContent>

        <TabsContent value="daily-checklist">
          <Card>
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium text-lg"><T text="Kitchen Daily Checklist" /></h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {dailyChecklist.filter(item => item.completed).length} / {dailyChecklist.length} <T text="completed" />
                </span>
                <Button variant="outline" size="sm">
                  <T text="Reset for Tomorrow" />
                </Button>
              </div>
            </div>
            
            <div className="divide-y">
              {dailyChecklist.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      item.completed ? 'bg-primary text-primary-foreground' : 'border border-input'
                    }`}>
                      {item.completed && <CheckCircle className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {item.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-muted-foreground text-sm">
                      <AlarmClock className="h-4 w-4 mr-1" />
                      <span>{item.time}</span>
                    </div>
                    {!item.completed && (
                      <Button size="sm">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        <T text="Mark Complete" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KitchenTasks;
