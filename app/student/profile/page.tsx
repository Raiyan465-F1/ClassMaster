import { StudentSidebar } from "@/components/student-sidebar"
import { Profile } from "@/components/profile"

export default function StudentProfile() {
  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />
      <main className="flex-1 overflow-auto p-6">
        <Profile />
      </main>
    </div>
  )
}
