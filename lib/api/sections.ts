// API functions for course and section management
const API_BASE_URL = "http://localhost:8000"

// Types for Course operations
export interface Course {
  course_code: string
  course_name: string
}

export interface CreateCourseRequest {
  course_code: string
  course_name: string
}

// Types for Section operations
export interface Section {
  course_code: string
  sec_number: number
  start_time: string
  end_time: string
  day_of_week: string
  location: string
}

export interface CreateSectionRequest {
  course_code: string
  sec_number: number
  start_time: string
  end_time: string
  day_of_week: string
  location: string
}

export interface UpdateSectionRequest extends CreateSectionRequest {}

// Course API functions
export async function getCourses(): Promise<Course[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to fetch courses')
  }
}

export async function createCourse(data: CreateCourseRequest): Promise<Course> {
  try {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      if (response.status === 409) {
        throw new Error('A course with this code already exists.')
      } else if (response.status === 400) {
        throw new Error(errorData.message || 'Invalid course data. Please check your inputs.')
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.')
      } else {
        throw new Error(errorData.message || `Failed to create course: ${response.status} ${response.statusText}`)
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
    throw new Error('Failed to create course')
  }
}

// Section API functions
export async function getSections(): Promise<Section[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/sections`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch sections: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to fetch sections')
  }
}

export async function getSectionsByCourse(courseCode: string): Promise<Section[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/${courseCode}/sections`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch sections for course: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to fetch course sections')
  }
}

export async function createSection(data: CreateSectionRequest): Promise<Section> {
  try {
    const response = await fetch(`${API_BASE_URL}/sections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      if (response.status === 409) {
        throw new Error('A section with this number already exists for this course.')
      } else if (response.status === 400) {
        throw new Error(errorData.message || 'Invalid section data. Please check your inputs.')
      } else if (response.status === 404) {
        throw new Error('Course not found. Please create the course first.')
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.')
      } else {
        throw new Error(errorData.message || `Failed to create section: ${response.status} ${response.statusText}`)
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
    throw new Error('Failed to create section')
  }
}

export async function updateSection(courseCode: string, secNumber: number, data: UpdateSectionRequest): Promise<Section> {
  try {
    const response = await fetch(`${API_BASE_URL}/sections/${courseCode}/${secNumber}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      if (response.status === 404) {
        throw new Error('Section not found.')
      } else if (response.status === 400) {
        throw new Error(errorData.message || 'Invalid section data. Please check your inputs.')
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.')
      } else {
        throw new Error(errorData.message || `Failed to update section: ${response.status} ${response.statusText}`)
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
    throw new Error('Failed to update section')
  }
}

export async function deleteSection(courseCode: string, secNumber: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/sections/${courseCode}/${secNumber}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      if (response.status === 404) {
        throw new Error('Section not found.')
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.')
      } else {
        throw new Error(errorData.message || `Failed to delete section: ${response.status} ${response.statusText}`)
      }
    }
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to delete section')
  }
}
