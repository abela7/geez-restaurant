
import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ClipboardList } from 'lucide-react';

// Mock data for activity log
const activityLogs = [
  { id: 1, user: 'Abebe Kebede', action: 'Logged in', target: 'System', timestamp: '2023-06-15 08:30:45' },
  { id: 2, user: 'Sara Hailu', action: 'Created order', target: 'Order #1532', timestamp: '2023-06-15 09:12:18' },
  { id: 3, user: 'Dawit Tesfaye', action: 'Modified menu item', target: 'Doro Wat', timestamp: '2023-06-15 10:05:32' },
  { id: 4, user: 'Tigist Alemu', action: 'Changed table status', target: 'Table 5', timestamp: '2023-06-15 11:22:40' },
  { id: 5, user: 'Abebe Kebede', action: 'Generated report', target: 'Sales Report', timestamp: '2023-06-15 12:15:03' },
  { id: 6, user: 'Admin', action: 'Added inventory item', target: 'Berbere Spice', timestamp: '2023-06-15 13:45:27' },
  { id: 7, user: 'Sara Hailu', action: 'Processed payment', target: 'Order #1527', timestamp: '2023-06-15 14:30:19' },
  { id: 8, user: 'System', action: 'Backup completed', target: 'Database', timestamp: '2023-06-15 15:00:00' },
];

const ActivityLog: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Layout interface="admin">
      <PageHeader
        heading={<T text="Activity Log" />}
        description={<T text="View all system and user activities" />}
        icon={<ClipboardList className="h-6 w-6" />}
      />
      
      <Card>
        <CardHeader>
          <CardTitle><T text="Recent Activities" /></CardTitle>
          <CardDescription><T text="Log of all recent system and user activities" /></CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><T text="User" /></TableHead>
                <TableHead><T text="Action" /></TableHead>
                <TableHead><T text="Target" /></TableHead>
                <TableHead><T text="Timestamp" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.target}</TableCell>
                  <TableCell>{log.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default ActivityLog;
