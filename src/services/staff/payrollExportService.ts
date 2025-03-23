
import { PayrollRecord } from "@/hooks/useStaffPayroll";
import { format } from "date-fns";

// Helper function to generate CSV content
const generateCSV = (records: PayrollRecord[], staffNames: Record<string, string> = {}) => {
  // CSV Headers
  const headers = [
    "Staff Name",
    "Pay Period",
    "Regular Hours",
    "Overtime Hours",
    "Total Hours",
    "Total Pay (£)",
    "Payment Status",
    "Payment Date"
  ].join(",");
  
  // CSV Rows
  const rows = records.map(record => {
    const staffName = staffNames[record.staff_id] || record.staff_id;
    const paymentDate = record.payment_date 
      ? format(new Date(record.payment_date), 'yyyy-MM-dd')
      : '';
    
    return [
      `"${staffName}"`,
      `"${record.pay_period}"`,
      record.regular_hours,
      record.overtime_hours,
      record.total_hours,
      record.total_pay.toFixed(2),
      `"${record.payment_status}"`,
      `"${paymentDate}"`
    ].join(",");
  });
  
  return [headers, ...rows].join("\n");
};

export const exportPayrollToCSV = (
  records: PayrollRecord[], 
  staffNames: Record<string, string> = {},
  filename = "payroll_export"
) => {
  try {
    const csvContent = generateCSV(records, staffNames);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error("Error exporting payroll data:", error);
    return false;
  }
};

export const exportPayrollToPDF = (
  records: PayrollRecord[],
  staffNames: Record<string, string> = {},
  title = "Payroll Report"
) => {
  // In a real implementation, this would use a PDF generation library
  // For now, we'll just show a placeholder that would be replaced with actual PDF generation
  
  console.log("Generating PDF with title:", title);
  console.log("Number of records:", records.length);
  
  alert("PDF Export functionality would be implemented with a PDF generation library like jsPDF or pdfmake.");
  
  return true;
};
