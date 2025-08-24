"use client"

import { StudentSidebar } from "@/components/student-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, BookOpen } from "lucide-react"

// Mock schedule data
const mockSchedule = [
  {
    day: "Monday",
    classes: [
      {
        time: "09:00 AM - 10:30 AM",
        course: "Database Systems",
        code: "CSE201",
        section: "B",
        room: "Room 101",
        instructor: "Prof. Johnson",
      },
      {
        time: "02:00 PM - 03:30 PM",
        course: "Software Engineering",
        code: "CSE401",
        section: "C",
        room: "Room 301",
        instructor: "Prof. Brown",
      },
    ],
  },
  {
    day: "Tuesday",
    classes: [
      {
        time: "11:00 AM - 12:30 PM",
        course: "Data Structures",
        code: "CSE301",
        section: "A",
        room: "Room 205",
        instructor: "Dr. Williams",
      },
    ],
  },
  {
    day: "Wednesday",
    classes: [
      {
        time: "09:00 AM - 10:30 AM",
        course: "Database Systems",
        code: "CSE201",
        section: "B",
        room: "Room 101",
        instructor: "Prof. Johnson",
      },
      {
        time: "11:00 AM - 12:30 PM",
        course: "Data Structures",
        code: "CSE301",
        section: "A",
        room: "Room 205",
        instructor: "Dr. Williams",
      },
    ],
  },
  {
    day: "Thursday",
    classes: [
      {
        time: "02:00 PM - 03:30 PM",
        course: "Software Engineering",
        code: "CSE401",
        section: "C",
        room: "Room 301",
        instructor: "Prof. Brown",
      },
    ],
  },
  {
    day: "Friday",
    classes: [
      {
        time: "09:00 AM - 10:30 AM",
        course: "Database Systems",
        code: "CSE201",
        section: "B",
        room: "Room 101",
        instructor: "Prof. Johnson",
      },
    ],
  },
]

export default function StudentSchedule() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      <StudentSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Class Schedule</h1>
            <p className="text-muted-foreground">Your weekly class schedule and timetable</p>
          </div>

          {/* Schedule Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {mockSchedule.map((day) => (
              <Card key={day.day}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>{day.day}</span>
                  </CardTitle>
                  <CardDescription>{day.classes.length} classes scheduled</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {day.classes.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">No classes scheduled</p>
                    ) : (
                      day.classes.map((classItem, index) => (
                        <div key={index} className="p-3 bg-muted/50 rounded-lg border">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-foreground text-sm">{classItem.course}</h4>
                              <p className="text-xs text-muted-foreground">{classItem.instructor}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {classItem.code}-{classItem.section}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{classItem.time}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{classItem.room}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Weekly Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Weekly Overview</span>
              </CardTitle>
              <CardDescription>Summary of your weekly class schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-chart-1">12</p>
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-chart-2">3</p>
                  <p className="text-sm text-muted-foreground">Courses</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-chart-4">7</p>
                  <p className="text-sm text-muted-foreground">Classes/Week</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-chart-5">3</p>
                  <p className="text-sm text-muted-foreground">Different Rooms</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
