
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { 
  Search, 
  Users, 
  Coffee, 
  Plus, 
  Clock, 
  Info, 
  Check, 
  X, 
  Edit, 
  Trash,
  Map 
} from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample table data
const tables = [
  { id: 1, number: 1, capacity: 4, status: "Available", position: "Main Hall", shape: "rectangle" },
  { id: 2, number: 2, capacity: 4, status: "Occupied", position: "Main Hall", shape: "rectangle", guests: 3, waiter: "Dawit", timeOccupied: "35 min", orders: 1 },
  { id: 3, number: 3, capacity: 2, status: "Reserved", position: "Main Hall", shape: "circle", reservation: { time: "7:30 PM", name: "Abebe Bekele", guests: 2 } },
  { id: 4, number: 4, capacity: 6, status: "Occupied", position: "Main Hall", shape: "rectangle", guests: 5, waiter: "Dawit", timeOccupied: "15 min", orders: 0 },
  { id: 5, number: 5, capacity: 4, status: "Occupied", position: "Window", shape: "rectangle", guests: 2, waiter: "Sara", timeOccupied: "55 min", orders: 2 },
  { id: 6, number: 6, capacity: 2, status: "Available", position: "Window", shape: "circle" },
  { id: 7, number: 7, capacity: 8, status: "Occupied", position: "Private Room", shape: "rectangle", guests: 7, waiter: "Dawit", timeOccupied: "65 min", orders: 3 },
  { id: 8, number: 8, capacity: 4, status: "Cleaning", position: "Main Hall", shape: "rectangle" },
  { id: 9, number: 9, capacity: 4, status: "Available", position: "Patio", shape: "rectangle" },
  { id: 10, number: 10, capacity: 6, status: "Available", position: "Patio", shape: "rectangle" }
];

// Sample reservation data
const reservations = [
  { id: 1, name: "Abebe Bekele", time: "7:30 PM", guests: 2, table: 3, contact: "0911-123456", notes: "Anniversary dinner" },
  { id: 2, name: "Makeda Haile", time: "8:00 PM", guests: 4, table: null, contact: "0912-345678", notes: "Birthday celebration" },
  { id: 3, name: "Solomon Tesfaye", time: "7:00 PM", guests: 6, table: null, contact: "0913-567890", notes: "Business dinner" }
];

const TableManagement = () => {
  const { t } = useLanguage();
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showReservationDialog, setShowReservationDialog] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800 border-green-300";
      case "Occupied":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Reserved":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Cleaning":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title={t("Table Management")} 
        description={t("Manage restaurant tables and seating")}
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Map className="mr-2 h-4 w-4" />
              <T text="Floor Plan" />
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              <T text="New Reservation" />
            </Button>
          </div>
        }
      />
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("Search tables or reservations...")}
            className="pl-9 w-full"
          />
        </div>
      </div>

      <Tabs defaultValue="tables">
        <TabsList className="mb-4">
          <TabsTrigger value="tables"><T text="Tables" /></TabsTrigger>
          <TabsTrigger value="reservations"><T text="Reservations" /></TabsTrigger>
        </TabsList>
        
        <TabsContent value="tables">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tables.map((table) => (
              <Card 
                key={table.id} 
                className={`overflow-hidden border ${
                  table.status === "Occupied" ? "border-amber-300" : 
                  table.status === "Reserved" ? "border-blue-300" : 
                  table.status === "Cleaning" ? "border-purple-300" : 
                  "border-gray-200"
                }`}
              >
                <div className={`p-2 text-center font-medium ${getStatusColor(table.status)}`}>
                  <T text="Table" /> {table.number} ({table.capacity} <T text="seats" />)
                </div>
                
                <CardContent className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{t("Status")}:</span>
                      <Badge variant="outline" className={getStatusColor(table.status)}>
                        {t(table.status)}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{t("Location")}:</span>
                      <span className="text-sm font-medium">{t(table.position)}</span>
                    </div>
                    
                    {table.status === "Occupied" && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t("Guests")}:</span>
                          <span className="text-sm font-medium">{table.guests} / {table.capacity}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t("Time")}:</span>
                          <span className="text-sm font-medium">{table.timeOccupied}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t("Orders")}:</span>
                          <span className="text-sm font-medium">{table.orders}</span>
                        </div>
                      </>
                    )}
                    
                    {table.status === "Reserved" && table.reservation && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t("Time")}:</span>
                          <span className="text-sm font-medium">{table.reservation.time}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t("Name")}:</span>
                          <span className="text-sm font-medium">{table.reservation.name}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t("Party")}:</span>
                          <span className="text-sm font-medium">{table.reservation.guests} {t("guests")}</span>
                        </div>
                      </>
                    )}
                    
                    <div className="mt-4 flex gap-2">
                      {table.status === "Available" && (
                        <Button 
                          className="flex-1" 
                          size="sm"
                          onClick={() => {
                            setSelectedTable(table);
                            setShowAssignDialog(true);
                          }}
                        >
                          <Users className="mr-2 h-4 w-4" />
                          <T text="Seat Guests" />
                        </Button>
                      )}
                      
                      {table.status === "Occupied" && (
                        <>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Coffee className="mr-2 h-4 w-4" />
                            <T text="View Order" />
                          </Button>
                          <Button variant="default" size="sm" className="flex-1">
                            <Check className="mr-2 h-4 w-4" />
                            <T text="Checkout" />
                          </Button>
                        </>
                      )}
                      
                      {table.status === "Reserved" && (
                        <>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Info className="mr-2 h-4 w-4" />
                            <T text="Details" />
                          </Button>
                          <Button variant="default" size="sm" className="flex-1">
                            <Check className="mr-2 h-4 w-4" />
                            <T text="Seat" />
                          </Button>
                        </>
                      )}
                      
                      {table.status === "Cleaning" && (
                        <Button variant="default" size="sm" className="flex-1">
                          <Check className="mr-2 h-4 w-4" />
                          <T text="Mark Ready" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="reservations">
          <Card>
            <div className="p-4 border-b flex justify-between items-center">
              <CardTitle className="text-lg font-medium"><T text="Today's Reservations" /></CardTitle>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                <T text="Add Reservation" />
              </Button>
            </div>
            
            <div className="divide-y">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="p-4 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{reservation.name}</h4>
                      <Badge variant="outline">{reservation.time}</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{reservation.guests} {t("guests")}</span>
                      </div>
                      <div className="flex items-center">
                        {reservation.table ? (
                          <>
                            <Info className="h-3 w-3 mr-1" />
                            <span>Table {reservation.table}</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{t("No table assigned")}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {reservation.notes && (
                      <p className="text-xs text-muted-foreground mt-1">{t("Notes")}: {reservation.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!reservation.table && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedTable(reservation);
                          setShowReservationDialog(true);
                        }}
                      >
                        <Map className="mr-2 h-4 w-4" />
                        <T text="Assign Table" />
                      </Button>
                    )}
                    <Button 
                      variant={reservation.table ? "default" : "outline"} 
                      size="sm"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      <T text="Seat" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialog for seating guests */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle><T text="Seat Guests at Table" /> {selectedTable?.number}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right"><T text="Number of Guests" /></Label>
              <Input
                type="number"
                min="1"
                max={selectedTable?.capacity || 1}
                defaultValue="1"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right"><T text="Assign Waiter" /></Label>
              <Select defaultValue="current">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("Select waiter")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">{t("Me (Current Waiter)")}</SelectItem>
                  <SelectItem value="sara">Sara</SelectItem>
                  <SelectItem value="abel">Abel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right"><T text="Notes" /></Label>
              <Input
                placeholder={t("Special requests or notes")}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              <T text="Cancel" />
            </Button>
            <Button onClick={() => setShowAssignDialog(false)}>
              <T text="Confirm" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog for assigning table to reservation */}
      <Dialog open={showReservationDialog} onOpenChange={setShowReservationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <T text="Assign Table for Reservation" />
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right"><T text="Guest Name" /></Label>
              <div className="col-span-3 font-medium">
                {selectedTable?.name}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right"><T text="Party Size" /></Label>
              <div className="col-span-3">
                {selectedTable?.guests} {t("guests")}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right"><T text="Select Table" /></Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("Choose a table")} />
                </SelectTrigger>
                <SelectContent>
                  {tables
                    .filter(table => 
                      (table.status === "Available" || table.status === "Cleaning") && 
                      table.capacity >= (selectedTable?.guests || 1)
                    )
                    .map(table => (
                      <SelectItem key={table.id} value={String(table.id)}>
                        {t("Table")} {table.number} ({table.capacity} {t("seats")})
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReservationDialog(false)}>
              <T text="Cancel" />
            </Button>
            <Button onClick={() => setShowReservationDialog(false)}>
              <T text="Assign" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TableManagement;
