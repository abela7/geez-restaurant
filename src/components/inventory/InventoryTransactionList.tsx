
import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { InventoryTransaction } from "@/services/inventory/types";
import { ArrowUp, ArrowDown, Trash2, ShoppingCart } from "lucide-react";

interface InventoryTransactionListProps {
  transactions: InventoryTransaction[];
  isLoading?: boolean;
}

export const InventoryTransactionList: React.FC<InventoryTransactionListProps> = ({
  transactions,
  isLoading = false
}) => {
  const { t } = useLanguage();

  const getTransactionIcon = (type: string, quantity: number) => {
    if (type === 'purchase') return <ShoppingCart className="h-4 w-4 text-green-500" />;
    if (type === 'waste') return <Trash2 className="h-4 w-4 text-destructive" />;
    
    return quantity >= 0 
      ? <ArrowUp className="h-4 w-4 text-green-500" /> 
      : <ArrowDown className="h-4 w-4 text-destructive" />;
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'success';
      case 'waste':
        return 'destructive';
      case 'consumption':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead><T text="Date & Time" /></TableHead>
            <TableHead><T text="Transaction Type" /></TableHead>
            <TableHead><T text="Quantity Change" /></TableHead>
            <TableHead><T text="Previous Quantity" /></TableHead>
            <TableHead><T text="New Quantity" /></TableHead>
            <TableHead><T text="Notes" /></TableHead>
            <TableHead><T text="Recorded By" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-2 text-muted-foreground"><T text="Loading transactions..." /></p>
                </div>
              </TableCell>
            </TableRow>
          ) : transactions.length > 0 ? (
            transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {new Date(transaction.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {getTransactionIcon(transaction.transaction_type, transaction.quantity)}
                    <Badge variant={getTransactionColor(transaction.transaction_type) as any}>
                      {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className={transaction.quantity >= 0 ? "text-green-600" : "text-destructive"}>
                  {transaction.quantity > 0 ? "+" : ""}{transaction.quantity} {transaction.unit}
                </TableCell>
                <TableCell>{transaction.previous_quantity} {transaction.unit}</TableCell>
                <TableCell>{transaction.new_quantity} {transaction.unit}</TableCell>
                <TableCell className="max-w-xs truncate">{transaction.notes || "-"}</TableCell>
                <TableCell>{transaction.created_by || "Admin"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                <T text="No transaction history found" />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
