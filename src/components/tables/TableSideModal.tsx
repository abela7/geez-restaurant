
import React from "react";
import { SideModal } from "@/components/ui/side-modal";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Table } from "@/services/table/types";
import TableForm from "./TableForm";

interface OptionType {
  value: string;
  label: string;
}

interface TableSideModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: Partial<Table>;
  onSubmit: (data: Table) => Promise<void>;
  roomOptions: OptionType[];
  groupOptions: OptionType[];
  isSubmitting?: boolean;
  error?: string | null;
  isEdit?: boolean;
}

const TableSideModal: React.FC<TableSideModalProps> = ({
  isOpen,
  onClose,
  table,
  onSubmit,
  roomOptions,
  groupOptions,
  isSubmitting = false,
  error = null,
  isEdit = false,
}) => {
  const { t } = useLanguage();

  const handleSubmit = async (data: Table) => {
    await onSubmit(data);
  };

  return (
    <SideModal
      open={isOpen}
      onOpenChange={onClose}
      title={isEdit ? t("Edit Table") : t("Add New Table")}
      width="lg"
    >
      <div className="pb-6">
        <TableForm
          initialData={table}
          onSubmit={handleSubmit}
          onCancel={onClose}
          roomOptions={roomOptions}
          groupOptions={groupOptions}
          isSubmitting={isSubmitting}
          error={error}
        />
      </div>
    </SideModal>
  );
};

export default TableSideModal;
