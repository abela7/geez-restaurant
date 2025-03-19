
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, Save, Layout, Grid3X3, Grid2X2, ImagePlus, Star, FileText, Palette } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const MenuDesign = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("layout");
  const [layoutType, setLayoutType] = useState("grid");
  const [gridSize, setGridSize] = useState("3x3");
  const [showFeatured, setShowFeatured] = useState(true);
  const [showPrices, setShowPrices] = useState(true);
  const [showDescriptions, setShowDescriptions] = useState(true);
  const [showColors, setShowColors] = useState(false);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title={<T text="Menu Design" />}
        description={<T text="Customize how your menu is displayed to customers" />}
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
              <T text="Save Design" />
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        <div className="lg:col-span-1 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="layout"><T text="Layout" /></TabsTrigger>
              <TabsTrigger value="featured"><T text="Featured" /></TabsTrigger>
              <TabsTrigger value="display"><T text="Display" /></TabsTrigger>
            </TabsList>

            <TabsContent value="layout" className="space-y-4">
              <Card className="p-4">
                <h3 className="text-lg font-medium mb-4"><T text="Menu Layout" /></h3>
                <RadioGroup 
                  value={layoutType} 
                  onValueChange={setLayoutType}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="grid" id="grid" />
                    <Label htmlFor="grid" className="flex items-center">
                      <Grid3X3 className="h-4 w-4 mr-2" />
                      <T text="Grid Layout" />
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="list" id="list" />
                    <Label htmlFor="list" className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      <T text="List Layout" />
                    </Label>
                  </div>
                </RadioGroup>
              </Card>

              {layoutType === "grid" && (
                <Card className="p-4">
                  <h3 className="text-lg font-medium mb-4"><T text="Grid Size" /></h3>
                  <RadioGroup 
                    value={gridSize} 
                    onValueChange={setGridSize}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2x2" id="2x2" />
                      <Label htmlFor="2x2" className="flex items-center">
                        <Grid2X2 className="h-4 w-4 mr-2" />
                        <T text="2x2 (Large Items)" />
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3x3" id="3x3" />
                      <Label htmlFor="3x3" className="flex items-center">
                        <Grid3X3 className="h-4 w-4 mr-2" />
                        <T text="3x3 (Medium Items)" />
                      </Label>
                    </div>
                  </RadioGroup>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="featured" className="space-y-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-500" />
                    <h3 className="text-lg font-medium"><T text="Featured Items" /></h3>
                  </div>
                  <Switch 
                    checked={showFeatured}
                    onCheckedChange={setShowFeatured}
                  />
                </div>
                {showFeatured && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground mb-2">
                      <T text="Select featured items to highlight on your menu" />
                    </p>
                    <Button size="sm" variant="outline">
                      <T text="Manage Featured Items" />
                    </Button>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="display" className="space-y-4">
              <Card className="p-4 space-y-4">
                <h3 className="text-lg font-medium mb-2"><T text="Display Options" /></h3>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-prices" className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <T text="Show Prices" />
                  </Label>
                  <Switch 
                    id="show-prices"
                    checked={showPrices}
                    onCheckedChange={setShowPrices}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-descriptions" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    <T text="Show Descriptions" />
                  </Label>
                  <Switch 
                    id="show-descriptions"
                    checked={showDescriptions}
                    onCheckedChange={setShowDescriptions}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-colors" className="flex items-center">
                    <Palette className="h-4 w-4 mr-2" />
                    <T text="Category Colors" />
                  </Label>
                  <Switch 
                    id="show-colors"
                    checked={showColors}
                    onCheckedChange={setShowColors}
                  />
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-2">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4"><T text="Menu Preview" /></h3>
            <div className="bg-background border rounded-md p-4">
              <div className="mb-4 pb-2 border-b">
                <h2 className="text-xl font-bold text-center mb-1">Habesha Restaurant</h2>
                <p className="text-sm text-center text-muted-foreground">Authentic Ethiopian & Eritrean Cuisine</p>
              </div>

              {showFeatured && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Star className="h-4 w-4 mr-2 text-yellow-500" />
                    <T text="Featured Dishes" />
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="overflow-hidden">
                      <AspectRatio ratio={16/9}>
                        <img src="/placeholder.svg" alt="Featured dish" className="w-full h-full object-cover" />
                      </AspectRatio>
                      <div className="p-2">
                        <h4 className="font-medium">Doro Wat</h4>
                        {showPrices && <p className="text-sm font-bold">$18.99</p>}
                      </div>
                    </Card>
                    <Card className="overflow-hidden">
                      <AspectRatio ratio={16/9}>
                        <img src="/placeholder.svg" alt="Featured dish" className="w-full h-full object-cover" />
                      </AspectRatio>
                      <div className="p-2">
                        <h4 className="font-medium">Kitfo</h4>
                        {showPrices && <p className="text-sm font-bold">$19.99</p>}
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${showColors ? 'text-red-600' : ''}`}>
                    <T text="Main Dishes" />
                  </h3>
                  {layoutType === 'grid' ? (
                    <div className={`grid grid-cols-${gridSize === '2x2' ? '2' : '3'} gap-4`}>
                      {[1, 2, 3].map((i) => (
                        <Card key={i} className="overflow-hidden">
                          <AspectRatio ratio={16/9}>
                            <img src="/placeholder.svg" alt="Dish" className="w-full h-full object-cover" />
                          </AspectRatio>
                          <div className="p-2">
                            <h4 className="font-medium">Menu Item {i}</h4>
                            {showDescriptions && <p className="text-xs text-muted-foreground">Short description of the dish</p>}
                            {showPrices && <p className="text-sm font-bold mt-1">$15.99</p>}
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex justify-between items-center border-b pb-2">
                          <div>
                            <h4 className="font-medium">Menu Item {i}</h4>
                            {showDescriptions && <p className="text-xs text-muted-foreground">Short description of the dish</p>}
                          </div>
                          {showPrices && <p className="text-sm font-bold">$15.99</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className={`text-lg font-semibold mb-3 ${showColors ? 'text-green-600' : ''}`}>
                    <T text="Vegetarian Dishes" />
                  </h3>
                  {layoutType === 'grid' ? (
                    <div className={`grid grid-cols-${gridSize === '2x2' ? '2' : '3'} gap-4`}>
                      {[1, 2].map((i) => (
                        <Card key={i} className="overflow-hidden">
                          <AspectRatio ratio={16/9}>
                            <img src="/placeholder.svg" alt="Dish" className="w-full h-full object-cover" />
                          </AspectRatio>
                          <div className="p-2">
                            <h4 className="font-medium">Veg Item {i}</h4>
                            {showDescriptions && <p className="text-xs text-muted-foreground">Short description of the dish</p>}
                            {showPrices && <p className="text-sm font-bold mt-1">$13.99</p>}
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex justify-between items-center border-b pb-2">
                          <div>
                            <h4 className="font-medium">Veg Item {i}</h4>
                            {showDescriptions && <p className="text-xs text-muted-foreground">Short description of the dish</p>}
                          </div>
                          {showPrices && <p className="text-sm font-bold">$13.99</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MenuDesign;
