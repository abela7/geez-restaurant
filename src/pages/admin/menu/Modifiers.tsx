
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, ChevronLeft, Settings, Trash2, Loader2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MenuNav } from "@/components/menu/MenuNav";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ModifierOption {
  id: string;
  name: string;
  price: number;
  modifier_group_id: string;
  created_at?: string;
  updated_at?: string;
}

interface ModifierGroup {
  id: string;
  name: string;
  required: boolean;
  created_at?: string;
  updated_at?: string;
  options?: ModifierOption[];
}

const Modifiers = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<ModifierGroup | null>(null);
  const [activeTab, setActiveTab] = useState("groups");
  const [showAddGroupDialog, setShowAddGroupDialog] = useState(false);
  const [showAddOptionDialog, setShowAddOptionDialog] = useState(false);
  
  const [newGroup, setNewGroup] = useState<Partial<ModifierGroup>>({
    name: "",
    required: false
  });
  
  const [newOption, setNewOption] = useState<Partial<ModifierOption>>({
    name: "",
    price: 0
  });

  useEffect(() => {
    loadModifierGroups();
  }, []);

  const loadModifierGroups = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('modifier_groups')
        .select('*');
      
      if (error) throw error;
      
      const groups: ModifierGroup[] = data.map(group => ({
        id: group.id,
        name: group.name,
        required: group.required,
        created_at: group.created_at,
        updated_at: group.updated_at,
        options: []
      }));
      
      // Load options for each group
      for (const group of groups) {
        const { data: options, error: optionsError } = await supabase
          .from('modifier_options')
          .select('*')
          .eq('modifier_group_id', group.id);
        
        if (optionsError) throw optionsError;
        
        group.options = options as ModifierOption[];
      }
      
      setModifierGroups(groups);
    } catch (error) {
      console.error('Error loading modifier groups:', error);
      toast.error('Failed to load modifier groups');
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadModifierOptions = async (groupId: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('modifier_options')
        .select('*')
        .eq('modifier_group_id', groupId);
      
      if (error) throw error;
      
      const updatedGroups = modifierGroups.map(group => {
        if (group.id === groupId) {
          return { ...group, options: data as ModifierOption[] };
        }
        return group;
      });
      
      setModifierGroups(updatedGroups);
      
      const currentGroup = updatedGroups.find(g => g.id === groupId) || null;
      setSelectedGroup(currentGroup);
      
    } catch (error) {
      console.error('Error loading modifier options:', error);
      toast.error('Failed to load modifier options');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, stateSetter: React.Dispatch<React.SetStateAction<any>>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseFloat(value) : value;
    stateSetter(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setNewGroup(prev => ({ ...prev, required: checked }));
  };

  const handleAddModifierGroup = async () => {
    if (!newGroup.name) {
      toast.error('Group name is required');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('modifier_groups')
        .insert({
          name: newGroup.name,
          required: newGroup.required
        })
        .select()
        .single();
      
      if (error) throw error;
      
      const newGroupWithOptions: ModifierGroup = {
        id: data.id,
        name: data.name,
        required: data.required,
        created_at: data.created_at,
        updated_at: data.updated_at,
        options: []
      };
      
      setModifierGroups([...modifierGroups, newGroupWithOptions]);
      
      toast.success('Modifier group added successfully');
      
      setNewGroup({
        name: "",
        required: false
      });
      setShowAddGroupDialog(false);
      
    } catch (error) {
      console.error('Error adding modifier group:', error);
      toast.error('Failed to add modifier group');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddModifierOption = async () => {
    if (!selectedGroup || !newOption.name) {
      toast.error('Option name is required');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('modifier_options')
        .insert({
          name: newOption.name,
          price: newOption.price || 0,
          modifier_group_id: selectedGroup.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update the selected group's options
      await loadModifierOptions(selectedGroup.id);
      
      toast.success('Option added successfully');
      
      setNewOption({
        name: "",
        price: 0
      });
      setShowAddOptionDialog(false);
      
    } catch (error) {
      console.error('Error adding modifier option:', error);
      toast.error('Failed to add modifier option');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteOption = async (optionId: string) => {
    if (!selectedGroup) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('modifier_options')
        .delete()
        .eq('id', optionId);
      
      if (error) throw error;
      
      // Update the options list
      await loadModifierOptions(selectedGroup.id);
      
      toast.success('Option deleted successfully');
      
    } catch (error) {
      console.error('Error deleting option:', error);
      toast.error('Failed to delete option');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout interface="admin">
      <div className="container mx-auto p-4 md:p-6">
        <PageHeader 
          title={<T text="Modifiers & Options" />}
          description={<T text="Create customization options for menu items" />}
          actions={
            <>
              <Button variant="outline" asChild>
                <Link to="/admin/menu">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  <T text="Back to Menu" />
                </Link>
              </Button>
              <Dialog open={showAddGroupDialog} onOpenChange={setShowAddGroupDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    <T text="Add Modifier Group" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle><T text="Add New Modifier Group" /></DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name"><T text="Group Name" /></Label>
                      <Input 
                        id="name" 
                        name="name"
                        value={newGroup.name}
                        onChange={(e) => handleInputChange(e, setNewGroup)}
                        placeholder={t("Enter group name")} 
                      />
                    </div>
                    <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <Label><T text="Required" /></Label>
                        <p className="text-sm text-muted-foreground">
                          <T text="Customer must select an option" />
                        </p>
                      </div>
                      <Switch 
                        checked={newGroup.required}
                        onCheckedChange={handleSwitchChange}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddModifierGroup} disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      <T text="Add Group" />
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          }
        />

        <MenuNav />

        {isLoading && !selectedGroup ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 mt-6">
            <TabsList>
              <TabsTrigger value="groups"><T text="Modifier Groups" /></TabsTrigger>
              <TabsTrigger value="options" disabled={!selectedGroup}><T text="Options" /></TabsTrigger>
            </TabsList>

            <TabsContent value="groups">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><T text="Group Name" /></TableHead>
                      <TableHead className="hidden md:table-cell"><T text="Options" /></TableHead>
                      <TableHead className="hidden md:table-cell"><T text="Required" /></TableHead>
                      <TableHead className="text-right"><T text="Actions" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modifierGroups.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          <T text="No modifier groups found. Create your first group!" />
                        </TableCell>
                      </TableRow>
                    ) : (
                      modifierGroups.map((group) => (
                        <TableRow key={group.id}>
                          <TableCell className="font-medium">{group.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{group.options?.length || 0}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {group.required ? <T text="Yes" /> : <T text="No" />}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                setSelectedGroup(group);
                                setActiveTab("options");
                                loadModifierOptions(group.id);
                              }}
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              <T text="Manage Options" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="options">
              {selectedGroup && (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-xl font-semibold">{selectedGroup.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {selectedGroup.required ? 
                          <T text="Customer must select one option" /> : 
                          <T text="Optional selection" />
                        }
                      </p>
                    </div>
                    <Dialog open={showAddOptionDialog} onOpenChange={setShowAddOptionDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          <T text="Add Option" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle><T text="Add New Option" /></DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="optionName"><T text="Option Name" /></Label>
                            <Input 
                              id="optionName" 
                              name="name"
                              value={newOption.name}
                              onChange={(e) => handleInputChange(e, setNewOption)}
                              placeholder={t("Enter option name")} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="price"><T text="Additional Price (£)" /></Label>
                            <Input 
                              id="price" 
                              name="price"
                              type="number" 
                              step="0.01" 
                              value={newOption.price}
                              onChange={(e) => handleInputChange(e, setNewOption)}
                              placeholder="0.00" 
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddModifierOption} disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            <T text="Add Option" />
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <Card>
                    {isLoading ? (
                      <div className="flex justify-center items-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead><T text="Option Name" /></TableHead>
                            <TableHead><T text="Additional Price" /></TableHead>
                            <TableHead className="text-right"><T text="Actions" /></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {!selectedGroup.options || selectedGroup.options.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={3} className="h-24 text-center">
                                <T text="No options found for this group. Add your first option!" />
                              </TableCell>
                            </TableRow>
                          ) : (
                            selectedGroup.options.map((option) => (
                              <TableRow key={option.id}>
                                <TableCell className="font-medium">{option.name}</TableCell>
                                <TableCell>
                                  {option.price > 0 ? `£${option.price.toFixed(2)}` : <T text="No charge" />}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="sm">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleDeleteOption(option.id)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default Modifiers;
