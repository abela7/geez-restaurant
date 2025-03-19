
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, ChevronLeft, Settings, Trash2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Sample modifier groups
const modifierGroups = [
  { 
    id: 1, 
    name: "Spice Level", 
    required: true, 
    options: [
      { id: 1, name: "Mild", price: 0.00 },
      { id: 2, name: "Medium", price: 0.00 },
      { id: 3, name: "Hot", price: 0.00 },
      { id: 4, name: "Extra Hot", price: 0.50 }
    ]
  },
  { 
    id: 2, 
    name: "Side Options", 
    required: false, 
    options: [
      { id: 5, name: "Extra Injera", price: 1.50 },
      { id: 6, name: "Rice", price: 2.00 },
      { id: 7, name: "Salad", price: 3.00 }
    ]
  },
  { 
    id: 3, 
    name: "Add-ons", 
    required: false, 
    options: [
      { id: 8, name: "Extra Meat", price: 4.00 },
      { id: 9, name: "Extra Sauce", price: 1.50 },
      { id: 10, name: "Ayib (Ethiopian Cheese)", price: 2.50 }
    ]
  }
];

const Modifiers = () => {
  const { t } = useLanguage();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [activeTab, setActiveTab] = useState("groups");

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title={<T text="Modifiers & Options" />}
        description={<T text="Create customization options for menu items" />}
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
                  <T text="Add Modifier Group" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle><T text="Add New Modifier Group" /></DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name"><T text="Group Name" /></Label>
                    <Input id="name" placeholder={t("Enter group name")} />
                  </div>
                  <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <Label><T text="Required" /></Label>
                      <p className="text-sm text-muted-foreground">
                        <T text="Customer must select an option" />
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
                <DialogFooter>
                  <Button><T text="Add Group" /></Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 mt-6">
        <TabsList>
          <TabsTrigger value="groups"><T text="Modifier Groups" /></TabsTrigger>
          <TabsTrigger value="options" disabled={!selectedGroup}><T text="Options" /></TabsTrigger>
        </TabsList>

        <TabsContent value="groups">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead><T text="Group Name" /></TableHead>
                  <TableHead className="hidden md:table-cell"><T text="Options" /></TableHead>
                  <TableHead className="hidden md:table-cell"><T text="Required" /></TableHead>
                  <TableHead className="text-right"><T text="Actions" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modifierGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">{group.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{group.options.length}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {group.required ? <T text="Yes" /> : <T text="No" />}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setSelectedGroup(group);
                          setActiveTab("options");
                        }}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        <T text="Manage Options" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="options">
          {selectedGroup && (
            <>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{selectedGroup.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedGroup.required ? 
                      <T text="Customer must select one option" /> : 
                      <T text="Optional selection" />
                    }
                  </p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      <T text="Add Option" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle><T text="Add New Option" /></DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="optionName"><T text="Option Name" /></Label>
                        <Input id="optionName" placeholder={t("Enter option name")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price"><T text="Additional Price" /></Label>
                        <Input id="price" type="number" step="0.01" placeholder="0.00" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button><T text="Add Option" /></Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><T text="Option Name" /></TableHead>
                      <TableHead><T text="Additional Price" /></TableHead>
                      <TableHead className="text-right"><T text="Actions" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedGroup.options.map((option) => (
                      <TableRow key={option.id}>
                        <TableCell className="font-medium">{option.name}</TableCell>
                        <TableCell>
                          {option.price > 0 ? `+$${option.price.toFixed(2)}` : <T text="No charge" />}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Modifiers;
