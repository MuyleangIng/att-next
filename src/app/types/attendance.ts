// app/types/attendance.ts
export interface AttendanceSummary {
    name: string;
    total_days: number;
    absent_days: number;
    present_days: number;
    avg_work_hours: number;
    late_days: number;
    total_late_minutes: number;
    total_early_minutes: number;
    weekdays: number;
    weekends: number;
    late_dates: {
      count: number;
      dates: string[];
      formatted: string;
    };
    absent_dates: {
      count: number;
      dates: string[];
      formatted: string;
    };
  }
  
  export interface AttendanceTotals {
    total_employees: number;
    total_days: number;
    total_absent_days: number;
    total_present_days: number;
    total_late_days: number;
    total_late_minutes: number;
    total_early_minutes: number;
    total_weekdays: number;
    total_weekends: number;
    average_work_hours: number;
  }