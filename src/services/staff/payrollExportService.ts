
import { PayrollRecord } from "@/hooks/useStaffPayroll";
import { format } from "date-fns";
import jsPDF from "jspdf";
import "jspdf-autotable";

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

// Function to export a single payroll record to PDF
export const exportPayrollRecordToPDF = (
  record: PayrollRecord,
  staffName?: string,
  title = "Payroll Record"
) => {
  try {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 20);
    
    // Add staff information if available
    if (staffName) {
      doc.setFontSize(12);
      doc.text(`Staff: ${staffName}`, 14, 30);
      doc.text(`Pay Period: ${record.pay_period}`, 14, 38);
    } else {
      doc.setFontSize(12);
      doc.text(`Pay Period: ${record.pay_period}`, 14, 30);
    }
    
    // Add payment status and date
    doc.setFontSize(11);
    doc.text(`Status: ${record.payment_status}`, 14, 46);
    if (record.payment_date) {
      doc.text(`Payment Date: ${format(new Date(record.payment_date), 'dd/MM/yyyy')}`, 14, 54);
    }
    
    // Add hours breakdown
    doc.setFontSize(14);
    doc.text("Hours Summary", 14, 66);
    
    const hourlyRate = record.hourly_rate || 10;
    const regularPay = record.regular_hours * hourlyRate;
    const overtimePay = record.overtime_hours * hourlyRate * 1.5;
    
    const hoursData = [
      ["Category", "Hours", "Rate (£)", "Amount (£)"],
      ["Regular Hours", record.regular_hours.toString(), hourlyRate.toFixed(2), regularPay.toFixed(2)],
      ["Overtime Hours", record.overtime_hours.toString(), (hourlyRate * 1.5).toFixed(2), overtimePay.toFixed(2)],
      ["Total", record.total_hours.toString(), "", record.total_pay.toFixed(2)]
    ];
    
    // Add table
    (doc as any).autoTable({
      startY: 70,
      head: [hoursData[0]],
      body: hoursData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [75, 58, 107] },
      styles: { halign: 'center' },
      columnStyles: {
        0: { halign: 'left' },
        3: { halign: 'right' }
      }
    });
    
    // Add payment summary
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("Payment Summary", 14, finalY);
    
    const paymentData = [
      ["Description", "Amount (£)"],
      ["Base Pay", regularPay.toFixed(2)],
      ["Overtime Pay", overtimePay.toFixed(2)],
      ["Total Pay", record.total_pay.toFixed(2)]
    ];
    
    // Add payment table
    (doc as any).autoTable({
      startY: finalY + 4,
      head: [paymentData[0]],
      body: paymentData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [75, 58, 107] },
      columnStyles: {
        0: { halign: 'left' },
        1: { halign: 'right' }
      }
    });
    
    // Add footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Generated on ${format(new Date(), 'dd/MM/yyyy HH:mm')} | Page ${i} of ${pageCount}`,
        14,
        doc.internal.pageSize.height - 10
      );
    }
    
    // Save PDF
    doc.save(`payroll_record_${record.pay_period.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};

// Function to export multiple payroll records to a single PDF
export const exportPayrollToPDF = (
  records: PayrollRecord[],
  staffNames: Record<string, string> = {},
  title = "Payroll Report"
) => {
  try {
    if (records.length === 0) {
      console.warn("No records to export");
      return false;
    }
    
    // Create new PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 20);
    
    // Add report date
    doc.setFontSize(11);
    doc.text(`Generated on: ${format(new Date(), 'dd MMMM yyyy, HH:mm')}`, 14, 28);
    doc.text(`Total Records: ${records.length}`, 14, 35);
    
    // Prepare data for table
    const tableData = records.map(record => [
      staffNames[record.staff_id] || record.staff_id,
      record.pay_period,
      record.regular_hours.toString(),
      record.overtime_hours.toString(),
      record.total_hours.toString(),
      `£${record.total_pay.toFixed(2)}`,
      record.payment_status,
      record.payment_date ? format(new Date(record.payment_date), 'dd/MM/yyyy') : '-'
    ]);
    
    // Add table
    (doc as any).autoTable({
      startY: 45,
      head: [['Staff Name', 'Pay Period', 'Regular Hrs', 'OT Hrs', 'Total Hrs', 'Total Pay', 'Status', 'Paid Date']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [75, 58, 107] },
      styles: { fontSize: 9 },
      columnStyles: {
        5: { halign: 'right' }
      }
    });
    
    // Calculate totals
    const totalRegularHours = records.reduce((sum, r) => sum + r.regular_hours, 0);
    const totalOvertimeHours = records.reduce((sum, r) => sum + r.overtime_hours, 0);
    const totalHours = records.reduce((sum, r) => sum + r.total_hours, 0);
    const totalPay = records.reduce((sum, r) => sum + r.total_pay, 0);
    
    // Add summary section
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("Summary", 14, finalY);
    
    const summaryData = [
      ["Description", "Value"],
      ["Total Regular Hours", totalRegularHours.toFixed(2)],
      ["Total Overtime Hours", totalOvertimeHours.toFixed(2)],
      ["Total Hours", totalHours.toFixed(2)],
      ["Total Payments", `£${totalPay.toFixed(2)}`],
      ["Average Pay Per Record", `£${(totalPay / records.length).toFixed(2)}`]
    ];
    
    // Add summary table
    (doc as any).autoTable({
      startY: finalY + 4,
      head: [summaryData[0]],
      body: summaryData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [75, 58, 107] },
      styles: { fontSize: 10 },
      columnStyles: {
        0: { halign: 'left' },
        1: { halign: 'right' }
      }
    });
    
    // Add footer with page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 30,
        doc.internal.pageSize.height - 10
      );
    }
    
    // Save PDF
    doc.save(`payroll_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};
