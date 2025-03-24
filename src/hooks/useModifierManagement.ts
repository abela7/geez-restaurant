
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
  modifier_group_id: string;
}

export interface ModifierGroup {
  id: string;
  name: string;
  required: boolean;
  created_at?: string;
  updated_at?: string;
  options?: ModifierOption[];
}

export const useModifierManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<ModifierGroup | null>(null);
  const [showAddGroupDialog, setShowAddGroupDialog] = useState(false);
  const [showEditGroupDialog, setShowEditGroupDialog] = useState(false);
  const [showDeleteGroupDialog, setShowDeleteGroupDialog] = useState(false);
  const [showAddOptionDialog, setShowAddOptionDialog] = useState(false);
  const [showEditOptionDialog, setShowEditOptionDialog] = useState(false);
  const [showDeleteOptionDialog, setShowDeleteOptionDialog] = useState(false);
  const [selectedOption, setSelectedOption] = useState<ModifierOption | null>(null);
  const [groupFormData, setGroupFormData] = useState<Partial<ModifierGroup>>({
    name: "",
    required: false
  });
  const [optionFormData, setOptionFormData] = useState<Partial<ModifierOption>>({
    name: "",
    price: 0
  });

  useEffect(() => {
    loadModifierGroups();
  }, []);

  const loadModifierGroups = async () => {
    try {
      setIsLoading(true);
      
      const { data: groups, error: groupsError } = await supabase
        .from('modifier_groups')
        .select('*')
        .order('name');
      
      if (groupsError) throw groupsError;
      
      // Fetch options for each group
      const groupsWithOptions = await Promise.all(
        groups.map(async (group) => {
          const { data: options, error: optionsError } = await supabase
            .from('modifier_options')
            .select('*')
            .eq('modifier_group_id', group.id)
            .order('name');
          
          if (optionsError) throw optionsError;
          
          return {
            ...group,
            options: options
          };
        })
      );
      
      setModifierGroups(groupsWithOptions);
    } catch (error) {
      console.error('Error loading modifier groups:', error);
      toast.error('Failed to load modifier groups');
    } finally {
      setIsLoading(false);
    }
  };

  const resetGroupForm = () => {
    setGroupFormData({
      name: "",
      required: false
    });
  };

  const resetOptionForm = () => {
    setOptionFormData({
      name: "",
      price: 0
    });
  };

  const handleGroupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setGroupFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleOptionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setOptionFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleAddGroup = async () => {
    if (!groupFormData.name) {
      toast.error('Group name is required');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('modifier_groups')
        .insert({
          name: groupFormData.name,
          required: groupFormData.required || false
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Modifier group added successfully');
      
      // Add the new group with empty options array
      const newGroup: ModifierGroup = {
        ...data,
        options: []
      };
      
      setModifierGroups(prev => [...prev, newGroup]);
      
      resetGroupForm();
      setShowAddGroupDialog(false);
      
    } catch (error) {
      console.error('Error adding modifier group:', error);
      toast.error('Failed to add modifier group');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOption = async () => {
    if (!selectedGroup) {
      toast.error('No modifier group selected');
      return;
    }
    
    if (!optionFormData.name) {
      toast.error('Option name is required');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('modifier_options')
        .insert({
          name: optionFormData.name,
          price: optionFormData.price || 0,
          modifier_group_id: selectedGroup.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Modifier option added successfully');
      
      // Update the modifier groups with the new option
      setModifierGroups(prev => 
        prev.map(group => 
          group.id === selectedGroup.id 
            ? { 
                ...group, 
                options: [...(group.options || []), data]
              } 
            : group
        )
      );
      
      resetOptionForm();
      setShowAddOptionDialog(false);
      
    } catch (error) {
      console.error('Error adding modifier option:', error);
      toast.error('Failed to add modifier option');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditGroup = (group: ModifierGroup) => {
    setSelectedGroup(group);
    setGroupFormData({
      name: group.name,
      required: group.required
    });
    setShowEditGroupDialog(true);
  };

  const handleEditOption = (option: ModifierOption) => {
    setSelectedOption(option);
    setOptionFormData({
      name: option.name,
      price: option.price
    });
    setShowEditOptionDialog(true);
  };

  const handleDeleteGroup = (group: ModifierGroup) => {
    setSelectedGroup(group);
    setShowDeleteGroupDialog(true);
  };

  const handleDeleteOption = (option: ModifierOption) => {
    setSelectedOption(option);
    setShowDeleteOptionDialog(true);
  };

  const confirmEditGroup = async () => {
    if (!selectedGroup || !groupFormData.name) {
      toast.error('Group name is required');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('modifier_groups')
        .update({
          name: groupFormData.name,
          required: groupFormData.required
        })
        .eq('id', selectedGroup.id);
      
      if (error) throw error;
      
      toast.success('Modifier group updated successfully');
      
      setModifierGroups(prev => 
        prev.map(group => 
          group.id === selectedGroup.id 
            ? { 
                ...group, 
                name: groupFormData.name || "", 
                required: groupFormData.required || false
              } 
            : group
        )
      );
      
      resetGroupForm();
      setShowEditGroupDialog(false);
      setSelectedGroup(null);
      
    } catch (error) {
      console.error('Error updating modifier group:', error);
      toast.error('Failed to update modifier group');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmEditOption = async () => {
    if (!selectedOption || !optionFormData.name) {
      toast.error('Option name is required');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('modifier_options')
        .update({
          name: optionFormData.name,
          price: optionFormData.price
        })
        .eq('id', selectedOption.id);
      
      if (error) throw error;
      
      toast.success('Modifier option updated successfully');
      
      // Update the modified option in the state
      setModifierGroups(prev => 
        prev.map(group => 
          group.id === selectedOption.modifier_group_id
            ? { 
                ...group, 
                options: group.options?.map(option => 
                  option.id === selectedOption.id 
                    ? { 
                        ...option, 
                        name: optionFormData.name || "", 
                        price: optionFormData.price || 0
                      } 
                    : option
                )
              } 
            : group
        )
      );
      
      resetOptionForm();
      setShowEditOptionDialog(false);
      setSelectedOption(null);
      
    } catch (error) {
      console.error('Error updating modifier option:', error);
      toast.error('Failed to update modifier option');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeleteGroup = async () => {
    if (!selectedGroup) return;
    
    try {
      setIsLoading(true);
      
      // First, check if the group has food items associated with it
      const { data: foodItemModifiers, error: checkError } = await supabase
        .from('food_item_modifiers')
        .select('id')
        .eq('modifier_group_id', selectedGroup.id);
      
      if (checkError) throw checkError;
      
      if (foodItemModifiers && foodItemModifiers.length > 0) {
        toast.error('Cannot delete group as it is used by food items');
        setShowDeleteGroupDialog(false);
        setSelectedGroup(null);
        return;
      }
      
      // Delete all options in the group first
      const { error: optionsError } = await supabase
        .from('modifier_options')
        .delete()
        .eq('modifier_group_id', selectedGroup.id);
      
      if (optionsError) throw optionsError;
      
      // Then delete the group
      const { error: groupError } = await supabase
        .from('modifier_groups')
        .delete()
        .eq('id', selectedGroup.id);
      
      if (groupError) throw groupError;
      
      toast.success('Modifier group deleted successfully');
      
      setModifierGroups(prev => prev.filter(group => group.id !== selectedGroup.id));
      
      setShowDeleteGroupDialog(false);
      setSelectedGroup(null);
      
    } catch (error) {
      console.error('Error deleting modifier group:', error);
      toast.error('Failed to delete modifier group');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeleteOption = async () => {
    if (!selectedOption) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('modifier_options')
        .delete()
        .eq('id', selectedOption.id);
      
      if (error) throw error;
      
      toast.success('Modifier option deleted successfully');
      
      // Remove the deleted option from the state
      setModifierGroups(prev => 
        prev.map(group => 
          group.id === selectedOption.modifier_group_id
            ? { 
                ...group, 
                options: group.options?.filter(option => option.id !== selectedOption.id)
              } 
            : group
        )
      );
      
      setShowDeleteOptionDialog(false);
      setSelectedOption(null);
      
    } catch (error) {
      console.error('Error deleting modifier option:', error);
      toast.error('Failed to delete modifier option');
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
};
