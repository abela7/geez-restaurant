
import { PayrollRecord } from "@/hooks/useStaffPayroll";
import { format, parseISO, isAfter, isBefore, isEqual, startOfMonth } from "date-fns";
import { PayrollFilterOptions } from "@/components/staff/PayrollFilter";

export const getFilteredPayrollRecords = (
  payrollRecords: PayrollRecord[],
  period: string,
  filterOptions: PayrollFilterOptions,
  staffId?: string,
  staffNames: Record<string, string> = {}
) => {
  if (staffId) {
    const staffRecords = payrollRecords.filter(record => record.staff_id === staffId);
    return applyFilters(staffRecords, filterOptions, staffNames);
  }
  
  const isCurrentMonth = (record: PayrollRecord) => {
    return record.pay_period.includes(format(new Date(), 'MMMM yyyy'));
  };
  
  const isPreviousPeriod = (record: PayrollRecord) => {
    try {
      // Attempt to parse the pay period date if in expected format
      const periodDate = record.pay_period.split(' - ')[0];
      const date = parseISO(`01 ${periodDate}`);
      return !isAfter(date, startOfMonth(new Date()));
    } catch {
      // Fallback if date parsing fails
      return !isCurrentMonth(record);
    }
  };
  
  let filteredRecords: PayrollRecord[] = [];
  
  switch (period) {
    case 'current':
      filteredRecords = payrollRecords.filter(isCurrentMonth);
      break;
    case 'previous':
      filteredRecords = payrollRecords.filter(isPreviousPeriod);
      break;
    default:
      filteredRecords = payrollRecords;
  }
  
  return applyFilters(filteredRecords, filterOptions, staffNames);
};

export const applyFilters = (
  records: PayrollRecord[], 
  filterOptions: PayrollFilterOptions,
  staffNames: Record<string, string> = {}
) => {
  return records.filter(record => {
    // Filter by pay period
    if (filterOptions.period && !record.pay_period.toLowerCase().includes(filterOptions.period.toLowerCase())) {
      return false;
    }
    
    // Filter by payment status
    if (filterOptions.status && record.payment_status !== filterOptions.status) {
      return false;
    }
    
    // Filter by staff name
    if (filterOptions.staffName && staffNames[record.staff_id]) {
      const name = staffNames[record.staff_id].toLowerCase();
      if (!name.includes(filterOptions.staffName.toLowerCase())) {
        return false;
      }
    }
    
    // Filter by date range
    if (filterOptions.dateFrom && record.payment_date) {
      const paymentDate = new Date(record.payment_date);
      if (isBefore(paymentDate, filterOptions.dateFrom) && !isEqual(paymentDate, filterOptions.dateFrom)) {
        return false;
      }
    }
    
    if (filterOptions.dateTo && record.payment_date) {
      const paymentDate = new Date(record.payment_date);
      if (isAfter(paymentDate, filterOptions.dateTo) && !isEqual(paymentDate, filterOptions.dateTo)) {
        return false;
      }
    }
    
    return true;
  });
};
