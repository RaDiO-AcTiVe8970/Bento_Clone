import { notFound } from "next/navigation"
import { Metadata } from "next"
import prisma from "@/lib/prisma"
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { BentoGrid } from "@/components/bento/BentoGrid"
import { BlockData } from "@/components/bento/BentoBlock"

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
    .filter((user) => user.username)
    .map((user) => ({
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
  const blocks: BlockData[] = user.blocks.map((block) => ({
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
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <ProfileHeader
          name={user.name || ""}
          username={user.username || ""}
          bio={user.bio || undefined}
          location={user.location || undefined}
          avatarUrl={user.image || undefined}
        />

        {blocks.length > 0 ? (
          <BentoGrid blocks={blocks} columns={4} gap={4} />
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              This profile doesn&apos;t have any blocks yet.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
