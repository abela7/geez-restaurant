
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { PlusCircle } from "lucide-react";

interface QuickOrderCardProps {
  name: string;
  description: string | null;
  price: number;
  category: string;
  imageUrl: string | null;
  onOrder: () => void;
}

export const QuickOrderCard: React.FC<QuickOrderCardProps> = ({
  name,
  description,
  price,
  category,
  imageUrl,
  onOrder
}) => {
  const { t } = useLanguage();
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative">
        <div 
          className="aspect-video bg-muted bg-cover bg-center" 
          style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : undefined }}
        />
        <Badge className="absolute top-2 right-2">{t(category)}</Badge>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-base line-clamp-1">{t(name)}</h3>
        {description && (
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{t(description)}</p>
        )}
        <div className="flex justify-between items-center mt-3">
          <span className="font-bold">${price.toFixed(2)}</span>
          <Button size="sm" onClick={onOrder}>
            <PlusCircle className="h-4 w-4 mr-1" />
            <T text="Add" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
