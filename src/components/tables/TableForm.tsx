
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useToast } from "@/hooks/use-toast";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Table } from "@/services/table/types";

interface TableFormProps {
  initialData?: Partial<Table>;
  onSubmit: (values: Table) => Promise<void>;
  onCancel: () => void;
  roomOptions: { label: string; value: string; }[];
  groupOptions: { label: string; value: string; }[];
}

const tableSchema = z.object({
  table_number: z.coerce.number().min(1, {
    message: "Table number must be at least 1.",
  }),
  capacity: z.coerce.number().min(1, {
    message: "Capacity must be at least 1.",
  }),
  status: z.enum(["available", "occupied", "reserved", "cleaning"]),
  room_id: z.string().nullable(),
  group_id: z.string().nullable(),
  position_x: z.number().optional(),
  position_y: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  rotation: z.number().optional(),
  shape: z.enum(['rectangle', 'circle', 'square']).optional(),
});

type FormValues = z.infer<typeof tableSchema>;

const TableForm = ({ 
  initialData = {}, 
  onSubmit, 
  onCancel,
  roomOptions,
  groupOptions
}: TableFormProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      table_number: initialData.table_number || 1,
      capacity: initialData.capacity || 2,
      status: initialData.status || "available",
      room_id: initialData.room_id === undefined ? null : initialData.room_id,
      group_id: initialData.group_id === undefined ? null : initialData.group_id,
      position_x: initialData.position_x || 0,
      position_y: initialData.position_y || 0,
      width: initialData.width || 100,
      height: initialData.height || 100,
      rotation: initialData.rotation || 0,
      shape: initialData.shape || 'rectangle',
    },
  });
  
  const handleFormSubmit = async (values: FormValues) => {
    try {
      await onSubmit(values as Table);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: t("Error"),
        description: t("Failed to save table. Please try again."),
        variant: "destructive",
      });
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="table_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel><T text="Table Number" /></FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder={t("Enter table number")} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel><T text="Capacity" /></FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder={t("Enter capacity")} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
                      <SelectValue placeholder={t("Select a status")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="available"><T text="Available" /></SelectItem>
                    <SelectItem value="occupied"><T text="Occupied" /></SelectItem>
                    <SelectItem value="reserved"><T text="Reserved" /></SelectItem>
                    <SelectItem value="cleaning"><T text="Cleaning" /></SelectItem>
                  </SelectContent>
                </Select>
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
                  onValueChange={(value) => field.onChange(value || null)}
                  value={field.value || "null"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select a room")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="null"><T text="None" /></SelectItem>
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
          
          <FormField
            control={form.control}
            name="group_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel><T text="Table Group" /></FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value || null)}
                  value={field.value || "null"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Select a group")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="null"><T text="None" /></SelectItem>
                    {groupOptions.map((group) => (
                      <SelectItem key={group.value} value={group.value}>
                        {group.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
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

export default TableForm;
