"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface MobileNavProps {
  items: NavItem[]
  title: string
  icon: React.ComponentType<{ className?: string }>
}

export function MobileNav({ items, title, icon: Icon }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="text-sidebar-foreground">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-sidebar border-sidebar-border">
          <SheetHeader className="border-b border-sidebar-border pb-4">
            <SheetTitle className="flex items-center space-x-2 text-sidebar-foreground">
              <Icon className="h-6 w-6 text-sidebar-primary" />
              <span>{title}</span>
            </SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col space-y-2 mt-6">
            {items.map((item) => {
              const ItemIcon = item.icon
              const isActive = pathname === item.href

              return (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <ItemIcon className="h-4 w-4 mr-2" />
                    {item.title}
                  </Button>
                </Link>
              )
            })}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <Link href="/" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full bg-transparent">
                ← Back to Login
              </Button>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
