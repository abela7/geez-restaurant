
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, Settings, Trash2, Pencil, Loader2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { MenuNav } from "@/components/menu/MenuNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useModifierManagement } from "@/hooks/useModifierManagement";
import { ModifierOption } from "@/hooks/useModifierManagement";
import { toast } from "sonner";

const Modifiers = () => {
  const { t } = useLanguage();
  const {
    modifierGroups,
    isLoading,
    showAddGroupDialog,
    setShowAddGroupDialog,
    showEditGroupDialog,
    setShowEditGroupDialog,
    showDeleteGroupDialog,
    setShowDeleteGroupDialog,
    showAddOptionDialog,
    setShowAddOptionDialog,
    showEditOptionDialog,
    setShowEditOptionDialog,
    showDeleteOptionDialog,
    setShowDeleteOptionDialog,
    selectedGroup,
    setSelectedGroup,
    selectedOption,
    setSelectedOption,
    groupFormData,
    setGroupFormData,
    optionFormData,
    resetGroupForm,
    resetOptionForm,
    handleGroupInputChange,
    handleOptionInputChange,
    handleAddGroup,
    handleAddOption,
    handleEditGroup,
    handleEditOption,
    handleDeleteGroup,
    handleDeleteOption,
    confirmEditGroup,
    confirmEditOption,
    confirmDeleteGroup,
    confirmDeleteOption,
    loadModifierGroups
  } = useModifierManagement();

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader
        title={<T text="Modifiers Management" />}
        description={<T text="Manage food item modifiers and options" />}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/admin/menu">
                <ChevronLeft className="mr-2 h-4 w-4" />
                <T text="Back to Menu" />
              </Link>
            </Button>
            <Button onClick={() => {
              resetGroupForm();
              setShowAddGroupDialog(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              <T text="Add Modifier Group" />
            </Button>
          </>
        }
      />

      <MenuNav />

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle><T text="Modifier Groups" /></CardTitle>
                <CardDescription><T text="Create groups of modifiers like 'Toppings', 'Spice Level'" /></CardDescription>
              </CardHeader>
              <CardContent>
                {modifierGroups.length === 0 ? (
                  <div className="text-center p-4">
                    <p className="text-muted-foreground mb-4"><T text="No modifier groups found" /></p>
                    <Button variant="outline" onClick={() => {
                      resetGroupForm();
                      setShowAddGroupDialog(true);
                    }}>
                      <Plus className="mr-2 h-4 w-4" />
                      <T text="Add Modifier Group" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {modifierGroups.map((group) => (
                      <Card key={group.id} className="overflow-hidden">
                        <div className="p-4 border-b flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{group.name}</h3>
                            <div className="flex items-center mt-1">
                              <Badge variant={group.required ? "default" : "outline"}>
                                {group.required ? t("Required") : t("Optional")}
                              </Badge>
                              <Badge variant="outline" className="ml-2">
                                {group.options?.length || 0} {t("options")}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex">
                            <Button variant="ghost" size="icon" onClick={() => handleEditGroup(group)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteGroup(group)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-4 bg-muted/40">
                          <div className="flex justify-between mb-2">
                            <h4 className="text-sm font-medium"><T text="Options" /></h4>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 px-2"
                              onClick={() => {
                                setSelectedGroup(group);
                                resetOptionForm();
                                setShowAddOptionDialog(true);
                              }}
                            >
                              <Plus className="h-3.5 w-3.5 mr-1" />
                              <T text="Add Option" />
                            </Button>
                          </div>
                          {(group.options?.length === 0 || !group.options) ? (
                            <p className="text-sm text-muted-foreground"><T text="No options added yet" /></p>
                          ) : (
                            <div className="space-y-2">
                              {group.options?.map((option) => (
                                <div 
                                  key={option.id} 
                                  className="flex justify-between items-center p-2 bg-background rounded-md text-sm"
                                >
                                  <div className="flex items-center">
                                    <span className="font-medium">{option.name}</span>
                                    {option.price > 0 && (
                                      <Badge className="ml-2">+£{option.price.toFixed(2)}</Badge>
                                    )}
                                  </div>
                                  <div className="flex">
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditOption(option)}>
                                      <Pencil className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteOption(option)}>
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle><T text="Modifier Usage" /></CardTitle>
                <CardDescription><T text="These modifiers can be applied to food items" /></CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="usage">
                  <TabsList className="mb-4">
                    <TabsTrigger value="usage"><T text="How to Use" /></TabsTrigger>
                    <TabsTrigger value="examples"><T text="Examples" /></TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="usage" className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2"><T text="What are modifiers?" /></h3>
                      <p className="text-muted-foreground"><T text="Modifiers allow customers to customize their orders. For example, a pizza might have modifiers for 'Toppings', 'Crust Type', or 'Size'." /></p>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2"><T text="How to create modifiers" /></h3>
                      <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                        <li><T text="Create a modifier group (e.g., 'Toppings')" /></li>
                        <li><T text="Add options to the group (e.g., 'Mushrooms', 'Pepperoni')" /></li>
                        <li><T text="Set prices for each option if needed" /></li>
                        <li><T text="Assign modifier groups to food items in the Food Items section" /></li>
                      </ol>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2"><T text="Required vs Optional" /></h3>
                      <p className="text-muted-foreground"><T text="You can mark a modifier group as 'Required' if customers must select at least one option from the group." /></p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="examples" className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2"><T text="Coffee Modifiers" /></h3>
                      <div className="space-y-2 text-muted-foreground">
                        <p><strong><T text="Group" />:</strong> <T text="Milk Type (Optional)" /></p>
                        <p><strong><T text="Options" />:</strong> <T text="Regular, Skim, Almond, Oat, Soy" /></p>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2"><T text="Pizza Modifiers" /></h3>
                      <div className="space-y-2 text-muted-foreground">
                        <p><strong><T text="Group" />:</strong> <T text="Crust Type (Required)" /></p>
                        <p><strong><T text="Options" />:</strong> <T text="Thin, Regular, Thick" /></p>
                        <br />
                        <p><strong><T text="Group" />:</strong> <T text="Extra Toppings (Optional)" /></p>
                        <p><strong><T text="Options" />:</strong> <T text="Cheese (+£1.00), Pepperoni (+£1.50), Mushrooms (+£1.00)" /></p>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <h3 className="font-medium mb-2"><T text="Steak Modifiers" /></h3>
                      <div className="space-y-2 text-muted-foreground">
                        <p><strong><T text="Group" />:</strong> <T text="Cooking Preference (Required)" /></p>
                        <p><strong><T text="Options" />:</strong> <T text="Rare, Medium Rare, Medium, Medium Well, Well Done" /></p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Add Modifier Group Dialog */}
      <Dialog open={showAddGroupDialog} onOpenChange={setShowAddGroupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle><T text="Add Modifier Group" /></DialogTitle>
            <DialogDescription>
              <T text="Create a new group of modifiers like 'Toppings' or 'Sizes'" />
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="group-name"><T text="Group Name" /></Label>
              <Input
                id="group-name"
                name="name"
                value={groupFormData.name}
                onChange={handleGroupInputChange}
                placeholder={t("e.g. Toppings, Sizes, Spice Level")}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="group-required"
                name="required"
                checked={groupFormData.required}
                onCheckedChange={(checked) => {
                  setGroupFormData(prev => ({
                    ...prev,
                    required: checked
                  }));
                }}
              />
              <Label htmlFor="group-required"><T text="Required selection" /></Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddGroupDialog(false)}>
              <T text="Cancel" />
            </Button>
            <Button onClick={handleAddGroup} disabled={!groupFormData.name}>
              <T text="Add Group" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modifier Group Dialog */}
      <Dialog open={showEditGroupDialog} onOpenChange={setShowEditGroupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle><T text="Edit Modifier Group" /></DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-group-name"><T text="Group Name" /></Label>
              <Input
                id="edit-group-name"
                name="name"
                value={groupFormData.name}
                onChange={handleGroupInputChange}
                placeholder={t("e.g. Toppings, Sizes, Spice Level")}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-group-required"
                name="required"
                checked={groupFormData.required}
                onCheckedChange={(checked) => {
                  setGroupFormData(prev => ({
                    ...prev,
                    required: checked
                  }));
                }}
              />
              <Label htmlFor="edit-group-required"><T text="Required selection" /></Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditGroupDialog(false)}>
              <T text="Cancel" />
            </Button>
            <Button onClick={confirmEditGroup} disabled={!groupFormData.name}>
              <T text="Save Changes" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modifier Group Dialog */}
      <Dialog open={showDeleteGroupDialog} onOpenChange={setShowDeleteGroupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle><T text="Delete Modifier Group" /></DialogTitle>
            <DialogDescription>
              <T text="Are you sure you want to delete this modifier group? This action cannot be undone." />
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            {selectedGroup && (
              <Alert>
                <AlertDescription>
                  <T text="You are about to delete" />: <strong>{selectedGroup.name}</strong>
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteGroupDialog(false)}>
              <T text="Cancel" />
            </Button>
            <Button variant="destructive" onClick={confirmDeleteGroup}>
              <T text="Delete Group" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Modifier Option Dialog */}
      <Dialog open={showAddOptionDialog} onOpenChange={setShowAddOptionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle><T text="Add Option" /></DialogTitle>
            <DialogDescription>
              {selectedGroup && (
                <>
                  <T text="Add option to" /> <strong>{selectedGroup.name}</strong>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="option-name"><T text="Option Name" /></Label>
              <Input
                id="option-name"
                name="name"
                value={optionFormData.name}
                onChange={handleOptionInputChange}
                placeholder={t("e.g. Extra Cheese, Medium, Spicy")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="option-price"><T text="Additional Price (£)" /></Label>
              <Input
                id="option-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={optionFormData.price}
                onChange={handleOptionInputChange}
                placeholder="0.00"
              />
              <p className="text-sm text-muted-foreground">
                <T text="Leave at 0 if this option doesn't add extra cost" />
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddOptionDialog(false)}>
              <T text="Cancel" />
            </Button>
            <Button onClick={handleAddOption} disabled={!optionFormData.name}>
              <T text="Add Option" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modifier Option Dialog */}
      <Dialog open={showEditOptionDialog} onOpenChange={setShowEditOptionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle><T text="Edit Option" /></DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-option-name"><T text="Option Name" /></Label>
              <Input
                id="edit-option-name"
                name="name"
                value={optionFormData.name}
                onChange={handleOptionInputChange}
                placeholder={t("e.g. Extra Cheese, Medium, Spicy")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-option-price"><T text="Additional Price (£)" /></Label>
              <Input
                id="edit-option-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={optionFormData.price}
                onChange={handleOptionInputChange}
                placeholder="0.00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditOptionDialog(false)}>
              <T text="Cancel" />
            </Button>
            <Button onClick={confirmEditOption} disabled={!optionFormData.name}>
              <T text="Save Changes" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modifier Option Dialog */}
      <Dialog open={showDeleteOptionDialog} onOpenChange={setShowDeleteOptionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle><T text="Delete Option" /></DialogTitle>
            <DialogDescription>
              <T text="Are you sure you want to delete this option? This action cannot be undone." />
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            {selectedOption && (
              <Alert>
                <AlertDescription>
                  <T text="You are about to delete" />: <strong>{selectedOption.name}</strong>
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteOptionDialog(false)}>
              <T text="Cancel" />
            </Button>
            <Button variant="destructive" onClick={confirmDeleteOption}>
              <T text="Delete Option" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Modifiers;
