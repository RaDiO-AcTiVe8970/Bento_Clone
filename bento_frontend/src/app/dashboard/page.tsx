import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Settings, Eye, BarChart3, ExternalLink } from "lucide-react"
import { ProfileLinkDisplay } from "@/components/dashboard/ProfileLinkDisplay"
import { ImportSection } from "@/components/dashboard/ImportSection"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  const user = session.user
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?"

  return (
    <main className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-gradient">
            Bento
          </Link>
          
          <div className="flex items-center gap-4">
            {user.username && (
              <Link href={`/${user.username}`} target="_blank">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
              </Link>
            )}
            <Link href="/dashboard/settings">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
            <Avatar className="w-9 h-9">
              <AvatarImage src={user.image || ""} alt={user.name || ""} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user.name?.split(" ")[0] || "there"}! 👋
          </h1>
          <p className="text-muted-foreground">
            Manage your Bento profile and customize your blocks.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Link href="/dashboard/edit">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                  <Plus className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>
                  Add, remove, or rearrange your blocks
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/settings">
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Update your profile info and preferences
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <ImportSection />

          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full opacity-60">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Coming soon - Track your profile views
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Profile Preview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Bento Link</CardTitle>
                <CardDescription>
                  Share this link with your audience
                </CardDescription>
              </div>
              {user.username && (
                <Link href={`/${user.username}`} target="_blank">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open
                  </Button>
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {user.username ? (
              <ProfileLinkDisplay username={user.username} />
            ) : (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-4">
                  You haven&apos;t set a username yet. Set one to get your custom Bento link!
                </p>
                <Link href="/dashboard/settings">
                  <Button size="sm">Set Username</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
