
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  MapPin, 
  FileDown,
  ShoppingCart, 
  Star,
  ExternalLink,
  RefreshCw
} from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import AppLayout from "@/components/Layout";
import { InventoryNav } from "@/components/inventory/InventoryNav";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

// Sample suppliers data
const suppliers = [
  { 
    id: 1, 
    name: "Local Farm Supply", 
    contact: "Tadesse Mengistu", 
    email: "tadesse@localfarm.com", 
    phone: "+251-911-123-456", 
    address: "Addis Ababa, Ethiopia", 
    categories: ["Vegetables", "Grains"], 
    status: "Active",
    rating: 5,
    lastOrder: "2023-11-20",
    paymentTerms: "Net 30",
    logo: "LF"
  },
  { 
    id: 2, 
    name: "Spice Imports Ltd", 
    contact: "Solomon Abebe", 
    email: "solomon@spiceimports.com", 
    phone: "+251-911-234-567", 
    address: "Addis Ababa, Ethiopia", 
    categories: ["Spices", "Legumes"], 
    status: "Active",
    rating: 4,
    lastOrder: "2023-11-15",
    paymentTerms: "Net 15",
    logo: "SI"
  },
  { 
    id: 3, 
    name: "Green Valley Farms", 
    contact: "Yohannes Tesfaye", 
    email: "yohannes@greenvalley.com", 
    phone: "+251-911-345-678", 
    address: "Debre Zeit, Ethiopia", 
    categories: ["Meat", "Dairy"], 
    status: "Active",
    rating: 4,
    lastOrder: "2023-11-18",
    paymentTerms: "Net 15",
    logo: "GV"
  },
  { 
    id: 4, 
    name: "Authentic Cultures", 
    contact: "Bethlehem Tsegaye", 
    email: "bethlehem@cultures.com", 
    phone: "+251-911-456-789", 
    address: "Addis Ababa, Ethiopia", 
    categories: ["Cultures", "Fermentation"], 
    status: "Active",
    rating: 5,
    lastOrder: "2023-10-30",
    paymentTerms: "Net 30",
    logo: "AC"
  },
  { 
    id: 5, 
    name: "Premium Meats", 
    contact: "Bereket Alemu", 
    email: "bereket@premiummeats.com", 
    phone: "+251-911-567-890", 
    address: "Bahir Dar, Ethiopia", 
    categories: ["Meat"], 
    status: "Inactive",
    rating: 3,
    lastOrder: "2023-09-15",
    paymentTerms: "Net 15",
    logo: "PM"
  }
];

const Suppliers = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderRatingStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
      />
    ));
  };

  return (
    <AppLayout interface="admin">
      <div className="container mx-auto p-4 md:p-6">
        <PageHeader 
          title={<T text="Suppliers" />}
          description={<T text="Manage your ingredient suppliers and vendors" />}
          actions={
            <>
              <Button variant="outline" size="sm" className="hidden md:flex">
                <RefreshCw className="mr-2 h-4 w-4" />
                <T text="Refresh" />
              </Button>
              <Button variant="outline" size="sm" className="hidden md:flex">
                <FileDown className="mr-2 h-4 w-4" />
                <T text="Export" />
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                <T text="Add Supplier" />
              </Button>
            </>
          }
        />

        <InventoryNav />

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("Search suppliers...")}
              className="w-full pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <T text="All Suppliers" />
            </Button>
            <Button variant="outline" size="sm">
              <T text="Active" />
            </Button>
            <Button variant="outline" size="sm">
              <T text="Inactive" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredSuppliers.map((supplier) => (
            <Card key={supplier.id} className="overflow-hidden">
              <div className="p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                <Avatar className="h-16 w-16 rounded-md border">
                  <AvatarFallback className="rounded-md bg-primary text-primary-foreground text-xl">
                    {supplier.logo}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                      <h3 className="text-xl font-semibold flex items-center">
                        {supplier.name}
                        <Badge className={`ml-2 ${supplier.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}>
                          {supplier.status}
                        </Badge>
                      </h3>
                      <p className="text-muted-foreground">{supplier.contact}</p>
                    </div>
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {renderRatingStars(supplier.rating)}
                      </div>
                      <span className="text-sm text-muted-foreground">({supplier.rating}/5)</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={`mailto:${supplier.email}`} className="text-blue-600 hover:underline">{supplier.email}</a>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{supplier.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{supplier.address}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {supplier.categories.map((category) => (
                      <Badge key={category} variant="outline">{category}</Badge>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row pt-4 gap-4 sm:gap-8 text-sm">
                    <div>
                      <span className="text-muted-foreground"><T text="Last Order" />:</span>
                      <span className="ml-2">{supplier.lastOrder}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground"><T text="Payment Terms" />:</span>
                      <span className="ml-2">{supplier.paymentTerms}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-row sm:flex-col gap-2 self-start">
                  <Button variant="outline" size="sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    <T text="New Order" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    <T text="Details" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Suppliers;
