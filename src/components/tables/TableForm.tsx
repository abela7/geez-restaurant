import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useToast } from "@/hooks/use-toast";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Table } from "@/services/table/types";

interface TableFormProps {
  initialData?: Partial<Table>;
  onSubmit: (values: Table) => Promise<void>;
  onCancel: () => void;
  roomOptions: { label: string; value: string; }[];
  groupOptions: { label: string; value: string; }[];
}

const tableSchema = z.object({
  table_number: z.number().min(1, {
    message: "Table number must be at least 1.",
  }),
  capacity: z.number().min(1, {
    message: "Capacity must be at least 1.",
  }),
  status: z.enum(["available", "occupied", "reserved", "cleaning"]),
  room_id: z.string().optional(),
  group_id: z.string().optional(),
  position_x: z.number().optional(),
  position_y: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  rotation: z.number().optional(),
  shape: z.enum(['rectangle', 'circle', 'square']).optional(),
});

const TableForm = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  roomOptions,
  groupOptions
}: TableFormProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const form = useForm<z.infer<typeof tableSchema>>({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      table_number: initialData?.table_number || 1,
      capacity: initialData?.capacity || 2,
      status: initialData?.status || "available",
      room_id: initialData?.room_id || "",
      group_id: initialData?.group_id || "",
      position_x: initialData?.position_x || 0,
      position_y: initialData?.position_y || 0,
      width: initialData?.width || 100,
      height: initialData?.height || 100,
      rotation: initialData?.rotation || 0,
      shape: initialData?.shape || 'rectangle',
    },
  });
  
  const { handleSubmit, control, setValue } = form;
  
  const handleInputChange = (name: string, value: any) => {
    setValue(name as any, value);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor="table_number"><T text="Table Number" /></Label>
          <FormField
            control={control}
            name="table_number"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    type="number" 
                    id="table_number" 
                    placeholder={t("Enter table number")} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="capacity"><T text="Capacity" /></Label>
          <FormField
            control={control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    type="number" 
                    id="capacity" 
                    placeholder={t("Enter capacity")} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status"><T text="Status" /></Label>
          <FormField
            control={control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("Select a status")} />
                  </SelectTrigger>
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
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="room_id"><T text="Room" /></Label>
          <Select
            value={initialData?.room_id || ""}
            onValueChange={(value) => handleInputChange('room_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("Select a room")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=""><T text="None" /></SelectItem>
              {roomOptions.map((room) => (
                <SelectItem key={room.value} value={room.value}>
                  {room.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="group_id"><T text="Table Group" /></Label>
          <Select
            value={initialData?.group_id || ""}
            onValueChange={(value) => handleInputChange('group_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("Select a group")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=""><T text="None" /></SelectItem>
              {groupOptions.map((group) => (
                <SelectItem key={group.value} value={group.value}>
                  {group.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="ghost" onClick={onCancel}>
          <T text="Cancel" />
        </Button>
        <Button type="submit">
          <T text="Save" />
        </Button>
      </div>
    </form>
  );
};

export default TableForm;
