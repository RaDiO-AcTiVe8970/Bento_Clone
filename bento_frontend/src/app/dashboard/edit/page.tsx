"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BentoGrid } from "@/components/bento/BentoGrid"
import { BlockData, BlockType } from "@/components/bento/BentoBlock"
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Loader2,
  Link as LinkIcon,
  FileText,
  Image as ImageIcon,
  MapPin,
  Music,
  Youtube,
  Github,
  Twitter,
  Instagram,
  Linkedin,
  X
} from "lucide-react"

const blockTypeOptions: { type: BlockType; icon: React.ReactNode; label: string }[] = [
  { type: "LINK", icon: <LinkIcon className="w-4 h-4" />, label: "Link" },
  { type: "TEXT", icon: <FileText className="w-4 h-4" />, label: "Text" },
  { type: "IMAGE", icon: <ImageIcon className="w-4 h-4" />, label: "Image" },
  { type: "GITHUB", icon: <Github className="w-4 h-4" />, label: "GitHub" },
  { type: "TWITTER", icon: <Twitter className="w-4 h-4" />, label: "Twitter" },
  { type: "INSTAGRAM", icon: <Instagram className="w-4 h-4" />, label: "Instagram" },
  { type: "LINKEDIN", icon: <Linkedin className="w-4 h-4" />, label: "LinkedIn" },
  { type: "SPOTIFY", icon: <Music className="w-4 h-4" />, label: "Spotify" },
  { type: "YOUTUBE", icon: <Youtube className="w-4 h-4" />, label: "YouTube" },
  { type: "MAP", icon: <MapPin className="w-4 h-4" />, label: "Map" },
]

export default function EditProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [blocks, setBlocks] = useState<BlockData[]>([])
  const [showAddBlock, setShowAddBlock] = useState(false)
  const [editingBlock, setEditingBlock] = useState<BlockData | null>(null)
  const [newBlockType, setNewBlockType] = useState<BlockType | null>(null)
  const [newBlockData, setNewBlockData] = useState({
    title: "",
    url: "",
    imageUrl: "",
    text: "",
    location: "",
  })

  const user = session?.user
  const initials = user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?"

  // Fetch blocks on mount
  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const response = await fetch("/api/blocks")
        if (response.ok) {
          const data = await response.json()
          setBlocks(data)
        }
      } catch (error) {
        console.error("Error fetching blocks:", error)
      }
    }
    fetchBlocks()
  }, [])

  const handleBlocksChange = useCallback((newBlocks: BlockData[]) => {
    setBlocks(newBlocks)
  }, [])

  const handleAddBlock = async () => {
    if (!newBlockType) return

    const newBlock: BlockData = {
      id: `temp-${Date.now()}`,
      type: newBlockType,
      title: newBlockData.title || undefined,
      url: newBlockData.url || undefined,
      imageUrl: newBlockData.imageUrl || undefined,
      content: newBlockData.text ? { text: newBlockData.text } : newBlockData.location ? { location: newBlockData.location } : undefined,
      gridX: 0,
      gridY: blocks.length,
      gridWidth: newBlockType === "IMAGE" || newBlockType === "MAP" ? 2 : 1,
      gridHeight: newBlockType === "IMAGE" || newBlockType === "MAP" ? 2 : 1,
      isVisible: true,
    }

    setBlocks([...blocks, newBlock])
    setShowAddBlock(false)
    setNewBlockType(null)
    setNewBlockData({ title: "", url: "", imageUrl: "", text: "", location: "" })
  }

  const handleDeleteBlock = useCallback((id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id))
  }, [blocks])

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/blocks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blocks }),
      })

      if (response.ok) {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error saving blocks:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    router.push("/login")
    return null
  }

  return (
    <main className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <span className="font-semibold">Edit Profile</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowAddBlock(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Block
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save
            </Button>
            <Avatar className="w-9 h-9">
              <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {blocks.length > 0 ? (
          <BentoGrid
            blocks={blocks}
            isEditing={true}
            onBlocksChange={handleBlocksChange}
            onBlockEdit={setEditingBlock}
            onBlockDelete={handleDeleteBlock}
            columns={4}
            gap={4}
          />
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">
              No blocks yet. Add your first block to get started!
            </p>
            <Button onClick={() => setShowAddBlock(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Block
            </Button>
          </div>
        )}
      </div>

      {/* Add Block Modal */}
      {showAddBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add Block</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    setShowAddBlock(false)
                    setNewBlockType(null)
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription>
                Choose a block type to add to your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!newBlockType ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {blockTypeOptions.map((option) => (
                    <button
                      key={option.type}
                      onClick={() => setNewBlockType(option.type)}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      {option.icon}
                      <span className="text-sm">{option.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setNewBlockType(null)}
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Back
                    </Button>
                    <span className="font-medium">
                      {blockTypeOptions.find((o) => o.type === newBlockType)?.label}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        value={newBlockData.title}
                        onChange={(e) => setNewBlockData({ ...newBlockData, title: e.target.value })}
                        placeholder="Block title"
                      />
                    </div>

                    {["LINK", "GITHUB", "TWITTER", "INSTAGRAM", "LINKEDIN", "SPOTIFY", "YOUTUBE"].includes(newBlockType) && (
                      <div>
                        <label className="text-sm font-medium">URL</label>
                        <Input
                          value={newBlockData.url}
                          onChange={(e) => setNewBlockData({ ...newBlockData, url: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                    )}

                    {["LINK", "IMAGE"].includes(newBlockType) && (
                      <div>
                        <label className="text-sm font-medium">Image URL</label>
                        <Input
                          value={newBlockData.imageUrl}
                          onChange={(e) => setNewBlockData({ ...newBlockData, imageUrl: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                    )}

                    {newBlockType === "TEXT" && (
                      <div>
                        <label className="text-sm font-medium">Text</label>
                        <textarea
                          value={newBlockData.text}
                          onChange={(e) => setNewBlockData({ ...newBlockData, text: e.target.value })}
                          placeholder="Enter your text..."
                          className="flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                        />
                      </div>
                    )}

                    {newBlockType === "MAP" && (
                      <div>
                        <label className="text-sm font-medium">Location</label>
                        <Input
                          value={newBlockData.location}
                          onChange={(e) => setNewBlockData({ ...newBlockData, location: e.target.value })}
                          placeholder="City, Country"
                        />
                      </div>
                    )}
                  </div>

                  <Button onClick={handleAddBlock} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Block
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
}
