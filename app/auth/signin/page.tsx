"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { loginUser, type LoginRequest } from "@/lib/api"
import { setCurrentUser } from "@/lib/auth"

export default function SignInPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    id: "",
    password: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.id || !formData.password) {
      toast.error("Please fill in all fields")
      return
    }

    // Validate that ID is a number
    const userId = parseInt(formData.id)
    if (isNaN(userId)) {
      toast.error("Please enter a numeric User ID (e.g., 2024001, 123). Email addresses are not supported for login.")
      return
    }

    setIsLoading(true)
    
    try {
      // Prepare API request data
      const loginData: LoginRequest = {
        user_id: userId,
        password: formData.password
      }

             // Call login API
       const response = await loginUser(loginData)
       
       // Store user data in localStorage for session management
       setCurrentUser(response)
       
       toast.success(`Welcome back, ${response.name}!`)
       
       // Redirect based on role returned from backend
       switch (response.role) {
         case "student":
           router.push("/student")
           break
         case "faculty":
           router.push("/faculty")
           break
         case "admin":
           router.push("/admin/sections")
           break
         default:
           toast.error("Unable to determine user role")
       }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Sign in failed. Please try again."
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your ClassMaster account</p>
        </div>

        {/* Sign In Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* User ID */}
              <div className="space-y-2">
                <Label htmlFor="id">User ID</Label>
                <Input
                  id="id"
                  type="number"
                  placeholder="Enter your numeric User ID (e.g., 2024001, 123)"
                  value={formData.id}
                  onChange={(e) => handleInputChange("id", e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter your numeric User ID (not email). Your role will be automatically determined from your ID.
                </p>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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

              {/* Sign In Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link 
                  href="/auth/register" 
                  className="text-primary hover:underline font-medium"
                >
                  Register here
                </Link>
              </p>
              <p className="text-xs text-muted-foreground">
                Students and Faculty can register • Admin accounts are created manually
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Portal Selection */}
        <div className="text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Portal Selection
          </Link>
        </div>
      </div>
    </div>
  )
}
