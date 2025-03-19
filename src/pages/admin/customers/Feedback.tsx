
import React from 'react';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, ThumbsUp, ThumbsDown, Star } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge-extended';

const FEEDBACK_DATA = [
  {
    id: 1,
    customer: "John Doe",
    date: "2023-06-10",
    rating: 4.5,
    foodRating: 5,
    serviceRating: 4,
    comments: "Amazing food, especially the doro wat! Service was a bit slow but very friendly.",
    status: "unread"
  },
  {
    id: 2,
    customer: "Sarah Miller",
    date: "2023-06-09",
    rating: 3.0,
    foodRating: 4,
    serviceRating: 2,
    comments: "Food was delicious but waited 45 minutes for the order.",
    status: "read"
  },
  {
    id: 3,
    customer: "Michael Chen",
    date: "2023-06-08",
    rating: 5.0,
    foodRating: 5,
    serviceRating: 5,
    comments: "Best Ethiopian food in town! Friendly staff and quick service.",
    status: "responded"
  },
];

const CustomerFeedback: React.FC = () => {
  const { t } = useLanguage();

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
              <div className="text-3xl font-bold mr-2">4.2</div>
              <div className="flex text-yellow-500">
                <Star className="fill-yellow-500 h-5 w-5" />
                <Star className="fill-yellow-500 h-5 w-5" />
                <Star className="fill-yellow-500 h-5 w-5" />
                <Star className="fill-yellow-500 h-5 w-5" />
                <Star className="fill-none stroke-yellow-500 h-5 w-5" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1"><T text="Based on 128 reviews" /></p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Food Quality" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold mr-2">4.7</div>
              <div className="flex text-yellow-500">
                <Star className="fill-yellow-500 h-5 w-5" />
                <Star className="fill-yellow-500 h-5 w-5" />
                <Star className="fill-yellow-500 h-5 w-5" />
                <Star className="fill-yellow-500 h-5 w-5" />
                <Star className="fill-yellow-500 h-5 w-5 opacity-70" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1"><T text="Highest rated category" /></p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Service" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold mr-2">3.8</div>
              <div className="flex text-yellow-500">
                <Star className="fill-yellow-500 h-5 w-5" />
                <Star className="fill-yellow-500 h-5 w-5" />
                <Star className="fill-yellow-500 h-5 w-5" />
                <Star className="fill-yellow-500 h-5 w-5 opacity-50" />
                <Star className="fill-none stroke-yellow-500 h-5 w-5" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1"><T text="Area for improvement" /></p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle><T text="Recent Feedback" /></CardTitle>
          <CardDescription><T text="View and respond to customer reviews" /></CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><T text="Customer" /></TableHead>
                <TableHead><T text="Date" /></TableHead>
                <TableHead><T text="Rating" /></TableHead>
                <TableHead className="hidden md:table-cell"><T text="Comments" /></TableHead>
                <TableHead><T text="Status" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {FEEDBACK_DATA.map((feedback) => (
                <TableRow key={feedback.id}>
                  <TableCell className="font-medium">{feedback.customer}</TableCell>
                  <TableCell>{feedback.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {feedback.rating}
                      <Star className={`h-4 w-4 ml-1 ${feedback.rating >= 4 ? "text-yellow-500" : "text-gray-400"}`} />
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-md truncate">
                    {feedback.comments}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        feedback.status === "unread" ? "destructive" : 
                        feedback.status === "read" ? "warning" : 
                        "success"
                      }
                    >
                      <T text={feedback.status} />
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default CustomerFeedback;
