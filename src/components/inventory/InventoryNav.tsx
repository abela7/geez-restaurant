
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Package, Carrot } from "lucide-react";

export const InventoryNav: React.FC = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={isActive("/admin/inventory") ? "default" : "outline"}
        size="sm"
        onClick={() => router.push("/admin/inventory")}
        className="flex gap-2"
      >
        <Package className="h-4 w-4" />
        <T text="Stock Levels" />
      </Button>
      <Button
        variant={isActive("/admin/inventory/ingredients") ? "default" : "outline"}
        size="sm"
        onClick={() => router.push("/admin/inventory/ingredients")}
        className="flex gap-2"
      >
        <Carrot className="h-4 w-4" />
        <T text="Ingredients" />
      </Button>
    </div>
  );
};
