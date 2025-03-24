
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { List, Grid2X2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

type ViewMode = "list" | "grid";

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  const { t } = useLanguage();

  return (
    <ToggleGroup type="single" value={currentView} onValueChange={(value) => value && onViewChange(value as ViewMode)}>
      <ToggleGroupItem value="list" aria-label={t("List View")} className="p-2 h-9">
        <List className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="grid" aria-label={t("Grid View")} className="p-2 h-9">
        <Grid2X2 className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ViewToggle;
