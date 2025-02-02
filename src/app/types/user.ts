export interface User {
    id: any
    name: string
    total_records: number
    total_absent: number
    total_late: number
    avg_work_hours: number
  }
  
  export interface UserDetail extends User {
    late_dates: string[]
    absent_dates: string[]
  }
  
  