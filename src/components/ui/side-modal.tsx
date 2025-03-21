
import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface SideModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: React.ReactNode
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
  showCloseButton = true,
  fullScreenOnMobile = false,
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
          "pt-6 flex flex-col h-full p-0 gap-0 border-l", 
          widthClasses[width],
          fullScreenOnMobile && isMobile ? "w-full max-w-full" : "",
          className
        )}
      >
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between w-full">
            <SheetTitle className="text-xl font-semibold">{title}</SheetTitle>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            )}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </SheetHeader>
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  )
}
