import { supabase } from "@/integrations/supabase/client";
import { Customer, CustomerFeedback, Promotion, CustomerPromotion } from "./types";

// Customer functions
export const getCustomers = async (): Promise<Customer[]> => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
  
  return data || [];
};

export const getCustomerById = async (id: string): Promise<Customer | null> => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching customer:', error);
    throw error;
  }
  
  return data;
};

export const createCustomer = async (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer> => {
  const { data, error } = await supabase
    .from('customers')
    .insert(customer)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
  
  return data;
};

export const updateCustomer = async (id: string, customer: Partial<Customer>): Promise<Customer> => {
  const { data, error } = await supabase
    .from('customers')
    .update(customer)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
  
  return data;
};

export const deleteCustomer = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

// Customer Feedback functions
export const getCustomerFeedback = async (): Promise<CustomerFeedback[]> => {
  const { data, error } = await supabase
    .from('customer_feedback')
    .select('*, customer:customer_id(name)')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching feedback:', error);
    throw error;
  }
  
  return data || [];
};

export const createCustomerFeedback = async (feedback: Omit<CustomerFeedback, 'id' | 'created_at' | 'updated_at'>): Promise<CustomerFeedback> => {
  const { data, error } = await supabase
    .from('customer_feedback')
    .insert(feedback)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating feedback:', error);
    throw error;
  }
  
  return data;
};

// Promotions functions
export const getPromotions = async (): Promise<Promotion[]> => {
  console.log('Fetching promotions');

  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .order('start_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching promotions:', error);
    throw error;
  }
  
  // Using type assertion to handle the discount_type field
  const promotions = data || [];
  
  // Update status based on dates
  const today = new Date();
  return promotions.map(promo => {
    const startDate = new Date(promo.start_date);
    const endDate = new Date(promo.end_date);
    
    if (promo.status !== 'inactive') {
      if (today < startDate) {
        promo.status = 'scheduled';
      } else if (today > endDate) {
        promo.status = 'expired';
      } else {
        promo.status = 'active';
      }
    }
    
    return promo as unknown as Promotion;
  });
};

export const createPromotion = async (promotion: Omit<Promotion, 'id' | 'created_at' | 'updated_at'>): Promise<Promotion> => {
  const { data, error } = await supabase
    .from('promotions')
    .insert(promotion)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating promotion:', error);
    throw error;
  }
  
  return data as unknown as Promotion;
};

export const updatePromotion = async (id: string, promotion: Partial<Promotion>): Promise<Promotion> => {
  const { data, error } = await supabase
    .from('promotions')
    .update(promotion)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating promotion:', error);
    throw error;
  }
  
  return data as unknown as Promotion;
};

export const deletePromotion = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('promotions')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting promotion:', error);
    throw error;
  }
};

// Customer Stats
export const getCustomerStats = async () => {
  const { data: customers, error: customersError } = await supabase
    .from('customers')
    .select('*');
    
  if (customersError) {
    console.error('Error fetching customer stats:', customersError);
    throw customersError;
  }
  
  const totalCustomers = customers?.length || 0;
  const activeCustomers = customers?.filter(c => c.visits && c.visits > 0)?.length || 0;
  
  // Calculate average visits
  let totalVisits = 0;
  customers?.forEach(customer => {
    totalVisits += customer.visits || 0;
  });
  const averageVisits = totalCustomers > 0 ? (totalVisits / totalCustomers).toFixed(1) : 0;
  
  // Count loyalty levels
  const bronzeMembers = customers?.filter(c => c.loyalty_level === 'Bronze')?.length || 0;
  const silverMembers = customers?.filter(c => c.loyalty_level === 'Silver')?.length || 0;
  const goldMembers = customers?.filter(c => c.loyalty_level === 'Gold')?.length || 0;
  
  return {
    totalCustomers,
    activeCustomers,
    averageVisits,
    loyaltyMembers: {
      bronze: bronzeMembers,
      silver: silverMembers,
      gold: goldMembers,
      total: bronzeMembers + silverMembers + goldMembers
    }
  };
};

// Customer Promotions
export const getCustomerPromotions = async (customerId: string): Promise<CustomerPromotion[]> => {
  const { data, error } = await supabase
    .from('customer_promotions')
    .select('*, promotion:promotion_id(*)')
    .eq('customer_id', customerId);
  
  if (error) {
    console.error('Error fetching customer promotions:', error);
    throw error;
  }
  
  return (data || []).map(item => ({
    ...item,
    promotion: item.promotion as unknown as Promotion
  })) as CustomerPromotion[];
};

export const assignPromotionToCustomer = async (customerId: string, promotionId: string): Promise<CustomerPromotion> => {
  const { data, error } = await supabase
    .from('customer_promotions')
    .insert({
      customer_id: customerId,
      promotion_id: promotionId,
      redeemed: false
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error assigning promotion to customer:', error);
    throw error;
  }
  
  return data as unknown as CustomerPromotion;
};

export const redeemPromotion = async (id: string): Promise<CustomerPromotion> => {
  const { data, error } = await supabase
    .from('customer_promotions')
    .update({
      redeemed: true,
      redeemed_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error redeeming promotion:', error);
    throw error;
  }
  
  // Also update the usage count on the promotion
  const promotionId = data.promotion_id;
  
  // Using rpc to call the increment_promotion_usage function
  try {
    await supabase
      .rpc('increment_promotion_usage', { promotion_id: promotionId });
    console.log('Promotion usage count incremented successfully');
  } catch (error) {
    console.error('Error incrementing promotion usage count:', error);
  }
  
  return data as unknown as CustomerPromotion;
};
