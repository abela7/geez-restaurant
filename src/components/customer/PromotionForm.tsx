
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLanguage, T } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Promotion } from '@/services/customer/types';

const promotionSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(5, { message: "Description must be at least 5 characters" }),
  discount_type: z.enum(['percentage', 'fixed', 'bogo']),
  discount_value: z.coerce.number().min(0, { message: "Discount value must be positive" }),
  start_date: z.string().min(1, { message: "Start date is required" }),
  end_date: z.string().min(1, { message: "End date is required" }),
  min_purchase: z.coerce.number().optional(),
  usage_limit: z.coerce.number().optional(),
  status: z.enum(['active', 'inactive', 'expired', 'scheduled']).default('active'),
});

type PromotionFormProps = {
  promotion?: Promotion;
  onSubmit: (data: z.infer<typeof promotionSchema>) => void;
  isLoading?: boolean;
};

const PromotionForm: React.FC<PromotionFormProps> = ({
  promotion,
  onSubmit,
  isLoading = false,
}) => {
  const { t } = useLanguage();
  
  const form = useForm<z.infer<typeof promotionSchema>>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      name: promotion?.name || '',
      description: promotion?.description || '',
      discount_type: promotion?.discount_type || 'percentage',
      discount_value: promotion?.discount_value || 0,
      start_date: promotion?.start_date ? new Date(promotion.start_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      end_date: promotion?.end_date ? new Date(promotion.end_date).toISOString().split('T')[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      min_purchase: promotion?.min_purchase || 0,
      usage_limit: promotion?.usage_limit || 0,
      status: promotion?.status || 'active',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel><T text="Promotion Name" /></FormLabel>
              <FormControl>
                <Input placeholder={t("Enter promotion name")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel><T text="Description" /></FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t("Enter promotion description")} 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="discount_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel><T text="Discount Type" /></FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select discount type")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="percentage"><T text="Percentage" /></SelectItem>
                    <SelectItem value="fixed"><T text="Fixed Amount (£)" /></SelectItem>
                    <SelectItem value="bogo"><T text="Buy One Get One" /></SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="discount_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {field.value === 'percentage' ? 
                    <T text="Discount (%)" /> : 
                    field.value === 'bogo' ? 
                    <T text="Discount (%)" /> : 
                    <T text="Discount Amount (£)" />
                  }
                </FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel><T text="Start Date" /></FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel><T text="End Date" /></FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="min_purchase"
            render={({ field }) => (
              <FormItem>
                <FormLabel><T text="Minimum Purchase (£)" /></FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="usage_limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel><T text="Usage Limit" /></FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel><T text="Status" /></FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("Select status")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active"><T text="Active" /></SelectItem>
                  <SelectItem value="inactive"><T text="Inactive" /></SelectItem>
                  <SelectItem value="scheduled"><T text="Scheduled" /></SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button 
            type="submit" 
            disabled={isLoading}
          >
            {promotion ? <T text="Update Promotion" /> : <T text="Add Promotion" />}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PromotionForm;
