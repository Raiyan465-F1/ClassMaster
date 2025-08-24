"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { StudentAssignment } from "@/components/student-assignment"

// Mock data
const mockStudents = [
  { id: "1", name: "Alice Johnson", email: "alice@university.edu", enrolledSections: ["CSE201-B", "CSE301-A"] },
  { id: "2", name: "Bob Smith", email: "bob@university.edu", enrolledSections: ["CSE201-A"] },
  { id: "3", name: "Carol Davis", email: "carol@university.edu", enrolledSections: [] },
  { id: "4", name: "David Wilson", email: "david@university.edu", enrolledSections: ["CSE301-A", "CSE401-C"] },
  { id: "5", name: "Eva Brown", email: "eva@university.edu", enrolledSections: ["CSE201-B"] },
]

const mockSections = [
  { courseCode: "CSE201", sectionNumber: "A", courseName: "Database Systems", instructor: "Dr. Smith" },
  { courseCode: "CSE201", sectionNumber: "B", courseName: "Database Systems", instructor: "Prof. Johnson" },
  { courseCode: "CSE301", sectionNumber: "A", courseName: "Data Structures", instructor: "Dr. Williams" },
  { courseCode: "CSE401", sectionNumber: "C", courseName: "Software Engineering", instructor: "Prof. Brown" },
]

export default function AdminStudents() {
  const [students, setStudents] = useState(mockStudents)

  const handleAssignStudent = (studentId: string, sectionKey: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? { ...student, enrolledSections: [...student.enrolledSections, sectionKey] }
          : student,
      ),
    )
  }

  const handleRemoveStudent = (studentId: string, sectionKey: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? { ...student, enrolledSections: student.enrolledSections.filter((section) => section !== sectionKey) }
          : student,
      ),
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Students</h1>
            <p className="text-muted-foreground">Assign students to course sections and manage enrollments</p>
          </div>

          <StudentAssignment
            students={students}
            sections={mockSections}
            onAssignStudent={handleAssignStudent}
            onRemoveStudent={handleRemoveStudent}
          />
        </div>
      </main>
    </div>
  )
}
