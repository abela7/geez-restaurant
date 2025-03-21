
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Ingredient } from "@/services/inventory/types";

interface InventoryItemCardProps {
  item: Ingredient;
  status: "normal" | "low" | "out-of-stock";
  onAdjust: (item: Ingredient) => void;
  onReport: (item: Ingredient) => void;
}

const InventoryItemCard: React.FC<InventoryItemCardProps> = ({
  item,
  status,
  onAdjust,
  onReport
}) => {
  const { t } = useLanguage();
  
  const getCardClassName = () => {
    if (status === 'out-of-stock') return 'border-destructive/50 bg-destructive/5';
    if (status === 'low') return 'border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20';
    return '';
  };
  
  const getBadgeVariant = () => {
    if (status === 'normal') return 'outline';
    if (status === 'low') return 'default';
    return 'destructive';
  };
  
  const getStatusText = () => {
    if (status === 'out-of-stock') return t('Out of Stock');
    if (status === 'low') return t('Low Stock');
    return t('In Stock');
  };
  
  return (
    <Card className={getCardClassName()}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-base">{item.name}</h3>
            <div className="text-sm text-muted-foreground mt-1">{item.category}</div>
          </div>
          <Badge 
            variant={getBadgeVariant()}
            className="capitalize"
          >
            {getStatusText()}
          </Badge>
        </div>
        
        <div className="mt-3 text-sm">
          <div className="flex justify-between">
            <span><T text="Current" /></span>
            <span className="font-medium">{item.stock_quantity || 0} {item.unit}</span>
          </div>
          {item.reorder_level !== undefined && (
            <div className="flex justify-between mt-1">
              <span><T text="Reorder At" /></span>
              <span>{item.reorder_level} {item.unit}</span>
            </div>
          )}
        </div>
        
        <div className="mt-3 flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onAdjust(item)}
          >
            <T text="Adjust Stock" />
          </Button>
          
          {(status === "low" || status === "out-of-stock") && (
            <Button 
              variant={status === "out-of-stock" ? "destructive" : "default"}
              size="sm"
              className="flex-1"
              onClick={() => onReport(item)}
            >
              <AlertTriangle className="h-4 w-4 mr-1" />
              <T text="Report" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryItemCard;
