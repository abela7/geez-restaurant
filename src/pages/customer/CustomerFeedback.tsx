
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, MessageSquare, ThumbsUp, Star, Heart } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const CustomerFeedback: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [waiterName, setWaiterName] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [comments, setComments] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Rating states
  const [foodRating, setFoodRating] = useState<number | null>(null);
  const [serviceRating, setServiceRating] = useState<number | null>(null);
  const [atmosphereRating, setAtmosphereRating] = useState<number | null>(null);
  const [valueRating, setValueRating] = useState<number | null>(null);
  
  // Detailed rating states
  const [foodTaste, setFoodTaste] = useState<number | null>(null);
  const [foodPresentation, setFoodPresentation] = useState<number | null>(null);
  const [foodTemperature, setFoodTemperature] = useState<number | null>(null);
  const [foodPortion, setFoodPortion] = useState<number | null>(null);
  const [foodAuthenticity, setFoodAuthenticity] = useState<number | null>(null);
  
  const [serviceSpeed, setServiceSpeed] = useState<number | null>(null);
  const [serviceAttentiveness, setServiceAttentiveness] = useState<number | null>(null);
  const [serviceKnowledge, setServiceKnowledge] = useState<number | null>(null);
  
  const [visitDate, setVisitDate] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Feedback submitted:', {
      name: anonymous ? 'Anonymous' : name,
      email: anonymous ? '' : email,
      tableNumber,
      waiterName,
      ratings: {
        food: foodRating,
        service: serviceRating,
        atmosphere: atmosphereRating,
        value: valueRating,
        details: {
          foodTaste,
          foodPresentation,
          foodTemperature,
          foodPortion,
          foodAuthenticity,
          serviceSpeed,
          serviceAttentiveness,
          serviceKnowledge
        }
      },
      comments,
      visitDate
    });
    
    setShowConfirmation(true);
  };
  
  const handleAnonymousChange = (checked: boolean) => {
    setAnonymous(checked);
    if (checked) {
      setName('');
      setEmail('');
    }
  };
  
  const resetForm = () => {
    setName('');
    setEmail('');
    setTableNumber('');
    setWaiterName('');
    setAnonymous(false);
    setComments('');
    setFoodRating(null);
    setServiceRating(null);
    setAtmosphereRating(null);
    setValueRating(null);
    setFoodTaste(null);
    setFoodPresentation(null);
    setFoodTemperature(null);
    setFoodPortion(null);
    setFoodAuthenticity(null);
    setServiceSpeed(null);
    setServiceAttentiveness(null);
    setServiceKnowledge(null);
    setVisitDate('');
    setShowConfirmation(false);
  };
  
  const renderStarRating = (rating: number | null, setRating: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="focus:outline-none"
          >
            <Star
              size={24}
              className={star <= (rating || 0) ? "fill-turmeric text-turmeric" : "text-gray-300"}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Layout interface="customer">
      <PageHeader 
        title="Feedback" 
        description="Share your dining experience with us"
        actions={
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            <T text="Contact Us" />
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle><T text="Your Feedback Matters" /></CardTitle>
            <CardDescription>
              <T text="Tell us about your experience at Habesha Restaurant" />
            </CardDescription>
          </CardHeader>
          <Separator />
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-6">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="general">
                    <T text="General" />
                  </TabsTrigger>
                  <TabsTrigger value="food">
                    <T text="Food" />
                  </TabsTrigger>
                  <TabsTrigger value="service">
                    <T text="Service" />
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="general">
                  <div className="grid gap-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="anonymous"
                        checked={anonymous}
                        onCheckedChange={handleAnonymousChange}
                      />
                      <Label htmlFor="anonymous">
                        <T text="Submit Anonymously" />
                      </Label>
                    </div>
                    
                    {!anonymous && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">
                              <T text="Your Name" />
                            </Label>
                            <Input
                              id="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder={currentLanguage === 'en' ? "Enter your name" : "ስምዎን ያስገቡ"}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">
                              <T text="Email" />
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder={currentLanguage === 'en' ? "Enter your email" : "ኢሜይልዎን ያስገቡ"}
                            />
                          </div>
                        </div>
                      </>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="table-number">
                          <T text="Table Number" />
                        </Label>
                        <Select 
                          value={tableNumber}
                          onValueChange={setTableNumber}
                        >
                          <SelectTrigger id="table-number">
                            <SelectValue placeholder={currentLanguage === 'en' ? "Select table" : "ጠረጴዛ ይምረጡ"} />
                          </SelectTrigger>
                          <SelectContent>
                            {[...Array(12)].map((_, i) => (
                              <SelectItem key={i} value={`T${i+1}`}>
                                <T text="Table" /> {i+1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="visit-date">
                          <T text="Visit Date" />
                        </Label>
                        <Input
                          id="visit-date"
                          type="date"
                          value={visitDate}
                          onChange={(e) => setVisitDate(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="waiter-name">
                        <T text="Server Name (Optional)" />
                      </Label>
                      <Select 
                        value={waiterName}
                        onValueChange={setWaiterName}
                      >
                        <SelectTrigger id="waiter-name">
                          <SelectValue placeholder={currentLanguage === 'en' ? "Select server" : "አገልጋይ ይምረጡ"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tigist">Tigist</SelectItem>
                          <SelectItem value="Abebe">Abebe</SelectItem>
                          <SelectItem value="Solomon">Solomon</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-lg mb-4">
                        <T text="Overall Ratings" />
                      </h3>
                      <div className="grid gap-6">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="food-rating" className="font-medium">
                            <T text="Food Quality" />
                          </Label>
                          <div id="food-rating">
                            {renderStarRating(foodRating, setFoodRating)}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <Label htmlFor="service-rating" className="font-medium">
                            <T text="Service" />
                          </Label>
                          <div id="service-rating">
                            {renderStarRating(serviceRating, setServiceRating)}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <Label htmlFor="atmosphere-rating" className="font-medium">
                            <T text="Atmosphere" />
                          </Label>
                          <div id="atmosphere-rating">
                            {renderStarRating(atmosphereRating, setAtmosphereRating)}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <Label htmlFor="value-rating" className="font-medium">
                            <T text="Value for Money" />
                          </Label>
                          <div id="value-rating">
                            {renderStarRating(valueRating, setValueRating)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="food">
                  <div className="space-y-6">
                    <h3 className="font-medium text-lg">
                      <T text="Food Details" />
                    </h3>
                    
                    <div className="flex justify-between items-center">
                      <Label htmlFor="food-taste" className="font-medium">
                        <T text="Taste" />
                      </Label>
                      <div id="food-taste">
                        {renderStarRating(foodTaste, setFoodTaste)}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Label htmlFor="food-presentation" className="font-medium">
                        <T text="Presentation" />
                      </Label>
                      <div id="food-presentation">
                        {renderStarRating(foodPresentation, setFoodPresentation)}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Label htmlFor="food-temperature" className="font-medium">
                        <T text="Temperature" />
                      </Label>
                      <div id="food-temperature">
                        {renderStarRating(foodTemperature, setFoodTemperature)}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Label htmlFor="food-portion" className="font-medium">
                        <T text="Portion Size" />
                      </Label>
                      <div id="food-portion">
                        {renderStarRating(foodPortion, setFoodPortion)}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Label htmlFor="food-authenticity" className="font-medium">
                        <T text="Authenticity" />
                      </Label>
                      <div id="food-authenticity">
                        {renderStarRating(foodAuthenticity, setFoodAuthenticity)}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="service">
                  <div className="space-y-6">
                    <h3 className="font-medium text-lg">
                      <T text="Service Details" />
                    </h3>
                    
                    <div className="flex justify-between items-center">
                      <Label htmlFor="service-speed" className="font-medium">
                        <T text="Speed" />
                      </Label>
                      <div id="service-speed">
                        {renderStarRating(serviceSpeed, setServiceSpeed)}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Label htmlFor="service-attentiveness" className="font-medium">
                        <T text="Attentiveness" />
                      </Label>
                      <div id="service-attentiveness">
                        {renderStarRating(serviceAttentiveness, setServiceAttentiveness)}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Label htmlFor="service-knowledge" className="font-medium">
                        <T text="Menu Knowledge" />
                      </Label>
                      <div id="service-knowledge">
                        {renderStarRating(serviceKnowledge, setServiceKnowledge)}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="space-y-2 mt-6">
                <Label htmlFor="comments">
                  <T text="Additional Comments" />
                </Label>
                <Textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder={currentLanguage === 'en' ? "Please share any other thoughts about your experience..." : "ስለ ልምድዎ ሌሎች ሐሳቦችን ያጋሩ..."}
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={resetForm}>
                <T text="Clear Form" />
              </Button>
              <Button type="submit">
                <T text="Submit Feedback" />
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle><T text="Why Your Feedback Matters" /></CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <ThumbsUp className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">
                  <T text="Helps Us Improve" />
                </h4>
                <p className="text-sm text-muted-foreground">
                  <T text="Your honest feedback helps us enhance our service and menu." />
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">
                  <T text="Better Guest Experience" />
                </h4>
                <p className="text-sm text-muted-foreground">
                  <T text="We use your input to create a more enjoyable dining experience for all guests." />
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Heart className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">
                  <T text="Support Our Team" />
                </h4>
                <p className="text-sm text-muted-foreground">
                  <T text="Positive feedback motivates our staff, while constructive criticism helps them grow." />
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-2">
                <T text="Customer Reviews" />
              </h4>
              <div className="space-y-3">
                <CustomerReview 
                  name="Makeda T."
                  date="Last week"
                  rating={5}
                  comment="Authentic Ethiopian food that reminded me of my grandmother's cooking. Incredible flavors!"
                />
                <CustomerReview 
                  name="Daniel M."
                  date="Last month"
                  rating={4}
                  comment="Great service and delicious food. The coffee ceremony was a wonderful experience."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <T text="Thank You For Your Feedback!" />
            </AlertDialogTitle>
            <AlertDialogDescription>
              <T text="We appreciate you taking the time to share your experience with us. Your feedback helps us improve our service." />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={resetForm}>
              <T text="Close" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

interface CustomerReviewProps {
  name: string;
  date: string;
  rating: number;
  comment: string;
}

const CustomerReview: React.FC<CustomerReviewProps> = ({ name, date, rating, comment }) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-muted/40 rounded-lg p-3">
      <div className="flex justify-between items-center mb-1">
        <div className="font-medium">{name}</div>
        <div className="text-xs text-muted-foreground">{date}</div>
      </div>
      <div className="flex mb-2">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            className={i < rating ? "fill-turmeric text-turmeric" : "text-gray-300"}
          />
        ))}
      </div>
      <p className="text-sm">
        <T text={comment} />
      </p>
    </div>
  );
};

export default CustomerFeedback;
