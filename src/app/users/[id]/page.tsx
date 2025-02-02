
'use client';
import { useParams } from 'next/navigation'
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { fetchAttendanceSummary, exportAttendance } from '@/lib/api';
import type { AttendanceSummary, AttendanceTotals } from '@/app/types/attendance';
import { format } from "date-fns"
interface AttendanceDate {
  date: string
}

interface EmployeeAttendance {
  name: string
  late_dates: AttendanceDate[]
  absent_dates: AttendanceDate[]
}

interface AttendanceCardProps {
  employee: EmployeeAttendance
}
export default function AttendancePage() {

  // const username = useParams() as { username: any }
  // const decodedUsername = decodeURIComponent(username.id)

  const [filters, setFilters] = useState({
    name: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    day_type: 'WEEKDAY' as any
  });

  const [data, setData] = useState<AttendanceSummary[]>([]);
  const [totals, setTotals] = useState<AttendanceTotals | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return format(date, "MMM dd, yyyy")
    } catch {
      return dateStr
    }
  }
  async function loadData() {
    try {
      setLoading(true);
      const response = await fetchAttendanceSummary(filters);
      setData(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load attendance data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleExport(type: 'excel' | 'csv' | 'json') {
    try {
      await exportAttendance({ ...filters, export_type: type });
      toast({
        title: "Success",
        description: `Attendance data exported as ${type.toUpperCase()}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export attendance data",
        variant: "destructive"
      });
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Attendance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Input
              placeholder="Employee Name"
              value="All Users"
              // onChange={(e) => setFilters(f => ({ ...f, name: e.target.value }))}
            />
            <Select
              value={filters.month.toString()}
              onValueChange={(value) => setFilters(f => ({ ...f, month: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.year.toString()}
              onValueChange={(value) => setFilters(f => ({ ...f, year: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - 2 + i;
                  return (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Select
              value={filters.day_type}
              onValueChange={(value: 'WEEKDAY' | 'WEEKEND') => setFilters(f => ({ ...f, day_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Day Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WEEKDAY">Weekday</SelectItem>
                <SelectItem value="WEEKEND">Weekend</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4 mb-6">
            <Button onClick={loadData} disabled={loading}>
              {loading ? 'Loading...' : 'Load Data'}
            </Button>
            <Button onClick={() => handleExport('excel')} variant="outline">
              Export Excel
            </Button>
            <Button onClick={() => handleExport('csv')} variant="outline">
              Export CSV
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Total Days</TableHead>
                  <TableHead>Absent Days</TableHead>
                  <TableHead>Present Days</TableHead>
                  <TableHead>Avg Hours</TableHead>
                  <TableHead>Late Days</TableHead>
                  <TableHead>Late Minutes</TableHead>
                  <TableHead>Early Minutes</TableHead>
                  <TableHead>Weekdays</TableHead>
                  <TableHead>Weekends</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.total_days}</TableCell>
                    <TableCell>{row.absent_days}</TableCell>
                    <TableCell>{row.present_days}</TableCell>
                    <TableCell>{row.avg_work_hours.toFixed(2)}</TableCell>
                    <TableCell>{row.late_days}</TableCell>
                    <TableCell>{row.total_late_minutes}</TableCell>
                    <TableCell>{row.total_early_minutes}</TableCell>
                    <TableCell>{row.weekdays}</TableCell>
                    <TableCell>{row.weekends}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* {data.map((employee, i) => (
            <Card key={i} className="mt-6">
              <CardHeader>
                <CardTitle>{employee.name} - Detailed Dates</CardTitle>
              </CardHeader>
              <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3 text-lg flex items-center gap-2">
              Late Dates <span className="text-sm text-muted-foreground">({employee.late_dates.length})</span>
            </h3>
            <ul className="space-y-2">
              {employee.late_dates.map((date, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-sm text-muted-foreground">{formatDate(date)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-lg flex items-center gap-2">
              Absent Dates <span className="text-sm text-muted-foreground">({employee.absent_dates.length})</span>
            </h3>
            <ul className="space-y-2">
              {employee.absent_dates.map((date, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span className="text-sm text-muted-foreground">{formatDate(date)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
            </Card>
          ))} */}
        </CardContent>
      </Card>
    </div>
  );
}