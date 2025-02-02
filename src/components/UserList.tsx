"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Trash, Eye } from "lucide-react"
import Link from "next/link"
import type { User } from "@/app/types/user"
import { getUsersSummary, deleteUser } from "@/lib/api"

interface UserListProps {
  initialUsers: User[]
}


export default function UserList({ initialUsers }: UserListProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers)
  const [nameFilter, setNameFilter] = useState("")
  const [monthFilter, setMonthFilter] = useState("")
  const [yearFilter, setYearFilter] = useState("")
    console.log(users)
  useEffect(() => {
    filterUsers()
  }, [nameFilter, monthFilter, yearFilter]) // Updated dependency array

  const filterUsers = () => {
    let filtered = users
    if (nameFilter) {
      filtered = filtered.filter((user) => user.name.toLowerCase().includes(nameFilter.toLowerCase()))
    }
    if (monthFilter) {
      // Implement month filtering logic if applicable
    }
    if (yearFilter) {
      // Implement year filtering logic if applicable
    }
    setFilteredUsers(filtered)
  }



  return (
    <Card>
      <CardHeader>
        <CardTitle>User Attendance Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <Input placeholder="Filter by name" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />
          <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(12)].map((_, i) => (
                <SelectItem key={i} value={(i + 1).toString()}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {[2023, 2024, 2025].map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Total Records</TableHead>
              <TableHead>Total Absent</TableHead>
              <TableHead>Total Late</TableHead>
              <TableHead>Avg Work Hours</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
      {filteredUsers.map((user: User) => {
        const userss = "alluser"
        return (
          <TableRow key={user.id}>
            <TableCell className="py-2">{user.name}</TableCell>
            <TableCell className="py-2">{user.total_records}</TableCell>
            <TableCell className="py-2">{user.total_absent}</TableCell>
            <TableCell className="py-2">{user.total_late}</TableCell>
            <TableCell className="py-2">{user.avg_work_hours.toFixed(2)}</TableCell>
            <TableCell className="py-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link 
                    href={`/users/${userss}`}
                    className="flex items-center"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

