
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/card-stat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TabNav from "@/components/TabNav";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Calendar, ChevronDown, Download, DollarSign, Search, TrendingUp, Users } from "lucide-react";
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ResponsiveContainer } from "recharts";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";

// Sample sales data for the chart
const dailySalesData = [
  { time: "8 AM", amount: 145 },
  { time: "9 AM", amount: 230 },
  { time: "10 AM", amount: 315 },
  { time: "11 AM", amount: 410 },
  { time: "12 PM", amount: 530 },
  { time: "1 PM", amount: 650 },
  { time: "2 PM", amount: 490 },
  { time: "3 PM", amount: 350 },
  { time: "4 PM", amount: 270 },
  { time: "5 PM", amount: 320 },
  { time: "6 PM", amount: 480 },
  { time: "7 PM", amount: 590 },
  { time: "8 PM", amount: 630 },
  { time: "9 PM", amount: 510 },
  { time: "10 PM", amount: 320 },
];

// Sample transactions data
const transactions = [
  { id: 1, time: "08:24 AM", items: 3, server: "Abebe T.", table: "Table 7", amount: 68.50, paymentMethod: "Cash" },
  { id: 2, time: "09:12 AM", items: 2, server: "Kebede M.", table: "Table 3", amount: 42.25, paymentMethod: "Card" },
  { id: 3, time: "10:30 AM", items: 5, server: "Hiwot Y.", table: "Table 12", amount: 94.75, paymentMethod: "Card" },
  { id: 4, time: "11:15 AM", items: 4, server: "Selam A.", table: "Table 8", amount: 76.20, paymentMethod: "Mobile" },
  { id: 5, time: "12:05 PM", items: 2, server: "Abebe T.", table: "Table 5", amount: 38.50, paymentMethod: "Cash" },
  { id: 6, time: "12:45 PM", items: 6, server: "Hiwot Y.", table: "Table 1", amount: 112.40, paymentMethod: "Card" },
  { id: 7, time: "01:20 PM", items: 3, server: "Kebede M.", table: "Table 9", amount: 57.30, paymentMethod: "Mobile" },
  { id: 8, time: "02:10 PM", items: 2, server: "Selam A.", table: "Table 6", amount: 46.75, paymentMethod: "Cash" },
  { id: 9, time: "03:05 PM", items: 4, server: "Abebe T.", table: "Table 4", amount: 83.20, paymentMethod: "Card" },
  { id: 10, time: "04:30 PM", items: 5, server: "Kebede M.", table: "Table 11", amount: 104.50, paymentMethod: "Mobile" },
];

// Sample popular items data
const popularItems = [
  { id: 1, name: "Doro Wat", quantity: 42, revenue: 630.00 },
  { id: 2, name: "Tibs", quantity: 38, revenue: 570.00 },
  { id: 3, name: "Kitfo", quantity: 35, revenue: 612.50 },
  { id: 4, name: "Shiro", quantity: 33, revenue: 462.00 },
  { id: 5, name: "Injera", quantity: 120, revenue: 360.00 },
];

const DailySales = () => {
  const [activeTab, setActiveTab] = useState("sales");
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  const { currentLanguage } = useLanguage();

  const tabItems = [
    { icon: <DollarSign className="h-4 w-4" />, label: "Sales Overview", value: "sales" },
    { icon: <Users className="h-4 w-4" />, label: "Staff Performance", value: "staff" },
    { icon: <TrendingUp className="h-4 w-4" />, label: "Item Analysis", value: "items" },
  ];

  return (
    <Layout interface="admin">
      <div className="container mx-auto p-4 md:p-6">
        <PageHeader 
          title="Daily Sales" 
          description={`Sales data for ${selectedDate}`}
          actions={
            <>
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                <T text="Change Date" />
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                <T text="Export Data" />
              </Button>
            </>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Today's Revenue" 
            value="$2,845.30" 
            change="+12.5%" 
            isPositive={true}
            icon={<DollarSign size={18} />}
          />
          <StatCard 
            title="Total Orders" 
            value="124" 
            change="+8.2%" 
            isPositive={true}
            icon={<TrendingUp size={18} />}
          />
          <StatCard 
            title="Average Order Value" 
            value="$22.94" 
            change="+4.3%" 
            isPositive={true}
            icon={<DollarSign size={18} />}
          />
          <StatCard 
            title="Total Customers" 
            value="98" 
            change="+6.5%" 
            isPositive={true}
            icon={<Users size={18} />}
          />
        </div>

        <TabNav items={tabItems} value={activeTab} onChange={setActiveTab} className="mb-6" />

        {activeTab === "sales" && (
          <>
            <Card className="mb-6 p-5">
              <h3 className="text-lg font-medium mb-4"><T text="Sales Throughout the Day" /></h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailySalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="amount" stroke="#DAA520" activeDot={{ r: 8 }} name="Sales ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card>
              <div className="p-4 border-b">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                  <h3 className="text-lg font-medium"><T text="Today's Transactions" /></h3>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search transactions..."
                      className="pl-9 w-full md:w-[300px]"
                    />
                  </div>
                </div>
              </div>
              
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><T text="Time" /></TableHead>
                      <TableHead><T text="Items" /></TableHead>
                      <TableHead><T text="Server" /></TableHead>
                      <TableHead><T text="Table" /></TableHead>
                      <TableHead><T text="Payment Method" /></TableHead>
                      <TableHead className="text-right"><T text="Amount" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.time}</TableCell>
                        <TableCell>{transaction.items}</TableCell>
                        <TableCell>{transaction.server}</TableCell>
                        <TableCell>{transaction.table}</TableCell>
                        <TableCell>{transaction.paymentMethod}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${transaction.amount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </Card>
          </>
        )}

        {activeTab === "staff" && (
          <Card className="p-5">
            <h3 className="text-lg font-medium mb-4"><T text="Staff Performance" /></h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Staff Name" /></TableHead>
                  <TableHead><T text="Orders Served" /></TableHead>
                  <TableHead><T text="Items Sold" /></TableHead>
                  <TableHead className="text-right"><T text="Sales Amount" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Abebe T.</TableCell>
                  <TableCell>24</TableCell>
                  <TableCell>78</TableCell>
                  <TableCell className="text-right">$845.20</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Kebede M.</TableCell>
                  <TableCell>18</TableCell>
                  <TableCell>52</TableCell>
                  <TableCell className="text-right">$642.30</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Hiwot Y.</TableCell>
                  <TableCell>22</TableCell>
                  <TableCell>64</TableCell>
                  <TableCell className="text-right">$738.50</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Selam A.</TableCell>
                  <TableCell>16</TableCell>
                  <TableCell>48</TableCell>
                  <TableCell className="text-right">$619.30</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        )}

        {activeTab === "items" && (
          <Card className="p-5">
            <h3 className="text-lg font-medium mb-4"><T text="Popular Items Today" /></h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Item Name" /></TableHead>
                  <TableHead><T text="Quantity Sold" /></TableHead>
                  <TableHead className="text-right"><T text="Revenue" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {popularItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.revenue.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default DailySales;
