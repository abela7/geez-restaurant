
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { UseFormReturn } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";

// Define the schema through zod
const customerInfoSchema = z.object({
  customerName: z.string().min(2, {
    message: "Customer name must be at least 2 characters.",
  }),
  customerPhone: z.string().optional(),
  customerEmail: z.string().email({
    message: "Invalid email address.",
  }).optional().or(z.literal('')),
  guestCount: z.string().default("1"),
});

type CustomerInfoFormValues = z.infer<typeof customerInfoSchema>;

interface CustomerInfoStepProps {
  form: UseFormReturn<any>;
  onSubmit: (values: CustomerInfoFormValues) => void;
}

export const CustomerInfoStep: React.FC<CustomerInfoStepProps> = ({ 
  form,
  onSubmit
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-xl font-semibold"><T text="Customer Information" /></h2>
      
      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><T text="Customer Name" /></FormLabel>
                    <FormControl>
                      <Input placeholder={t("Enter customer name")} {...field} />
                    </FormControl>
                    <FormDescription>
                      <T text="This will help identify the customer's order." />
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><T text="Phone Number" /> <span className="text-muted-foreground text-sm">(<T text="optional" />)</span></FormLabel>
                      <FormControl>
                        <Input placeholder={t("Enter phone number")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel><T text="Email" /> <span className="text-muted-foreground text-sm">(<T text="optional" />)</span></FormLabel>
                      <FormControl>
                        <Input placeholder={t("Enter email address")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="guestCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><T text="Number of Guests" /></FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("Select number of guests")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">
                <T text="Continue" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
