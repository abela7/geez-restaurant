
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useLanguage, T } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Room } from "@/services/table/types";

interface RoomFormProps {
  initialData?: Partial<Room>;
  onSubmit: (values: Room) => Promise<void>;
  onCancel: () => void;
}

const roomSchema = z.object({
  name: z.string().min(1, {
    message: "Room name is required.",
  }),
  description: z.string().optional(),
  active: z.boolean().default(true),
});

const RoomForm = ({ initialData, onSubmit, onCancel }: RoomFormProps) => {
  const { t } = useLanguage();
  
  const form = useForm<z.infer<typeof roomSchema>>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      active: initialData?.active === undefined ? true : initialData.active,
    },
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel><T text="Room Name" /></FormLabel>
              <FormControl>
                <Input placeholder={t("Enter room name")} {...field} />
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
                  placeholder={t("Enter room description (optional)")} 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel><T text="Active" /></FormLabel>
                <FormDescription>
                  <T text="Mark this room as active or inactive" />
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={onCancel}>
            <T text="Cancel" />
          </Button>
          <Button type="submit">
            <T text="Save" />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RoomForm;
