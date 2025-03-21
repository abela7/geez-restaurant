
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Ban } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

const EmptyInventory: React.FC = () => {
  return (
    <Card className="col-span-full">
      <CardContent className="flex flex-col items-center justify-center p-6">
        <Ban className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
        <p className="text-muted-foreground">
          <T text="No inventory items found" />
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyInventory;
