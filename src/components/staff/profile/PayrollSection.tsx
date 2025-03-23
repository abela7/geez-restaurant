
import React, { useState, useEffect } from "react";
import { T } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  PoundSterling, Clock, CalendarDays, ArrowUpDown,
  Filter, ChevronLeft, ChevronRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{field: string, direction: 'asc' | 'desc'}>({
    field: "pay_period",
    direction: "desc"
  });
  const pageSize = 5;
  
  useEffect(() => {
    fetchPayroll();
  }, [staffId, statusFilter, page, sorting]);
  
  const fetchPayroll = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('staff_payroll')
        .select('*')
        .eq('staff_id', staffId)
        .order(sorting.field, { ascending: sorting.direction === 'asc' })
        .range((page - 1) * pageSize, page * pageSize - 1);
      
      if (statusFilter !== "all") {
        query = query.eq('payment_status', statusFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setPayrollRecords(data as PayrollRecord[]);
    } catch (err: any) {
      console.error('Error fetching payroll:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleSort = () => {
    setSorting(prev => ({
      ...prev,
      direction: prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
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
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center text-lg font-medium">
          <PoundSterling className="mr-2 h-5 w-5" />
          <T text="Payroll History" />
        </CardTitle>
        
        <div className="flex items-center space-x-2">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[130px] h-8">
              <Filter className="h-3.5 w-3.5 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"><T text="All Status" /></SelectItem>
              <SelectItem value="Paid"><T text="Paid" /></SelectItem>
              <SelectItem value="Pending"><T text="Pending" /></SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleSort}
            className="h-8 px-2"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
          </Button>
        </div>
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
          <>
            <ul className="space-y-3">
              {payrollRecords.map((record) => (
                <li key={record.id} className="border p-3 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium text-base">{record.pay_period}</span>
                        <Badge className={`ml-2 ${getStatusColor(record.payment_status)}`}>
                          {record.payment_status}
                        </Badge>
                      </div>
                      <div className="flex items-center mt-2 space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>
                            {record.regular_hours} <T text="reg" /> + {record.overtime_hours} <T text="OT" /> = {record.total_hours} <T text="hours" />
                          </span>
                        </div>
                        {record.payment_date && (
                          <div className="flex items-center">
                            <CalendarDays className="h-3.5 w-3.5 mr-1" />
                            <span><T text="Paid on" />: {formatDate(record.payment_date)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-lg font-medium">
                        £{record.total_pay.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            <div className="flex items-center justify-between mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <T text="Previous" />
              </Button>
              <span className="text-sm text-muted-foreground">
                <T text="Page" /> {page}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => p + 1)}
                disabled={payrollRecords.length < pageSize}
              >
                <T text="Next" />
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PayrollSection;
