
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ListChecks, Loader2, Plus } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  due?: string;
}

interface TasksWidgetProps {
  staffId: string;
  staffName: string;
}

const TasksWidget: React.FC<TasksWidgetProps> = ({ staffId, staffName }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        // For demo purposes, we'll use hardcoded tasks
        // In production, we would fetch from the database
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        
        const demoTasks: Task[] = [
          {
            id: '1',
            title: 'Check if all tables are properly set',
            completed: false,
            priority: 'high',
            due: 'Today'
          },
          {
            id: '2',
            title: 'Review daily specials and menu changes',
            completed: true,
            priority: 'high',
            due: 'Today'
          },
          {
            id: '3',
            title: 'Prepare welcome drinks for reservations',
            completed: false,
            priority: 'medium',
            due: 'Today'
          },
          {
            id: '4',
            title: 'Clean and restock service station',
            completed: false,
            priority: 'medium'
          }
        ];
        
        setTasks(demoTasks);
      } catch (error: any) {
        console.error("Error fetching tasks:", error);
        toast({
          title: "Error",
          description: "Failed to load tasks",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, [staffId]);
  
  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
    
    // In production, we would update the database here
    toast({
      title: "Task updated",
      description: "Task status has been updated",
    });
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case 'medium':
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case 'low':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center">
          <ListChecks className="h-4 w-4 mr-2" />
          <T text="Today's Tasks" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {tasks.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <T text="No tasks assigned today" />
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map(task => (
                  <div key={task.id} className="flex items-start gap-2">
                    <Checkbox 
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label 
                        htmlFor={`task-${task.id}`}
                        className={`text-sm font-medium flex flex-wrap items-center gap-2 ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {task.title}
                        {task.priority && (
                          <Badge variant="outline" className={`text-[10px] py-0 h-4 ${getPriorityColor(task.priority)}`}>
                            {t(task.priority)}
                          </Badge>
                        )}
                      </label>
                      {task.due && (
                        <p className="text-xs text-muted-foreground">
                          <T text="Due" />: {task.due}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-4"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              <T text="Add Task" />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TasksWidget;
