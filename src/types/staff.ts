
export interface StaffMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: 'admin' | 'waiter' | 'chef' | 'dishwasher' | 'manager';
  department: string;
  address: string;
  hourly_rate: number;
  bio: string;
  image_url: string;
  gender: string;
  performance: number;
  attendance: string;
  hiring_date?: string;
  staff_role?: 'Super Admin' | 'Admin' | 'Waiter' | 'Kitchen' | 'Customer';
}

export type StaffRole = 'admin' | 'waiter' | 'chef' | 'dishwasher' | 'manager';
export type StaffRoleEnum = 'Super Admin' | 'Admin' | 'Waiter' | 'Kitchen' | 'Customer';
export type Department = 'Kitchen' | 'Front of House' | 'Management';
export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'On Leave';
