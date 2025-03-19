
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Calendar, CreditCard, Search, Download, DollarSign, Filter, Plus, Wallet, ArrowUpDown, Check, X } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";

// Sample payment method data
const paymentMethodData = [
  { name: "Cash", value: 35 },
  { name: "Credit Card", value: 42 },
  { name: "Mobile Payment", value: 18 },
  { name: "Gift Card", value: 5 },
];

// Sample payment transactions
const paymentTransactions = [
  { 
    id: 1, 
    date: "Aug 7, 2023", 
    time: "7:24 PM", 
    orderId: "ORD-2023-2541", 
    amount: 124.50, 
    method: "Credit Card", 
    status: "completed",
    cardType: "Visa",
    last4: "4242",
    server: "Abebe T."
  },
  { 
    id: 2, 
    date: "Aug 7, 2023", 
    time: "6:58 PM", 
    orderId: "ORD-2023-2540", 
    amount: 86.75, 
    method: "Cash", 
    status: "completed",
    cardType: "",
    last4: "",
    server: "Kebede M."
  },
  { 
    id: 3, 
    date: "Aug 7, 2023", 
    time: "6:45 PM", 
    orderId: "ORD-2023-2539", 
    amount: 204.25, 
    method: "Mobile Payment", 
    status: "completed",
    cardType: "Telebirr",
    last4: "",
    server: "Hiwot Y."
  },
  { 
    id: 4, 
    date: "Aug 7, 2023", 
    time: "6:12 PM", 
    orderId: "ORD-2023-2538", 
    amount: 157.30, 
    method: "Credit Card", 
    status: "completed",
    cardType: "Mastercard",
    last4: "8524",
    server: "Selam A."
  },
  { 
    id: 5, 
    date: "Aug 7, 2023", 
    time: "5:47 PM", 
    orderId: "ORD-2023-2537", 
    amount: 94.50, 
    method: "Cash", 
    status: "completed",
    cardType: "",
    last4: "",
    server: "Abebe T."
  },
  { 
    id: 6, 
    date: "Aug 7, 2023", 
    time: "5:30 PM", 
    orderId: "ORD-2023-2536", 
    amount: 132.80, 
    method: "Gift Card", 
    status: "completed",
    cardType: "",
    last4: "7823",
    server: "Kebede M."
  },
  { 
    id: 7, 
    date: "Aug 7, 2023", 
    time: "5:15 PM", 
    orderId: "ORD-2023-2535", 
    amount: 75.40, 
    method: "Credit Card", 
    status: "declined",
    cardType: "Visa",
    last4: "1234",
    server: "Hiwot Y."
  },
  { 
    id: 8, 
    date: "Aug 7, 2023", 
    time: "4:48 PM", 
    orderId: "ORD-2023-2534", 
    amount: 108.60, 
    method: "Mobile Payment", 
    status: "completed",
    cardType: "Telebirr",
    last4: "",
    server: "Selam A."
  },
  { 
    id: 9, 
    date: "Aug 7, 2023", 
    time: "4:22 PM", 
    orderId: "ORD-2023-2533", 
    amount: 67.90, 
    method: "Cash", 
    status: "completed",
    cardType: "",
    last4: "",
    server: "Abebe T."
  },
  { 
    id: 10, 
    date: "Aug 7, 2023", 
    time: "3:55 PM", 
    orderId: "ORD-2023-2532", 
    amount: 128.45, 
    method: "Credit Card", 
    status: "refunded",
    cardType: "Mastercard",
    last4: "6578",
    server: "Kebede M."
  },
];

// Sample payment providers
const paymentProviders = [
  { 
    id: 1,
    name: "Bank Card Processing",
    provider: "Commercial Bank of Ethiopia",
    type: "Card Processing",
    status: "active",
    fee: "2.5% + 0.25 ETB",
    settlement: "T+1",
    lastSettlement: "Aug 6, 2023"
  },
  { 
    id: 2,
    name: "Mobile Payment",
    provider: "Telebirr",
    type: "Mobile Money",
    status: "active",
    fee: "1.5%",
    settlement: "Same day",
    lastSettlement: "Aug 7, 2023"
  },
  { 
    id: 3,
    name: "Debit Cards",
    provider: "Dashen Bank",
    type: "Card Processing",
    status: "active",
    fee: "2.0%",
    settlement: "T+1",
    lastSettlement: "Aug 6, 2023"
  },
  { 
    id: 4,
    name: "Gift Card System",
    provider: "Internal",
    type: "Prepaid",
    status: "active",
    fee: "0%",
    settlement: "Immediate",
    lastSettlement: "Aug 7, 2023"
  },
  { 
    id: 5,
    name: "International Cards",
    provider: "Global Payment Gateway",
    type: "Card Processing",
    status: "inactive",
    fee: "3.5% + 0.50 ETB",
    settlement: "T+2",
    lastSettlement: "Jul 15, 2023"
  },
];

// Colors for the pie chart
const COLORS = ['#DAA520', '#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const PaymentManagement = () => {
  const [activeTab, setActiveTab] = useState("transactions");
  const { currentLanguage } = useLanguage();

  return (
    <Layout interface="admin">
      <div className="container mx-auto p-4 md:p-6">
        <PageHeader 
          title="Payment Management" 
          description="Monitor and manage payment transactions and providers"
          actions={
            <>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                <T text="Date Range" />
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                <T text="Export Data" />
              </Button>
            </>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 flex items-center space-x-4">
            <div className="p-2 rounded-full bg-amber-100">
              <DollarSign className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground"><T text="Today's Sales" /></p>
              <h3 className="text-2xl font-bold">$1,845.30</h3>
            </div>
          </Card>
          
          <Card className="p-4 flex items-center space-x-4">
            <div className="p-2 rounded-full bg-blue-100">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground"><T text="Card Payments" /></p>
              <h3 className="text-2xl font-bold">$965.40</h3>
            </div>
          </Card>
          
          <Card className="p-4 flex items-center space-x-4">
            <div className="p-2 rounded-full bg-green-100">
              <Wallet className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground"><T text="Cash Payments" /></p>
              <h3 className="text-2xl font-bold">$645.80</h3>
            </div>
          </Card>
          
          <Card className="p-4 flex items-center space-x-4">
            <div className="p-2 rounded-full bg-purple-100">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground"><T text="Other Payments" /></p>
              <h3 className="text-2xl font-bold">$234.10</h3>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="mt-6">
          <TabsList className="mb-4">
            <TabsTrigger value="transactions"><T text="Transactions" /></TabsTrigger>
            <TabsTrigger value="methods"><T text="Payment Methods" /></TabsTrigger>
            <TabsTrigger value="providers"><T text="Payment Providers" /></TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions">
            <Card>
              <div className="p-4 border-b">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                  <div className="relative w-full md:w-auto">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search transactions..."
                      className="pl-9 w-full md:w-[300px]"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      <T text="Filter" />
                    </Button>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all"><T text="All Status" /></SelectItem>
                        <SelectItem value="completed"><T text="Completed" /></SelectItem>
                        <SelectItem value="pending"><T text="Pending" /></SelectItem>
                        <SelectItem value="refunded"><T text="Refunded" /></SelectItem>
                        <SelectItem value="declined"><T text="Declined" /></SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Payment Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all"><T text="All Methods" /></SelectItem>
                        <SelectItem value="card"><T text="Credit Card" /></SelectItem>
                        <SelectItem value="cash"><T text="Cash" /></SelectItem>
                        <SelectItem value="mobile"><T text="Mobile Payment" /></SelectItem>
                        <SelectItem value="gift"><T text="Gift Card" /></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <ScrollArea className="h-[550px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]"><T text="Date/Time" /></TableHead>
                      <TableHead><T text="Order ID" /></TableHead>
                      <TableHead><T text="Amount" /></TableHead>
                      <TableHead><T text="Method" /></TableHead>
                      <TableHead><T text="Details" /></TableHead>
                      <TableHead><T text="Server" /></TableHead>
                      <TableHead><T text="Status" /></TableHead>
                      <TableHead className="text-right"><T text="Actions" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="text-xs">
                          {transaction.date}<br/>{transaction.time}
                        </TableCell>
                        <TableCell>{transaction.orderId}</TableCell>
                        <TableCell className="font-medium">${transaction.amount.toFixed(2)}</TableCell>
                        <TableCell>{transaction.method}</TableCell>
                        <TableCell className="text-xs">
                          {transaction.cardType && (
                            <>
                              {transaction.cardType}
                              {transaction.last4 && <span> •••• {transaction.last4}</span>}
                            </>
                          )}
                        </TableCell>
                        <TableCell>{transaction.server}</TableCell>
                        <TableCell>
                          <Badge variant={
                            transaction.status === "completed" ? "default" : 
                            transaction.status === "refunded" ? "outline" : 
                            "destructive"
                          }>
                            <T text={transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)} />
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </Card>
          </TabsContent>
          
          <TabsContent value="methods">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1 p-5">
                <h3 className="text-lg font-medium mb-4"><T text="Payment Methods Distribution" /></h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethodData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {paymentMethodData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              <Card className="lg:col-span-2 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium"><T text="Accepted Payment Methods" /></h3>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    <T text="Add Method" />
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><T text="Payment Method" /></TableHead>
                      <TableHead><T text="Status" /></TableHead>
                      <TableHead><T text="Processor" /></TableHead>
                      <TableHead><T text="Fee" /></TableHead>
                      <TableHead className="text-right"><T text="Actions" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          <T text="Credit/Debit Cards" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default"><T text="Active" /></Badge>
                      </TableCell>
                      <TableCell>Commercial Bank of Ethiopia</TableCell>
                      <TableCell>2.5% + 0.25 ETB</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <T text="Configure" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Wallet className="mr-2 h-4 w-4" />
                          <T text="Cash" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default"><T text="Active" /></Badge>
                      </TableCell>
                      <TableCell>N/A</TableCell>
                      <TableCell>0%</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <T text="Configure" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <DollarSign className="mr-2 h-4 w-4" />
                          <T text="Mobile Payment" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default"><T text="Active" /></Badge>
                      </TableCell>
                      <TableCell>Telebirr</TableCell>
                      <TableCell>1.5%</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <T text="Configure" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          <T text="Gift Cards" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default"><T text="Active" /></Badge>
                      </TableCell>
                      <TableCell>Internal</TableCell>
                      <TableCell>0%</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <T text="Configure" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="providers">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium"><T text="Payment Providers" /></h3>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  <T text="Add Provider" />
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><T text="Provider Name" /></TableHead>
                    <TableHead><T text="Type" /></TableHead>
                    <TableHead><T text="Status" /></TableHead>
                    <TableHead><T text="Fee Structure" /></TableHead>
                    <TableHead><T text="Settlement Period" /></TableHead>
                    <TableHead><T text="Last Settlement" /></TableHead>
                    <TableHead className="text-right"><T text="Actions" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentProviders.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell className="font-medium">{provider.provider}</TableCell>
                      <TableCell>{provider.type}</TableCell>
                      <TableCell>
                        <Badge variant={provider.status === "active" ? "default" : "outline"}>
                          {provider.status === "active" ? <Check className="mr-1 h-3 w-3" /> : <X className="mr-1 h-3 w-3" />}
                          <T text={provider.status.charAt(0).toUpperCase() + provider.status.slice(1)} />
                        </Badge>
                      </TableCell>
                      <TableCell>{provider.fee}</TableCell>
                      <TableCell>{provider.settlement}</TableCell>
                      <TableCell>{provider.lastSettlement}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <T text="Manage" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PaymentManagement;
