import { FacultySidebar } from "@/components/faculty-sidebar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function FacultyAnnouncementsLoading() {
  return (
    <div className="flex h-screen bg-background">
      <FacultySidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div>
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>

          <div className="flex items-center justify-center h-64">
            <Skeleton className="h-8 w-48" />
          </div>
        </div>
      </main>
    </div>
  )
}
