
import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <SheetContent 
        className={`p-0 ${widthClass} overflow-y-auto side-modal-content`} 
        side="right"
      >
        <div className="flex flex-col h-full">
          <div className="sticky top-0 bg-background z-40 border-b p-4">
            <div className="flex justify-between items-center">
              <SheetHeader className="text-left">
                {title && <SheetTitle className="text-xl">{title}</SheetTitle>}
                {description && <SheetDescription>{description}</SheetDescription>}
              </SheetHeader>
              <SheetClose asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full h-8 w-8"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </SheetClose>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {children}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
