
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Ingredient } from "@/services/inventory/types";

interface InventoryItemRowProps {
  item: Ingredient;
  status: "normal" | "low" | "out-of-stock";
  onAdjust: (item: Ingredient) => void;
  onReport: (item: Ingredient) => void;
}

const InventoryItemRow: React.FC<InventoryItemRowProps> = ({
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
    if (status === 'out-of-stock') return t('Out');
    if (status === 'low') return t('Low');
    return t('OK');
  };
  
  return (
    <Card className={getCardClassName()}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="font-medium">{item.name}</h3>
              <div className="text-sm text-muted-foreground">{item.category}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right mr-2">
              <div className="font-medium">{item.stock_quantity || 0} {item.unit}</div>
              <div className="text-xs text-muted-foreground">
                <T text="Reorder at" />: {item.reorder_level} {item.unit}
              </div>
            </div>
            <Badge variant={getBadgeVariant()}>
              {getStatusText()}
            </Badge>
            <Button size="sm" variant="outline" onClick={() => onAdjust(item)}>
              <T text="Adjust" />
            </Button>
            {(status === "low" || status === "out-of-stock") && (
              <Button 
                size="sm" 
                variant={status === "out-of-stock" ? "destructive" : "default"}
                onClick={() => onReport(item)}
              >
                <T text="Report" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryItemRow;
