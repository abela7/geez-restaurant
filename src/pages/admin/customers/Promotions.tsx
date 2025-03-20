
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgePercent, Calendar, Users, ArrowRight, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge-extended';
import { SideModal } from '@/components/ui/side-modal';
import { useToast } from '@/hooks/use-toast';
import PromotionForm from '@/components/customer/PromotionForm';
import { getPromotions, createPromotion, updatePromotion, deletePromotion } from '@/services/customer/customerService';
import { Promotion } from '@/services/customer/types';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Promotions: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);

  const { 
    data: promotions = [], 
    isLoading 
  } = useQuery({
    queryKey: ['promotions'],
    queryFn: getPromotions
  });

  const activePromotions = promotions.filter(p => p.status === 'active').length;
  const totalRedemptions = promotions.reduce((sum, p) => sum + (p.usage_count || 0), 0);
  const upcomingPromotions = promotions.filter(p => p.status === 'scheduled').length;

  const createMutation = useMutation({
    mutationFn: createPromotion,
    onSuccess: () => {
      toast({
        title: t("Promotion Added"),
        description: t("The promotion has been added successfully."),
      });
      setShowAddModal(false);
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: t("Failed to add promotion. Please try again."),
        variant: "destructive",
      });
      console.error("Error adding promotion:", error);
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: (data: { id: string; promotion: Partial<Promotion> }) => 
      updatePromotion(data.id, data.promotion),
    onSuccess: () => {
      toast({
        title: t("Promotion Updated"),
        description: t("The promotion has been updated successfully."),
      });
      setShowEditModal(false);
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: t("Failed to update promotion. Please try again."),
        variant: "destructive",
      });
      console.error("Error updating promotion:", error);
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: deletePromotion,
    onSuccess: () => {
      toast({
        title: t("Promotion Deleted"),
        description: t("The promotion has been deleted successfully."),
      });
      setShowDeleteDialog(false);
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: t("Failed to delete promotion. Please try again."),
        variant: "destructive",
      });
      console.error("Error deleting promotion:", error);
    }
  });
  
  const handleAddPromotion = (data: Partial<Promotion>) => {
    // Convert date strings to ISO format for the database
    const formattedData = {
      ...data,
      start_date: new Date(data.start_date!).toISOString(),
      end_date: new Date(data.end_date!).toISOString(),
    };
    
    createMutation.mutate(formattedData as Omit<Promotion, 'id' | 'created_at' | 'updated_at'>);
  };
  
  const handleUpdatePromotion = (data: Partial<Promotion>) => {
    if (selectedPromotion) {
      // Convert date strings to ISO format for the database
      const formattedData = {
        ...data,
        start_date: new Date(data.start_date!).toISOString(),
        end_date: new Date(data.end_date!).toISOString(),
      };
      
      updateMutation.mutate({ 
        id: selectedPromotion.id, 
        promotion: formattedData 
      });
    }
  };
  
  const handleDeletePromotion = () => {
    if (selectedPromotion) {
      deleteMutation.mutate(selectedPromotion.id);
    }
  };
  
  const handleEditPromotion = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setShowEditModal(true);
  };
  
  const handleDeletePrompt = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setShowDeleteDialog(true);
  };
  
  // Helper function to format discount display
  const formatDiscount = (promotion: Promotion) => {
    switch (promotion.discount_type) {
      case 'percentage':
        return `${promotion.discount_value}%`;
      case 'fixed':
        return `£${promotion.discount_value}`;
      case 'bogo':
        return t("Buy One Get One");
      default:
        return "";
    }
  };

  return (
    <Layout interface="admin">
      <PageHeader
        heading={<T text="Promotions" />}
        description={<T text="Create and manage special offers and promotions" />}
        icon={<BadgePercent className="h-6 w-6" />}
        actions={
          <Button onClick={() => setShowAddModal(true)}>
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
            <div className="text-3xl font-bold">{activePromotions}</div>
            <p className="text-sm text-muted-foreground mt-1"><T text="Currently running" /></p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Total Redemptions" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRedemptions}</div>
            <p className="text-sm text-muted-foreground mt-1"><T text="This month" /></p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg"><T text="Upcoming Promotions" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingPromotions}</div>
            <p className="text-sm text-muted-foreground mt-1"><T text="Scheduled to start" /></p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {isLoading ? (
          <Card className="lg:col-span-2">
            <CardContent className="text-center py-10">
              <T text="Loading promotions..." />
            </CardContent>
          </Card>
        ) : promotions.length === 0 ? (
          <Card className="lg:col-span-2">
            <CardContent className="text-center py-10">
              <T text="No promotions found. Create your first promotion to get started." />
            </CardContent>
          </Card>
        ) : (
          promotions.map((promo) => (
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
                    <span>
                      {format(new Date(promo.start_date), 'dd/MM/yy')} - {format(new Date(promo.end_date), 'dd/MM/yy')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>
                      <T text="Redemptions:" /> {promo.usage_count || 0}
                      {promo.usage_limit ? `/${promo.usage_limit}` : ''}
                    </span>
                  </div>
                </div>
                {promo.usage_limit ? (
                  <Progress 
                    value={((promo.usage_count || 0) / promo.usage_limit) * 100} 
                    className="h-2" 
                  />
                ) : (
                  <Progress value={0} className="h-2" />
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Badge variant="secondary">
                  {formatDiscount(promo)}
                </Badge>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-sm"
                    onClick={() => handleEditPromotion(promo)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    <T text="Edit" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-sm text-destructive"
                    onClick={() => handleDeletePrompt(promo)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    <T text="Delete" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      
      {/* Add Promotion Modal */}
      <SideModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        title={<T text="Add New Promotion" />}
        description={<T text="Create a new promotion or special offer" />}
      >
        <PromotionForm 
          onSubmit={handleAddPromotion}
          isLoading={createMutation.isPending}
        />
      </SideModal>
      
      {/* Edit Promotion Modal */}
      <SideModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        title={<T text="Edit Promotion" />}
        description={<T text="Update promotion details" />}
      >
        {selectedPromotion && (
          <PromotionForm 
            promotion={selectedPromotion}
            onSubmit={handleUpdatePromotion}
            isLoading={updateMutation.isPending}
          />
        )}
      </SideModal>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle><T text="Confirm Deletion" /></AlertDialogTitle>
            <AlertDialogDescription>
              <T text="Are you sure you want to delete this promotion? This action cannot be undone." />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel><T text="Cancel" /></AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePromotion}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <T text="Delete" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Promotions;
