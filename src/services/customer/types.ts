
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  loyalty_level?: string;
  loyalty_points?: number;
  visits?: number;
  last_visit?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerFeedback {
  id: string;
  customer_id?: string;
  order_id?: string;
  overall_rating: number;
  food_rating?: number;
  service_rating?: number;
  atmosphere_rating?: number;
  comments?: string;
  created_at?: string;
  updated_at?: string;
  customer?: {
    name: string;
  };
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  discount_type: 'percentage' | 'fixed' | 'bogo';
  discount_value: number;
  start_date: string;
  end_date: string;
  min_purchase?: number;
  usage_limit?: number;
  usage_count?: number;
  status: 'active' | 'inactive' | 'expired' | 'scheduled';
  created_at?: string;
  updated_at?: string;
}

export interface CustomerPromotion {
  id: string;
  customer_id: string;
  promotion_id: string;
  redeemed: boolean;
  redeemed_at?: string;
  created_at?: string;
  updated_at?: string;
  promotion?: Promotion;
  customer?: Customer;
}
