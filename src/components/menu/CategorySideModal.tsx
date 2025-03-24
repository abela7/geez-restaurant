
import React from "react";
import { SideModal } from "@/components/ui/side-modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { MenuCategory } from "@/types/menu";

interface CategorySideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Partial<MenuCategory>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSwitchChange: (checked: boolean) => void;
  onSubmit: () => void;
  isLoading: boolean;
  mode: "add" | "edit";
}

export const CategorySideModal: React.FC<CategorySideModalProps> = ({
  open,
  onOpenChange,
  formData,
  onChange,
  onSwitchChange,
  onSubmit,
  isLoading,
  mode
}) => {
  const { t } = useLanguage();
  const isEdit = mode === "edit";
  
  return (
    <SideModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? <T text="Edit Category" /> : <T text="Add New Category" />}
      description={isEdit ? 
        <T text="Update the details of this category" /> : 
        <T text="Create a new category for your menu items" />
      }
    >
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor={`${mode}-name`}><T text="Category Name" /></Label>
          <Input 
            id={`${mode}-name`} 
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder={t("Enter category name")} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${mode}-description`}><T text="Description" /></Label>
          <Textarea 
            id={`${mode}-description`} 
            name="description"
            value={formData.description || ""}
            onChange={onChange}
            placeholder={t("Enter category description")}
            rows={3}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch 
            id={`${mode}-active`}
            checked={formData.active}
            onCheckedChange={onSwitchChange}
          />
          <Label htmlFor={`${mode}-active`}><T text="Active" /></Label>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          <T text="Cancel" />
        </Button>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isEdit ? <T text="Save Changes" /> : <T text="Add Category" />}
        </Button>
      </div>
    </SideModal>
  );
};
