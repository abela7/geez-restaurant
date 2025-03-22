
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { CheckCircle, Clock, AlarmClock, Plus, Calendar, ListChecks, Grid, List, Filter, Search } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  
  // Filter tasks based on search query, priority, and assignee
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === "all" || task.priority.toLowerCase() === priorityFilter.toLowerCase();
    const matchesAssignee = assigneeFilter === "all" || task.assignee === assigneeFilter;
    return matchesSearch && matchesPriority && matchesAssignee;
  });
  
  // Get unique assignees for filter dropdown
  const uniqueAssignees = Array.from(new Set(tasks.map(task => task.assignee)));

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold"><T text="Kitchen Tasks" /></h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          <T text="Add Task" />
        </Button>
      </div>

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
          <div className="mb-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all"><T text="All Priorities" /></SelectItem>
                  <SelectItem value="high"><T text="High" /></SelectItem>
                  <SelectItem value="medium"><T text="Medium" /></SelectItem>
                  <SelectItem value="low"><T text="Low" /></SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all"><T text="All Staff" /></SelectItem>
                  {uniqueAssignees.map((assignee) => (
                    <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="border rounded-md flex">
                <Button 
                  variant={viewMode === "grid" ? "default" : "ghost"} 
                  size="icon" 
                  className="h-9 w-9 rounded-r-none"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === "list" ? "default" : "ghost"} 
                  size="icon" 
                  className="h-9 w-9 rounded-l-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
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
                {viewMode === "list" ? (
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
                      {filteredTasks.filter(task => task.status === "Pending").map((task) => (
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
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {filteredTasks.filter(task => task.status === "Pending").map((task) => (
                      <Card key={task.id} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-base">{task.title}</h3>
                          <Badge 
                            variant={
                              task.priority === "High" ? "destructive" : 
                              task.priority === "Medium" ? "default" : 
                              "outline"
                            }
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center text-muted-foreground text-sm mb-3">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{task.due}</span>
                        </div>
                        <div className="flex items-center text-sm mb-4">
                          <span className="font-medium mr-2"><T text="Assignee:" /></span>
                          <span>{task.assignee}</span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          <T text="Start" />
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="in-progress" className="m-0">
                {viewMode === "list" ? (
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
                      {filteredTasks.filter(task => task.status === "In Progress").map((task) => (
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
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {filteredTasks.filter(task => task.status === "In Progress").map((task) => (
                      <Card key={task.id} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-base">{task.title}</h3>
                          <Badge 
                            variant={
                              task.priority === "High" ? "destructive" : 
                              task.priority === "Medium" ? "default" : 
                              "outline"
                            }
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center text-muted-foreground text-sm mb-3">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{task.due}</span>
                        </div>
                        <div className="flex items-center text-sm mb-4">
                          <span className="font-medium mr-2"><T text="Assignee:" /></span>
                          <span>{task.assignee}</span>
                        </div>
                        <Button size="sm" className="w-full">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          <T text="Complete" />
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="m-0">
                {viewMode === "list" ? (
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
                      {filteredTasks.filter(task => task.status === "Completed").map((task) => (
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
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {filteredTasks.filter(task => task.status === "Completed").map((task) => (
                      <Card key={task.id} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-base">{task.title}</h3>
                          <Badge 
                            variant={
                              task.priority === "High" ? "destructive" : 
                              task.priority === "Medium" ? "default" : 
                              "outline"
                            }
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center text-muted-foreground text-sm mb-3">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{task.due}</span>
                        </div>
                        <div className="flex items-center text-sm mb-4">
                          <span className="font-medium mr-2"><T text="Assignee:" /></span>
                          <span>{task.assignee}</span>
                        </div>
                        <Badge variant="default" className="w-fit">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          <T text="Completed" />
                        </Badge>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </TabsContent>

        <TabsContent value="daily-checklist">
          <div className="mb-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search checklist..."
                className="pl-9 w-full"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="border rounded-md flex">
                <Button 
                  variant={viewMode === "grid" ? "default" : "ghost"} 
                  size="icon" 
                  className="h-9 w-9 rounded-r-none"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === "list" ? "default" : "ghost"} 
                  size="icon" 
                  className="h-9 w-9 rounded-l-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              <Button variant="outline" size="sm">
                <T text="Reset for Tomorrow" />
              </Button>
            </div>
          </div>
          
          <Card>
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium text-lg"><T text="Kitchen Daily Checklist" /></h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {dailyChecklist.filter(item => item.completed).length} / {dailyChecklist.length} <T text="completed" />
                </span>
              </div>
            </div>
            
            {viewMode === "list" ? (
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
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {dailyChecklist.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 mt-0.5 rounded-full flex-shrink-0 flex items-center justify-center ${
                        item.completed ? 'bg-primary text-primary-foreground' : 'border border-input'
                      }`}>
                        {item.completed && <CheckCircle className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium mb-2 ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {item.title}
                        </p>
                        <div className="flex items-center text-muted-foreground text-sm mb-3">
                          <AlarmClock className="h-4 w-4 mr-1" />
                          <span>{item.time}</span>
                        </div>
                        {!item.completed && (
                          <Button size="sm" className="w-full">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            <T text="Mark Complete" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KitchenTasks;
