import { StudentSidebar } from "@/components/student-sidebar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function StudentSelectCoursesLoading() {
  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <div>
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>

          {/* Enrollment Form Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-80" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <Skeleton className="h-10 w-32" />
            </CardContent>
          </Card>

          {/* Current Enrollments Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-80" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                      <Skeleton className="h-5 w-32" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Available Sections Overview Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-80" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <Skeleton className="h-5 w-48 mb-3" />
                    <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-1">
                      {[1, 2, 3, 4, 5, 6].map((j) => (
                        <Skeleton key={j} className="h-12 w-full" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
