
import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { MenuCategory } from "@/types/menu";

interface EditCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: Partial<MenuCategory>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSwitchChange: (checked: boolean) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const EditCategoryDialog: React.FC<EditCategoryDialogProps> = ({
  open,
  onOpenChange,
  formData,
  onChange,
  onSwitchChange,
  onSubmit,
  isLoading
}) => {
  const { t } = useLanguage();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle><T text="Edit Category" /></DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name"><T text="Category Name" /></Label>
            <Input 
              id="edit-name" 
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder={t("Enter category name")} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description"><T text="Description" /></Label>
            <Textarea 
              id="edit-description" 
              name="description"
              value={formData.description || ""}
              onChange={onChange}
              placeholder={t("Enter category description")}
              rows={3}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="edit-active"
              checked={formData.active}
              onCheckedChange={onSwitchChange}
            />
            <Label htmlFor="edit-active"><T text="Active" /></Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <T text="Cancel" />
          </Button>
          <Button onClick={onSubmit} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            <T text="Save Changes" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
