import { notFound } from "next/navigation"
import { Metadata } from "next"
import prisma from "@/lib/prisma"
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { BentoGrid } from "@/components/bento/BentoGrid"
import { BlockData } from "@/components/bento/BentoBlock"
import Link from "next/link"

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params
  
  const user = await prisma.user.findUnique({
    where: { username },
    select: { name: true, bio: true, image: true, username: true },
  })

  if (!user) {
    return {
      title: "Profile Not Found",
    }
  }

  return {
    title: `${user.name || user.username} | Bento`,
    description: user.bio || `Check out ${user.name || user.username}'s Bento profile`,
    openGraph: {
      title: `${user.name || user.username} | Bento`,
      description: user.bio || `Check out ${user.name || user.username}'s Bento profile`,
      images: user.image ? [{ url: user.image }] : [],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${user.name || user.username} | Bento`,
      description: user.bio || `Check out ${user.name || user.username}'s Bento profile`,
    },
  }
}

// Static generation for known profiles (optional)
export async function generateStaticParams() {
  const users = await prisma.user.findMany({
    where: { username: { not: null } },
    select: { username: true },
    take: 100, // Limit for build time
  })

  return users
    .filter((user: { username: string | null }) => user.username)
    .map((user: { username: string | null }) => ({
      username: user.username as string,
    }))
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      blocks: {
        where: { isVisible: true },
        orderBy: { order: "asc" },
      },
      socialLinks: {
        where: { isVisible: true },
        orderBy: { order: "asc" },
      },
    },
  })

  if (!user) {
    notFound()
  }

  // Transform blocks to BlockData format
  const blocks: BlockData[] = user.blocks.map((block: any) => ({
    id: block.id,
    type: block.type,
    title: block.title || undefined,
    content: block.content as Record<string, unknown> | undefined,
    url: block.url || undefined,
    imageUrl: block.imageUrl || undefined,
    gridX: block.gridX,
    gridY: block.gridY,
    gridWidth: block.gridWidth,
    gridHeight: block.gridHeight,
    backgroundColor: block.backgroundColor || undefined,
    textColor: block.textColor || undefined,
    borderRadius: block.borderRadius || undefined,
    isVisible: block.isVisible,
  }))

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 mesh-gradient" />
      <div className="fixed inset-0 noise pointer-events-none" />
      
      {/* Animated gradient orbs */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[120px] animate-float" />
      <div className="fixed top-1/3 right-0 w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-[120px] animate-float animation-delay-200" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/20 rounded-full blur-[100px] animate-float animation-delay-400" />
      <div className="fixed bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[80px] animate-float animation-delay-600" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 glass-strong border-b border-white/10">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl text-gradient">
              Bento
            </Link>
            <Link 
              href="/login" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Create yours →
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 md:py-12">
          <ProfileHeader
            name={user.name || ""}
            username={user.username || ""}
            bio={user.bio || undefined}
            location={user.location || undefined}
            avatarUrl={user.image || undefined}
          />

          {blocks.length > 0 ? (
            <div className="animate-slide-up animation-delay-400">
              <BentoGrid blocks={blocks} columns={4} gap={4} />
            </div>
          ) : (
            <div className="text-center py-20 animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-6">
                <span className="text-4xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">No blocks yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                This profile is being set up. Check back soon for amazing content!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="relative z-10 py-8 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Made with <span className="text-gradient font-semibold">Bento</span>
          </Link>
        </footer>
      </div>
    </main>
  )
}
