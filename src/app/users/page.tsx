import UserList from "@/components/UserList"
import { getUsersSummary } from "@/lib/api"

export default async function UsersPage() {
  const initialUsers = await getUsersSummary()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Attendance</h1>
      <UserList initialUsers={initialUsers} />
    </div>
  )
}

