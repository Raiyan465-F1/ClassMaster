import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminSettings() {
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold text-foreground mb-4">System Settings</h1>
        <p className="text-muted-foreground">System settings will be built in upcoming tasks.</p>
      </main>
    </div>
  )
}
