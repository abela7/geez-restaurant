// Add staff performance related types

export interface StaffPerformanceData {
  name: string;
  attendance: number;
  tasks: number;
  efficiency: number;
}

export interface AttendanceData {
  name: string;
  onTime: number;
  late: number;
  absent: number;
}

export interface TaskCompletionData {
  name: string;
  completed: number;
  pending: number;
  late: number;
}

export interface DepartmentPerformance {
  category: string;
  completion: number;
}

export interface TopPerformers {
  topPerformer: { name: string, department: string, efficiency: number };
  mostImproved: { name: string, department: string, improvement: number };
  needsAttention: { name: string, department: string, issue: string };
}

export interface AttendanceMetrics {
  workingDays: number;
  onTimeRate: { count: number, percentage: number, trend: string };
  lateArrivals: { count: number, percentage: number, trend: string };
  absences: { count: number, percentage: number, trend: string };
}
