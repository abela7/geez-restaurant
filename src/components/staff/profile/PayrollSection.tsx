
import React, { useState, useEffect } from "react";
import { T } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PoundSterling, Clock, CalendarDays } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface PayrollSectionProps {
  staffId: string;
}

interface PayrollRecord {
  id: string;
  staff_id: string;
  pay_period: string;
  regular_hours: number;
  overtime_hours: number;
  total_hours: number;
  total_pay: number;
  payment_status: string;
  payment_date: string | null;
}

const PayrollSection: React.FC<PayrollSectionProps> = ({ staffId }) => {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPayroll = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('staff_payroll')
          .select('*')
          .eq('staff_id', staffId)
          .order('pay_period', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        
        setPayrollRecords(data as PayrollRecord[]);
      } catch (err: any) {
        console.error('Error fetching payroll:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPayroll();
  }, [staffId]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400";
      case "Pending":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg font-medium">
          <PoundSterling className="mr-2 h-5 w-5" />
          <T text="Recent Payroll" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center p-4">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent text-primary rounded-full"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">
            <p>{error}</p>
          </div>
        ) : payrollRecords.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            <p><T text="No payroll records found" /></p>
          </div>
        ) : (
          <ul className="space-y-3">
            {payrollRecords.map((record) => (
              <li key={record.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{record.pay_period}</p>
                    <div className="flex items-center mt-1 space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>{record.total_hours.toFixed(2)} hours</span>
                      </div>
                      {record.payment_date && (
                        <div className="flex items-center">
                          <CalendarDays className="h-3.5 w-3.5 mr-1" />
                          <span>{formatDate(record.payment_date)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(record.payment_status)}`}>
                      {record.payment_status}
                    </span>
                    <span className="text-sm mt-1 font-medium">
                      £{record.total_pay.toFixed(2)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default PayrollSection;
