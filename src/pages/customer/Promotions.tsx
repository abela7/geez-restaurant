
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Gift, Share2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";

// Sample promotion data
const promotions = [
  {
    id: 1,
    title: "Happy Hour Special",
    description: "Enjoy 20% off on all traditional Ethiopian beverages every weekday from 4 PM to 6 PM. Perfect time to try our specialty honey wine!",
    expiry: "Ongoing",
    image: "/placeholder.svg",
    type: "Time-Limited"
  },
  {
    id: 2,
    title: "Family Feast Deal",
    description: "Feed the whole family with our special platter for 4-6 people. Includes a variety of meat and vegetarian dishes, plus complimentary bread.",
    expiry: "Valid until Aug 30, 2023",
    image: "/placeholder.svg",
    type: "Special Package"
  },
  {
    id: 3,
    title: "Weekend Brunch",
    description: "Join us every Saturday and Sunday from 10 AM to 2 PM for a special Ethiopian brunch. Fixed price menu with bottomless coffee.",
    expiry: "Ongoing",
    image: "/placeholder.svg",
    type: "Recurring"
  },
  {
    id: 4,
    title: "Loyalty Program",
    description: "Join our loyalty program and earn points with every purchase. Redeem points for free items and exclusive discounts.",
    expiry: "Permanent",
    image: "/placeholder.svg",
    type: "Program"
  },
  {
    id: 5,
    title: "First-Time Visitor Discount",
    description: "First time at our restaurant? Show this promotion to your server for 15% off your entire order!",
    expiry: "Valid for first visit only",
    image: "/placeholder.svg",
    type: "One-Time"
  },
  {
    id: 6,
    title: "Cultural Night Special",
    description: "Every Thursday is cultural night! Enjoy live traditional music and get 10% off when you order any of our signature dishes.",
    expiry: "Ongoing",
    image: "/placeholder.svg",
    type: "Recurring"
  }
];

const Promotions = () => {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title="Deals & Promotions" 
        description="Check out our special offers and ongoing promotions"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => (
          <Card key={promo.id} className="overflow-hidden flex flex-col">
            <AspectRatio ratio={16 / 9}>
              <img 
                src={promo.image} 
                alt={promo.title} 
                className="object-cover w-full h-full"
              />
            </AspectRatio>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium">{promo.title}</h3>
                <Badge variant="outline">{promo.type}</Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4 flex-1">{promo.description}</p>
              
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <Clock className="h-4 w-4 mr-1" />
                <span>{promo.expiry}</span>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  <T text="Share" />
                </Button>
                <Button size="sm">
                  <Gift className="h-4 w-4 mr-2" />
                  <T text="Redeem" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Promotions;
