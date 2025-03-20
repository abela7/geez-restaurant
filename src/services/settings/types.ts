
export interface RestaurantProfile {
  id: string;
  name: string;
  cuisine_type: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  description: string | null;
  tax_id: string | null;
  founded_year: number | null;
  created_at: string;
  updated_at: string;
}

export interface BusinessHours {
  id: string;
  day_of_week: string;
  open_time: string;
  close_time: string;
  is_closed: boolean;
  created_at: string;
  updated_at: string;
}

export interface RestaurantBranding {
  id: string;
  logo_url: string | null;
  cover_image_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  name: string;
  description: string | null;
  permissions: Record<string, boolean>;
  created_at: string;
  updated_at: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role_id: string | null;
  status: string;
  last_login: string | null;
  created_at: string;
  updated_at: string;
  role?: UserRole;
}

export interface UserActivityLog {
  id: string;
  user_id: string | null;
  activity: string;
  timestamp: string;
  ip_address: string | null;
  status: string;
  user?: UserAccount;
}
