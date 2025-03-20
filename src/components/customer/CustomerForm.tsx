
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
import { Customer } from '@/services/customer/types';

const customerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  loyalty_level: z.string().default('Bronze'),
  loyalty_points: z.coerce.number().optional(),
  visits: z.coerce.number().optional(),
  notes: z.string().optional().or(z.literal('')),
});

type CustomerFormProps = {
  customer?: Customer;
  onSubmit: (data: z.infer<typeof customerSchema>) => void;
  isLoading?: boolean;
};

const CustomerForm: React.FC<CustomerFormProps> = ({
  customer,
  onSubmit,
  isLoading = false,
}) => {
  const { t } = useLanguage();
  
  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer?.name || '',
      email: customer?.email || '',
      phone: customer?.phone || '',
      address: customer?.address || '',
      loyalty_level: customer?.loyalty_level || 'Bronze',
      loyalty_points: customer?.loyalty_points || 0,
      visits: customer?.visits || 0,
      notes: customer?.notes || '',
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
              <FormLabel><T text="Customer Name" /></FormLabel>
              <FormControl>
                <Input placeholder={t("Enter customer name")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel><T text="Email Address" /></FormLabel>
                <FormControl>
                  <Input placeholder={t("Enter email address")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel><T text="Phone Number" /></FormLabel>
                <FormControl>
                  <Input placeholder={t("Enter phone number")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel><T text="Address" /></FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t("Enter customer address")} 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="loyalty_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel><T text="Loyalty Level" /></FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select loyalty level")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Bronze">Bronze</SelectItem>
                    <SelectItem value="Silver">Silver</SelectItem>
                    <SelectItem value="Gold">Gold</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="loyalty_points"
            render={({ field }) => (
              <FormItem>
                <FormLabel><T text="Loyalty Points" /></FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="visits"
            render={({ field }) => (
              <FormItem>
                <FormLabel><T text="Visit Count" /></FormLabel>
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel><T text="Notes" /></FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t("Add any additional notes about this customer")} 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button 
            type="submit" 
            disabled={isLoading}
          >
            {customer ? <T text="Update Customer" /> : <T text="Add Customer" />}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CustomerForm;
