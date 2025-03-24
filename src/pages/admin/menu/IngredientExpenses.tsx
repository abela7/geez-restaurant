
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { MenuNav } from "@/components/menu/MenuNav";
import { Loader2, Plus, Calendar, Download, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import ViewToggle from "@/components/admin/finance/ViewToggle";
import { useIngredientExpenses } from "@/hooks/useIngredientExpenses";
import ExpenseForm from "@/components/admin/menu/ingredients/ExpenseForm";
import ExpensesList from "@/components/admin/menu/ingredients/ExpensesList";
import ExpensesGrid from "@/components/admin/menu/ingredients/ExpensesGrid";
import EmptyState from "@/components/admin/menu/ingredients/EmptyState";

const IngredientExpenses = () => {
  const { t } = useLanguage();
  const {
    loading,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    openDialog,
    setOpenDialog,
    editingExpense,
    formData,
    filteredExpenses,
    ingredients,
    units,
    handleInputChange,
    handleNumberChange,
    handleSelectChange,
    handleEditExpense,
    handleAddExpense,
    saveExpense,
    deleteExpense,
  } = useIngredientExpenses();

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader
        title={<T text="Ingredient Expenses" />}
        description={<T text="Track expenses for all recipe ingredients" />}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/admin/menu">
                <T text="Back to Menu" />
              </Link>
            </Button>
            <Button onClick={handleAddExpense}>
              <Plus className="h-4 w-4 mr-2" />
              <T text="Add Expense" />
            </Button>
          </>
        }
      />

      <MenuNav />

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4 mt-6">
        <div className="relative flex-1">
          <Input
            placeholder={t("Search expenses...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={filteredExpenses.length === 0}
          >
            <Calendar className="mr-2 h-4 w-4" />
            <T text="Date Range" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            disabled={filteredExpenses.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            <T text="Export" />
          </Button>
          
          <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
          
          {searchQuery && (
            <Button variant="outline" size="sm" onClick={() => setSearchQuery("")}>
              <Filter className="mr-2 h-4 w-4" />
              <T text="Clear Filter" />
            </Button>
          )}
        </div>
      </div>

      {loading && !filteredExpenses.length ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {filteredExpenses.length === 0 ? (
            <EmptyState onAddExpense={handleAddExpense} />
          ) : (
            <Card>
              {viewMode === "list" ? (
                <ExpensesList 
                  expenses={filteredExpenses} 
                  onEdit={handleEditExpense} 
                  onDelete={deleteExpense} 
                />
              ) : (
                <ExpensesGrid 
                  expenses={filteredExpenses} 
                  onEdit={handleEditExpense} 
                  onDelete={deleteExpense} 
                />
              )}
            </Card>
          )}
        </>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <ExpenseForm
          formData={formData}
          ingredients={ingredients}
          units={units}
          loading={loading}
          isEditing={!!editingExpense}
          onClose={() => setOpenDialog(false)}
          onSave={saveExpense}
          handleInputChange={handleInputChange}
          handleNumberChange={handleNumberChange}
          handleSelectChange={handleSelectChange}
        />
      </Dialog>
    </div>
  );
};

export default IngredientExpenses;
