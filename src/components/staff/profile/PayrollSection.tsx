
import React, { useState, useEffect } from "react";
import { T } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  PoundSterling, Clock, CalendarDays, ArrowUpDown,
  Filter, ChevronLeft, ChevronRight, FileText
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
import { useToast } from "@/hooks/use-toast";
import { SideModal } from "@/components/ui/side-modal";
import useStaffPayroll from "@/hooks/useStaffPayroll";
import { exportPayrollRecordToPDF } from "@/services/staff/payrollExportService";

interface PayrollSectionProps {
  staffId: string;
}

const PayrollSection: React.FC<PayrollSectionProps> = ({ staffId }) => {
  const { toast } = useToast();
  const { payrollRecords, isLoading, error } = useStaffPayroll(staffId);
  
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<{field: string, direction: 'asc' | 'desc'}>({
    field: "pay_period",
    direction: "desc"
  });
  const [selectedPayroll, setSelectedPayroll] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const pageSize = 5;
  
  // Apply filters and sorting
  const filteredPayroll = payrollRecords
    .filter(record => statusFilter === "all" || record.payment_status === statusFilter)
    .sort((a, b) => {
      if (sorting.direction === 'asc') {
        return a[sorting.field as keyof typeof a] > b[sorting.field as keyof typeof b] ? 1 : -1;
      } else {
        return a[sorting.field as keyof typeof a] < b[sorting.field as keyof typeof b] ? 1 : -1;
      }
    });
  
  // Paginate the records
  const paginatedPayroll = filteredPayroll.slice((page - 1) * pageSize, page * pageSize);
  
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
  
  const viewPayrollDetails = (record: any) => {
    setSelectedPayroll(record);
    setIsDetailModalOpen(true);
  };
  
  const handleExportPDF = (record: any) => {
    if (record) {
      exportPayrollRecordToPDF(record, `Staff Record ${staffId}`, `Payroll Record - ${record.pay_period}`);
      toast({
        title: "Success",
        description: "Payroll record exported to PDF"
      });
    }
  };
  
  return (
    <>
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
          ) : paginatedPayroll.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground">
              <p><T text="No payroll records found" /></p>
            </div>
          ) : (
            <>
              <ul className="space-y-3">
                {paginatedPayroll.map((record) => (
                  <li key={record.id} className="border p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium text-base">{record.pay_period}</span>
                          <Badge className={`ml-2 ${getStatusColor(record.payment_status)}`}>
                            {record.payment_status}
                          </Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center mt-2 space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-muted-foreground">
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
                      
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-medium">
                          £{record.total_pay.toFixed(2)}
                        </span>
                        <div className="flex mt-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7"
                            onClick={() => handleExportPDF(record)}
                          >
                            <FileText className="h-3.5 w-3.5 mr-1.5" />
                            <span className="text-xs"><T text="PDF" /></span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7"
                            onClick={() => viewPayrollDetails(record)}
                          >
                            <FileText className="h-3.5 w-3.5 mr-1.5" />
                            <span className="text-xs"><T text="Details" /></span>
                          </Button>
                        </div>
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
                  disabled={paginatedPayroll.length < pageSize}
                >
                  <T text="Next" />
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <SideModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        title={<T text="Payroll Details" />}
        width="md"
      >
        {selectedPayroll && (
          <div className="space-y-6">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold text-lg mb-4">{selectedPayroll.pay_period}</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground"><T text="Regular Hours" /></span>
                  <span>{selectedPayroll.regular_hours}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground"><T text="Overtime Hours" /></span>
                  <span>{selectedPayroll.overtime_hours}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="font-medium"><T text="Total Hours" /></span>
                  <span className="font-medium">{selectedPayroll.total_hours}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="font-medium"><T text="Total Pay" /></span>
                  <span className="font-bold">£{selectedPayroll.total_pay.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2"><T text="Payment Status" /></h4>
              <Badge className={getStatusColor(selectedPayroll.payment_status)}>
                {selectedPayroll.payment_status}
              </Badge>
              {selectedPayroll.payment_date && (
                <div className="mt-2 text-sm">
                  <span className="text-muted-foreground"><T text="Paid on" />: </span>
                  {formatDate(selectedPayroll.payment_date)}
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => handleExportPDF(selectedPayroll)}
              >
                <FileText className="h-4 w-4 mr-2" />
                <T text="Export PDF" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsDetailModalOpen(false)}
              >
                <T text="Close" />
              </Button>
            </div>
          </div>
        )}
      </SideModal>
    </>
  );
};

export default PayrollSection;
