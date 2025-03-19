
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Send, Megaphone, MessageSquare, Bell, Users } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample messages data
const messages = [
  { id: 1, sender: "Dawit Tadesse", role: "Waiter", time: "Today, 10:23 AM", content: "We're running low on napkins at the front.", read: true, image: "/placeholder.svg" },
  { id: 2, sender: "Makeda Haile", role: "Chef", time: "Today, 9:45 AM", content: "The beef delivery arrived but they only brought half of what we ordered.", read: true, image: "/placeholder.svg" },
  { id: 3, sender: "Sara Mengistu", role: "Waiter", time: "Yesterday", content: "Table 5 had a complaint about the spice level in the Doro Wat.", read: false, image: "/placeholder.svg" },
  { id: 4, sender: "Samuel Tekle", role: "Bartender", time: "Yesterday", content: "We're out of Ethiopian honey wine. Need to order more.", read: true, image: "/placeholder.svg" },
  { id: 5, sender: "Tigist Alemu", role: "Hostess", time: "Jul 10", content: "The reservation system was down for about 30 minutes today.", read: true, image: "/placeholder.svg" },
];

// Sample announcements data
const announcements = [
  { id: 1, title: "New Menu Items Next Week", date: "Posted Jul 12", content: "We'll be adding five new items to our menu starting next Monday. Training for all staff will be held this weekend." },
  { id: 2, title: "Staff Meeting Reminder", date: "Posted Jul 10", content: "Reminder that we have a mandatory staff meeting tomorrow at 8:00 AM. We'll be discussing the upcoming holiday schedule." },
  { id: 3, title: "Restaurant Closing Early", date: "Posted Jul 5", content: "We'll be closing at 9:00 PM this Saturday for a private event. All evening shift staff should arrive at the regular time." },
];

const Communication = () => {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title="Communication" 
        description="Manage messages, announcements and notifications"
        actions={
          <Button>
            <Megaphone className="mr-2 h-4 w-4" />
            <T text="New Announcement" />
          </Button>
        }
      />

      <Tabs defaultValue="messages">
        <TabsList className="mb-4">
          <TabsTrigger value="messages">
            <MessageSquare className="h-4 w-4 mr-2" />
            <T text="Staff Messages" />
          </TabsTrigger>
          <TabsTrigger value="announcements">
            <Megaphone className="h-4 w-4 mr-2" />
            <T text="Announcements" />
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            <T text="Notifications" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 overflow-hidden flex flex-col">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search messages..."
                    className="pl-9"
                  />
                </div>
              </div>
              <ScrollArea className="flex-1 h-[400px]">
                <div className="divide-y">
                  {messages.map((message) => (
                    <div key={message.id} className={`p-4 cursor-pointer hover:bg-muted ${!message.read ? 'bg-muted/50' : ''}`}>
                      <div className="flex gap-3">
                        <Avatar>
                          <img src={message.image} alt={message.sender} />
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium truncate">{message.sender}</h4>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{message.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{message.content}</p>
                          <Badge variant="outline" className="mt-1 text-xs">{message.role}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
            
            <Card className="md:col-span-2 flex flex-col">
              <div className="p-4 border-b flex items-center gap-3">
                <Avatar>
                  <img src="/placeholder.svg" alt="Selected user" />
                </Avatar>
                <div>
                  <h3 className="font-medium">Dawit Tadesse</h3>
                  <span className="text-sm text-muted-foreground">Waiter</span>
                </div>
              </div>
              <ScrollArea className="flex-1 p-4 h-[350px]">
                <div className="space-y-4">
                  <div className="flex justify-start mb-4">
                    <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm">We're running low on napkins at the front.</p>
                      <span className="text-xs text-muted-foreground mt-1">10:23 AM</span>
                    </div>
                  </div>
                  <div className="flex justify-end mb-4">
                    <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm">Thanks for letting me know. I'll order more right away.</p>
                      <span className="text-xs text-primary-foreground/70 mt-1">10:25 AM</span>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input placeholder="Type your message..." className="flex-1" />
                  <Button>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="announcements">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 overflow-hidden flex flex-col">
              <div className="p-4 border-b">
                <Button className="w-full">
                  <Megaphone className="mr-2 h-4 w-4" />
                  <T text="Create Announcement" />
                </Button>
              </div>
              <ScrollArea className="flex-1 h-[400px]">
                <div className="divide-y">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="p-4 cursor-pointer hover:bg-muted">
                      <h4 className="font-medium">{announcement.title}</h4>
                      <span className="text-xs text-muted-foreground">{announcement.date}</span>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{announcement.content}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
            
            <Card className="md:col-span-2 p-4 flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">New Menu Items Next Week</h3>
                <span className="text-sm text-muted-foreground">Posted Jul 12</span>
              </div>
              
              <div className="mb-6">
                <p className="mb-4">
                  We'll be adding five new items to our menu starting next Monday. Training for all staff will be held this weekend.
                </p>
                <p>
                  Please make sure you are familiar with the ingredients, preparation methods, and presentation of these new dishes. The kitchen staff will provide detailed information during the training.
                </p>
              </div>
              
              <div className="border-t pt-4 mt-auto">
                <h4 className="font-medium mb-2">Target Audience</h4>
                <div className="flex gap-2">
                  <Badge>All Staff</Badge>
                  <Badge variant="outline">Kitchen</Badge>
                  <Badge variant="outline">Waiters</Badge>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline">
                  <T text="Edit" />
                </Button>
                <Button variant="destructive" size="sm">
                  <T text="Delete" />
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4"><T text="Notification Settings" /></h3>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium"><T text="Low Inventory Alerts" /></h4>
                      <p className="text-sm text-muted-foreground"><T text="Get notified when ingredients are running low" /></p>
                    </div>
                    <Button variant="outline" size="sm">
                      <T text="Configure" />
                    </Button>
                  </div>
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium"><T text="Staff Messages" /></h4>
                      <p className="text-sm text-muted-foreground"><T text="Notification settings for new messages" /></p>
                    </div>
                    <Button variant="outline" size="sm">
                      <T text="Configure" />
                    </Button>
                  </div>
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium"><T text="Task Reminders" /></h4>
                      <p className="text-sm text-muted-foreground"><T text="Get reminded about upcoming tasks" /></p>
                    </div>
                    <Button variant="outline" size="sm">
                      <T text="Configure" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4"><T text="Delivery Methods" /></h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium"><T text="In-App Notifications" /></h4>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <T text="Configure" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium"><T text="SMS Notifications" /></h4>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <T text="Configure" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium"><T text="Staff Dashboard Alerts" /></h4>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <T text="Configure" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Communication;
