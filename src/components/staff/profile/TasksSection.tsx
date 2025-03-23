
import React, { useState, useEffect } from "react";
import { T } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckSquare, Clock, ArrowUpDown, Filter, 
  ChevronLeft, ChevronRight, Tag
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { getCategoryName, getCategoryColor } from "@/constants/taskCategories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{field: string, direction: 'asc' | 'desc'}>({
    field: "due_date",
    direction: "asc"
  });
  const pageSize = 5;
  
  useEffect(() => {
    fetchTasks();
  }, [staffId, statusFilter, categoryFilter, page, sorting]);
  
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('staff_tasks')
        .select('*')
        .eq('staff_id', staffId)
        .order(sorting.field, { ascending: sorting.direction === 'asc' })
        .range((page - 1) * pageSize, page * pageSize - 1);
      
      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter);
      }
      
      if (categoryFilter !== "all") {
        query = query.eq('category', categoryFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setTasks(data as Task[]);
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleSort = () => {
    setSorting(prev => ({
      ...prev,
      direction: prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
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

  const categories = ["inventory", "training", "menu", "cleaning", "maintenance", "admin"];
  
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center text-lg font-medium">
          <CheckSquare className="mr-2 h-5 w-5" />
          <T text="Assigned Tasks" />
        </CardTitle>
        
        <div className="flex items-center space-x-2">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[130px] h-8">
              <Filter className="h-3.5 w-3.5 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"><T text="All Status" /></SelectItem>
              <SelectItem value="Completed"><T text="Completed" /></SelectItem>
              <SelectItem value="In Progress"><T text="In Progress" /></SelectItem>
              <SelectItem value="Pending"><T text="Pending" /></SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={categoryFilter}
            onValueChange={(value) => {
              setCategoryFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[130px] h-8">
              <Tag className="h-3.5 w-3.5 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"><T text="All Categories" /></SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  <T text={getCategoryName(cat)} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleSort}
            className="h-8 px-2"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
          </Button>
        </div>
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
          <>
            <ul className="space-y-3">
              {tasks.map((task) => (
                <li key={task.id} className="border p-3 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-medium text-base">{task.title}</h4>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 mt-2">
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
            
            <div className="flex items-center justify-between mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <T text="Previous" />
              </Button>
              <span className="text-sm text-muted-foreground">
                <T text="Page" /> {page}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => p + 1)}
                disabled={tasks.length < pageSize}
              >
                <T text="Next" />
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TasksSection;
