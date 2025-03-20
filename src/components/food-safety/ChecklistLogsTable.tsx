
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { ChecklistLog } from "@/hooks/useChecklistLogs";
import { format } from "date-fns";

type ChecklistLogsTableProps = {
  logs: ChecklistLog[];
  staffNames: Record<string, string>;
  templateNames: Record<string, string>;
};

const ChecklistLogsTable: React.FC<ChecklistLogsTableProps> = ({
  logs,
  staffNames,
  templateNames,
}) => {
  const { t } = useLanguage();
  
  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <T text="No completed checklists found." />
      </div>
    );
  }
  
  return (
    <ScrollArea className="h-[400px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead><T text="Date & Time" /></TableHead>
            <TableHead><T text="Checklist" /></TableHead>
            <TableHead><T text="Completed By" /></TableHead>
            <TableHead><T text="Notes" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                {format(new Date(log.completed_at), "PPp")}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {templateNames[log.template_id] || <T text="Unknown Template" />}
                </Badge>
              </TableCell>
              <TableCell>
                {staffNames[log.completed_by] || <T text="Unknown Staff" />}
              </TableCell>
              <TableCell>
                {log.notes || <span className="text-muted-foreground">-</span>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default ChecklistLogsTable;
