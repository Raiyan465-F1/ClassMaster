// Dashboard API functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface DashboardTask {
  todo_id: number
  title: string
  status: 'pending' | 'completed' | 'delayed'
  due_date: string
  related_announcement_id: number | null
  announcement_title: string | null
  announcement_content: string | null
  announcement_type: string | null
  announcement_deadline: string | null
  course_code: string | null
  section_number: number | null
}

export interface DashboardCourse {
  course_code: string
  course_name: string
  sec_number: number
  start_time: string
  end_time: string
  day_of_week: string
  location: string
}

export interface DashboardAnnouncement {
  announcement_id: number
  title: string
  content: string
  created_at: string
  type: string
  section_course_code: string
  section_sec_number: number
  faculty_id: number
  deadline: string | null
}

export interface StudentDashboard {
  student_id: number
  pending_tasks: DashboardTask[]
  tasks_due_tomorrow: DashboardTask[]
  enrolled_courses: DashboardCourse[]
  todays_schedule: DashboardCourse[]
  todays_announcements: DashboardAnnouncement[]
  announcements_count_today: number
}

export async function getStudentDashboard(studentId: number): Promise<StudentDashboard> {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${studentId}/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User_ID': studentId.toString(),
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching student dashboard:', error)
    throw error
  }
}
