import { AdminSidebar } from "@/components/admin-sidebar"
import { Profile } from "@/components/profile"

export default function AdminProfile() {
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6">
        <Profile />
      </main>
    </div>
  )
}
