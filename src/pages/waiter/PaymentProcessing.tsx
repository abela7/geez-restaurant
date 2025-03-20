
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { CreditCard, Calculator, Printer, DollarSign, Percent, ReceiptText, Divide, ArrowRight } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample order data for payment
const orderItems = [
  { id: 1, name: "Doro Wat", quantity: 2, price: 18.99, subtotal: 37.98 },
  { id: 2, name: "Tibs", quantity: 1, price: 17.99, subtotal: 17.99 },
  { id: 3, name: "Injera Bread", quantity: 3, price: 3.99, subtotal: 11.97 },
  { id: 4, name: "Ethiopian Coffee", quantity: 2, price: 4.50, subtotal: 9.00 },
];

// Calculate order total
const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
const tax = subtotal * 0.08; // 8% tax
const total = subtotal + tax;

// Sample payment methods
const paymentMethods = [
  { id: "cash", name: "Cash", icon: <DollarSign className="h-5 w-5" /> },
  { id: "credit", name: "Credit Card", icon: <CreditCard className="h-5 w-5" /> },
  { id: "mobile", name: "Mobile Payment", icon: <Printer className="h-5 w-5" /> },
];

const PaymentProcessing = () => {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title="Payment Processing" 
        description="Process payments for customer orders"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="p-4 border-b flex justify-between items-center">
              <div>
                <h3 className="font-medium text-lg"><T text="Order #45" /></h3>
                <p className="text-sm text-muted-foreground"><T text="Table 7" /></p>
              </div>
              <Badge variant="outline"><T text="Ready for Payment" /></Badge>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Item" /></TableHead>
                  <TableHead className="text-right"><T text="Quantity" /></TableHead>
                  <TableHead className="text-right"><T text="Price" /></TableHead>
                  <TableHead className="text-right"><T text="Subtotal" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">£{item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">£{item.subtotal.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium"><T text="Subtotal" /></TableCell>
                  <TableCell className="text-right font-medium">£{subtotal.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium"><T text="Tax (8%)" /></TableCell>
                  <TableCell className="text-right">£{tax.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-bold text-lg"><T text="Total" /></TableCell>
                  <TableCell className="text-right font-bold text-lg">£{total.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            <div className="p-4 border-t">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <Button variant="outline">
                  <Percent className="mr-2 h-4 w-4" />
                  <T text="Apply Discount" />
                </Button>
                <Button variant="outline">
                  <Divide className="mr-2 h-4 w-4" />
                  <T text="Split Bill" />
                </Button>
                <Button variant="outline">
                  <Calculator className="mr-2 h-4 w-4" />
                  <T text="Calculator" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <div className="p-4 border-b">
              <h3 className="font-medium text-lg"><T text="Payment Method" /></h3>
            </div>
            
            <div className="p-4">
              <Tabs defaultValue="cash">
                <TabsList className="grid grid-cols-3 mb-4">
                  {paymentMethods.map((method) => (
                    <TabsTrigger key={method.id} value={method.id} className="flex gap-2">
                      {method.icon}
                      <span className="hidden sm:inline"><T text={method.name} /></span>
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <TabsContent value="cash">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2"><T text="Amount Due" /></p>
                      <p className="text-2xl font-bold">£{total.toFixed(2)}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block"><T text="Amount Received" /></label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">£</span>
                        <Input placeholder="0.00" className="pl-7" />
                      </div>
                    </div>
                    
                    <div className="bg-muted rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium"><T text="Change Due" /></p>
                        <p className="font-bold">£0.00</p>
                      </div>
                    </div>
                    
                    <Button className="w-full" size="lg">
                      <DollarSign className="mr-2 h-5 w-5" />
                      <T text="Process Cash Payment" />
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="credit">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2"><T text="Amount to Charge" /></p>
                      <p className="text-2xl font-bold">£{total.toFixed(2)}</p>
                    </div>
                    
                    <div className="bg-muted rounded-md p-4">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <p className="font-medium"><T text="Card Terminal Ready" /></p>
                          <p className="text-sm text-muted-foreground"><T text="Please swipe, insert, or tap card" /></p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block"><T text="Tip Amount (Optional)" /></label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">£</span>
                        <Input placeholder="0.00" className="pl-7" />
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <Button variant="outline" size="sm">15%</Button>
                        <Button variant="outline" size="sm">18%</Button>
                        <Button variant="outline" size="sm">20%</Button>
                      </div>
                    </div>
                    
                    <Button className="w-full" size="lg">
                      <CreditCard className="mr-2 h-5 w-5" />
                      <T text="Process Card Payment" />
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="mobile">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2"><T text="Amount to Process" /></p>
                      <p className="text-2xl font-bold">£{total.toFixed(2)}</p>
                    </div>
                    
                    <div className="bg-muted rounded-md p-4 flex flex-col items-center justify-center text-center py-8">
                      <img src="/placeholder.svg" alt="QR Code" className="w-40 h-40 mb-4" />
                      <p className="font-medium"><T text="Scan to Pay" /></p>
                      <p className="text-sm text-muted-foreground"><T text="Use mobile payment app to scan" /></p>
                    </div>
                    
                    <Button className="w-full" size="lg">
                      <ArrowRight className="mr-2 h-5 w-5" />
                      <T text="Confirm Payment" />
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </Card>
          
          <Card className="mt-6">
            <div className="p-4 border-b">
              <h3 className="font-medium"><T text="Receipt Options" /></h3>
            </div>
            <div className="p-4 space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Printer className="mr-2 h-4 w-4" />
                <T text="Print Receipt" />
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ReceiptText className="mr-2 h-4 w-4" />
                <T text="Email Receipt" />
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ReceiptText className="mr-2 h-4 w-4" />
                <T text="SMS Receipt" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessing;
