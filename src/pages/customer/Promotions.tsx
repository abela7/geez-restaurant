
import React from "react";
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Gift, Share2 } from "lucide-react";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { getPromotions } from "@/services/customer/customerService";
import { Promotion } from "@/services/customer/types";
import { format } from "date-fns";

const PromotionsPage = () => {
  const { t } = useLanguage();

  const { 
    data: promotions = [], 
    isLoading 
  } = useQuery({
    queryKey: ['promotions'],
    queryFn: getPromotions
  });
  
  // Filter to only show active promotions
  const activePromotions = promotions.filter(p => p.status === 'active');
  
  // Helper function to format discount display
  const formatDiscount = (promotion: Promotion) => {
    switch (promotion.discount_type) {
      case 'percentage':
        return `${promotion.discount_value}% off`;
      case 'fixed':
        return `£${promotion.discount_value} off`;
      case 'bogo':
        return t("Buy One Get One");
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title="Deals & Promotions" 
        description="Check out our special offers and ongoing promotions"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <Card className="col-span-full">
            <div className="p-8 text-center">
              <T text="Loading promotions..." />
            </div>
          </Card>
        ) : activePromotions.length === 0 ? (
          <Card className="col-span-full">
            <div className="p-8 text-center">
              <T text="No active promotions at the moment. Check back soon!" />
            </div>
          </Card>
        ) : (
          activePromotions.map((promo) => (
            <Card key={promo.id} className="overflow-hidden flex flex-col">
              <AspectRatio ratio={16 / 9}>
                <img 
                  src="/placeholder.svg" 
                  alt={promo.name} 
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium">{promo.name}</h3>
                  <Badge variant="outline">{formatDiscount(promo)}</Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 flex-1">{promo.description}</p>
                
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    <T text="Valid until:" /> {format(new Date(promo.end_date), 'dd MMMM yyyy')}
                  </span>
                </div>
                
                {promo.min_purchase && (
                  <div className="text-sm text-muted-foreground mb-4">
                    <T text="Minimum purchase:" /> £{promo.min_purchase}
                  </div>
                )}
                
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
          ))
        )}
      </div>
    </div>
  );
};

export default PromotionsPage;
