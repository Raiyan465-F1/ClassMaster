import { AdminSidebar } from "@/components/admin-sidebar"
import { DashboardCard } from "@/components/dashboard-card"
import { Badge } from "@/components/ui/badge"
import { Users, UserCheck, BookOpen, BarChart3, AlertTriangle, TrendingUp } from "lucide-react"

// Mock data for admin dashboard
const mockStats = {
  totalStudents: 1247,
  totalFaculty: 89,
  totalCourses: 156,
  totalSections: 234,
  unassignedStudents: 23,
  unassignedSections: 8,
}

const mockRecentActivity = [
  { action: "Student enrolled in CSE201-B", time: "2 hours ago", type: "enrollment" },
  { action: "Faculty assigned to CSE301-A", time: "4 hours ago", type: "assignment" },
  { action: "New course section created", time: "1 day ago", type: "creation" },
  { action: "Student transferred to different section", time: "2 days ago", type: "transfer" },
]

const mockAlerts = [
  { message: "23 students not assigned to any section", type: "warning", priority: "high" },
  { message: "8 course sections without assigned faculty", type: "error", priority: "high" },
  { message: "Database backup completed successfully", type: "success", priority: "low" },
]

export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">System overview and management tools</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-chart-1 border-chart-1">
                Spring 2024
              </Badge>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card p-4 rounded-lg border">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-chart-1" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{mockStats.totalStudents}</p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-chart-2" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{mockStats.totalFaculty}</p>
                  <p className="text-sm text-muted-foreground">Total Faculty</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-chart-4" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{mockStats.totalCourses}</p>
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                </div>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-chart-5" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{mockStats.totalSections}</p>
                  <p className="text-sm text-muted-foreground">Course Sections</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Alerts */}
            <DashboardCard
              title="System Alerts"
              description="Important notifications and warnings"
              icon={AlertTriangle}
              className="lg:row-span-2"
            >
              <div className="space-y-3">
                {mockAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      alert.type === "error"
                        ? "bg-destructive/10 border-destructive/20"
                        : alert.type === "warning"
                          ? "bg-chart-1/10 border-chart-1/20"
                          : "bg-chart-4/10 border-chart-4/20"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium text-foreground">{alert.message}</p>
                      <Badge
                        variant="outline"
                        className={
                          alert.priority === "high"
                            ? "text-destructive border-destructive"
                            : "text-muted-foreground border-muted"
                        }
                      >
                        {alert.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>

            {/* Quick Actions */}
            <DashboardCard title="Quick Actions" description="Common administrative tasks" icon={TrendingUp}>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-chart-1/10 rounded-lg border border-chart-1/20 text-center">
                  <Users className="h-6 w-6 text-chart-1 mx-auto mb-2" />
                  <p className="text-sm font-medium">Manage Students</p>
                  <p className="text-xs text-muted-foreground">{mockStats.unassignedStudents} unassigned</p>
                </div>
                <div className="p-3 bg-chart-2/10 rounded-lg border border-chart-2/20 text-center">
                  <UserCheck className="h-6 w-6 text-chart-2 mx-auto mb-2" />
                  <p className="text-sm font-medium">Manage Faculty</p>
                  <p className="text-xs text-muted-foreground">{mockStats.unassignedSections} sections need faculty</p>
                </div>
                <div className="p-3 bg-chart-4/10 rounded-lg border border-chart-4/20 text-center">
                  <BookOpen className="h-6 w-6 text-chart-4 mx-auto mb-2" />
                  <p className="text-sm font-medium">Course Sections</p>
                  <p className="text-xs text-muted-foreground">Manage assignments</p>
                </div>
                <div className="p-3 bg-chart-5/10 rounded-lg border border-chart-5/20 text-center">
                  <BarChart3 className="h-6 w-6 text-chart-5 mx-auto mb-2" />
                  <p className="text-sm font-medium">View Reports</p>
                  <p className="text-xs text-muted-foreground">System analytics</p>
                </div>
              </div>
            </DashboardCard>

            {/* Recent Activity */}
            <DashboardCard title="Recent Activity" description="Latest system changes and updates" icon={TrendingUp}>
              <div className="space-y-3">
                {mockRecentActivity.map((activity, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-foreground text-sm">{activity.action}</p>
                    <div className="flex items-center justify-between mt-1">
                      <Badge
                        variant="outline"
                        className={
                          activity.type === "enrollment"
                            ? "text-chart-1 border-chart-1"
                            : activity.type === "assignment"
                              ? "text-chart-2 border-chart-2"
                              : "text-chart-4 border-chart-4"
                        }
                      >
                        {activity.type}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>
        </div>
      </main>
    </div>
  )
}
