
import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

interface SideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  width?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export function SideModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  width = "md"
}: SideModalProps) {
  const getWidthClass = (width: string) => {
    switch (width) {
      case "sm":
        return "sm:max-w-sm";
      case "md":
        return "sm:max-w-md";
      case "lg":
        return "sm:max-w-lg";
      case "xl":
        return "sm:max-w-xl";
      case "2xl":
        return "sm:max-w-2xl";
      case "full":
        return "sm:max-w-full";
      default:
        return "sm:max-w-md";
    }
  };

  const widthClass = getWidthClass(width);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={`p-4 ${widthClass} overflow-y-auto side-modal-content`} side="right">
        <SheetHeader className="mb-4 sticky top-0 bg-background z-10 pb-2">
          {title && <SheetTitle>{title}</SheetTitle>}
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="overflow-y-auto side-modal-body h-[calc(100vh-150px)]">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
