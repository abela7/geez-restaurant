
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
    <Card className="overflow-hidden hover:shadow-sm transition-all duration-200 group border-border">
      <div className="relative">
        <div 
          className="aspect-[4/3] bg-muted bg-cover bg-center" 
          style={{ 
            backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
            backgroundColor: !imageUrl ? 'hsl(var(--muted))' : undefined
          }}
        />
        <Badge className="absolute top-1 right-1 bg-background/80 backdrop-blur-sm text-xs">{t(category)}</Badge>
      </div>
      <div className="p-2">
        <h3 className="font-medium text-sm line-clamp-1">{t(name)}</h3>
        {description && (
          <p className="text-muted-foreground text-xs mt-0.5 line-clamp-1">{t(description)}</p>
        )}
        <div className="flex justify-between items-center mt-1.5">
          <span className="font-bold text-primary text-sm">${price.toFixed(2)}</span>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={onOrder} 
            className="h-6 px-1.5 group-hover:bg-primary/10"
          >
            <PlusCircle className="h-3 w-3 mr-0.5" />
            <T text="Add" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
