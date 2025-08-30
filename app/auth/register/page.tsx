"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { GraduationCap, Eye, EyeOff, Users, UserCheck } from "lucide-react"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student", // Default to student tab
    studentId: "", // Only for students
    facultyId: "", // Only for faculty
    department: "", // Only for faculty
    anonymousName: "" // Optional for leaderboard
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword || !formData.role) {
      toast.error("Please fill in all required fields")
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return false
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return false
    }

    if (formData.role === "student" && !formData.studentId) {
      toast.error("Student ID is required for student registration")
      return false
    }

    if (formData.role === "faculty" && (!formData.facultyId || !formData.department)) {
      toast.error("Faculty ID and Department are required for faculty registration")
      return false
    }

    return true
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock registration - in real app, this would create the user account
      toast.success(`Registration successful! Welcome to ClassMaster, ${formData.fullName}!`)
      
      // Redirect to signin page
      router.push("/auth/signin")
    } catch (error) {
      toast.error("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTabChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      role: value,
      // Clear role-specific fields when switching tabs
      studentId: value === "student" ? prev.studentId : "",
      facultyId: value === "faculty" ? prev.facultyId : "",
      department: value === "faculty" ? prev.department : "",
      anonymousName: value === "student" ? prev.anonymousName : ""
    }))
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <UserCheck className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Join ClassMaster</h1>
          <p className="text-muted-foreground">Create your account to get started</p>
        </div>

                 {/* Register Form */}
         <Card>
           <CardHeader>
             <CardTitle>Create Account</CardTitle>
             <CardDescription>
               Register as a student or faculty member
             </CardDescription>
           </CardHeader>
           <CardContent>
             <Tabs value={formData.role} onValueChange={handleTabChange} className="w-full">
               {/* Role Selection Tabs */}
               <TabsList className="grid w-full grid-cols-2">
                 <TabsTrigger value="student" className="flex items-center space-x-2">
                   <GraduationCap className="h-4 w-4" />
                   <span>Student</span>
                 </TabsTrigger>
                 <TabsTrigger value="faculty" className="flex items-center space-x-2">
                   <Users className="h-4 w-4" />
                   <span>Faculty</span>
                 </TabsTrigger>
               </TabsList>

               {/* Student Registration Form */}
               <TabsContent value="student" className="space-y-4 mt-6">
                 <form onSubmit={handleRegister} className="space-y-4">
                   {/* Full Name */}
                   <div className="space-y-2">
                     <Label htmlFor="fullName">Full Name *</Label>
                     <Input
                       id="fullName"
                       type="text"
                       placeholder="Enter your full name"
                       value={formData.fullName}
                       onChange={(e) => handleInputChange("fullName", e.target.value)}
                       required
                     />
                   </div>

                   {/* Email */}
                   <div className="space-y-2">
                     <Label htmlFor="email">Email *</Label>
                     <Input
                       id="email"
                       type="email"
                       placeholder="Enter your email address"
                       value={formData.email}
                       onChange={(e) => handleInputChange("email", e.target.value)}
                       required
                     />
                   </div>

                   {/* Student ID */}
                   <div className="space-y-2">
                     <Label htmlFor="studentId">Student ID *</Label>
                     <Input
                       id="studentId"
                       type="text"
                       placeholder="Enter your student ID"
                       value={formData.studentId}
                       onChange={(e) => handleInputChange("studentId", e.target.value)}
                       required
                     />
                   </div>

                   {/* Anonymous Name for Leaderboard */}
                   <div className="space-y-2">
                     <Label htmlFor="anonymousName">Anonymous Name (Optional)</Label>
                     <Input
                       id="anonymousName"
                       type="text"
                       placeholder="Choose a name for anonymous leaderboard display"
                       value={formData.anonymousName}
                       onChange={(e) => handleInputChange("anonymousName", e.target.value)}
                     />
                     <p className="text-xs text-muted-foreground">
                       This name will be used when you choose to appear anonymously on leaderboards
                     </p>
                   </div>

                   {/* Password */}
                   <div className="space-y-2">
                     <Label htmlFor="password">Password *</Label>
                     <div className="relative">
                       <Input
                         id="password"
                         type={showPassword ? "text" : "password"}
                         placeholder="Create a password (min. 6 characters)"
                         value={formData.password}
                         onChange={(e) => handleInputChange("password", e.target.value)}
                         required
                       />
                       <Button
                         type="button"
                         variant="ghost"
                         size="sm"
                         className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                         onClick={() => setShowPassword(!showPassword)}
                       >
                         {showPassword ? (
                           <EyeOff className="h-4 w-4 text-muted-foreground" />
                         ) : (
                           <Eye className="h-4 w-4 text-muted-foreground" />
                         )}
                       </Button>
                     </div>
                   </div>

                   {/* Confirm Password */}
                   <div className="space-y-2">
                     <Label htmlFor="confirmPassword">Confirm Password *</Label>
                     <div className="relative">
                       <Input
                         id="confirmPassword"
                         type={showConfirmPassword ? "text" : "password"}
                         placeholder="Confirm your password"
                         value={formData.confirmPassword}
                         onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                         required
                       />
                       <Button
                         type="button"
                         variant="ghost"
                         size="sm"
                         className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                       >
                         {showConfirmPassword ? (
                           <EyeOff className="h-4 w-4 text-muted-foreground" />
                         ) : (
                           <Eye className="h-4 w-4 text-muted-foreground" />
                         )}
                       </Button>
                     </div>
                   </div>

            

                   {/* Register Button */}
                   <Button 
                     type="submit" 
                     className="w-full" 
                     disabled={isLoading}
                   >
                     {isLoading ? "Creating Account..." : "Create Student Account"}
                   </Button>
                 </form>
               </TabsContent>

               {/* Faculty Registration Form */}
               <TabsContent value="faculty" className="space-y-4 mt-6">
                 <form onSubmit={handleRegister} className="space-y-4">
                   {/* Full Name */}
                   <div className="space-y-2">
                     <Label htmlFor="fullName">Full Name *</Label>
                     <Input
                       id="fullName"
                       type="text"
                       placeholder="Enter your full name"
                       value={formData.fullName}
                       onChange={(e) => handleInputChange("fullName", e.target.value)}
                       required
                     />
                   </div>

                   {/* Email */}
                   <div className="space-y-2">
                     <Label htmlFor="email">Email *</Label>
                     <Input
                       id="email"
                       type="email"
                       placeholder="Enter your email address"
                       value={formData.email}
                       onChange={(e) => handleInputChange("email", e.target.value)}
                       required
                     />
                   </div>

                   {/* Faculty ID */}
                   <div className="space-y-2">
                     <Label htmlFor="facultyId">Faculty ID *</Label>
                     <Input
                       id="facultyId"
                       type="text"
                       placeholder="Enter your faculty ID"
                       value={formData.facultyId}
                       onChange={(e) => handleInputChange("facultyId", e.target.value)}
                       required
                     />
                   </div>

                   {/* Department */}
                   <div className="space-y-2">
                     <Label htmlFor="department">Department *</Label>
                     <Input
                       id="department"
                       type="text"
                       placeholder="Enter your department"
                       value={formData.department}
                       onChange={(e) => handleInputChange("department", e.target.value)}
                       required
                     />
                   </div>

                   {/* Password */}
                   <div className="space-y-2">
                     <Label htmlFor="password">Password *</Label>
                     <div className="relative">
                       <Input
                         id="password"
                         type={showPassword ? "text" : "password"}
                         placeholder="Create a password (min. 6 characters)"
                         value={formData.password}
                         onChange={(e) => handleInputChange("password", e.target.value)}
                         required
                       />
                       <Button
                         type="button"
                         variant="ghost"
                         size="sm"
                         className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                         onClick={() => setShowPassword(!showPassword)}
                       >
                         {showPassword ? (
                           <EyeOff className="h-4 w-4 text-muted-foreground" />
                         ) : (
                           <Eye className="h-4 w-4 text-muted-foreground" />
                         )}
                       </Button>
                     </div>
                   </div>

                   {/* Confirm Password */}
                   <div className="space-y-2">
                     <Label htmlFor="confirmPassword">Confirm Password *</Label>
                     <div className="relative">
                       <Input
                         id="confirmPassword"
                         type={showConfirmPassword ? "text" : "password"}
                         placeholder="Confirm your password"
                         value={formData.confirmPassword}
                         onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                         required
                       />
                       <Button
                         type="button"
                         variant="ghost"
                         size="sm"
                         className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                         onClick={() => setShowPassword(!showConfirmPassword)}
                       >
                         {showConfirmPassword ? (
                           <EyeOff className="h-4 w-4 text-muted-foreground" />
                         ) : (
                           <Eye className="h-4 w-4 text-muted-foreground" />
                         )}
                       </Button>
                     </div>
                   </div>


                   {/* Register Button */}
                   <Button 
                     type="submit" 
                     className="w-full" 
                     disabled={isLoading}
                   >
                     {isLoading ? "Creating Account..." : "Create Faculty Account"}
                   </Button>
                 </form>
               </TabsContent>
             </Tabs>

                         {/* Links */}
             <div className="mt-6 text-center space-y-2">
               <p className="text-sm text-muted-foreground">
                 Already have an account?{" "}
                 <Link 
                   href="/auth/signin" 
                   className="text-primary hover:underline font-medium"
                 >
                   Sign in here
                 </Link>
               </p>
               <p className="text-xs text-muted-foreground">
                 Note: Admin accounts are created manually by system administrators
               </p>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
