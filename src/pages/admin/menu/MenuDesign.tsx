import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, Save, Layout, Grid3X3, Grid2X2, ImagePlus, Star, FileText, Palette, DollarSign } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MenuNav } from "@/components/menu/MenuNav";
import Layout from "@/components/Layout";

const MenuDesign = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("layout");
  const [gridStyle, setGridStyle] = useState("4");

  return (
    <Layout interface="admin">
      <div className="container mx-auto p-4 md:p-6">
        <PageHeader 
          title={<T text="Menu Design" />}
          description={<T text="Customize the appearance and layout of your menus" />}
          actions={
            <>
              <Button variant="outline" asChild>
                <Link to="/admin/menu">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  <T text="Back to Menu" />
                </Link>
              </Button>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                <T text="Save Changes" />
              </Button>
            </>
          }
        />

        <MenuNav />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 mt-6">
          <TabsList>
            <TabsTrigger value="layout"><T text="Layout" /></TabsTrigger>
            <TabsTrigger value="style"><T text="Style" /></TabsTrigger>
            <TabsTrigger value="elements"><T text="Elements" /></TabsTrigger>
          </TabsList>
          <TabsContent value="layout">
            <Card>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-medium"><T text="Grid Style" /></h3>
                <p className="text-sm text-muted-foreground">
                  <T text="Choose the grid style for your menu items" />
                </p>
                <RadioGroup defaultValue={gridStyle} onValueChange={setGridStyle} className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4" id="grid-4" />
                    <Label htmlFor="grid-4">
                      <Grid3X3 className="h-5 w-5 mr-2" />
                      <T text="4 items per row" />
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="grid-2" />
                    <Label htmlFor="grid-2">
                      <Grid2X2 className="h-5 w-5 mr-2" />
                      <T text="2 items per row" />
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="style">
            <Card>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-medium"><T text="Theme" /></h3>
                <p className="text-sm text-muted-foreground">
                  <T text="Customize the color scheme of your menu" />
                </p>
                <Select>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder={t("Select a theme")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light"><T text="Light" /></SelectItem>
                    <SelectItem value="dark"><T text="Dark" /></SelectItem>
                    <SelectItem value="custom"><T text="Custom" /></SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="elements">
            <Card>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-medium"><T text="Featured Items" /></h3>
                <p className="text-sm text-muted-foreground">
                  <T text="Highlight special items on your menu" />
                </p>
                <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <Label><T text="Show Featured Items" /></Label>
                    <p className="text-sm text-muted-foreground">
                      <T text="Display featured items at the top of the menu" />
                    </p>
                  </div>
                  <Switch />
                </div>
                <h3 className="text-lg font-medium"><T text="Item Images" /></h3>
                <p className="text-sm text-muted-foreground">
                  <T text="Control the display of images for menu items" />
                </p>
                <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <Label><T text="Show Item Images" /></Label>
                    <p className="text-sm text-muted-foreground">
                      <T text="Display images alongside menu items" />
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MenuDesign;
