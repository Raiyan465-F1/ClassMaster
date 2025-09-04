// API functions for schedule management
import { getCurrentUser } from '@/lib/auth'

const API_BASE_URL = "http://localhost:8000"

// Types for Schedule operations
export interface ScheduleRequest {
  user_id: number
  role: "student" | "faculty"
}

export interface ScheduleItem {
  course_code: string
  course_name: string
  sec_number: number
  start_time: string
  end_time: string
  location: string
}

export interface Schedule {
  Monday: ScheduleItem[]
  Tuesday: ScheduleItem[]
  Wednesday: ScheduleItem[]
  Thursday: ScheduleItem[]
  Friday: ScheduleItem[]
  Saturday: ScheduleItem[]
  Sunday: ScheduleItem[]
}

export interface ScheduleResponse {
  user_id: number
  role: "student" | "faculty"
  schedule: Schedule
}

// Get schedule for a user
export async function getSchedule(userId: number, role: "student" | "faculty"): Promise<ScheduleResponse> {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      throw new Error('User not authenticated. Please log in again.')
    }

    const response = await fetch(`${API_BASE_URL}/schedule/${userId}`, {
      method: 'GET',
      headers: {
        'X-User_ID': currentUser.user_id.toString(),
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      if (response.status === 404) {
        throw new Error('Schedule not found.')
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.')
      } else {
        throw new Error(errorData.detail || `Failed to fetch schedule: ${response.status} ${response.statusText}`)
      }
    }

    return await response.json()
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to fetch schedule')
  }
}
