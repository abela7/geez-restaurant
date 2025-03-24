
import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { MenuCategory } from "@/types/menu";

interface DeleteCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: MenuCategory | null;
  onSubmit: () => void;
  isLoading: boolean;
}

export const DeleteCategoryDialog: React.FC<DeleteCategoryDialogProps> = ({
  open,
  onOpenChange,
  category,
  onSubmit,
  isLoading
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle><T text="Delete Category" /></DialogTitle>
          <DialogDescription>
            <T text="Are you sure you want to delete this category? This action cannot be undone." />
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {category && category.itemCount && category.itemCount > 0 ? (
            <div className="flex items-start space-x-2 p-4 bg-amber-50 border border-amber-200 rounded-md">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <p className="text-sm text-amber-800">
                {`This category contains ${category.itemCount} food items. You must reassign or delete these items before deleting the category.`}
              </p>
            </div>
          ) : (
            <p>{`This will permanently delete the '${category?.name || ""}' category.`}</p>
          )}
        </div>
        <DialogFooter>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
