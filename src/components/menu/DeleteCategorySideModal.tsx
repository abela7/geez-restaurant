
import React from "react";
import { SideModal } from "@/components/ui/side-modal";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { MenuCategory } from "@/types/menu";

interface DeleteCategorySideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: MenuCategory | null;
  onSubmit: () => void;
  isLoading: boolean;
}

export const DeleteCategorySideModal: React.FC<DeleteCategorySideModalProps> = ({
  open,
  onOpenChange,
  category,
  onSubmit,
  isLoading
}) => {
  return (
    <SideModal
      open={open}
      onOpenChange={onOpenChange}
      title={<T text="Delete Category" />}
      description={<T text="Are you sure you want to delete this category? This action cannot be undone." />}
      width="sm"
    >
      <div className="py-4">
        {category && category.itemCount && category.itemCount > 0 ? (
          <div className="flex items-start space-x-2 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              {`This category contains ${category.itemCount} food items. You must reassign or delete these items before deleting the category.`}
            </p>
          </div>
        ) : (
          <p>{`This will permanently delete the '${category?.name || ""}' category.`}</p>
        )}
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          <T text="Cancel" />
        </Button>
        <Button 
          variant="destructive" 
          onClick={onSubmit} 
          disabled={isLoading || (category?.itemCount && category.itemCount > 0)}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          <T text="Delete" />
        </Button>
      </div>
    </SideModal>
  );
};
