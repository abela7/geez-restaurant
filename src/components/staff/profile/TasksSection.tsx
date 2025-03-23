
import React, { useState, useEffect } from "react";
import { T } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { getCategoryName, getCategoryColor } from "@/constants/taskCategories";

interface TasksSectionProps {
  staffId: string;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  completed_at: string | null;
  category: string | null;
}

const TasksSection: React.FC<TasksSectionProps> = ({ staffId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('staff_tasks')
          .select('*')
          .eq('staff_id', staffId)
          .order('due_date', { ascending: true })
          .limit(5);
        
        if (error) throw error;
        
        setTasks(data as Task[]);
      } catch (err: any) {
        console.error('Error fetching tasks:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, [staffId]);
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400";
      case "Medium":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Low":
        return "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg font-medium">
          <CheckSquare className="mr-2 h-5 w-5" />
          <T text="Assigned Tasks" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center p-4">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent text-primary rounded-full"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">
            <p>{error}</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            <p><T text="No tasks assigned" /></p>
          </div>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li key={task.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium">{task.title}</h4>
                      <Badge className={`ml-2 ${getStatusColor(task.status)}`}>
                        {task.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-1">
                      {task.category && (
                        <Badge variant="outline" className={getCategoryColor(task.category)}>
                          {getCategoryName(task.category)}
                        </Badge>
                      )}
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {task.description}
                      </p>
                    )}
                  </div>
                  
                  {task.due_date && (
                    <div className="text-sm text-muted-foreground flex items-center whitespace-nowrap ml-4">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDate(task.due_date)}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default TasksSection;
