
export interface MenuNotification {
  id?: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success";
  for_role: string;
  created_by: string;
  created_at?: string;
  read?: boolean;
}
