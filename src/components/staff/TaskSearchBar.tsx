
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TaskSearchBarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
}

const TaskSearchBar: React.FC<TaskSearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter
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
      
      <div className="flex items-center gap-2">
        <select 
          className="border rounded p-2 bg-background h-9"
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">{t("All Status")}</option>
          <option value="completed">{t("Completed")}</option>
          <option value="in progress">{t("In Progress")}</option>
          <option value="pending">{t("Pending")}</option>
        </select>
      </div>
    </div>
  );
};

export default TaskSearchBar;
