/**
 * Authentication utilities for managing user sessions
 */

export interface User {
  user_id: number
  name: string
  email: string
  role: "student" | "faculty" | "admin"
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') {
    return null // Return null during SSR
  }
  
  try {
    const userStr = localStorage.getItem('user')
    if (!userStr) return null
    
    const user = JSON.parse(userStr)
    return user
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error)
    return null
  }
}

/**
 * Set current user in localStorage
 */
export function setCurrentUser(user: User): void {
  if (typeof window === 'undefined') {
    return // Do nothing during SSR
  }
  
  try {
    localStorage.setItem('user', JSON.stringify(user))
  } catch (error) {
    console.error('Error storing user data in localStorage:', error)
  }
}

/**
 * Clear current user from localStorage (logout)
 */
export function clearCurrentUser(): void {
  if (typeof window === 'undefined') {
    return // Do nothing during SSR
  }
  
  try {
    localStorage.removeItem('user')
  } catch (error) {
    console.error('Error clearing user data from localStorage:', error)
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

/**
 * Check if user has specific role
 */
export function hasRole(role: "student" | "faculty" | "admin"): boolean {
  const user = getCurrentUser()
  return user?.role === role
}

/**
 * Get user's display name
 */
export function getUserDisplayName(): string {
  const user = getCurrentUser()
  return user?.name || 'User'
}

/**
 * Get user's role
 */
export function getUserRole(): string | null {
  const user = getCurrentUser()
  return user?.role || null
}
