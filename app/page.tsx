import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Users, Shield } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
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
          <h1 className="text-3xl font-bold text-foreground">EduPortal</h1>
          <p className="text-muted-foreground">Your unified platform for academic management</p>
        </div>

        {/* Portal Selection Cards */}
        <div className="space-y-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link href="/student" className="block">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-chart-1/10 rounded-full group-hover:bg-chart-1/20 transition-colors">
                    <GraduationCap className="h-6 w-6 text-chart-1" />
                  </div>
                </div>
                <CardTitle className="text-lg">Student Portal</CardTitle>
                <CardDescription>Access your classes, grades, and assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-chart-1 hover:bg-chart-1/90 text-background">Enter as Student</Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link href="/faculty" className="block">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-chart-2/10 rounded-full group-hover:bg-chart-2/20 transition-colors">
                    <Users className="h-6 w-6 text-chart-2" />
                  </div>
                </div>
                <CardTitle className="text-lg">Faculty Portal</CardTitle>
                <CardDescription>Manage courses, grades, and announcements</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-chart-2 hover:bg-chart-2/90 text-background">Enter as Faculty</Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <Link href="/admin" className="block">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-chart-3/10 rounded-full group-hover:bg-chart-3/20 transition-colors">
                    <Shield className="h-6 w-6 text-chart-3" />
                  </div>
                </div>
                <CardTitle className="text-lg">Admin Portal</CardTitle>
                <CardDescription>Manage users and system administration</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-chart-3 hover:bg-chart-3/90 text-background">Enter as Admin</Button>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>University Database Management System</p>
        </div>
      </div>
    </div>
  )
}
