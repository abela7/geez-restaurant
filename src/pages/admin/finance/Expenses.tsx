
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, Calendar, Receipt } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

import ExpenseCategories from "@/components/admin/finance/ExpenseCategories";
import ExpenseTracker from "@/components/admin/finance/ExpenseTracker";
import ExpenseReporting from "@/components/admin/finance/ExpenseReporting";
import ExpensesBudget from "@/components/admin/finance/ExpensesBudget";

const Expenses = () => {
  const [activeTab, setActiveTab] = useState("tracker");
  const [editMode, setEditMode] = useState(false);
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title="Expense Management" 
        description="Track, categorize, and analyze restaurant expenses"
        actions={
          <>
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Calendar className="mr-2 h-4 w-4" />
              <T text="Date Range" />
            </Button>
            <Button variant="outline" size="sm" className="hidden md:flex">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              <T text="Export" />
            </Button>
            {activeTab === "categories" && (
              <Button 
                variant={editMode ? "default" : "outline"} 
                size="sm"
                onClick={() => setEditMode(!editMode)}
              >
                <T text={editMode ? "Done Editing" : "Edit Categories"} />
              </Button>
            )}
          </>
        }
      />

      <Tabs defaultValue="tracker" value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="tracker">
            <Receipt className="h-4 w-4 mr-2" />
            <T text="Expense Tracker" />
          </TabsTrigger>
          <TabsTrigger value="categories">
            <T text="Categories" />
          </TabsTrigger>
          <TabsTrigger value="budget">
            <T text="Budget" />
          </TabsTrigger>
          <TabsTrigger value="reports">
            <T text="Reports & Analysis" />
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tracker">
          <ExpenseTracker />
        </TabsContent>
        
        <TabsContent value="categories">
          <ExpenseCategories editMode={editMode} />
        </TabsContent>
        
        <TabsContent value="budget">
          <ExpensesBudget editingMode={editMode} />
        </TabsContent>
        
        <TabsContent value="reports">
          <ExpenseReporting />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Expenses;
