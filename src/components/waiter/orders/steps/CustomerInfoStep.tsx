
import React from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// This should match the schema in the parent component
const customerInfoSchema = z.object({
  customerName: z.string().min(2, {
    message: "Customer name must be at least 2 characters.",
  }),
  customerPhone: z.string().optional(),
  customerEmail: z.string().email({
    message: "Invalid email address.",
  }).optional(),
});

type CustomerInfoFormValues = z.infer<typeof customerInfoSchema>;

interface CustomerInfoStepProps {
  form: ReturnType<typeof useForm<CustomerInfoFormValues>>;
  onSubmit: (values: CustomerInfoFormValues) => void;
}

export const CustomerInfoStep: React.FC<CustomerInfoStepProps> = ({ form, onSubmit }) => {
  const { t } = useLanguage();
  
  return (
    <Card className="mb-4 mt-4">
      <CardHeader>
        <CardTitle><T text="Customer Information" /></CardTitle>
        <CardDescription><T text="Enter the customer's details for the order." /></CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel><T text="Customer Name" /></FormLabel>
                  <FormControl>
                    <Input placeholder={t("Customer name")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel><T text="Phone Number" /> (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder={t("Phone number")} {...field} />
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
                  <FormLabel><T text="Email Address" /> (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder={t("Email address")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit"><T text="Continue to Menu" /></Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
