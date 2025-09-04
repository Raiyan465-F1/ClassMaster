"use client"

import { useState, useEffect } from "react"
import { StudentSidebar } from "@/components/student-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, BookOpen, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { getSchedule, type Schedule } from "@/lib/api/schedule"
import { getCurrentUser } from "@/lib/auth"

export default function StudentSchedule() {
  const [schedule, setSchedule] = useState<Schedule | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
  }, [])

  useEffect(() => {
    if (user) {
      loadSchedule()
    }
  }, [user])

  const loadSchedule = async () => {
    setIsLoading(true)
    try {
      const scheduleData = await getSchedule(user.user_id, "student")
      setSchedule(scheduleData.schedule)
    } catch (error) {
      console.error('Failed to load schedule:', error)
      toast.error('Failed to load schedule')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    loadSchedule()
  }

  if (!user) {
    return (
      <div className="flex h-screen bg-background">
        <StudentSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading user information...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Schedule</h1>
              <p className="text-muted-foreground">View your weekly class schedule</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Schedule Stats */}
          {schedule && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Object.values(schedule).reduce((total, day) => total + day.length, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This week
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Busiest Day</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Object.entries(schedule).reduce((busiest, [day, classes]) => 
                      classes.length > busiest.count ? { day, count: classes.length } : busiest
                    , { day: "None", count: 0 }).day}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Most classes scheduled
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Free Days</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Object.values(schedule).filter(day => day.length === 0).length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    No classes scheduled
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Schedule Grid */}
          {schedule ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {Object.entries(schedule).map(([day, classes]) => (
                <Card key={day}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span>{day}</span>
                    </CardTitle>
                    <CardDescription>{classes.length} classes scheduled</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {classes.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No classes scheduled</p>
                      ) : (
                        classes
                          .sort((a: any, b: any) => a.start_time.localeCompare(b.start_time))
                          .map((classItem: any, index: number) => (
                            <div key={index} className="p-3 bg-muted/50 rounded-lg border">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold text-foreground text-sm">{classItem.course_name}</h4>
                                  <p className="text-xs text-muted-foreground">Section {classItem.sec_number}</p>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {classItem.course_code}
                                </Badge>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    {new Date(`2000-01-01T${classItem.start_time}`).toLocaleTimeString('en-US', {
                                      hour: 'numeric',
                                      minute: '2-digit',
                                      hour12: true
                                    })} - {new Date(`2000-01-01T${classItem.end_time}`).toLocaleTimeString('en-US', {
                                      hour: 'numeric',
                                      minute: '2-digit',
                                      hour12: true
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  <span>{classItem.location}</span>
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
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Schedule Available</CardTitle>
                <CardDescription>
                  Your schedule information could not be loaded.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Unable to load your schedule at this time.
                  </p>
                  <button
                    onClick={handleRefresh}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    Try Again
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Weekly Overview */}
          {schedule && (
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
                    <p className="text-2xl font-bold text-chart-1">
                      {Object.values(schedule).reduce((total, day) => total + day.length, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Classes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-chart-2">
                      {new Set(Object.values(schedule).flat().map((cls: any) => `${cls.course_code}-${cls.sec_number}`)).size}
                    </p>
                    <p className="text-sm text-muted-foreground">Courses</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-chart-4">
                      {Object.values(schedule).filter(day => day.length > 0).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Active Days</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-chart-5">
                      {new Set(Object.values(schedule).flat().map((cls: any) => cls.location)).size}
                    </p>
                    <p className="text-sm text-muted-foreground">Different Rooms</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
