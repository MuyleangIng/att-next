// lib/api.ts
export async function fetchAttendanceSummary(params: {
    name?: string;
    month?: number;
    year?: number;
    day_type?: 'WEEKDAY' | 'WEEKEND';
  }) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString());
    });
  
    const response = await fetch(`https://attendance.shinoshike.studio/api/v1/api/v1/attendance/monthly-summary?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch attendance summary');
    return response.json();
  }
  

  import type { User } from "@/app/types/user"

  const API_URL = "https://attendance.shinoshike.studio/api/v1"
  
  export async function getUsersSummary(): Promise<User[]> {
    const response = await fetch(`${API_URL}/api/v1/attendance/users`)
    if (!response.ok) {
      throw new Error("Failed to fetch users")
    }
    return response.json()
  }
  

  export async function deleteUser(username: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/v1/attendance/user/${username}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error("Failed to delete user")
    }
  }
  
  
  
  export async function exportAttendance(params: {
    name?: string;
    month?: number;
    year?: number;
    day_type?: 'WEEKDAY' | 'WEEKEND';
    export_type: 'excel' | 'csv' | 'json';
  }) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString());
    });
  
    if (params.export_type === 'json') {
      const response = await fetch(`https://attendance.shinoshike.studio/api/v1/api/v1/attendance/monthly-summary-export?${searchParams}`);
      return response.json();
    } else {
      window.location.href = `https://attendance.shinoshike.studio/api/v1/api/v1/attendance/monthly-summary-export?${searchParams}`;
    }
  }