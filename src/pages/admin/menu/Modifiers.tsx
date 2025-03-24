
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { MenuNav } from "@/components/menu/MenuNav";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  ChevronsUpDown, 
  PlusCircle, 
  Loader2 
} from "lucide-react";
import { useModifierManagement, ModifierGroup, ModifierOption } from "@/hooks/useModifierManagement";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";

const Modifiers = () => {
  const { t } = useLanguage();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState("groups");
  
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
    setGroupFormData, // This is missing in original code
    optionFormData,
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
    confirmDeleteOption
  } = useModifierManagement();

  const toggleGroupExpand = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const renderModifierGroups = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      );
    }

    if (modifierGroups.length === 0) {
      return (
        <div className="text-center p-8">
          <p className="text-muted-foreground mb-4">
            <T text="No modifier groups have been created yet" />
          </p>
          <Button onClick={() => setShowAddGroupDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            <T text="Create Modifier Group" />
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modifierGroups.map((group) => (
          <Card key={group.id} className="shadow-md relative group">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold flex items-center justify-between">
                {group.name}
                {group.required && (
                  <Badge className="ml-2 bg-amber-500">
                    <T text="Required" />
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {group.options?.length || 0} <T text="options" />
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
              <Collapsible
                open={expandedGroups[group.id]}
                onOpenChange={() => toggleGroupExpand(group.id)}
                className="space-y-2"
              >
                <div className="flex justify-between items-center pb-2">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <T text="View Options" />
                      <ChevronsUpDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => {
                      setSelectedGroup(group);
                      setShowAddOptionDialog(true);
                    }}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    <T text="Add Option" />
                  </Button>
                </div>
                <CollapsibleContent>
                  {group.options && group.options.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead><T text="Name" /></TableHead>
                          <TableHead><T text="Price" /></TableHead>
                          <TableHead className="text-right"><T text="Actions" /></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {group.options.map((option) => (
                          <TableRow key={option.id}>
                            <TableCell>{option.name}</TableCell>
                            <TableCell>£{option.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right space-x-1">
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={() => handleEditOption(option)}
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="text-red-500"
                                onClick={() => handleDeleteOption(option)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-sm text-muted-foreground py-2">
                      <T text="No options added yet" />
                    </p>
                  )}
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
            <CardFooter className="pt-4 flex justify-end gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleEditGroup(group)}
              >
                <Pencil className="h-4 w-4 mr-1" />
                <T text="Edit" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-500"
                onClick={() => handleDeleteGroup(group)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                <T text="Delete" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title={<T text="Modifiers & Options" />}
        description={<T text="Create customization options for menu items" />}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/admin/menu">
                <T text="Back to Menu" />
              </Link>
            </Button>
            <Button onClick={() => setShowAddGroupDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              <T text="Add Modifier Group" />
            </Button>
          </>
        }
      />

      <MenuNav />

      <div className="mt-6 bg-white rounded-lg p-4 shadow">
        <Tabs defaultValue="groups" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="groups">
              <T text="Modifier Groups" />
            </TabsTrigger>
            <TabsTrigger value="usage">
              <T text="Usage Instructions" />
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="groups" className="space-y-4">
            {renderModifierGroups()}
          </TabsContent>
          
          <TabsContent value="usage">
            <Card>
              <CardHeader>
                <CardTitle><T text="How to Use Modifiers" /></CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg mb-2"><T text="What are Modifier Groups?" /></h3>
                  <p className="text-muted-foreground">
                    <T text="Modifier groups are categories of options that can be applied to food items. For example, 'Type of Beef Tibs' or 'Size of Tej'." />
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2"><T text="How to Create a Modifier Group" /></h3>
                  <ol className="list-decimal ml-5 space-y-2">
                    <li><T text="Click the 'Add Modifier Group' button" /></li>
                    <li><T text="Enter a name for the group (e.g., 'Type of Beef Tibs')" /></li>
                    <li><T text="Set whether the group is required or optional" /></li>
                    <li><T text="Click 'Add Modifier Group' to save" /></li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2"><T text="How to Add Options to a Group" /></h3>
                  <ol className="list-decimal ml-5 space-y-2">
                    <li><T text="Find the modifier group you want to add options to" /></li>
                    <li><T text="Click 'Add Option'" /></li>
                    <li><T text="Enter a name for the option (e.g., 'Spicy')" /></li>
                    <li><T text="Set a price if the option costs extra" /></li>
                    <li><T text="Click 'Add Option' to save" /></li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2"><T text="Assigning Modifiers to Food Items" /></h3>
                  <p className="text-muted-foreground mb-2">
                    <T text="After creating modifier groups, you can assign them to food items when creating or editing a food item." />
                  </p>
                  <p className="text-muted-foreground">
                    <T text="For example, assign the 'Type of Beef Tibs' modifier group to the 'Beef Tibs' food item. This will allow customers to choose between Spicy, Mild, or Normal options when ordering Beef Tibs." />
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Add Group Dialog */}
      <Dialog open={showAddGroupDialog} onOpenChange={setShowAddGroupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle><T text="Add Modifier Group" /></DialogTitle>
            <DialogDescription>
              <T text="Create a new modifier group like 'Size of Tej' or 'Type of Beef Tibs'" />
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name"><T text="Group Name" /></Label>
              <Input
                id="name"
                name="name"
                placeholder={t("Enter group name")}
                value={groupFormData.name}
                onChange={handleGroupInputChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="required"
                name="required"
                checked={groupFormData.required}
                onCheckedChange={(checked) => {
                  // Using setGroupFormData directly from useModifierManagement hook
                  setGroupFormData(prev => ({ ...prev, required: checked }));
                }}
              />
              <Label htmlFor="required"><T text="Required (customers must select an option)" /></Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddGroupDialog(false)}>
              <T text="Cancel" />
            </Button>
            <Button onClick={handleAddGroup} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <T text="Add Modifier Group" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Group Dialog */}
      <Dialog open={showEditGroupDialog} onOpenChange={setShowEditGroupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle><T text="Edit Modifier Group" /></DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name"><T text="Group Name" /></Label>
              <Input
                id="edit-name"
                name="name"
                placeholder={t("Enter group name")}
                value={groupFormData.name}
                onChange={handleGroupInputChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-required"
                name="required"
                checked={groupFormData.required}
                onCheckedChange={(checked) => {
                  // Using setGroupFormData directly from useModifierManagement hook
                  setGroupFormData(prev => ({ ...prev, required: checked }));
                }}
              />
              <Label htmlFor="edit-required"><T text="Required (customers must select an option)" /></Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditGroupDialog(false)}>
              <T text="Cancel" />
            </Button>
            <Button onClick={confirmEditGroup} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <T text="Save Changes" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Group Dialog */}
      <Dialog open={showDeleteGroupDialog} onOpenChange={setShowDeleteGroupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle><T text="Delete Modifier Group" /></DialogTitle>
            <DialogDescription>
              <T text="Are you sure you want to delete this modifier group? This will also delete all options within the group." />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteGroupDialog(false)}>
              <T text="Cancel" />
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteGroup} 
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <T text="Delete Group" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Option Dialog */}
      <Dialog open={showAddOptionDialog} onOpenChange={setShowAddOptionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle><T text="Add Option" /></DialogTitle>
            <DialogDescription>
              {selectedGroup && (
                <>
                  <span>
                    {t("Add a new option to the '{groupName}' group", { groupName: selectedGroup.name })}
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="option-name"><T text="Option Name" /></Label>
              <Input
                id="option-name"
                name="name"
                placeholder={t("Enter option name")}
                value={optionFormData.name}
                onChange={handleOptionInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price"><T text="Price (£)" /></Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={optionFormData.price}
                onChange={handleOptionInputChange}
              />
              <p className="text-sm text-muted-foreground">
                <T text="Enter 0 if there is no additional charge for this option" />
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddOptionDialog(false)}>
              <T text="Cancel" />
            </Button>
            <Button onClick={handleAddOption} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <T text="Add Option" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Option Dialog */}
      <Dialog open={showEditOptionDialog} onOpenChange={setShowEditOptionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle><T text="Edit Option" /></DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-option-name"><T text="Option Name" /></Label>
              <Input
                id="edit-option-name"
                name="name"
                placeholder={t("Enter option name")}
                value={optionFormData.name}
                onChange={handleOptionInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-price"><T text="Price (£)" /></Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={optionFormData.price}
                onChange={handleOptionInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditOptionDialog(false)}>
              <T text="Cancel" />
            </Button>
            <Button onClick={confirmEditOption} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <T text="Save Changes" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Option Dialog */}
      <Dialog open={showDeleteOptionDialog} onOpenChange={setShowDeleteOptionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle><T text="Delete Option" /></DialogTitle>
            <DialogDescription>
              <T text="Are you sure you want to delete this option?" />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteOptionDialog(false)}>
              <T text="Cancel" />
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteOption} 
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <T text="Delete Option" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Modifiers;
