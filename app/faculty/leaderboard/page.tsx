"use client"

import { FacultySidebar } from "@/components/faculty-sidebar"
import { Leaderboard } from "@/components/leaderboard"

export default function FacultyLeaderboard() {
  return (
    <div className="flex h-screen bg-background">
      <FacultySidebar />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Leaderboard userRole="faculty" />
        </div>
      </main>
    </div>
  )
}
