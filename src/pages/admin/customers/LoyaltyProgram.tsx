
import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Heart, Star, Settings, Users, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge-extended';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const LOYALTY_TIERS = [
  {
    id: 1,
    name: "Bronze",
    pointsRequired: 0,
    benefits: ["5% discount on food items", "Birthday special offer"],
    color: "text-amber-700"
  },
  {
    id: 2,
    name: "Silver",
    pointsRequired: 100,
    benefits: ["10% discount on all items", "Free appetizer with meals over $30", "Priority seating"],
    color: "text-gray-400"
  },
  {
    id: 3,
    name: "Gold",
    pointsRequired: 300,
    benefits: ["15% discount on all items", "Free dessert with every meal", "Priority seating", "Exclusive event invitations"],
    color: "text-yellow-500"
  },
];

const TOP_MEMBERS = [
  { id: 1, name: "Michael Chen", tier: "Gold", points: 520, visits: 24 },
  { id: 2, name: "Sarah Johnson", tier: "Gold", points: 450, visits: 19 },
  { id: 3, name: "David Kim", tier: "Gold", points: 380, visits: 16 },
  { id: 4, name: "Emily Rodriguez", tier: "Silver", points: 270, visits: 12 },
  { id: 5, name: "John Smith", tier: "Silver", points: 180, visits: 9 },
];

const LoyaltyProgram: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Layout interface="admin">
      <PageHeader
        heading={<T text="Loyalty Program" />}
        description={<T text="Manage customer loyalty tiers and rewards" />}
        icon={<Award className="h-6 w-6" />}
        actions={
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            <T text="Program Settings" />
          </Button>
        }
      />
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Total Members" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">142</div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +8% <span className="text-muted-foreground ml-1"><T text="from last month" /></span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Bronze Members" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">76</div>
            <p className="text-sm text-muted-foreground mt-1">54% <T text="of total" /></p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Silver Members" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">43</div>
            <p className="text-sm text-muted-foreground mt-1">30% <T text="of total" /></p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Gold Members" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">23</div>
            <p className="text-sm text-muted-foreground mt-1">16% <T text="of total" /></p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="tiers" className="mb-6">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="tiers"><T text="Loyalty Tiers" /></TabsTrigger>
          <TabsTrigger value="members"><T text="Top Members" /></TabsTrigger>
        </TabsList>
        
        <TabsContent value="tiers">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {LOYALTY_TIERS.map((tier) => (
              <Card key={tier.id}>
                <CardHeader>
                  <div className="flex items-center">
                    <Award className={`h-6 w-6 mr-2 ${tier.color}`} />
                    <CardTitle className={tier.color}>{tier.name}</CardTitle>
                  </div>
                  <CardDescription>
                    <T text="Required Points:" /> {tier.pointsRequired}+
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <h4 className="font-medium mb-2"><T text="Benefits" /></h4>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start">
                        <Heart className={`h-4 w-4 mr-2 mt-0.5 ${tier.color}`} />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle><T text="Top Loyalty Members" /></CardTitle>
              <CardDescription><T text="Members with the most points and visits" /></CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {TOP_MEMBERS.map((member) => (
                  <div key={member.id} className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4 last:border-0">
                    <div className="flex items-center mb-2 md:mb-0">
                      <div className="bg-muted rounded-full w-10 h-10 flex items-center justify-center mr-3">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="flex items-center text-sm">
                          <Badge 
                            variant={
                              member.tier === "Gold" ? "default" : 
                              member.tier === "Silver" ? "secondary" : 
                              "outline"
                            }
                            className="mr-2"
                          >
                            <T text={member.tier} />
                          </Badge>
                          <span className="text-muted-foreground">
                            <T text="Visits:" /> {member.visits}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col w-full md:w-1/3">
                      <div className="flex justify-between text-sm mb-1">
                        <span><T text="Points:" /> {member.points}</span>
                        <span>
                          {member.tier === "Gold" ? "---" : (
                            member.tier === "Silver" ? 
                              `${member.points - 100}/${300 - 100}` : 
                              `${member.points}/100`
                          )}
                        </span>
                      </div>
                      <Progress 
                        value={
                          member.tier === "Gold" ? 100 : 
                          member.tier === "Silver" ? 
                            ((member.points - 100) / (300 - 100)) * 100 : 
                            (member.points / 100) * 100
                        } 
                        className="h-2" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default LoyaltyProgram;
