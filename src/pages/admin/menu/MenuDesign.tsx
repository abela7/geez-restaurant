
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Save, Layout, Type, Image, Palette, Eye } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { MenuNav } from "@/components/menu/MenuNav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useMenuDesign } from "@/hooks/useMenuDesign";
import { MenuPreview } from "@/components/menu/design/MenuPreview";
import { FontSettings } from "@/components/menu/design/FontSettings";
import { ColorSettings } from "@/components/menu/design/ColorSettings";
import { LayoutSettings } from "@/components/menu/design/LayoutSettings";
import { SideModal } from "@/components/ui/side-modal";

const MenuDesign = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("layout");
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const { 
    menuDesign, 
    isLoading, 
    saveMenuDesign,
    updateDesignField 
  } = useMenuDesign();
  
  const handleSave = async () => {
    try {
      await saveMenuDesign();
      toast({
        title: t("Success"),
        description: t("Menu design saved successfully"),
      });
    } catch (error) {
      toast({
        title: t("Error"),
        description: t("Failed to save menu design"),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader
        title={<T text="Menu Design" />}
        description={<T text="Design and customize your restaurant menu" />}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/admin/menu">
                <ChevronLeft className="mr-2 h-4 w-4" />
                <T text="Back to Menu" />
              </Link>
            </Button>
            <Button onClick={() => setPreviewOpen(true)} variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              <T text="Preview" />
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              <T text="Save Design" />
            </Button>
          </>
        }
      />

      <MenuNav />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle><T text="Design Settings" /></CardTitle>
              <CardDescription><T text="Customize your menu appearance" /></CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="layout" className="flex items-center">
                    <Layout className="mr-2 h-4 w-4" />
                    <T text="Layout" />
                  </TabsTrigger>
                  <TabsTrigger value="typography" className="flex items-center">
                    <Type className="mr-2 h-4 w-4" />
                    <T text="Typography" />
                  </TabsTrigger>
                  <TabsTrigger value="colors" className="flex items-center">
                    <Palette className="mr-2 h-4 w-4" />
                    <T text="Colors" />
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="layout" className="space-y-4 mt-0">
                  <LayoutSettings 
                    design={menuDesign} 
                    onChange={updateDesignField}
                    isLoading={isLoading}
                  />
                </TabsContent>
                
                <TabsContent value="typography" className="space-y-4 mt-0">
                  <FontSettings 
                    design={menuDesign} 
                    onChange={updateDesignField}
                    isLoading={isLoading}
                  />
                </TabsContent>
                
                <TabsContent value="colors" className="space-y-4 mt-0">
                  <ColorSettings 
                    design={menuDesign} 
                    onChange={updateDesignField}
                    isLoading={isLoading}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle><T text="Live Preview" /></CardTitle>
              <CardDescription><T text="See how your menu will look" /></CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
              <MenuPreview design={menuDesign} />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <SideModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        title={<T text="Menu Preview" />}
        width="lg"
      >
        <div className="p-4">
          <MenuPreview design={menuDesign} fullWidth />
        </div>
      </SideModal>
    </div>
  );
};

export default MenuDesign;
