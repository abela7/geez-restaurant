
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, Trash2, Grid2X2, List } from "lucide-react";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { MeasurementUnit } from "@/types/dishCost";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import UnitCard from "./UnitCard";

interface UnitsTableProps {
  units: MeasurementUnit[];
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddUnit: () => void;
  onEditUnit?: (unit: MeasurementUnit) => void;
  onDeleteUnit?: (id: string) => void;
}

const UnitsTable: React.FC<UnitsTableProps> = ({
  units,
  searchQuery,
  onSearchChange,
  onAddUnit,
  onEditUnit,
  onDeleteUnit
}) => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  
  const filteredUnits = units.filter(unit => 
    unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <CardTitle><T text="Unit Types" /></CardTitle>
          <Button onClick={onAddUnit}>
            <Plus className="mr-1 h-4 w-4" />
            <T text="Add Unit Type" />
          </Button>
        </div>
        <CardDescription><T text="Manage measurement units for ingredients" /></CardDescription>
        <div className="mt-3 flex flex-wrap justify-between items-center gap-2">
          <InputWithIcon
            placeholder={t("Search unit types...")}
            value={searchQuery}
            onChange={onSearchChange}
            className="max-w-sm"
            icon={<Search className="h-4 w-4" />}
          />
          
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "grid" | "table")}>
            <ToggleGroupItem value="table" aria-label="List view">
              <List className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline"><T text="List" /></span>
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <Grid2X2 className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline"><T text="Grid" /></span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Name" /></TableHead>
                  <TableHead><T text="Abbreviation" /></TableHead>
                  <TableHead><T text="Type" /></TableHead>
                  <TableHead className="text-right"><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUnits.map((unit) => (
                  <TableRow key={unit.id}>
                    <TableCell className="font-medium">{unit.name}</TableCell>
                    <TableCell>{unit.abbreviation}</TableCell>
                    <TableCell>{unit.type}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {onEditUnit && (
                          <Button variant="ghost" size="icon" onClick={() => onEditUnit(unit)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {onDeleteUnit && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              if (window.confirm(t("Are you sure you want to delete this unit?"))) {
                                onDeleteUnit(unit.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUnits.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      <T text="No units found" />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-2">
            {filteredUnits.map((unit) => (
              <UnitCard 
                key={unit.id} 
                unit={unit}
                onEdit={onEditUnit}
                onDelete={onDeleteUnit}
              />
            ))}
            {filteredUnits.length === 0 && (
              <div className="col-span-full text-center py-6 text-muted-foreground">
                <T text="No units found" />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UnitsTable;
