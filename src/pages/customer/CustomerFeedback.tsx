
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StarIcon } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { createCustomerFeedback } from "@/services/customer/customerService";
import type { CustomerFeedback as CustomerFeedbackType } from "@/services/customer/types";

// Define a simple Star Rating component
const StarRating = ({ 
  rating, 
  setRating, 
  label, 
  size = 24,
  disabled = false
}: { 
  rating: number; 
  setRating: (rating: number) => void; 
  label: string;
  size?: number;
  disabled?: boolean;
}) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            size={size}
            className={`cursor-pointer ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
            onClick={() => !disabled && setRating(star)}
          />
        ))}
      </div>
    </div>
  );
};

const CustomerFeedbackPage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [overallRating, setOverallRating] = useState(0);
  const [foodRating, setFoodRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [atmosphereRating, setAtmosphereRating] = useState(0);
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const feedbackMutation = useMutation({
    mutationFn: createCustomerFeedback,
    onSuccess: () => {
      toast({
        title: t("Thank you for your feedback!"),
        description: t("Your feedback has been submitted successfully."),
      });
      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ['customerFeedback'] });
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: t("There was a problem submitting your feedback. Please try again."),
        variant: "destructive",
      });
      console.error("Error submitting feedback:", error);
    }
  });

  const handleSubmit = () => {
    if (overallRating === 0) {
      toast({
        title: t("Rating Required"),
        description: t("Please provide an overall rating before submitting."),
        variant: "destructive",
      });
      return;
    }

    const feedback: Omit<CustomerFeedbackType, 'id' | 'created_at' | 'updated_at'> = {
      overall_rating: overallRating,
      food_rating: foodRating || undefined,
      service_rating: serviceRating || undefined,
      atmosphere_rating: atmosphereRating || undefined,
      comments: comments || undefined,
    };

    feedbackMutation.mutate(feedback);
  };

  const handleNewFeedback = () => {
    setOverallRating(0);
    setFoodRating(0);
    setServiceRating(0);
    setAtmosphereRating(0);
    setComments("");
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <PageHeader 
          title={t("Feedback Submitted")} 
          description={t("Thank you for sharing your experience with us")}
        />
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">
              <T text="Thank You!" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              <T text="Your feedback has been submitted successfully. We appreciate you taking the time to share your experience with us." />
            </p>
            <p>
              <T text="Your opinions help us improve our service for all our guests." />
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={handleNewFeedback}>
              <T text="Submit Another Feedback" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title={t("Share Your Feedback")} 
        description={t("Help us improve your dining experience")}
      />
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>
            <T text="How was your experience?" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col items-center">
            <StarRating 
              rating={overallRating} 
              setRating={setOverallRating} 
              label={t("Overall Rating")} 
              size={32}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StarRating 
              rating={foodRating} 
              setRating={setFoodRating} 
              label={t("Food Quality")} 
            />
            <StarRating 
              rating={serviceRating} 
              setRating={setServiceRating} 
              label={t("Service")} 
            />
            <StarRating 
              rating={atmosphereRating} 
              setRating={setAtmosphereRating} 
              label={t("Atmosphere")} 
            />
          </div>
          
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              <T text="Additional Comments" />
            </label>
            <Textarea
              placeholder={t("Share more details about your experience...")}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleSubmit} 
            disabled={feedbackMutation.isPending}
          >
            <T text="Submit Feedback" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CustomerFeedbackPage;
