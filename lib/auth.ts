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
 * Set current user in localStorage and cookies
 */
export function setCurrentUser(user: User): void {
  if (typeof window === 'undefined') {
    return // Do nothing during SSR
  }
  
  try {
    localStorage.setItem('user', JSON.stringify(user))
    
    // Also set cookie for server-side middleware
    document.cookie = `user=${JSON.stringify(user)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
  } catch (error) {
    console.error('Error storing user data:', error)
  }
}

/**
 * Clear current user from localStorage and cookies (logout)
 */
export function clearCurrentUser(): void {
  if (typeof window === 'undefined') {
    return // Do nothing during SSR
  }
  
  try {
    localStorage.removeItem('user')
    
    // Also clear cookie
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  } catch (error) {
    console.error('Error clearing user data:', error)
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
