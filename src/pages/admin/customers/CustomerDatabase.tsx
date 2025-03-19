
import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Search, Download, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge-extended';

const CUSTOMERS_DATA = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    visits: 8,
    lastVisit: "2023-06-10",
    status: "active",
    loyalty: "Gold"
  },
  {
    id: 2,
    name: "Sarah Miller",
    email: "sarah.miller@example.com",
    phone: "+1 (555) 987-6543",
    visits: 3,
    lastVisit: "2023-06-05",
    status: "active",
    loyalty: "Silver"
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael.chen@example.com",
    phone: "+1 (555) 456-7890",
    visits: 12,
    lastVisit: "2023-06-09",
    status: "active",
    loyalty: "Gold"
  },
  {
    id: 4,
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    phone: "+1 (555) 234-5678",
    visits: 1,
    lastVisit: "2023-05-28",
    status: "inactive",
    loyalty: "Bronze"
  },
  {
    id: 5,
    name: "David Kim",
    email: "david.kim@example.com",
    phone: "+1 (555) 876-5432",
    visits: 6,
    lastVisit: "2023-06-01",
    status: "active",
    loyalty: "Silver"
  },
];

const CustomerDatabase: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Layout interface="admin">
      <PageHeader
        heading={<T text="Customer Database" />}
        description={<T text="Manage your customer information" />}
        icon={<Database className="h-6 w-6" />}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              <T text="Export" />
            </Button>
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              <T text="Add Customer" />
            </Button>
          </>
        }
      />
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Total Customers" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">248</div>
            <p className="text-sm text-muted-foreground mt-1"><T text="+12% from last month" /></p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Active Customers" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">186</div>
            <p className="text-sm text-muted-foreground mt-1"><T text="75% of total customers" /></p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Average Visits" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.2</div>
            <p className="text-sm text-muted-foreground mt-1"><T text="Per customer" /></p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Loyalty Members" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">142</div>
            <p className="text-sm text-muted-foreground mt-1"><T text="57% of total customers" /></p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle><T text="Customer List" /></CardTitle>
          <CardDescription><T text="View and manage customer information" /></CardDescription>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder={t("Search customers...")}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><T text="Name" /></TableHead>
                <TableHead className="hidden md:table-cell"><T text="Email" /></TableHead>
                <TableHead className="hidden lg:table-cell"><T text="Phone" /></TableHead>
                <TableHead><T text="Visits" /></TableHead>
                <TableHead className="hidden md:table-cell"><T text="Last Visit" /></TableHead>
                <TableHead><T text="Status" /></TableHead>
                <TableHead><T text="Loyalty" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CUSTOMERS_DATA.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{customer.email}</TableCell>
                  <TableCell className="hidden lg:table-cell">{customer.phone}</TableCell>
                  <TableCell>{customer.visits}</TableCell>
                  <TableCell className="hidden md:table-cell">{customer.lastVisit}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={customer.status === "active" ? "success" : "warning"}
                    >
                      <T text={customer.status} />
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        customer.loyalty === "Gold" ? "default" : 
                        customer.loyalty === "Silver" ? "secondary" : 
                        "outline"
                      }
                    >
                      <T text={customer.loyalty} />
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default CustomerDatabase;
