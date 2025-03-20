
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, PhoneCall, Mail, Clock, DollarSign, Calendar, 
  Star, BarChart, DownloadIcon, Printer, Edit, Trash, PlusCircle
} from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import ErrorDisplay from "@/components/staff/ErrorDisplay";
import StaffLoadingState from "@/components/staff/StaffLoadingState";
import PayrollList from "@/components/staff/PayrollList";
import AttendanceList from "@/components/staff/AttendanceList";
import TasksList from "@/components/staff/TasksList";

// Custom hooks for staff data
import useStaffProfile from "@/hooks/useStaffProfile";
import useStaffAttendance from "@/hooks/useStaffAttendance";
import useStaffPayroll from "@/hooks/useStaffPayroll";
import useStaffTasks from "@/hooks/useStaffTasks";
import { useToast } from "@/hooks/use-toast";

const StaffProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  // Fetch staff profile data
  const { 
    staffMember, 
    isLoading: isProfileLoading, 
    error: profileError 
  } = useStaffProfile(id || '');
  
  // Fetch attendance records
  const { 
    attendanceRecords, 
    isLoading: isAttendanceLoading, 
    error: attendanceError,
    addAttendanceRecord,
    updateAttendanceRecord 
  } = useStaffAttendance(id || '');
  
  // Fetch payroll records
  const { 
    payrollRecords, 
    isLoading: isPayrollLoading, 
    error: payrollError,
    updatePayrollRecord 
  } = useStaffPayroll(id || '');
  
  // Fetch tasks
  const { 
    tasks, 
    isLoading: isTasksLoading, 
    error: tasksError,
    addTask,
    updateTask,
    deleteTask 
  } = useStaffTasks(id || '');
  
  // States for new record dialogs
  const [newAttendanceDialog, setNewAttendanceDialog] = useState(false);
  const [newTaskDialog, setNewTaskDialog] = useState(false);
  const [newPayrollDialog, setNewPayrollDialog] = useState(false);
  
  // Handler for updating payroll status
  const handleUpdatePaymentStatus = async (payrollId: string, status: string) => {
    try {
      await updatePayrollRecord(payrollId, { 
        payment_status: status,
        payment_date: status === 'Paid' ? new Date().toISOString() : null
      });
    } catch (error) {
      console.error('Failed to update payment status:', error);
    }
  };
  
  // Handler for updating task status
  const handleUpdateTaskStatus = async (taskId: string, status: string) => {
    try {
      await updateTask(taskId, { 
        status,
        completed_at: status === 'Completed' ? new Date().toISOString() : null
      });
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };
  
  // Handler for deleting a task
  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };
  
  // Handler for attendance form submission
  const handleAttendanceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!id) return;
    
    const formData = new FormData(e.currentTarget);
    const date = formData.get('date') as string;
    const status = formData.get('status') as string;
    const checkIn = formData.get('checkIn') as string;
    const checkOut = formData.get('checkOut') as string;
    const notes = formData.get('notes') as string;
    
    let hoursWorked = 0;
    
    if (checkIn && checkOut) {
      const checkInDate = new Date(`2000-01-01T${checkIn}`);
      const checkOutDate = new Date(`2000-01-01T${checkOut}`);
      hoursWorked = (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60);
    }
    
    try {
      const newRecord = {
        staff_id: id,
        date,
        status,
        check_in: checkIn ? `${date}T${checkIn}:00` : null,
        check_out: checkOut ? `${date}T${checkOut}:00` : null,
        hours_worked: hoursWorked,
        notes
      };
      
      await addAttendanceRecord(newRecord);
      setNewAttendanceDialog(false);
    } catch (error) {
      console.error('Failed to add attendance record:', error);
    }
  };
  
  // Handler for task form submission
  const handleTaskSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!id) return;
    
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const priority = formData.get('priority') as string;
    const dueDate = formData.get('dueDate') as string;
    
    try {
      const newTask = {
        staff_id: id,
        title,
        description,
        priority,
        status: 'Pending',
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
        completed_at: null
      };
      
      await addTask(newTask);
      setNewTaskDialog(false);
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };
  
  // Handler for payroll form submission
  const handlePayrollSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!id || !staffMember) return;
    
    const formData = new FormData(e.currentTarget);
    const payPeriod = formData.get('payPeriod') as string;
    const regularHours = parseFloat(formData.get('regularHours') as string);
    const overtimeHours = parseFloat(formData.get('overtimeHours') as string);
    const hourlyRate = staffMember.hourly_rate || 0;
    
    const totalHours = regularHours + overtimeHours;
    const totalPay = (regularHours * hourlyRate) + (overtimeHours * hourlyRate * 1.5);
    
    try {
      const newPayroll = {
        staff_id: id,
        pay_period: payPeriod,
        regular_hours: regularHours,
        overtime_hours: overtimeHours,
        total_hours: totalHours,
        total_pay: totalPay,
        payment_status: 'Pending',
        payment_date: null
      };
      
      await addPayrollRecord(newPayroll);
      setNewPayrollDialog(false);
    } catch (error) {
      console.error('Failed to add payroll record:', error);
    }
  };
  
  // Export data to CSV
  const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) {
      toast({
        title: "Error",
        description: "No data to export",
        variant: "destructive"
      });
      return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          let value = row[header];
          // Handle special formatting
          if (value === null || value === undefined) value = '';
          if (typeof value === 'string') value = `"${value.replace(/"/g, '""')}"`;
          return value;
        }).join(',')
      )
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create a link to download
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Success",
      description: `${filename} exported successfully`,
    });
  };
  
  if (isProfileLoading) {
    return (
      <Layout interface="admin">
        <div className="container mx-auto py-6">
          <PageHeader 
            heading={<T text="Staff Profile" />}
            description={<T text="Loading staff details..." />}
          />
          <Card>
            <StaffLoadingState />
          </Card>
        </div>
      </Layout>
    );
  }

  if (profileError || !staffMember) {
    return (
      <Layout interface="admin">
        <div className="container mx-auto py-6">
          <PageHeader 
            heading={<T text="Staff Profile" />}
            description={<T text="View and manage staff details" />}
          />
          <ErrorDisplay error={profileError || "Staff member not found"} />
          <div className="text-center py-8">
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/admin/staff")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <T text="Back to Staff Management" />
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const getFullName = () => {
    return `${staffMember.first_name || ""} ${staffMember.last_name || ""}`.trim() || "No Name";
  };

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
              <Edit className="mr-2 h-4 w-4" />
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
                    src={staffMember.image_url || "/placeholder.svg"}
                    alt={getFullName()}
                    className="aspect-square h-full w-full object-cover"
                  />
                </Avatar>
                <h2 className="text-xl font-bold">{getFullName()}</h2>
                <div className="mt-1 flex items-center">
                  <Badge>{staffMember.role}</Badge>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{staffMember.bio || "No bio available"}</p>
                
                <div className="mt-6 w-full space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <PhoneCall className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{staffMember.phone || "No phone"}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{staffMember.email || "No email"}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">
                        <T text="Started on" /> {staffMember.start_date ? format(new Date(staffMember.start_date), 'MMM dd, yyyy') : 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">£{staffMember.hourly_rate?.toFixed(2) || '0.00'}/hr</span>
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
                {staffMember.skills && staffMember.skills.length > 0 ? (
                  staffMember.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="mr-2 mb-2">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No skills listed</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Tabs defaultValue="performance">
            <TabsList className="mb-4">
              <TabsTrigger value="performance"><T text="Performance" /></TabsTrigger>
              <TabsTrigger value="attendance"><T text="Attendance" /></TabsTrigger>
              <TabsTrigger value="payroll"><T text="Payroll" /></TabsTrigger>
              <TabsTrigger value="tasks"><T text="Tasks" /></TabsTrigger>
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
                          <span className="font-medium">{staffMember.performance || 0}%</span>
                        </div>
                      </div>
                      <Progress value={staffMember.performance || 0} className="h-2" />
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
                          {staffMember.attendance || "Unknown"}
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
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => exportToCSV([
                    { metric: 'Customer Service', value: 92 },
                    { metric: 'Team Collaboration', value: 88 },
                    { metric: 'Speed & Efficiency', value: 95 },
                    { metric: 'Quality of Work', value: 96 }
                  ], `${getFullName()}_Performance`)}>
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    <T text="Export Data" />
                  </Button>
                  <Button variant="outline">
                    <Printer className="mr-2 h-4 w-4" />
                    <T text="Print Report" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="attendance">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle><T text="Attendance Records" /></CardTitle>
                    <CardDescription><T text="Staff check-in and check-out times" /></CardDescription>
                  </div>
                  <Dialog open={newAttendanceDialog} onOpenChange={setNewAttendanceDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <T text="Add Record" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle><T text="Add Attendance Record" /></DialogTitle>
                        <DialogDescription>
                          <T text="Add a new attendance record for" /> {getFullName()}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAttendanceSubmit}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">
                              <T text="Date" />
                            </Label>
                            <Input
                              id="date"
                              name="date"
                              type="date"
                              defaultValue={new Date().toISOString().split('T')[0]}
                              className="col-span-3"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                              <T text="Status" />
                            </Label>
                            <Select name="status" defaultValue="Present">
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder={t("Select status")} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Present">Present</SelectItem>
                                <SelectItem value="Late">Late</SelectItem>
                                <SelectItem value="Absent">Absent</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="checkIn" className="text-right">
                              <T text="Check In" />
                            </Label>
                            <Input
                              id="checkIn"
                              name="checkIn"
                              type="time"
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="checkOut" className="text-right">
                              <T text="Check Out" />
                            </Label>
                            <Input
                              id="checkOut"
                              name="checkOut"
                              type="time"
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="notes" className="text-right">
                              <T text="Notes" />
                            </Label>
                            <Input
                              id="notes"
                              name="notes"
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit"><T text="Save Record" /></Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {attendanceError ? (
                    <ErrorDisplay error={attendanceError} />
                  ) : (
                    <AttendanceList 
                      attendanceRecords={attendanceRecords}
                      isLoading={isAttendanceLoading}
                    />
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => exportToCSV(attendanceRecords, `${getFullName()}_Attendance`)}
                    disabled={attendanceRecords.length === 0}
                  >
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    <T text="Export Data" />
                  </Button>
                  <Button variant="outline" disabled={attendanceRecords.length === 0}>
                    <Printer className="mr-2 h-4 w-4" />
                    <T text="Print Report" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="payroll">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle><T text="Payroll Records" /></CardTitle>
                    <CardDescription><T text="Staff payment history" /></CardDescription>
                  </div>
                  <Dialog open={newPayrollDialog} onOpenChange={setNewPayrollDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <T text="Add Payroll" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle><T text="Add Payroll Record" /></DialogTitle>
                        <DialogDescription>
                          <T text="Add a new payroll record for" /> {getFullName()}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handlePayrollSubmit}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="payPeriod" className="text-right">
                              <T text="Pay Period" />
                            </Label>
                            <Input
                              id="payPeriod"
                              name="payPeriod"
                              placeholder="e.g. July 1-15, 2023"
                              className="col-span-3"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="regularHours" className="text-right">
                              <T text="Regular Hours" />
                            </Label>
                            <Input
                              id="regularHours"
                              name="regularHours"
                              type="number"
                              min="0"
                              step="0.5"
                              defaultValue="80"
                              className="col-span-3"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="overtimeHours" className="text-right">
                              <T text="Overtime Hours" />
                            </Label>
                            <Input
                              id="overtimeHours"
                              name="overtimeHours"
                              type="number"
                              min="0"
                              step="0.5"
                              defaultValue="0"
                              className="col-span-3"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="hourlyRate" className="text-right">
                              <T text="Hourly Rate" />
                            </Label>
                            <div className="col-span-3 flex items-center">
                              <span className="text-muted-foreground">£{staffMember.hourly_rate?.toFixed(2) || '0.00'}</span>
                              <span className="ml-2 text-xs text-muted-foreground">(<T text="Defined in profile" />)</span>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit"><T text="Save Record" /></Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {payrollError ? (
                    <ErrorDisplay error={payrollError} />
                  ) : (
                    <PayrollList 
                      payrollRecords={payrollRecords}
                      isLoading={isPayrollLoading}
                      onUpdateStatus={handleUpdatePaymentStatus}
                    />
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => exportToCSV(payrollRecords, `${getFullName()}_Payroll`)}
                    disabled={payrollRecords.length === 0}
                  >
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    <T text="Export Data" />
                  </Button>
                  <Button variant="outline" disabled={payrollRecords.length === 0}>
                    <Printer className="mr-2 h-4 w-4" />
                    <T text="Print Report" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="tasks">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle><T text="Tasks" /></CardTitle>
                    <CardDescription><T text="Assigned tasks and deadlines" /></CardDescription>
                  </div>
                  <Dialog open={newTaskDialog} onOpenChange={setNewTaskDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <T text="Add Task" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle><T text="Assign New Task" /></DialogTitle>
                        <DialogDescription>
                          <T text="Assign a new task to" /> {getFullName()}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleTaskSubmit}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                              <T text="Title" />
                            </Label>
                            <Input
                              id="title"
                              name="title"
                              placeholder="Task title"
                              className="col-span-3"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                              <T text="Description" />
                            </Label>
                            <Input
                              id="description"
                              name="description"
                              placeholder="Task description"
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="priority" className="text-right">
                              <T text="Priority" />
                            </Label>
                            <Select name="priority" defaultValue="Medium">
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder={t("Select priority")} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="dueDate" className="text-right">
                              <T text="Due Date" />
                            </Label>
                            <Input
                              id="dueDate"
                              name="dueDate"
                              type="date"
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit"><T text="Assign Task" /></Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {tasksError ? (
                    <ErrorDisplay error={tasksError} />
                  ) : (
                    <TasksList 
                      tasks={tasks}
                      isLoading={isTasksLoading}
                      onUpdateStatus={handleUpdateTaskStatus}
                      onDelete={handleDeleteTask}
                    />
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => exportToCSV(tasks, `${getFullName()}_Tasks`)}
                    disabled={tasks.length === 0}
                  >
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    <T text="Export Data" />
                  </Button>
                  <Button variant="outline" disabled={tasks.length === 0}>
                    <Printer className="mr-2 h-4 w-4" />
                    <T text="Print Report" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default StaffProfile;
