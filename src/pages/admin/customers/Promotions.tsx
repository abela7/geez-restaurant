
import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgePercent, Calendar, Users, ArrowRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge-extended';

const PROMOTIONS_DATA = [
  {
    id: 1,
    name: "Summer Special",
    description: "20% off on all main dishes every Tuesday",
    startDate: "2023-06-01",
    endDate: "2023-08-31",
    status: "active",
    redemptions: 68,
    target: 100,
    type: "discount"
  },
  {
    id: 2,
    name: "Happy Hour",
    description: "Buy one, get one free on all drinks from 4-6 PM",
    startDate: "2023-06-15",
    endDate: "2023-07-15",
    status: "active",
    redemptions: 42,
    target: 150,
    type: "bogo"
  },
  {
    id: 3,
    name: "Family Meal Deal",
    description: "Free dessert with any family meal purchase",
    startDate: "2023-05-01",
    endDate: "2023-06-01",
    status: "expired",
    redemptions: 89,
    target: 80,
    type: "freebie"
  },
  {
    id: 4,
    name: "New Menu Launch",
    description: "10% off on all new menu items",
    startDate: "2023-07-01",
    endDate: "2023-07-31",
    status: "scheduled",
    redemptions: 0,
    target: 200,
    type: "discount"
  },
];

const Promotions: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Layout interface="admin">
      <PageHeader
        heading={<T text="Promotions" />}
        description={<T text="Create and manage special offers and promotions" />}
        icon={<BadgePercent className="h-6 w-6" />}
        actions={
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            <T text="New Promotion" />
          </Button>
        }
      />
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Active Promotions" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
            <p className="text-sm text-muted-foreground mt-1"><T text="Currently running" /></p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Total Redemptions" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">110</div>
            <p className="text-sm text-muted-foreground mt-1"><T text="This month" /></p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Upcoming Promotions" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1</div>
            <p className="text-sm text-muted-foreground mt-1"><T text="Scheduled to start" /></p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {PROMOTIONS_DATA.map((promo) => (
          <Card key={promo.id} className={promo.status === "expired" ? "opacity-70" : ""}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{promo.name}</CardTitle>
                  <CardDescription className="mt-1">{promo.description}</CardDescription>
                </div>
                <Badge 
                  variant={
                    promo.status === "active" ? "success" : 
                    promo.status === "scheduled" ? "warning" : 
                    "outline"
                  }
                >
                  <T text={promo.status} />
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm mb-3">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{promo.startDate} - {promo.endDate}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span><T text="Redemptions:" /> {promo.redemptions}/{promo.target}</span>
                </div>
              </div>
              <Progress value={(promo.redemptions / promo.target) * 100} className="h-2" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Badge variant="secondary">
                <T text={
                  promo.type === "discount" ? "Discount" : 
                  promo.type === "bogo" ? "Buy One Get One" : 
                  "Free Item"
                } />
              </Badge>
              <Button variant="ghost" size="sm" className="text-sm">
                <T text="View Details" />
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default Promotions;
