
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { MeasurementUnit } from "@/types/dishCost";

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
        <div className="mt-2">
          <InputWithIcon
            placeholder={t("Search unit types...")}
            value={searchQuery}
            onChange={onSearchChange}
            className="max-w-sm"
            icon={<Search className="h-4 w-4" />}
          />
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><T text="Name" /></TableHead>
              <TableHead><T text="Abbreviation" /></TableHead>
              <TableHead className="text-right"><T text="Actions" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUnits.map((unit) => (
              <TableRow key={unit.id}>
                <TableCell className="font-medium">{unit.name}</TableCell>
                <TableCell>{unit.abbreviation}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {onEditUnit && (
                      <Button variant="ghost" size="icon" onClick={() => onEditUnit(unit)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDeleteUnit && (
                      <Button variant="ghost" size="icon" onClick={() => onDeleteUnit(unit.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UnitsTable;
