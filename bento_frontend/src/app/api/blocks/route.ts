import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

// GET - Fetch user's blocks
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const blocks = await prisma.block.findMany({
      where: { userId: session.user.id },
      orderBy: { order: "asc" },
    })

    // Transform to BlockData format
    const blockData = blocks.map((block) => ({
      id: block.id,
      type: block.type,
      title: block.title,
      content: block.content,
      url: block.url,
      imageUrl: block.imageUrl,
      gridX: block.gridX,
      gridY: block.gridY,
      gridWidth: block.gridWidth,
      gridHeight: block.gridHeight,
      backgroundColor: block.backgroundColor,
      textColor: block.textColor,
      borderRadius: block.borderRadius,
      isVisible: block.isVisible,
    }))

    return NextResponse.json(blockData)
  } catch (error) {
    console.error("Error fetching blocks:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - Create a new block
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      type,
      title,
      content,
      url,
      imageUrl,
      gridX = 0,
      gridY = 0,
      gridWidth = 1,
      gridHeight = 1,
      backgroundColor,
      textColor,
      borderRadius,
    } = body

    // Get the highest order number
    const lastBlock = await prisma.block.findFirst({
      where: { userId: session.user.id },
      orderBy: { order: "desc" },
    })

    const newBlock = await prisma.block.create({
      data: {
        userId: session.user.id,
        type,
        title,
        content,
        url,
        imageUrl,
        gridX,
        gridY,
        gridWidth,
        gridHeight,
        backgroundColor,
        textColor,
        borderRadius,
        order: (lastBlock?.order ?? -1) + 1,
      },
    })

    return NextResponse.json(newBlock)
  } catch (error) {
    console.error("Error creating block:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT - Update all blocks (bulk update for drag-and-drop)
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { blocks } = body

    if (!Array.isArray(blocks)) {
      return NextResponse.json(
        { error: "Invalid blocks data" },
        { status: 400 }
      )
    }

    // Delete all existing blocks
    await prisma.block.deleteMany({
      where: { userId: session.user.id },
    })

    // Create new blocks with updated order
    const createdBlocks = await Promise.all(
      blocks.map((block: {
        type: string
        title?: string
        content?: object
        url?: string
        imageUrl?: string
        gridX?: number
        gridY?: number
        gridWidth?: number
        gridHeight?: number
        backgroundColor?: string
        textColor?: string
        borderRadius?: number
        isVisible?: boolean
      }, index: number) =>
        prisma.block.create({
          data: {
            userId: session.user.id as string,
            type: block.type as "LINK" | "TEXT" | "IMAGE" | "MAP" | "SPOTIFY" | "YOUTUBE" | "GITHUB" | "TWITTER" | "INSTAGRAM" | "LINKEDIN" | "CUSTOM",
            title: block.title || null,
            content: block.content ? JSON.parse(JSON.stringify(block.content)) : undefined,
            url: block.url || null,
            imageUrl: block.imageUrl || null,
            gridX: block.gridX ?? 0,
            gridY: block.gridY ?? 0,
            gridWidth: block.gridWidth ?? 1,
            gridHeight: block.gridHeight ?? 1,
            backgroundColor: block.backgroundColor || null,
            textColor: block.textColor || null,
            borderRadius: block.borderRadius || null,
            order: index,
            isVisible: block.isVisible ?? true,
          },
        })
      )
    )

    return NextResponse.json(createdBlocks)
  } catch (error) {
    console.error("Error updating blocks:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a block
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const blockId = searchParams.get("id")

    if (!blockId) {
      return NextResponse.json(
        { error: "Block ID required" },
        { status: 400 }
      )
    }

    // Verify ownership
    const block = await prisma.block.findFirst({
      where: {
        id: blockId,
        userId: session.user.id,
      },
    })

    if (!block) {
      return NextResponse.json(
        { error: "Block not found" },
        { status: 404 }
      )
    }

    await prisma.block.delete({
      where: { id: blockId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting block:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
