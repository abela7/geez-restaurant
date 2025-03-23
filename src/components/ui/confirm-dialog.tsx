
import React from "react";
import { Button } from "@/components/ui/button";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { SideModal } from "@/components/ui/side-modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
}) => {
  const { t } = useLanguage();
  
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <SideModal
      open={isOpen}
      onOpenChange={onClose}
      title={title}
      description={description}
      width="sm"
    >
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onClose}>
          {cancelLabel || t("Cancel")}
        </Button>
        <Button onClick={handleConfirm}>
          {confirmLabel || t("Confirm")}
        </Button>
      </div>
    </SideModal>
  );
};

export default ConfirmDialog;
