
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X, CheckCircle, Download } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { taskCategories } from "@/constants/taskCategories";

type TaskFiltersProps = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  categoryFilter: string;
  setCategoryFilter: React.Dispatch<React.SetStateAction<string>>;
  showCompleted: boolean;
  setShowCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  exportToCSV: () => void;
  hasFilteredTasks: boolean;
};

const TaskFilters: React.FC<TaskFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  showCompleted,
  setShowCompleted,
  exportToCSV,
  hasFilteredTasks
}) => {
  const { t } = useLanguage();

  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t("Search tasks...")}
          className="w-full pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <Select defaultValue={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder={t("Filter by status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all"><T text="All Status" /></SelectItem>
            <SelectItem value="completed"><T text="Completed" /></SelectItem>
            <SelectItem value="in progress"><T text="In Progress" /></SelectItem>
            <SelectItem value="pending"><T text="Pending" /></SelectItem>
          </SelectContent>
        </Select>
        
        <Select defaultValue={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder={t("Filter by category")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all"><T text="All Categories" /></SelectItem>
            {taskCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${category.color}`}></div>
                  <span>{category.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button variant="outline" className="w-full sm:w-auto" onClick={() => setShowCompleted(!showCompleted)}>
          {showCompleted ? <X className="mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
          {showCompleted ? <T text="Hide Completed" /> : <T text="Show Completed" />}
        </Button>
        
        <Button variant="outline" className="w-full sm:w-auto" onClick={exportToCSV} disabled={!hasFilteredTasks}>
          <Download className="mr-2 h-4 w-4" />
          <T text="Export" />
        </Button>
      </div>
    </div>
  );
};

export default TaskFilters;
