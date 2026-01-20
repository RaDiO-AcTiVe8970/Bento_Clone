import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Settings, Eye, BarChart3, ExternalLink, Sparkles, Pencil, Upload } from "lucide-react"
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
    <main className="min-h-screen mesh-gradient noise">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-strong border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-2xl text-gradient">
            Bento
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
            <Link href="/dashboard/settings">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
            <Avatar className="w-10 h-10 border-2 border-primary/20">
              <AvatarImage src={user.image || ""} alt={user.name || ""} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Welcome Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold">
              Welcome back, {user.name?.split(" ")[0] || "there"}!
            </h1>
            <span className="text-3xl">👋</span>
          </div>
          <p className="text-lg text-muted-foreground">
            Manage your Bento profile and customize your blocks.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Edit Profile Card */}
          <Link href="/dashboard/edit" className="group">
            <div className="relative h-full bg-card rounded-2xl border border-border p-6 card-hover-glow overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/25">
                  <Pencil className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Edit Profile</h3>
                <p className="text-muted-foreground">
                  Add, remove, or rearrange your blocks
                </p>
              </div>
            </div>
          </Link>

          {/* Settings Card */}
          <Link href="/dashboard/settings" className="group">
            <div className="relative h-full bg-card rounded-2xl border border-border p-6 card-hover-glow overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/25">
                  <Settings className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Settings</h3>
                <p className="text-muted-foreground">
                  Update your profile info and preferences
                </p>
              </div>
            </div>
          </Link>

          {/* Import Section */}
          <div className="group">
            <div className="relative h-full bg-card rounded-2xl border border-border p-6 card-hover-glow overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/25">
                  <Upload className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Import</h3>
                <p className="text-muted-foreground mb-4">
                  Import from Bento.me
                </p>
                <ImportSection />
              </div>
            </div>
          </div>

          {/* Analytics Card */}
          <div className="group opacity-60 cursor-not-allowed">
            <div className="relative h-full bg-card rounded-2xl border border-border p-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-2xl" />
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4 shadow-lg shadow-green-500/25">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Analytics</h3>
                <p className="text-muted-foreground">
                  Coming soon - Track your profile views
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Link Card */}
        <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Your Bento Link
              </h2>
              <p className="text-muted-foreground">
                Share this link with your audience
              </p>
            </div>
            {user.username && (
              <Link href={`/${user.username}`} target="_blank">
                <Button className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0">
                  <ExternalLink className="w-4 h-4" />
                  Open Profile
                </Button>
              </Link>
            )}
          </div>
          
          {user.username ? (
            <ProfileLinkDisplay username={user.username} />
          ) : (
            <div className="p-6 bg-muted/50 rounded-xl border border-dashed border-border">
              <p className="text-muted-foreground mb-4">
                You haven&apos;t set a username yet. Set one to get your custom Bento link!
              </p>
              <Link href="/dashboard/settings">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0">
                  Set Username
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
