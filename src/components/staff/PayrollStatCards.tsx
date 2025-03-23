
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, PoundSterling, CreditCard } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { format, endOfMonth } from "date-fns";
import { PayrollRecord } from "@/hooks/useStaffPayroll";

interface PayrollStatCardsProps {
  payrollRecords: PayrollRecord[];
}

const PayrollStatCards: React.FC<PayrollStatCardsProps> = ({ payrollRecords }) => {
  const { t } = useLanguage();

  // Get current period totals
  const currentPeriodRecords = payrollRecords.filter(record => 
    record.pay_period.includes(format(new Date(), 'MMMM yyyy'))
  );
  
  const totalHours = currentPeriodRecords.reduce((sum, record) => sum + record.total_hours, 0);
  const totalPay = currentPeriodRecords.reduce((sum, record) => sum + record.total_pay, 0);

  const nextPaymentDate = () => {
    // Simple logic - if we're before the 15th, next payment is 15th, otherwise end of month
    const today = new Date();
    const day = today.getDate();
    
    if (day < 15) {
      return "15 " + format(today, 'MMMM');
    } else {
      return format(endOfMonth(today), 'd MMMM');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              <T text="Current Pay Period" />
            </p>
            <div className="text-2xl font-bold">£{totalPay.toFixed(2)}</div>
          </div>
          <PoundSterling className="h-8 w-8 text-primary opacity-80" />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              <T text="Total Hours" />
            </p>
            <div className="text-2xl font-bold">{totalHours}</div>
          </div>
          <Clock className="h-8 w-8 text-primary opacity-80" />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              <T text="Next Payment Date" />
            </p>
            <div className="text-2xl font-bold">{nextPaymentDate()}</div>
          </div>
          <CreditCard className="h-8 w-8 text-primary opacity-80" />
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollStatCards;
