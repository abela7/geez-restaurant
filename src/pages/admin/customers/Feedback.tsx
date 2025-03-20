
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Star, Filter, Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge-extended';
import { Button } from '@/components/ui/button';
import { getCustomerFeedback } from '@/services/customer/customerService';
import { CustomerFeedback } from '@/services/customer/types';
import { format } from 'date-fns';
import { SideModal } from '@/components/ui/side-modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CustomerFeedbackPage: React.FC = () => {
  const { t } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedFeedback, setSelectedFeedback] = useState<CustomerFeedback | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const { 
    data: feedbackList = [],
    isLoading 
  } = useQuery({
    queryKey: ['customer-feedback'],
    queryFn: getCustomerFeedback
  });

  const filteredFeedback = React.useMemo(() => {
    if (selectedFilter === 'all') return feedbackList;
    
    const ratingThreshold = parseInt(selectedFilter);
    return feedbackList.filter(feedback => feedback.overall_rating >= ratingThreshold);
  }, [feedbackList, selectedFilter]);
  
  // Calculate feedback stats
  const calculateStats = () => {
    if (feedbackList.length === 0) {
      return {
        overallRating: 0,
        foodRating: 0, 
        serviceRating: 0,
        totalCount: 0
      };
    }
    
    const totalOverall = feedbackList.reduce((sum, item) => sum + item.overall_rating, 0);
    
    const foodRatings = feedbackList.filter(item => item.food_rating !== null && item.food_rating !== undefined);
    const totalFood = foodRatings.reduce((sum, item) => sum + (item.food_rating || 0), 0);
    
    const serviceRatings = feedbackList.filter(item => item.service_rating !== null && item.service_rating !== undefined);
    const totalService = serviceRatings.reduce((sum, item) => sum + (item.service_rating || 0), 0);
    
    return {
      overallRating: (totalOverall / feedbackList.length).toFixed(1),
      foodRating: foodRatings.length > 0 ? (totalFood / foodRatings.length).toFixed(1) : 0,
      serviceRating: serviceRatings.length > 0 ? (totalService / serviceRatings.length).toFixed(1) : 0,
      totalCount: feedbackList.length
    };
  };
  
  const stats = calculateStats();
  
  const handleViewFeedback = (feedback: CustomerFeedback) => {
    setSelectedFeedback(feedback);
    setShowViewModal(true);
  };
  
  // Render stars for rating display
  const renderStars = (rating: number | undefined | null) => {
    if (rating === undefined || rating === null) return null;
    
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <Layout interface="admin">
      <PageHeader
        heading={<T text="Customer Feedback" />}
        description={<T text="Manage and respond to customer feedback" />}
        icon={<MessageCircle className="h-6 w-6" />}
      />
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Overall Rating" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold mr-2">{stats.overallRating}</div>
              <div className="flex text-yellow-500">
                {renderStars(Number(stats.overallRating))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              <T text="Based on" /> {stats.totalCount} <T text="reviews" />
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Food Quality" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold mr-2">{stats.foodRating}</div>
              <div className="flex text-yellow-500">
                {renderStars(Number(stats.foodRating))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {Number(stats.foodRating) >= 4.5 ? 
                <T text="Highest rated category" /> : 
                <T text="Based on customer ratings" />
              }
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Service" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold mr-2">{stats.serviceRating}</div>
              <div className="flex text-yellow-500">
                {renderStars(Number(stats.serviceRating))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {Number(stats.serviceRating) < 4.0 ? 
                <T text="Area for improvement" /> : 
                <T text="Based on customer ratings" />
              }
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle><T text="Recent Feedback" /></CardTitle>
              <CardDescription><T text="View and respond to customer reviews" /></CardDescription>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select 
                value={selectedFilter} 
                onValueChange={setSelectedFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("Filter by rating")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all"><T text="All Ratings" /></SelectItem>
                  <SelectItem value="5"><T text="5 Stars Only" /></SelectItem>
                  <SelectItem value="4"><T text="4+ Stars" /></SelectItem>
                  <SelectItem value="3"><T text="3+ Stars" /></SelectItem>
                  <SelectItem value="2"><T text="2+ Stars" /></SelectItem>
                  <SelectItem value="1"><T text="1+ Stars" /></SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><T text="Customer" /></TableHead>
                <TableHead><T text="Date" /></TableHead>
                <TableHead><T text="Rating" /></TableHead>
                <TableHead className="hidden md:table-cell"><T text="Comments" /></TableHead>
                <TableHead className="text-right"><T text="Actions" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    <T text="Loading feedback..." />
                  </TableCell>
                </TableRow>
              ) : filteredFeedback.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    <T text="No feedback found." />
                  </TableCell>
                </TableRow>
              ) : (
                filteredFeedback.map((feedback) => (
                  <TableRow key={feedback.id}>
                    <TableCell className="font-medium">
                      {feedback.customer?.name || <T text="Anonymous" />}
                    </TableCell>
                    <TableCell>
                      {feedback.created_at ? format(new Date(feedback.created_at), 'dd/MM/yyyy') : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {feedback.overall_rating}
                        <Star className={`h-4 w-4 ml-1 ${feedback.overall_rating >= 4 ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}`} />
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-md truncate">
                      {feedback.comments || <span className="text-muted-foreground italic"><T text="No comments" /></span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewFeedback(feedback)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        <T text="View" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* View Feedback Modal */}
      <SideModal
        open={showViewModal}
        onOpenChange={setShowViewModal}
        title={<T text="Feedback Details" />}
        width="md"
      >
        {selectedFeedback && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-semibold">
                  {selectedFeedback.customer?.name || <T text="Anonymous Customer" />}
                </h3>
                <Badge className="ml-2">
                  {selectedFeedback.created_at ? format(new Date(selectedFeedback.created_at), 'dd MMM yyyy') : ''}
                </Badge>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="flex mr-2">
                  {renderStars(selectedFeedback.overall_rating)}
                </div>
                <span className="text-sm font-medium">{selectedFeedback.overall_rating}/5</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-muted/50">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium"><T text="Food" /></CardTitle>
                </CardHeader>
                <CardContent className="pb-3 pt-0">
                  {selectedFeedback.food_rating ? (
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {renderStars(selectedFeedback.food_rating)}
                      </div>
                      <span className="text-sm">{selectedFeedback.food_rating}/5</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">
                      <T text="Not rated" />
                    </span>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-muted/50">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium"><T text="Service" /></CardTitle>
                </CardHeader>
                <CardContent className="pb-3 pt-0">
                  {selectedFeedback.service_rating ? (
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {renderStars(selectedFeedback.service_rating)}
                      </div>
                      <span className="text-sm">{selectedFeedback.service_rating}/5</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">
                      <T text="Not rated" />
                    </span>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-muted/50">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium"><T text="Atmosphere" /></CardTitle>
                </CardHeader>
                <CardContent className="pb-3 pt-0">
                  {selectedFeedback.atmosphere_rating ? (
                    <div className="flex items-center">
                      <div className="flex mr-2">
                        {renderStars(selectedFeedback.atmosphere_rating)}
                      </div>
                      <span className="text-sm">{selectedFeedback.atmosphere_rating}/5</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">
                      <T text="Not rated" />
                    </span>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {selectedFeedback.comments && (
              <div>
                <h4 className="text-sm font-medium mb-2"><T text="Comments" /></h4>
                <div className="bg-muted/50 p-4 rounded-md">
                  <p className="text-sm">{selectedFeedback.comments}</p>
                </div>
              </div>
            )}
            
            <div className="flex justify-end pt-4">
              <Button variant="outline">
                <T text="Mark as Resolved" />
              </Button>
            </div>
          </div>
        )}
      </SideModal>
    </Layout>
  );
};

export default CustomerFeedbackPage;
