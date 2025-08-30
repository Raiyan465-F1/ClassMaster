import { StudentSidebar } from "@/components/student-sidebar"

export default function Loading() {
  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
              <div className="h-4 w-64 bg-muted rounded animate-pulse" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-12 bg-muted rounded animate-pulse" />
              <div className="h-10 w-48 bg-muted rounded animate-pulse" />
            </div>
          </div>

          {/* Leaderboard Card Skeleton */}
          <div className="bg-card text-card-foreground rounded-xl border shadow-sm">
            <div className="p-6 border-b">
              <div className="h-6 w-64 bg-muted rounded animate-pulse" />
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-8 w-16 bg-muted rounded animate-pulse" />
                    <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                    <div className="ml-auto h-6 w-16 bg-muted rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Points Info Skeleton */}
          <div className="bg-card text-card-foreground rounded-xl border shadow-sm">
            <div className="p-6 border-b">
              <div className="h-6 w-48 bg-muted rounded animate-pulse" />
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 w-full bg-muted rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
