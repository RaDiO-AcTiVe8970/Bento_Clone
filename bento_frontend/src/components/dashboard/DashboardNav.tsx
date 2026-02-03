"use client"
// dashboard navigation bar component
import { signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings, Eye, LogOut, Home, ExternalLink, LayoutDashboard } from "lucide-react"

interface User {
  id?: string
  name?: string | null
  email?: string | null
  image?: string | null
  username?: string | null
}

interface DashboardNavProps {
  user: User
}

export function DashboardNav({ user }: DashboardNavProps) {
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?"

  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-2xl text-gradient">
          BentoPortfolio
        </Link>
        
        <div className="flex items-center gap-3">
          {user.username && (
            <Link href={`/${user.username}`} target="_blank">
              <Button variant="ghost" size="sm" className="gap-2">
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">View Profile</span>
              </Button>
            </Link>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary/50 transition-colors">
                  <AvatarImage src={user.image || ""} alt={user.name || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  {user.name && (
                    <p className="font-medium">{user.name}</p>
                  )}
                  {user.email && (
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/" className="cursor-pointer">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              {user.username && (
                <DropdownMenuItem asChild>
                  <Link href={`/${user.username}`} target="_blank" className="cursor-pointer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Profile
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
