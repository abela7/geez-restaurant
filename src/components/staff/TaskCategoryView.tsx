
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, CheckCircle, PlusCircle, X } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { StaffTask } from "@/hooks/useStaffTasks";
import { taskCategories, TaskCategory } from "@/constants/taskCategories";
import { format } from "date-fns";

type TaskWithCategory = TaskCategory & {
  tasks: StaffTask[];
};

type TaskCategoryViewProps = {
  filteredTasks: StaffTask[];
  staffNamesMap: Record<string, string>;
  staffInitialsMap: Record<string, string>;
  staffImagesMap: Record<string, string | undefined>;
  handleUpdateTaskStatus: (taskId: string, status: string) => Promise<void>;
  handleDeleteTask: (taskId: string) => Promise<void>;
  openNewTaskDialog: (categoryId?: string) => void;
};

const TaskCategoryView: React.FC<TaskCategoryViewProps> = ({
  filteredTasks,
  staffNamesMap,
  staffInitialsMap,
  staffImagesMap,
  handleUpdateTaskStatus,
  handleDeleteTask,
  openNewTaskDialog
}) => {
  const { t } = useLanguage();

  const groupTasksByCategory = (): TaskWithCategory[] => {
    return taskCategories.map(category => ({
      ...category,
      tasks: filteredTasks.filter(task => task.category === category.id)
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {groupTasksByCategory().map((category) => (
        <Card key={category.id} className="overflow-hidden">
          <CardHeader className={`${category.color} bg-opacity-10 pb-2`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                <CardTitle className="text-lg">{category.name}</CardTitle>
              </div>
              <Badge variant="outline">
                {category.tasks.length} <T text="tasks" />
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 max-h-[400px] overflow-auto">
            {category.tasks.length > 0 ? (
              <div className="space-y-3">
                {category.tasks.map((task) => (
                  <div key={task.id} className="p-3 border rounded-md hover:bg-accent/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="font-medium">{task.title}</div>
                      <Badge 
                        variant={
                          task.status === "Completed" ? "default" : 
                          task.status === "In Progress" ? "secondary" : 
                          "outline"
                        }
                      >
                        {task.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{task.description}</div>
                    <div className="flex items-center justify-between mt-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Avatar className="h-5 w-5">
                          {staffImagesMap[task.staff_id] ? (
                            <AvatarImage src={staffImagesMap[task.staff_id]} alt={staffNamesMap[task.staff_id]} />
                          ) : (
                            <AvatarFallback>{staffInitialsMap[task.staff_id] || "??"}</AvatarFallback>
                          )}
                        </Avatar>
                        <span>{staffNamesMap[task.staff_id]}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>
                          {task.due_date 
                            ? format(new Date(task.due_date), 'MMM dd, yyyy') 
                            : '-'}
                          {task.due_time && ` ${task.due_time}`}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-end mt-2 gap-2">
                      {task.status !== 'Completed' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleUpdateTaskStatus(task.id, 'Completed')}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          <T text="Complete" />
                        </Button>
                      )}
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <T text="No tasks in this category" />
              </div>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-3" 
              onClick={() => openNewTaskDialog(category.id)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              <T text="Add Task" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TaskCategoryView;
