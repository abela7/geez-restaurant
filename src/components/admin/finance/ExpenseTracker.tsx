
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Calendar, Download, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample expense data
const initialExpenses = [
  { 
    id: 1, 
    date: new Date(2023, 7, 15), 
    category: "Staff Wages", 
    amount: 3250.00, 
    payee: "Staff Payroll", 
    paymentMethod: "Bank Transfer",
    reference: "AUG-PAYROLL-01", 
    description: "August salaries for kitchen staff" 
  },
  { 
    id: 2, 
    date: new Date(2023, 7, 10), 
    category: "Rent", 
    amount: 2500.00, 
    payee: "Property Management Ltd", 
    paymentMethod: "Bank Transfer",
    reference: "AUG-RENT-2023", 
    description: "August rent for restaurant premises" 
  },
  { 
    id: 3, 
    date: new Date(2023, 7, 8), 
    category: "Ingredients", 
    amount: 1245.60, 
    payee: "Fresh Foods Supplier", 
    paymentMethod: "Credit Card",
    reference: "INV-12345", 
    description: "Weekly produce delivery" 
  },
  { 
    id: 4, 
    date: new Date(2023, 7, 5), 
    category: "Utilities", 
    amount: 475.25, 
    payee: "Energy Provider", 
    paymentMethod: "Direct Debit",
    reference: "BILL-08-2023", 
    description: "Electricity and gas bill" 
  },
  { 
    id: 5, 
    date: new Date(2023, 7, 12), 
    category: "Marketing", 
    amount: 350.00, 
    payee: "Social Media Agency", 
    paymentMethod: "Credit Card",
    reference: "SM-AUG-2023", 
    description: "Social media promotion campaign" 
  },
];

// Sample categories
const expenseCategories = [
  "Staff Wages", "Rent", "Ingredients", "Utilities", "Maintenance", 
  "Marketing", "Licenses & Insurance", "Kitchen Supplies", "Transport"
];

const paymentMethods = ["Cash", "Credit Card", "Bank Transfer", "Cheque", "Direct Debit"];

interface ExpenseTrackerProps {
  onExpenseAdded?: (expense: any) => void;
}

const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({ onExpenseAdded }) => {
  const { t } = useLanguage();
  const [expenses, setExpenses] = useState(initialExpenses);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  
  const [newExpense, setNewExpense] = useState({
    date: new Date(),
    category: "",
    amount: 0,
    payee: "",
    paymentMethod: "Bank Transfer",
    reference: "",
    description: ""
  });

  const handleAddExpense = () => {
    const expense = {
      ...newExpense,
      id: expenses.length + 1,
    };
    
    setExpenses([expense, ...expenses]);
    
    if (onExpenseAdded) {
      onExpenseAdded(expense);
    }
    
    setNewExpense({
      date: new Date(),
      category: "",
      amount: 0,
      payee: "",
      paymentMethod: "Bank Transfer",
      reference: "",
      description: ""
    });
    
    setIsAddDialogOpen(false);
  };

  const handleDeleteExpense = (id: number) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  // Filter expenses based on search, category, and date
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = 
      expense.payee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "All" || expense.category === categoryFilter;
    
    let matchesDate = true;
    if (dateFilter === "Today") {
      const today = new Date();
      matchesDate = expense.date.toDateString() === today.toDateString();
    } else if (dateFilter === "This Week") {
      const today = new Date();
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(today.getDate() - 7);
      matchesDate = expense.date >= oneWeekAgo && expense.date <= today;
    } else if (dateFilter === "This Month") {
      const today = new Date();
      matchesDate = 
        expense.date.getMonth() === today.getMonth() && 
        expense.date.getFullYear() === today.getFullYear();
    }
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("Search expenses...")}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={t("All Categories")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All"><T text="All Categories" /></SelectItem>
              {expenseCategories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder={t("Date Range")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All"><T text="All Time" /></SelectItem>
              <SelectItem value="Today"><T text="Today" /></SelectItem>
              <SelectItem value="This Week"><T text="This Week" /></SelectItem>
              <SelectItem value="This Month"><T text="This Month" /></SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={() => {
            setSearchTerm("");
            setCategoryFilter("All");
            setDateFilter("All");
          }}>
            <X className="h-4 w-4 mr-2" />
            <T text="Clear" />
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                <T text="Add Expense" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle><T text="Add New Expense" /></DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date"><T text="Date" /></Label>
                    <Input
                      id="date"
                      type="date"
                      onChange={(e) => {
                        setNewExpense({
                          ...newExpense, 
                          date: e.target.value ? new Date(e.target.value) : new Date()
                        });
                      }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount"><T text="Amount (£)" /></Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      value={newExpense.amount === 0 ? "" : newExpense.amount}
                      onChange={(e) => setNewExpense({...newExpense, amount: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category"><T text="Category" /></Label>
                  <Select 
                    value={newExpense.category} 
                    onValueChange={(value) => setNewExpense({...newExpense, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select a category")} />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="payee"><T text="Payee" /></Label>
                  <Input
                    id="payee"
                    placeholder={t("Who was paid")}
                    value={newExpense.payee}
                    onChange={(e) => setNewExpense({...newExpense, payee: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="payment-method"><T text="Payment Method" /></Label>
                  <Select 
                    value={newExpense.paymentMethod} 
                    onValueChange={(value) => setNewExpense({...newExpense, paymentMethod: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>{method}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reference"><T text="Reference" /></Label>
                  <Input
                    id="reference"
                    placeholder={t("Invoice or reference number")}
                    value={newExpense.reference}
                    onChange={(e) => setNewExpense({...newExpense, reference: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description"><T text="Description" /></Label>
                  <Textarea
                    id="description"
                    placeholder={t("Expense details")}
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  <T text="Cancel" />
                </Button>
                <Button onClick={handleAddExpense} disabled={!newExpense.category || newExpense.amount <= 0 || !newExpense.payee}>
                  <T text="Add Expense" />
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><T text="Date" /></TableHead>
              <TableHead><T text="Category" /></TableHead>
              <TableHead><T text="Amount" /></TableHead>
              <TableHead className="hidden md:table-cell"><T text="Payee" /></TableHead>
              <TableHead className="hidden md:table-cell"><T text="Payment Method" /></TableHead>
              <TableHead className="hidden lg:table-cell"><T text="Reference" /></TableHead>
              <TableHead className="hidden lg:table-cell"><T text="Description" /></TableHead>
              <TableHead className="text-right"><T text="Actions" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{format(expense.date, "dd MMM yyyy")}</TableCell>
                <TableCell>
                  <Badge variant="outline">{expense.category}</Badge>
                </TableCell>
                <TableCell className="font-medium">£{expense.amount.toFixed(2)}</TableCell>
                <TableCell className="hidden md:table-cell">{expense.payee}</TableCell>
                <TableCell className="hidden md:table-cell">{expense.paymentMethod}</TableCell>
                <TableCell className="hidden lg:table-cell">{expense.reference}</TableCell>
                <TableCell className="hidden lg:table-cell max-w-[200px] truncate">{expense.description}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteExpense(expense.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredExpenses.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <p><T text="No expenses found" /></p>
                    <p className="text-sm"><T text="Try adjusting your filters or add a new expense" /></p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={2} className="text-right font-bold"><T text="Total:" /></TableHead>
              <TableHead className="font-bold">£{totalExpenses.toFixed(2)}</TableHead>
              <TableHead colSpan={5}></TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </Card>
    </>
  );
};

export default ExpenseTracker;
