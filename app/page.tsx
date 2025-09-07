import { Button } from "@/components/ui/button"
import { LogIn, UserPlus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <Image 
                src="/classMaster.png" 
                alt="ClassMaster Logo" 
                width={32} 
                height={32}
                className="rounded-full"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">ClassMaster</h1>
          <p className="text-muted-foreground">Your unified platform for academic management</p>
        </div>

        {/* Authentication Section */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <Link href="/auth/signin">
              <Button size="lg" className="w-full h-12 text-lg">
                <LogIn className="h-5 w-5 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="outline" size="lg" className="w-full h-12 text-lg">
                <UserPlus className="h-5 w-5 mr-2" />
                Register
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-center text-muted-foreground">
            New users can register as Student or Faculty
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>University Database Management System</p>
        </div>
      </div>
    </div>
  )
}
