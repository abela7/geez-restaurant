import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Plus, Trash, Save, RotateCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type ChecklistItemInput = {
  description: string;
  requires_value: boolean;
  value_type: string | null;
  value_unit: string | null;
  display_order: number;
};

const NewChecklistPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("kitchen");
  const [frequency, setFrequency] = useState("daily");
  const [requiredTime, setRequiredTime] = useState("morning");
  const [items, setItems] = useState<ChecklistItemInput[]>([
    {
      description: "",
      requires_value: false,
      value_type: null,
      value_unit: null,
      display_order: 1,
    },
  ]);
  
  const handleAddItem = () => {
    setItems([
      ...items,
      {
        description: "",
        requires_value: false,
        value_type: null,
        value_unit: null,
        display_order: items.length + 1,
      },
    ]);
  };
  
  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    
    const newItems = [...items];
    newItems.splice(index, 1);
    
    const reorderedItems = newItems.map((item, idx) => ({
      ...item,
      display_order: idx + 1,
    }));
    
    setItems(reorderedItems);
  };
  
  const handleItemChange = (index: number, updates: Partial<ChecklistItemInput>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    setItems(newItems);
  };
  
  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({
        title: t("Validation Error"),
        description: t("Please enter a checklist name."),
        variant: "destructive",
      });
      return;
    }
    
    const validItems = items.filter(item => item.description.trim());
    if (validItems.length === 0) {
      toast({
        title: t("Validation Error"),
        description: t("Please add at least one checklist item."),
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data: template, error: templateError } = await supabase
        .from("checklist_templates")
        .insert([{
          name,
          role,
          frequency,
          required_time: requiredTime,
        }])
        .select()
        .single();
        
      if (templateError) throw templateError;
      
      const itemsToInsert = validItems.map(item => ({
        template_id: template.id,
        description: item.description,
        requires_value: item.requires_value,
        value_type: item.requires_value ? (item.value_type || "text") : null,
        value_unit: item.requires_value ? item.value_unit : null,
        display_order: item.display_order,
      }));
      
      const { error: itemsError } = await supabase
        .from("checklist_items")
        .insert(itemsToInsert);
        
      if (itemsError) throw itemsError;
      
      toast({
        title: t("Checklist Created"),
        description: t("Your new checklist template has been created successfully."),
      });
      
      navigate("/admin/food-safety/checklists");
    } catch (error) {
      console.error("Error creating checklist:", error);
      toast({
        title: t("Error"),
        description: t("There was a problem creating your checklist. Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <PageHeader
        heading={<T text="Create New Checklist" />}
        description={<T text="Define a new food safety checklist template" />}
        backHref="/admin/food-safety/checklists"
      />
      
      <Card>
        <CardHeader>
          <CardTitle><T text="Checklist Details" /></CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name"><T text="Checklist Name" /></Label>
              <Input
                id="name"
                placeholder={t("e.g., Kitchen Morning Checklist")}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="role"><T text="Role" /></Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder={t("Select role")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="kitchen"><T text="Kitchen Staff" /></SelectItem>
                      <SelectItem value="waiter"><T text="Front of House" /></SelectItem>
                      <SelectItem value="manager"><T text="Management" /></SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="frequency"><T text="Frequency" /></Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder={t("Select frequency")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="daily"><T text="Daily" /></SelectItem>
                      <SelectItem value="weekly"><T text="Weekly" /></SelectItem>
                      <SelectItem value="monthly"><T text="Monthly" /></SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="required-time"><T text="Required Time" /></Label>
                <Select value={requiredTime} onValueChange={setRequiredTime}>
                  <SelectTrigger id="required-time">
                    <SelectValue placeholder={t("Select time")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="morning"><T text="Morning" /></SelectItem>
                      <SelectItem value="evening"><T text="Evening" /></SelectItem>
                      <SelectItem value="closing"><T text="Closing" /></SelectItem>
                      <SelectItem value="shift"><T text="Every Shift" /></SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium"><T text="Checklist Items" /></h3>
                <Button type="button" size="sm" onClick={handleAddItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  <T text="Add Item" />
                </Button>
              </div>
              
              <div className="space-y-6">
                {items.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <Label className="text-base">{t("Item")} {index + 1}</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(index)}
                        disabled={items.length <= 1}
                      >
                        <Trash className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`item-${index}-description`}><T text="Description" /></Label>
                      <Input
                        id={`item-${index}-description`}
                        placeholder={t("e.g., Check refrigerator temperature")}
                        value={item.description}
                        onChange={(e) => handleItemChange(index, { description: e.target.value })}
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input
                        id={`item-${index}-requires-value`}
                        type="checkbox"
                        checked={item.requires_value}
                        onChange={(e) => handleItemChange(index, { requires_value: e.target.checked })}
                        className="mr-2"
                      />
                      <Label htmlFor={`item-${index}-requires-value`}><T text="Requires a value" /></Label>
                    </div>
                    
                    {item.requires_value && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`item-${index}-value-type`}><T text="Value Type" /></Label>
                          <Select
                            value={item.value_type || "text"}
                            onValueChange={(value) => handleItemChange(index, { value_type: value })}
                          >
                            <SelectTrigger id={`item-${index}-value-type`}>
                              <SelectValue placeholder={t("Select type")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="text"><T text="Text" /></SelectItem>
                                <SelectItem value="number"><T text="Number" /></SelectItem>
                                <SelectItem value="temperature"><T text="Temperature" /></SelectItem>
                                <SelectItem value="yes_no"><T text="Yes/No" /></SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`item-${index}-value-unit`}><T text="Unit (Optional)" /></Label>
                          <Input
                            id={`item-${index}-value-unit`}
                            placeholder={t("e.g., °C, kg, etc.")}
                            value={item.value_unit || ""}
                            onChange={(e) => handleItemChange(index, { value_unit: e.target.value })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate("/admin/food-safety/checklists")}>
            <T text="Cancel" />
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <RotateCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            <T text="Create Checklist" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NewChecklistPage;
