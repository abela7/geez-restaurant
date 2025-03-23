
import * as React from "react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SideModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  className?: string
  width?: "sm" | "md" | "lg" | "xl" | "full"
  showCloseButton?: boolean
  fullScreenOnMobile?: boolean
}

export function SideModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  width = "md",
  fullScreenOnMobile = true,
}: SideModalProps) {
  const isMobile = useIsMobile()
  
  const widthClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    full: "sm:max-w-screen-sm md:max-w-screen-md",
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className={cn(
          "pt-6 flex flex-col h-full p-0 gap-0 border-l overflow-hidden", 
          widthClasses[width],
          fullScreenOnMobile && isMobile ? "w-full max-w-full" : "",
          className
        )}
      >
        {title && (
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between w-full">
              <div className="text-xl font-semibold">{title}</div>
            </div>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        <ScrollArea className="flex-1 w-full h-full">
          <div className="p-6">
            {children}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
