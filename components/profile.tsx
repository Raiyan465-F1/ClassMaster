"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, IdCard, Building } from "lucide-react"
import { getCurrentUser, type User as UserType } from "@/lib/auth"

export function Profile() {
  const [user, setUser] = useState<UserType | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
  }, [])



  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No user data found. Please log in again.</p>
      </div>
    )
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Building className="h-5 w-5" />
      case 'student':
        return <User className="h-5 w-5" />
      case 'faculty':
        return <User className="h-5 w-5" />
      default:
        return <User className="h-5 w-5" />
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator'
      case 'student':
        return 'Student'
      case 'faculty':
        return 'Faculty Member'
      default:
        return role
    }
  }

  const getIdLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin ID'
      case 'student':
        return 'Student ID'
      case 'faculty':
        return 'Faculty ID'
      default:
        return 'User ID'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'student':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'faculty':
        return 'text-green-600 bg-green-50 border-green-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your account details and preferences</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Role Badge */}
          <div className="flex items-center space-x-2">
            <Label className="text-sm font-medium">Role:</Label>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getRoleColor(user.role)}`}>
              {getRoleIcon(user.role)}
              <span className="text-sm font-medium">{getRoleLabel(user.role)}</span>
            </div>
          </div>

          {/* Role-specific ID */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <IdCard className="h-4 w-4" />
              <span>{getIdLabel(user.role)}</span>
            </Label>
            <Input
              value={user.user_id.toString()}
              readOnly
            />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Full Name</span>
            </Label>
            <Input
              value={user.name}
              readOnly
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Email Address</span>
            </Label>
            <Input
              value={user.email}
                readOnly              
            />
          </div>

          {/* Account Info */}
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Account Information</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Your profile data is stored locally in your browser</p>
              <p>• Changes will only affect your local session</p>
              <p>• Contact your administrator for permanent account changes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
