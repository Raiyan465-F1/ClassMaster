// API functions for announcement management
import { getCurrentUser } from '@/lib/auth'

const API_BASE_URL = "http://localhost:8000"

// Types for Announcement operations
export interface CreateAnnouncementRequest {
  title: string
  content: string
  type: "quiz" | "assignment" | "general"
  course_code: string
  sec_number: number
  deadline?: string
}

export interface Announcement {
  announcement_id: number
  title: string
  content: string
  created_at: string
  type: "quiz" | "assignment" | "general"
  section_course_code: string
  section_sec_number: number
  faculty_id: number
  deadline?: string
}

// Create announcement API function
export async function createAnnouncement(data: CreateAnnouncementRequest): Promise<Announcement> {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      throw new Error('User not authenticated. Please log in again.')
    }

    if (currentUser.role !== 'faculty') {
      throw new Error('Only faculty users can create announcements.')
    }

    // Validate deadline requirement for quiz and assignment types
    if ((data.type === 'quiz' || data.type === 'assignment') && !data.deadline) {
      throw new Error(`Deadline is required for ${data.type} announcements.`)
    }

    const response = await fetch(`${API_BASE_URL}/create-announcement`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User_ID': currentUser.user_id.toString(),
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      if (response.status === 400) {
        throw new Error(errorData.detail || 'Invalid announcement data. Please check your inputs.')
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.')
      } else {
        throw new Error(errorData.detail || `Failed to create announcement: ${response.status} ${response.statusText}`)
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
    throw new Error('Failed to create announcement')
  }
}
