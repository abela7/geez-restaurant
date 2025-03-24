
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useLanguage, T } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { TableGroup } from "@/services/table/types";

interface TableGroupFormProps {
  initialData?: Partial<TableGroup>;
  onSubmit: (values: TableGroup) => Promise<void>;
  onCancel: () => void;
  roomOptions: { label: string; value: string; }[];
}

const tableGroupSchema = z.object({
  name: z.string().min(1, {
    message: "Group name is required.",
  }),
  description: z.string().optional(),
  room_id: z.string().optional(),
});

const TableGroupForm = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  roomOptions
}: TableGroupFormProps) => {
  const { t } = useLanguage();
  
  const form = useForm<z.infer<typeof tableGroupSchema>>({
    resolver: zodResolver(tableGroupSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      room_id: initialData?.room_id || "",
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
              <FormLabel><T text="Group Name" /></FormLabel>
              <FormControl>
                <Input placeholder={t("Enter group name")} {...field} />
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
                  placeholder={t("Enter group description (optional)")} 
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
          name="room_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel><T text="Room" /></FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("Select a room (optional)")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none"><T text="None" /></SelectItem>
                  {roomOptions.map((room) => (
                    <SelectItem key={room.value} value={room.value}>
                      {room.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
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

export default TableGroupForm;
