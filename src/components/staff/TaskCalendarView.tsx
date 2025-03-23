
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { StaffTask } from "@/hooks/useStaffTasks";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { format, isSameDay } from "date-fns";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import { T } from "@/contexts/LanguageContext";
import { getCategoryColor } from "@/constants/taskCategories";

interface TaskCalendarViewProps {
  tasks: StaffTask[];
  staffNames: Record<string, string>;
}

const TaskCalendarView: React.FC<TaskCalendarViewProps> = ({ tasks, staffNames }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Get tasks for the selected date
  const tasksForSelectedDate = selectedDate 
    ? tasks.filter(task => 
        task.due_date && isSameDay(new Date(task.due_date), selectedDate)
      )
    : [];
  
  // Function to highlight dates with tasks
  const highlightedDays = tasks
    .filter(task => task.due_date)
    .map(task => new Date(task.due_date as string));
  
  // Function to determine the priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 border-amber-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300 border-gray-200';
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      <Card className="md:col-span-4">
        <CardContent className="p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            highlightedDays={highlightedDays}
          />
        </CardContent>
      </Card>
      
      <Card className="md:col-span-8">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">
              {selectedDate ? (
                <span className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  <T text="Tasks for" /> {format(selectedDate, 'MMMM d, yyyy')}
                </span>
              ) : (
                <T text="Select a date to view tasks" />
              )}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(new Date())}
            >
              <T text="Today" />
            </Button>
          </div>
          
          {tasksForSelectedDate.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p><T text="No tasks scheduled for this date" /></p>
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {tasksForSelectedDate.map((task) => (
                  <div 
                    key={task.id} 
                    className="p-3 border rounded-md hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        {task.category && (
                          <Badge variant="outline" className={getCategoryColor(task.category)}>
                            {task.category}
                          </Badge>
                        )}
                        <Badge variant={task.status === 'Completed' ? 'default' : 'secondary'}>
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-between items-center mt-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          <T text="Assigned to" />: {staffNames[task.staff_id] || task.staff_id}
                        </span>
                      </div>
                      {task.due_time && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{task.due_time}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskCalendarView;
