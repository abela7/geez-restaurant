
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { MenuNav } from "@/components/menu/MenuNav";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Pencil, Trash2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export interface MeasurementUnit {
  id: string;
  name: string;
  abbreviation: string;
  type: string;
  description: string | null;
  base_unit_id: string | null;
  conversion_factor: number | null;
  created_at: string;
  updated_at: string;
}

const UnitManagement = () => {
  const { t } = useLanguage();
  const [units, setUnits] = useState<MeasurementUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUnit, setEditingUnit] = useState<MeasurementUnit | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    abbreviation: "",
    type: "weight", // Default type
    description: "",
    base_unit_id: null as string | null,
    conversion_factor: null as number | null,
  });
  
  // Unit types
  const unitTypes = [
    { value: "weight", label: "Weight" },
    { value: "volume", label: "Volume" },
    { value: "quantity", label: "Quantity" },
    { value: "spoon", label: "Spoon" },
    { value: "custom", label: "Custom" },
  ];

  useEffect(() => {
    loadUnits();
  }, []);

  const loadUnits = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("measurement_units")
        .select("*")
        .order("type")
        .order("name");

      if (error) throw error;
      setUnits(data || []);
    } catch (error) {
      console.error("Error loading measurement units:", error);
      toast.error("Failed to load measurement units");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (name: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value ? parseFloat(e.target.value) : null;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditUnit = (unit: MeasurementUnit) => {
    setEditingUnit(unit);
    setFormData({
      name: unit.name,
      abbreviation: unit.abbreviation,
      type: unit.type,
      description: unit.description || "",
      base_unit_id: unit.base_unit_id,
      conversion_factor: unit.conversion_factor,
    });
    setOpenDialog(true);
  };

  const handleAddUnit = () => {
    setEditingUnit(null);
    setFormData({
      name: "",
      abbreviation: "",
      type: "weight",
      description: "",
      base_unit_id: null,
      conversion_factor: null,
    });
    setOpenDialog(true);
  };

  const saveUnit = async () => {
    try {
      setLoading(true);
      
      // Validation
      if (!formData.name || !formData.abbreviation || !formData.type) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (editingUnit) {
        // Update existing unit
        const { error } = await supabase
          .from("measurement_units")
          .update({
            name: formData.name,
            abbreviation: formData.abbreviation,
            type: formData.type,
            description: formData.description || null,
            base_unit_id: formData.base_unit_id,
            conversion_factor: formData.conversion_factor,
          })
          .eq("id", editingUnit.id);

        if (error) throw error;
        toast.success("Unit updated successfully");
      } else {
        // Create new unit
        const { error } = await supabase
          .from("measurement_units")
          .insert([
            {
              name: formData.name,
              abbreviation: formData.abbreviation,
              type: formData.type,
              description: formData.description || null,
              base_unit_id: formData.base_unit_id,
              conversion_factor: formData.conversion_factor,
            },
          ]);

        if (error) throw error;
        toast.success("Unit added successfully");
      }

      // Reload units and close dialog
      await loadUnits();
      setOpenDialog(false);
    } catch (error) {
      console.error("Error saving unit:", error);
      toast.error("Failed to save unit");
    } finally {
      setLoading(false);
    }
  };

  const deleteUnit = async (id: string) => {
    if (!confirm(t("Are you sure you want to delete this unit?"))) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from("measurement_units")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Unit deleted successfully");
      await loadUnits();
    } catch (error) {
      console.error("Error deleting unit:", error);
      toast.error("Failed to delete unit. It may be in use by ingredients.");
    } finally {
      setLoading(false);
    }
  };

  // Filter units based on search query
  const filteredUnits = units.filter(
    unit =>
      unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.abbreviation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group units by type for better organization
  const groupedUnits = filteredUnits.reduce((acc, unit) => {
    if (!acc[unit.type]) {
      acc[unit.type] = [];
    }
    acc[unit.type].push(unit);
    return acc;
  }, {} as Record<string, MeasurementUnit[]>);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader
        title={<T text="Measurement Units" />}
        description={<T text="Manage measurement units for ingredients and recipes" />}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/admin/menu">
                <T text="Back to Menu" />
              </Link>
            </Button>
            <Button onClick={handleAddUnit}>
              <Plus className="h-4 w-4 mr-2" />
              <T text="Add Unit" />
            </Button>
          </>
        }
      />

      <MenuNav />

      <div className="mb-4 mt-6">
        <Input
          placeholder={t("Search units...")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {loading && !units.length ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {Object.keys(groupedUnits).length === 0 ? (
            <Card className="bg-muted/40">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  <T text="No Units Found" />
                </h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  <T text="You haven't added any measurement units yet. Units are essential for ingredient management and recipe costing." />
                </p>
                <Button onClick={handleAddUnit}>
                  <Plus className="h-4 w-4 mr-2" />
                  <T text="Add Your First Unit" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            Object.entries(groupedUnits).map(([type, unitsInType]) => (
              <div key={type} className="mb-8">
                <h2 className="text-lg font-medium mb-4 flex items-center">
                  <Badge variant="outline" className="mr-2">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Badge>
                  <span>{t("Units")} ({unitsInType.length})</span>
                </h2>
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead><T text="Unit Name" /></TableHead>
                        <TableHead><T text="Abbreviation" /></TableHead>
                        <TableHead><T text="Description" /></TableHead>
                        <TableHead className="text-right"><T text="Actions" /></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {unitsInType.map((unit) => (
                        <TableRow key={unit.id}>
                          <TableCell className="font-medium">{unit.name}</TableCell>
                          <TableCell>{unit.abbreviation}</TableCell>
                          <TableCell className="max-w-md truncate">
                            {unit.description || <span className="text-muted-foreground italic">No description</span>}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleEditUnit(unit)}
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-destructive hover:text-destructive"
                                onClick={() => deleteUnit(unit.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            ))
          )}
        </>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUnit ? <T text="Edit Unit" /> : <T text="Add New Unit" />}
            </DialogTitle>
            <DialogDescription>
              <T text="Create measurement units for ingredient quantities" />
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name"><T text="Unit Name" /></Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Kilogram, Liter"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="abbreviation"><T text="Abbreviation" /></Label>
                <Input
                  id="abbreviation"
                  name="abbreviation"
                  value={formData.abbreviation}
                  onChange={handleInputChange}
                  placeholder="e.g., kg, L"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type"><T text="Unit Type" /></Label>
              <Select
                value={formData.type}
                onValueChange={handleSelectChange("type")}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("Select a unit type")} />
                </SelectTrigger>
                <SelectContent>
                  {unitTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {t(type.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description"><T text="Description (Optional)" /></Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder={t("Description of when to use this unit")}
                rows={3}
              />
            </div>

            {/* Add conversion factor and base unit in the future */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              <T text="Cancel" />
            </Button>
            <Button onClick={saveUnit} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingUnit ? <T text="Update Unit" /> : <T text="Add Unit" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnitManagement;
