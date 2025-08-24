"use client"

import { FacultySidebar } from "@/components/faculty-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users } from "lucide-react"

// Mock schedule data for faculty
const mockFacultySchedule = [
  {
    day: "Monday",
    classes: [
      {
        time: "09:00 AM - 10:30 AM",
        course: "Database Systems",
        code: "CSE201",
        section: "B",
        room: "Room 101",
        students: 45,
      },
      {
        time: "02:00 PM - 03:30 PM",
        course: "Data Structures",
        code: "CSE301",
        section: "A",
        room: "Room 205",
        students: 38,
      },
    ],
  },
  {
    day: "Tuesday",
    classes: [
      {
        time: "11:00 AM - 12:30 PM",
        course: "Database Systems",
        code: "CSE201",
        section: "A",
        room: "Room 103",
        students: 42,
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
        students: 45,
      },
      {
        time: "02:00 PM - 03:30 PM",
        course: "Data Structures",
        code: "CSE301",
        section: "A",
        room: "Room 205",
        students: 38,
      },
    ],
  },
  {
    day: "Thursday",
    classes: [
      {
        time: "11:00 AM - 12:30 PM",
        course: "Database Systems",
        code: "CSE201",
        section: "A",
        room: "Room 103",
        students: 42,
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
        students: 45,
      },
    ],
  },
]

export default function FacultySchedule() {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      <FacultySidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Teaching Schedule</h1>
            <p className="text-muted-foreground">Your weekly teaching schedule and class timetable</p>
          </div>

          {/* Schedule Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {mockFacultySchedule.map((day) => (
              <Card key={day.day}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>{day.day}</span>
                  </CardTitle>
                  <CardDescription>{day.classes.length} classes to teach</CardDescription>
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
                              <p className="text-xs text-muted-foreground">Section {classItem.section}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {classItem.code}
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
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Users className="h-3 w-3" />
                              <span>{classItem.students} students</span>
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
                <Users className="h-5 w-5" />
                <span>Teaching Load Overview</span>
              </CardTitle>
              <CardDescription>Summary of your weekly teaching responsibilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-chart-1">12</p>
                  <p className="text-sm text-muted-foreground">Teaching Hours</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-chart-2">2</p>
                  <p className="text-sm text-muted-foreground">Courses</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-chart-4">7</p>
                  <p className="text-sm text-muted-foreground">Classes/Week</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-chart-5">125</p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
