
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookUser, ListChecks, BadgeDollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { T } from "@/contexts/LanguageContext";

type SearchBarProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search staff..."
          className="w-full pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={() => navigate("/admin/staff/directory")}>
          <BookUser className="mr-2 h-4 w-4" />
          <T text="Directory" />
        </Button>
        <Button variant="outline" onClick={() => navigate("/admin/staff/tasks")}>
          <ListChecks className="mr-2 h-4 w-4" />
          <T text="Tasks" />
        </Button>
        <Button variant="outline" onClick={() => navigate("/admin/staff/payroll")}>
          <BadgeDollarSign className="mr-2 h-4 w-4" />
          <T text="Payroll" />
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
