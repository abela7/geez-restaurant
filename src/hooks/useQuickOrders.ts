
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type QuickOrder = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
};

export const useQuickOrders = () => {
  const [orders, setOrders] = useState<QuickOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchQuickOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Temporarily use sample data
        const sampleOrders: QuickOrder[] = [
          {
            id: "1",
            name: "Doro Wat",
            description: "Traditional Ethiopian spicy chicken stew",
            price: 14.99,
            category: "Main Dishes",
            image_url: "https://images.unsplash.com/photo-1566549025339-0b3927462bbf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZXRoaW9waWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D"
          },
          {
            id: "2",
            name: "Injera with Tibs",
            description: "Sourdough flatbread with sautéed beef",
            price: 16.99,
            category: "Main Dishes",
            image_url: "https://images.unsplash.com/photo-1571130986414-c11d9945542c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXRoaW9waWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D"
          },
          {
            id: "3",
            name: "Misir Wat",
            description: "Spicy lentil stew",
            price: 11.99,
            category: "Vegetarian",
            image_url: "https://images.unsplash.com/photo-1567888853783-cc3f58b2590e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGxlbnRpbCUyMHN0ZXd8ZW58MHx8MHx8fDA%3D"
          },
          {
            id: "4",
            name: "Ethiopian Coffee",
            description: "Traditional coffee ceremony",
            price: 5.99,
            category: "Beverages",
            image_url: "https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXRoaW9waWFuJTIwY29mZmVlfGVufDB8fDB8fHww"
          },
          {
            id: "5",
            name: "Kitfo",
            description: "Ethiopian steak tartare",
            price: 18.99,
            category: "Main Dishes",
            image_url: "https://images.unsplash.com/photo-1544378382-5e45b0e95b4d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGV0aGlvcGlhbiUyMGZvb2R8ZW58MHx8MHx8fDA%3D"
          },
          {
            id: "6",
            name: "Shiro",
            description: "Spiced chickpea purée",
            price: 10.99,
            category: "Vegetarian",
            image_url: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGV0aGlvcGlhbiUyMGZvb2R8ZW58MHx8MHx8fDA%3D"
          }
        ];
        
        setOrders(sampleOrders);
        
        // In a real implementation, we would fetch from Supabase
        // const { data, error } = await supabase
        //   .from('food_items')
        //   .select('id, name, description, price, category:categories(name), image_url')
        //   .order('name');
        
        // if (error) throw error;
        
        // const mappedData = data.map(item => ({
        //   id: item.id,
        //   name: item.name,
        //   description: item.description,
        //   price: item.price,
        //   category: item.category?.name || 'Uncategorized',
        //   image_url: item.image_url
        // }));
        
        // setOrders(mappedData);
      } catch (err: any) {
        console.error('Error fetching quick orders:', err);
        setError(err.message || 'Failed to load quick orders');
        toast({
          title: "Error",
          description: `Failed to load quick orders: ${err.message}`,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuickOrders();
  }, [toast]);

  return {
    orders,
    isLoading,
    error
  };
};
