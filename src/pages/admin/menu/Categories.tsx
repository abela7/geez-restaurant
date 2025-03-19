
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, ChevronLeft } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Sample menu categories
const menuCategories = [
  { id: 1, name: "Main Dishes", items: 5, description: "Main course dishes" },
  { id: 2, name: "Vegetarian", items: 3, description: "Vegetarian dishes" },
  { id: 3, name: "Appetizers", items: 2, description: "Small dishes to start the meal" },
  { id: 4, name: "Beverages", items: 4, description: "Drinks and refreshments" },
  { id: 5, name: "Desserts", items: 2, description: "Sweet treats to end the meal" }
];

const Categories = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title={<T text="Menu Categories" />}
        description={<T text="Organize your menu with categories for easier navigation" />}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/admin/menu">
                <ChevronLeft className="mr-2 h-4 w-4" />
                <T text="Back to Menu" />
              </Link>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  <T text="Add Category" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle><T text="Add New Category" /></DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name"><T text="Category Name" /></Label>
                    <Input id="name" placeholder={t("Enter category name")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description"><T text="Description" /></Label>
                    <Textarea 
                      id="description" 
                      placeholder={t("Enter category description")}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button><T text="Add Category" /></Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {menuCategories.map((category) => (
          <Card key={category.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-medium">{category.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {category.items} <T text="items" />
                </p>
              </div>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                <T text="Edit" />
              </Button>
            </div>
            <p className="text-sm mt-2">{category.description}</p>
          </Card>
        ))}
        <Card className="p-4 border-dashed flex justify-center items-center h-32">
          <Button variant="ghost">
            <Plus className="h-5 w-5 mr-2" />
            <T text="Add Category" />
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Categories;
