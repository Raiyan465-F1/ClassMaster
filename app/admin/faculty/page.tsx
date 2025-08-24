"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { FacultyAssignment } from "@/components/faculty-assignment"

// Mock data
const mockFaculty = [
  { id: "1", name: "Dr. Smith", email: "smith@university.edu", assignedSections: ["CSE201-A"] },
  { id: "2", name: "Prof. Johnson", email: "johnson@university.edu", assignedSections: ["CSE201-B", "CSE301-A"] },
  { id: "3", name: "Dr. Williams", email: "williams@university.edu", assignedSections: [] },
  { id: "4", name: "Prof. Brown", email: "brown@university.edu", assignedSections: ["CSE401-C"] },
]

const mockSections = [
  { courseCode: "CSE201", sectionNumber: "A", courseName: "Database Systems", instructor: "Dr. Smith" },
  { courseCode: "CSE201", sectionNumber: "B", courseName: "Database Systems", instructor: "Prof. Johnson" },
  { courseCode: "CSE301", sectionNumber: "A", courseName: "Data Structures", instructor: "Dr. Williams" },
  { courseCode: "CSE401", sectionNumber: "C", courseName: "Software Engineering", instructor: "Prof. Brown" },
]

export default function AdminFaculty() {
  const [faculty, setFaculty] = useState(mockFaculty)

  const handleAssignFaculty = (facultyId: string, sectionKey: string) => {
    setFaculty((prev) =>
      prev.map((member) =>
        member.id === facultyId ? { ...member, assignedSections: [...member.assignedSections, sectionKey] } : member,
      ),
    )
  }

  const handleRemoveFaculty = (facultyId: string, sectionKey: string) => {
    setFaculty((prev) =>
      prev.map((member) =>
        member.id === facultyId
          ? { ...member, assignedSections: member.assignedSections.filter((section) => section !== sectionKey) }
          : member,
      ),
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Faculty</h1>
            <p className="text-muted-foreground">Assign faculty members to course sections and manage teaching loads</p>
          </div>

          <FacultyAssignment
            faculty={faculty}
            sections={mockSections}
            onAssignFaculty={handleAssignFaculty}
            onRemoveFaculty={handleRemoveFaculty}
          />
        </div>
      </main>
    </div>
  )
}
