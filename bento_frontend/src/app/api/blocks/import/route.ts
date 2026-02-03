import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ParsedBentoData, ParsedBlock } from "@/lib/bento-parser"

// Map parser block types to Prisma enum
const toPrismaBlockType = (type: string): string => {
  const typeMap: Record<string, string> = {
    'LINK': 'LINK',
    'TEXT': 'TEXT',
    'IMAGE': 'IMAGE',
    'MAP': 'MAP',
    'SPOTIFY': 'SPOTIFY',
    'YOUTUBE': 'YOUTUBE',
    'GITHUB': 'GITHUB',
    'TWITTER': 'TWITTER',
    'INSTAGRAM': 'INSTAGRAM',
    'LINKEDIN': 'LINKEDIN',
    'CUSTOM': 'CUSTOM',
  }
  return typeMap[type] || 'LINK'
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data: ParsedBentoData = await request.json()

    // Validate the data
    if (!data || !Array.isArray(data.blocks)) {
      return NextResponse.json(
        { error: "Invalid import data format" },
        { status: 400 }
      )
    }

    // Get the user's current max order
    const existingBlocks = await prisma.block.findMany({
      where: { userId: session.user.id },
      orderBy: { order: 'desc' },
      take: 1,
    })
    
    let startOrder = existingBlocks.length > 0 ? existingBlocks[0].order + 1 : 0

    // Create blocks from imported data
    const createdBlocks = await prisma.$transaction(
      data.blocks.map((block: ParsedBlock, index: number) => {
        return prisma.block.create({
          data: {
            userId: session.user.id,
            type: toPrismaBlockType(block.type) as any,
            title: block.title || `Imported Block ${index + 1}`,
            content: block.content ? JSON.parse(JSON.stringify(block.content)) : null,
            url: block.url,
            imageUrl: block.imageUrl,
            gridX: block.gridX,
            gridY: block.gridY,
            gridWidth: Math.min(Math.max(block.gridWidth, 1), 4), // Clamp between 1-4
            gridHeight: Math.min(Math.max(block.gridHeight, 1), 4),
            order: startOrder + index,
            backgroundColor: block.backgroundColor,
            textColor: block.textColor,
            borderRadius: block.borderRadius,
          },
        })
      })
    )

    // Optionally update user profile if provided
    if (data.profile) {
      const profileUpdates: Record<string, string | null> = {}
      
      if (data.profile.name && !session.user.name) {
        profileUpdates.name = data.profile.name
      }
      if (data.profile.bio) {
        profileUpdates.bio = data.profile.bio
      }
      if (data.profile.avatar && !session.user.image) {
        profileUpdates.image = data.profile.avatar
      }
      if (data.profile.location) {
        profileUpdates.location = data.profile.location
      }

      if (Object.keys(profileUpdates).length > 0) {
        await prisma.user.update({
          where: { id: session.user.id },
          data: profileUpdates,
        })
      }
    }

    return NextResponse.json({
      success: true,
      imported: createdBlocks.length,
      blocks: createdBlocks,
    })
  } catch (error) {
    console.error("Import error:", error)
    return NextResponse.json(
      { error: "Failed to import blocks" },
      { status: 500 }
    )
  }
}
