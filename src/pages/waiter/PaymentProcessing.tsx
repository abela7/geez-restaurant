
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, DollarSign, CreditCard, Tag, Printer, Check, Plus, Clock } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Sample active orders for payment
const activeOrders = [
  { 
    id: 101, 
    table: "Table 5", 
    server: "Dawit", 
    time: "58 mins", 
    guests: 2, 
    status: "Ready for Payment",
    items: [
      { name: "Doro Wat", quantity: 1, price: 18.99 },
      { name: "Tibs", quantity: 1, price: 16.99 },
      { name: "St. George Beer", quantity: 2, price: 5.99 },
      { name: "Baklava", quantity: 1, price: 6.99 }
    ],
    subtotal: 54.95,
    tax: 4.95,
    total: 59.90
  },
  { 
    id: 102, 
    table: "Table 7", 
    server: "Dawit", 
    time: "85 mins", 
    guests: 6, 
    status: "Ready for Payment",
    items: [
      { name: "Shiro", quantity: 2, price: 14.99 },
      { name: "Kitfo", quantity: 1, price: 19.99 },
      { name: "Doro Wat", quantity: 2, price: 18.99 },
      { name: "Gomen", quantity: 1, price: 8.99 },
      { name: "Vegetable Sambusa", quantity: 3, price: 3.99 },
      { name: "Tej (Honey Wine)", quantity: 2, price: 8.99 },
      { name: "Ethiopian Coffee", quantity: 6, price: 3.99 }
    ],
    subtotal: 142.85,
    tax: 12.86,
    total: 155.71
  },
  { 
    id: 103, 
    table: "Table 3", 
    server: "Sara", 
    time: "45 mins", 
    guests: 4, 
    status: "Dining",
    items: [
      { name: "Beyaynetu (Vegan Combo)", quantity: 2, price: 16.99 },
      { name: "Tibs", quantity: 2, price: 16.99 },
      { name: "Mango Juice", quantity: 2, price: 4.99 },
      { name: "Sprite", quantity: 2, price: 2.99 }
    ],
    subtotal: 85.92,
    tax: 7.73,
    total: 93.65
  }
];

// Sample completed payments
const completedPayments = [
  { id: 98, table: "Table 4", amount: "$76.43", method: "Credit Card", time: "12:15 PM", server: "Dawit" },
  { id: 99, table: "Table 9", amount: "$42.18", method: "Cash", time: "12:22 PM", server: "Abel" },
  { id: 100, table: "Table 2", amount: "$105.92", method: "Credit Card", time: "1:05 PM", server: "Sara" }
];

const PaymentProcessing = () => {
  const { t } = useLanguage();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showSplitDialog, setShowSplitDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [tipAmount, setTipAmount] = useState("15");
  const [tipCustom, setTipCustom] = useState("");
  
  const tipOptions = ["10", "15", "18", "20", "custom"];
  
  const calculateTipAmount = (order: any) => {
    if (!order) return 0;
    if (tipAmount === "custom") {
      return parseFloat(tipCustom) || 0;
    }
    return (parseFloat(tipAmount) / 100) * order.subtotal;
  };
  
  const calculateTotal = (order: any) => {
    if (!order) return 0;
    const tip = calculateTipAmount(order);
    return order.total + tip;
  };
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title={t("Payment Processing")} 
        description={t("Process payments for customer orders")}
      />
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("Search by table or order number...")}
            className="pl-9 w-full"
          />
        </div>
      </div>
      
      <Tabs defaultValue="active">
        <TabsList className="mb-4">
          <TabsTrigger value="active"><T text="Active Orders" /></TabsTrigger>
          <TabsTrigger value="completed"><T text="Completed Payments" /></TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {activeOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50 p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-medium">
                      {t(order.table)} - {t("Order")} #{order.id}
                    </CardTitle>
                    <Badge variant={order.status === "Ready for Payment" ? "default" : "secondary"}>
                      {t(order.status)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex gap-1 items-center">
                        <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span>{order.time}</span>
                      </div>
                      <div>
                        {order.guests} {t("guests")}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="max-h-24 overflow-y-auto text-sm">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between my-1">
                          <span>{item.quantity}x {item.name}</span>
                          <span>${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>{t("Subtotal")}:</span>
                        <span>${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("Tax")}:</span>
                        <span>${order.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium mt-1">
                        <span>{t("Total")}:</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 pt-0 flex gap-2">
                  {order.status === "Ready for Payment" ? (
                    <>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowSplitDialog(true);
                        }}
                      >
                        <Tag className="mr-2 h-4 w-4" />
                        <T text="Split Bill" />
                      </Button>
                      <Button 
                        className="flex-1"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowPaymentDialog(true);
                        }}
                      >
                        <DollarSign className="mr-2 h-4 w-4" />
                        <T text="Pay" />
                      </Button>
                    </>
                  ) : (
                    <Button className="w-full">
                      <Check className="mr-2 h-4 w-4" />
                      <T text="Mark Ready for Payment" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="completed">
          <Card>
            <CardHeader className="px-6 py-4">
              <CardTitle>{t("Recent Payments")}</CardTitle>
            </CardHeader>
            
            <div className="divide-y">
              {completedPayments.map((payment) => (
                <div key={payment.id} className="p-4 px-6 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{payment.table} - {t("Order")} #{payment.id}</h4>
                      <Badge variant="outline">{payment.method}</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{payment.time}</span>
                      </div>
                      <div>
                        {t("Server")}: {payment.server}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xl font-semibold">{payment.amount}</div>
                    <Button variant="outline" size="sm">
                      <Printer className="h-4 w-4 mr-2" />
                      <T text="Receipt" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle><T text="Process Payment" /></DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">{selectedOrder?.table} - {t("Order")} #{selectedOrder?.id}</h3>
              <p className="text-sm text-muted-foreground">{selectedOrder?.guests} {t("guests")} • {selectedOrder?.time}</p>
            </div>
            
            <Separator />
            
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>{t("Subtotal")}:</span>
                <span>${selectedOrder?.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("Tax")}:</span>
                <span>${selectedOrder?.tax.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span>{t("Tip")}:</span>
                <div className="font-medium">${calculateTipAmount(selectedOrder).toFixed(2)}</div>
              </div>
              <div className="flex justify-between font-semibold">
                <span>{t("Total")}:</span>
                <span>${calculateTotal(selectedOrder).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>{t("Add Tip")}</Label>
              <div className="flex flex-wrap gap-2">
                {tipOptions.map(option => (
                  <Button
                    key={option}
                    type="button"
                    variant={tipAmount === option ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTipAmount(option)}
                  >
                    {option === "custom" ? t("Custom") : `${option}%`}
                  </Button>
                ))}
              </div>
              
              {tipAmount === "custom" && (
                <div className="flex items-center gap-2">
                  <Label>{t("Custom Amount")}:</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={tipCustom}
                    onChange={(e) => setTipCustom(e.target.value)}
                    className="w-20"
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <Label>{t("Payment Method")}</Label>
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={setPaymentMethod}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    <T text="Credit Card" />
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash" className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <T text="Cash" />
                  </Label>
                </div>
              </RadioGroup>
              
              {paymentMethod === "cash" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right" htmlFor="cash-amount">
                    <T text="Cash Amount" />
                  </Label>
                  <Input 
                    id="cash-amount"
                    type="number" 
                    min={calculateTotal(selectedOrder)} 
                    step="0.01" 
                    defaultValue={Math.ceil(calculateTotal(selectedOrder))}
                    className="col-span-3" 
                  />
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              <T text="Cancel" />
            </Button>
            <Button onClick={() => setShowPaymentDialog(false)}>
              <T text="Complete Payment" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Split Bill Dialog */}
      <Dialog open={showSplitDialog} onOpenChange={setShowSplitDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle><T text="Split Bill" /></DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">{selectedOrder?.table} - {t("Order")} #{selectedOrder?.id}</h3>
              <p className="text-sm text-muted-foreground">{selectedOrder?.guests} {t("guests")} • ${selectedOrder?.total.toFixed(2)}</p>
            </div>
            
            <div className="space-y-3">
              <Label>{t("Split Method")}</Label>
              <Select defaultValue="equal">
                <SelectTrigger>
                  <SelectValue placeholder={t("Select split method")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equal">{t("Equal Split")}</SelectItem>
                  <SelectItem value="items">{t("By Items")}</SelectItem>
                  <SelectItem value="custom">{t("Custom Amounts")}</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="space-y-3">
                <Label>{t("Number of Ways")}</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">-</Button>
                  <Input type="number" min="2" max={selectedOrder?.guests} defaultValue="2" className="w-16 text-center" />
                  <Button variant="outline" size="sm">+</Button>
                </div>
                
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="flex justify-between text-sm font-medium">
                    <span>{t("Amount per person")}:</span>
                    <span>${(selectedOrder?.total / 2).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSplitDialog(false)}>
              <T text="Cancel" />
            </Button>
            <Button onClick={() => {
              setShowSplitDialog(false);
              setShowPaymentDialog(true);
            }}>
              <T text="Continue to Payment" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentProcessing;
