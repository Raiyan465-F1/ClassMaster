"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, BookOpen } from "lucide-react"
import { Schedule, ScheduleItem } from "@/lib/api/schedule"

interface ScheduleViewProps {
  schedule: Schedule
  isLoading?: boolean
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"
]

export function ScheduleView({ schedule, isLoading = false }: ScheduleViewProps) {
  const [selectedDay, setSelectedDay] = useState<string>("Monday")

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getScheduleItemAtTime = (day: string, time: string) => {
    return schedule[day as keyof Schedule]?.find(item => {
      const itemStart = item.start_time.substring(0, 5)
      const itemEnd = item.end_time.substring(0, 5)
      return time >= itemStart && time < itemEnd
    })
  }

  const getItemDuration = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}`)
    const end = new Date(`2000-01-01T${endTime}`)
    const diffMs = end.getTime() - start.getTime()
    const diffMins = Math.round(diffMs / 60000)
    return diffMins
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {DAYS.map((day) => (
          <Card key={day}>
            <CardHeader>
              <CardTitle className="text-lg">{day}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Day Navigation */}
      <div className="flex flex-wrap gap-2">
        {DAYS.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedDay === day
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Selected Day Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {selectedDay} Schedule
          </CardTitle>
          <CardDescription>
            {schedule[selectedDay as keyof Schedule]?.length || 0} classes scheduled
          </CardDescription>
        </CardHeader>
        <CardContent>
          {schedule[selectedDay as keyof Schedule]?.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Classes Scheduled</h3>
              <p className="text-muted-foreground">Enjoy your free time on {selectedDay}!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {schedule[selectedDay as keyof Schedule]
                ?.sort((a, b) => a.start_time.localeCompare(b.start_time))
                .map((item, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">
                          {item.course_code} - {item.course_name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Section {item.sec_number}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {getItemDuration(item.start_time, item.end_time)} min
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {formatTime(item.start_time)} - {formatTime(item.end_time)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
          <CardDescription>Quick view of all scheduled classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DAYS.map((day) => {
              const daySchedule = schedule[day as keyof Schedule]
              const classCount = daySchedule?.length || 0
              
              return (
                <div
                  key={day}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedDay === day
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedDay(day)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{day}</h4>
                    <Badge variant={classCount > 0 ? "default" : "secondary"}>
                      {classCount} {classCount === 1 ? "class" : "classes"}
                    </Badge>
                  </div>
                  
                  {classCount > 0 && (
                    <div className="space-y-1">
                      {daySchedule?.slice(0, 2).map((item, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          {item.course_code} ({formatTime(item.start_time)})
                        </div>
                      ))}
                      {classCount > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{classCount - 2} more classes
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
