
export interface Customer {
  id?: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
  visits?: number;
  loyalty_points?: number;
  loyalty_level?: string;
  last_visit?: string | null;
}
