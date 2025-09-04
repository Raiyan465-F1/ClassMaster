import { FacultySidebar } from "@/components/faculty-sidebar"
import { Profile } from "@/components/profile"

export default function FacultyProfile() {
  return (
    <div className="flex h-screen bg-background">
      <FacultySidebar />
      <main className="flex-1 overflow-auto p-6">
        <Profile />
      </main>
    </div>
  )
}
