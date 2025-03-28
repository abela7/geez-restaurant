
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage, T } from "@/contexts/LanguageContext";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableStatus } from "@/services/table/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define schema for table form
const tableFormSchema = z.object({
  table_number: z.coerce.number().positive({ message: "Table number must be positive" }),
  capacity: z.coerce.number().min(1, { message: "Capacity must be at least 1" }),
  status: z.enum(['available', 'occupied', 'reserved', 'cleaning', 'inactive'] as const),
  room_id: z.string().nullable(),
  group_id: z.string().nullable(),
  position_x: z.coerce.number().optional(),
  position_y: z.coerce.number().optional(),
  width: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  rotation: z.coerce.number().optional(),
  shape: z.enum(['rectangle', 'circle', 'square'] as const).optional(),
  location: z.string().optional(),
});

type TableFormValues = z.infer<typeof tableFormSchema>;

interface OptionType {
  value: string;
  label: string;
}

interface TableFormProps {
  initialData: Partial<Table>;
  onSubmit: (data: Table) => Promise<void>;
  onCancel: () => void;
  roomOptions: OptionType[];
  groupOptions: OptionType[];
  isSubmitting?: boolean;
  error?: string | null;
}

const TableForm: React.FC<TableFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  roomOptions, 
  groupOptions,
  isSubmitting = false,
  error = null
}) => {
  const { t } = useLanguage();
  
  // Convert initialData to match the form's expected types
  const defaultValues: Partial<TableFormValues> = {
    table_number: initialData.table_number || 1,
    capacity: initialData.capacity || 4,
    status: (initialData.status as TableStatus) || 'available',
    room_id: initialData.room_id || null,
    group_id: initialData.group_id || null,
    position_x: initialData.position_x || 0,
    position_y: initialData.position_y || 0,
    width: initialData.width || 100,
    height: initialData.height || 100,
    rotation: initialData.rotation || 0,
    shape: initialData.shape || 'rectangle',
    location: initialData.location || '',
  };
  
  const form = useForm<TableFormValues>({
    resolver: zodResolver(tableFormSchema),
    defaultValues,
  });
  
  const handleSubmit = async (values: TableFormValues) => {
    // Pass the values with the original ID if in edit mode
    await onSubmit({
      ...(initialData.id ? { id: initialData.id } : {}),
      ...values,
    } as Table);
  };

  const selectedShape = form.watch('shape');
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="basic"><T text="Basic Info" /></TabsTrigger>
            <TabsTrigger value="design"><T text="Table Design" /></TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="table_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><T text="Table Number" /></FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
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
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select status")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="available">{t("Available")}</SelectItem>
                      <SelectItem value="occupied">{t("Occupied")}</SelectItem>
                      <SelectItem value="reserved">{t("Reserved")}</SelectItem>
                      <SelectItem value="cleaning">{t("Cleaning")}</SelectItem>
                      <SelectItem value="inactive">{t("Inactive")}</SelectItem>
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
                    value={field.value || "null"}
                    onValueChange={(value) => field.onChange(value === "null" ? null : value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select room")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="null">{t("No Room")}</SelectItem>
                      {roomOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
                    value={field.value || "null"}
                    onValueChange={(value) => field.onChange(value === "null" ? null : value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select group")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="null">{t("No Group")}</SelectItem>
                      {groupOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel><T text="Location Description (Optional)" /></FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t("e.g., Near window")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="design" className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="shape"
              render={({ field }) => (
                <FormItem>
                  <FormLabel><T text="Shape" /></FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select shape")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="rectangle">{t("Rectangle")}</SelectItem>
                      <SelectItem value="circle">{t("Circle")}</SelectItem>
                      <SelectItem value="square">{t("Square")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><T text="Width" /></FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {selectedShape === "circle" ? <T text="Diameter" /> : <T text="Height" />}
                    </FormLabel>
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
              name="rotation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel><T text="Rotation (degrees)" /></FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      min="0" 
                      max="359" 
                      disabled={selectedShape === "circle"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="position_x"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><T text="Position X" /></FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="position_y"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel><T text="Position Y" /></FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-4 p-4 border rounded-md bg-muted/30">
              <div className="text-sm text-muted-foreground mb-2">
                <T text="Table Preview" />
              </div>
              <div className="relative w-full h-40 bg-background border rounded-md flex items-center justify-center">
                <div
                  className={`bg-primary/20 border-2 border-primary ${
                    selectedShape === 'circle' ? 'rounded-full' : 
                    selectedShape === 'square' ? 'aspect-square' : 'rounded-md'
                  }`}
                  style={{
                    width: `${Math.min(form.watch('width') || 100, 150)}px`,
                    height: `${Math.min(form.watch('height') || 100, 150)}px`,
                    transform: selectedShape !== 'circle' ? `rotate(${form.watch('rotation') || 0}deg)` : 'none',
                  }}
                >
                  <div className="flex h-full items-center justify-center font-medium">
                    {form.watch('table_number') || '?'}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <T text="Cancel" />
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                <T text="Saving..." />
              </>
            ) : (
              <T text="Save" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TableForm;
