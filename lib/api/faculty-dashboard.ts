// Faculty Dashboard API types and functions

export interface FacultyDashboardTask {
  todo_id: number
  title: string
  status: "pending" | "completed" | "delayed"
  due_date: string | null
  due_date_display: string | null
  related_announcement_id: number | null
  announcement_title: string | null
  announcement_content: string | null
  announcement_type: string | null
  announcement_deadline: string | null
  course_code: string | null
  section_number: number | null
}

export interface FacultyDashboardCourse {
  course_code: string
  course_name: string
  sec_number: number
  start_time: string
  end_time: string
  day_of_week: string
  location: string
}

export interface FacultyDashboardAnnouncement {
  announcement_id: number
  title: string
  content: string
  created_at: string
  type: string
  section_course_code: string
  section_sec_number: number
  faculty_id: number
  deadline: string
}

export interface WeeklySchedule {
  Monday: FacultyDashboardCourse[]
  Tuesday: FacultyDashboardCourse[]
  Wednesday: FacultyDashboardCourse[]
  Thursday: FacultyDashboardCourse[]
  Friday: FacultyDashboardCourse[]
  Saturday: FacultyDashboardCourse[]
  Sunday: FacultyDashboardCourse[]
}

export interface TaskStatistics {
  total_tasks: number
  pending_tasks: number
  completed_tasks: number
  delayed_tasks: number
  completion_rate: number
}

export interface FacultyDashboard {
  faculty_id: number
  pending_tasks: FacultyDashboardTask[]
  courses_teaching: FacultyDashboardCourse[]
  total_students: number
  hours_this_week: number
  todays_schedule: FacultyDashboardCourse[]
  todays_announcements: FacultyDashboardAnnouncement[]
  announcements_count_today: number
}

export interface TodaysClasses {
  faculty_id: number
  date: string
  day_of_week: string
  classes: FacultyDashboardCourse[]
  total_classes: number
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export async function getFacultyDashboard(facultyId: number): Promise<FacultyDashboard> {
  try {
    const response = await fetch(`${API_BASE_URL}/faculty/${facultyId}/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User_ID': facultyId.toString(),
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch faculty dashboard: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching faculty dashboard:', error)
    throw error
  }
}

export async function getTodaysClasses(facultyId: number): Promise<TodaysClasses> {
  try {
    const response = await fetch(`${API_BASE_URL}/faculty/${facultyId}/todays-classes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User_ID': facultyId.toString(),
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch today's classes: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching today\'s classes:', error)
    throw error
  }
}

export async function getRecentAnnouncements(facultyId: number): Promise<FacultyDashboardAnnouncement[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/faculty/${facultyId}/recent-announcements`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User_ID': facultyId.toString(),
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch recent announcements: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching recent announcements:', error)
    throw error
  }
}
