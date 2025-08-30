"use client"

import { StudentSidebar } from "@/components/student-sidebar"
import { Leaderboard } from "@/components/leaderboard"

export default function StudentLeaderboard() {
  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Leaderboard userRole="student" />
        </div>
      </main>
    </div>
  )
}
