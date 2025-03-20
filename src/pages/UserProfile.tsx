import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge-extended";
import { 
  User, Clock, DollarSign, Calendar, Mail, Phone, 
  MapPin, Award, ArrowLeft
} from "lucide-react";

const UserProfile = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const userProfile = {
    id: "1",
    firstName: "Dawit",
    lastName: "Tadesse",
    role: "Senior Waiter",
    email: "dawit.t@example.com",
    phone: "+251 91 234 5678",
    address: "Addis Ababa, Ethiopia",
    startDate: "2021-05-15",
    rating: 95,
    tables: 12,
    tips: 145,
    imageUrl: "/placeholder.svg"
  };

  const workSchedule = [
    { id: 1, date: "Today", time: "5:00 PM - 11:00 PM", type: "Dinner Service" },
    { id: 2, date: "Tomorrow", time: "11:00 AM - 3:00 PM", type: "Lunch Service" },
    { id: 3, date: "Jul 15", time: "5:00 PM - 11:00 PM", type: "Dinner Service" },
  ];

  const payrollHistory = [
    { id: 1, period: "Jun 1 - Jun 15, 2023", amount: "$850.00", status: "Paid" },
    { id: 2, period: "May 16 - May 31, 2023", amount: "$920.00", status: "Paid" },
    { id: 3, period: "May 1 - May 15, 2023", amount: "$780.00", status: "Paid" },
  ];

  const performanceMetrics = [
    { metric: "Average Service Time", value: "22 mins" },
    { metric: "Orders Per Shift", value: "32" },
    { metric: "Customer Rating", value: "4.8/5" },
    { metric: "Upsell Rate", value: "18%" },
  ];

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <T text="Back" />
      </Button>

      <PageHeader 
        title={t("My Profile")} 
        description={t("View and manage your personal information")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <img src={userProfile.imageUrl} alt={`${userProfile.firstName} ${userProfile.lastName}`} />
              </Avatar>
              
              <h2 className="text-xl font-semibold">{userProfile.firstName} {userProfile.lastName}</h2>
              <p className="text-muted-foreground">{userProfile.role}</p>
              
              <div className="w-full border-t my-6"></div>
              
              <div className="grid grid-cols-3 gap-2 w-full mt-2 text-center">
                <div className="p-2 rounded-md bg-muted">
                  <p className="text-lg font-bold">{userProfile.tables}</p>
                  <p className="text-xs text-muted-foreground"><T text="Tables" /></p>
                </div>
                <div className="p-2 rounded-md bg-muted">
                  <p className="text-lg font-bold">{userProfile.rating}%</p>
                  <p className="text-xs text-muted-foreground"><T text="Rating" /></p>
                </div>
                <div className="p-2 rounded-md bg-muted">
                  <p className="text-lg font-bold">${userProfile.tips}</p>
                  <p className="text-xs text-muted-foreground"><T text="Tips" /></p>
                </div>
              </div>
              
              <div className="w-full border-t my-6"></div>
              
              <div className="w-full text-left">
                <div className="flex items-center mb-3">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{userProfile.email}</span>
                </div>
                <div className="flex items-center mb-3">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{userProfile.phone}</span>
                </div>
                <div className="flex items-center mb-3">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{userProfile.address}</span>
                </div>
                <div className="flex items-center mb-3">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span><T text="Started" />: {new Date(userProfile.startDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="schedule">
            <TabsList className="mb-4">
              <TabsTrigger value="schedule">
                <Clock className="h-4 w-4 mr-2" />
                <T text="Work Schedule" />
              </TabsTrigger>
              <TabsTrigger value="payroll">
                <DollarSign className="h-4 w-4 mr-2" />
                <T text="Payroll" />
              </TabsTrigger>
              <TabsTrigger value="performance">
                <Award className="h-4 w-4 mr-2" />
                <T text="Performance" />
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="schedule">
              <Card>
                <div className="p-4 border-b">
                  <h3 className="font-medium"><T text="Upcoming Shifts" /></h3>
                </div>
                
                <div className="divide-y">
                  {workSchedule.map((shift) => (
                    <div key={shift.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{shift.date}</p>
                          <p className="text-sm text-muted-foreground">{shift.time}</p>
                        </div>
                        <Badge variant="outline">{t(shift.type)}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-3 text-center border-t">
                  <Button variant="ghost" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    <T text="Full Schedule" />
                  </Button>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="payroll">
              <Card>
                <div className="p-4 border-b">
                  <h3 className="font-medium"><T text="Payroll History" /></h3>
                </div>
                
                <div className="divide-y">
                  {payrollHistory.map((payment) => (
                    <div key={payment.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{payment.period}</p>
                          <p className="text-sm text-muted-foreground">{payment.amount}</p>
                        </div>
                        <Badge variant={payment.status === "Paid" ? "default" : "outline"}>
                          {t(payment.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-3 text-center border-t">
                  <Button variant="ghost" size="sm">
                    <DollarSign className="mr-2 h-4 w-4" />
                    <T text="Complete Payroll History" />
                  </Button>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="performance">
              <Card>
                <div className="p-4 border-b">
                  <h3 className="font-medium"><T text="Performance Metrics" /></h3>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {performanceMetrics.map((metric, idx) => (
                      <Card key={idx} className="p-4">
                        <h4 className="text-sm text-muted-foreground">{t(metric.metric)}</h4>
                        <p className="text-2xl font-bold mt-1">{metric.value}</p>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <div className="p-3 text-center border-t">
                  <Button variant="ghost" size="sm">
                    <Award className="mr-2 h-4 w-4" />
                    <T text="Detailed Performance Report" />
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
