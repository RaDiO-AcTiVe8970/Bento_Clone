"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BlockData, BlockType } from "./BentoBlock"
import { cn } from "@/lib/utils"
import { 
  X, 
  Check, 
  Trash2,
  Grid2X2,
  RectangleHorizontal,
  RectangleVertical,
  Square,
  Maximize2
} from "lucide-react"

interface BlockEditorProps {
  block: BlockData
  onSave: (block: BlockData) => void
  onDelete: (id: string) => void
  onClose: () => void
}

// Size presets for different block types
type SizePreset = {
  name: string
  icon: React.ReactNode
  gridWidth: number
  gridHeight: number
  description: string
}

const sizePresets: SizePreset[] = [
  { 
    name: "Small", 
    icon: <Square className="w-4 h-4" />, 
    gridWidth: 1, 
    gridHeight: 1,
    description: "1×1 - Icon & title only"
  },
  { 
    name: "Wide", 
    icon: <RectangleHorizontal className="w-4 h-4" />, 
    gridWidth: 2, 
    gridHeight: 1,
    description: "2×1 - Compact preview"
  },
  { 
    name: "Tall", 
    icon: <RectangleVertical className="w-4 h-4" />, 
    gridWidth: 1, 
    gridHeight: 2,
    description: "1×2 - Vertical layout"
  },
  { 
    name: "Medium", 
    icon: <Grid2X2 className="w-4 h-4" />, 
    gridWidth: 2, 
    gridHeight: 2,
    description: "2×2 - Rich embed"
  },
  { 
    name: "Large", 
    icon: <Maximize2 className="w-4 h-4" />, 
    gridWidth: 3, 
    gridHeight: 2,
    description: "3×2 - Full embed"
  },
]

// Get recommended sizes based on block type
function getRecommendedSizes(type: BlockType): SizePreset[] {
  switch (type) {
    case "YOUTUBE":
    case "SPOTIFY":
    case "MAP":
      return sizePresets // All sizes available
    case "IMAGE":
      return sizePresets.filter(s => s.gridWidth >= 1)
    case "TEXT":
      return sizePresets.filter(s => s.name !== "Small")
    case "LINK":
    case "GITHUB":
    case "TWITTER":
    case "INSTAGRAM":
    case "LINKEDIN":
      return sizePresets
    default:
      return sizePresets
  }
}

// Visual preview of block size
function SizePreview({ width, height, isSelected }: { width: number; height: number; isSelected: boolean }) {
  return (
    <div className="w-16 h-16 grid grid-cols-4 grid-rows-4 gap-0.5">
      {Array.from({ length: 16 }).map((_, i) => {
        const row = Math.floor(i / 4)
        const col = i % 4
        const isActive = col < width && row < height
        return (
          <div
            key={i}
            className={cn(
              "rounded-sm transition-colors",
              isActive 
                ? isSelected 
                  ? "bg-primary" 
                  : "bg-primary/60"
                : "bg-muted/50"
            )}
          />
        )
      })}
    </div>
  )
}

export function BlockEditor({ block, onSave, onDelete, onClose }: BlockEditorProps) {
  const [editedBlock, setEditedBlock] = useState<BlockData>(block)
  const [customSize, setCustomSize] = useState(false)
  
  const recommendedSizes = getRecommendedSizes(block.type)
  
  const currentPreset = sizePresets.find(
    p => p.gridWidth === editedBlock.gridWidth && p.gridHeight === editedBlock.gridHeight
  )

  const handleSizeChange = (preset: SizePreset) => {
    setEditedBlock({
      ...editedBlock,
      gridWidth: preset.gridWidth,
      gridHeight: preset.gridHeight,
    })
    setCustomSize(false)
  }

  const handleCustomSizeChange = (dimension: "width" | "height", value: number) => {
    setCustomSize(true)
    setEditedBlock({
      ...editedBlock,
      [dimension === "width" ? "gridWidth" : "gridHeight"]: Math.max(1, Math.min(4, value)),
    })
  }

  const handleSave = () => {
    onSave(editedBlock)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="w-full max-w-xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Edit Block</CardTitle>
              <CardDescription className="mt-1">
                Customize your {block.type.toLowerCase()} block
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Block Properties */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Content
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Title</label>
                <Input
                  value={editedBlock.title || ""}
                  onChange={(e) => setEditedBlock({ ...editedBlock, title: e.target.value })}
                  placeholder="Block title"
                />
              </div>

              {["LINK", "GITHUB", "TWITTER", "INSTAGRAM", "LINKEDIN", "SPOTIFY", "YOUTUBE"].includes(block.type) && (
                <div>
                  <label className="text-sm font-medium mb-1.5 block">URL</label>
                  <Input
                    value={editedBlock.url || ""}
                    onChange={(e) => setEditedBlock({ ...editedBlock, url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              )}

              {["LINK", "IMAGE"].includes(block.type) && (
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Image URL</label>
                  <Input
                    value={editedBlock.imageUrl || ""}
                    onChange={(e) => setEditedBlock({ ...editedBlock, imageUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              )}

              {block.type === "TEXT" && (
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Text</label>
                  <textarea
                    value={String(editedBlock.content?.text || "")}
                    onChange={(e) => setEditedBlock({ 
                      ...editedBlock, 
                      content: { ...editedBlock.content, text: e.target.value }
                    })}
                    placeholder="Enter your text..."
                    className="flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              )}

              {block.type === "MAP" && (
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Location / Map URL</label>
                  <Input
                    value={editedBlock.url || ""}
                    onChange={(e) => setEditedBlock({ ...editedBlock, url: e.target.value })}
                    placeholder="City, Country or Google Maps URL"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Block Size
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {recommendedSizes.map((preset) => {
                const isSelected = !customSize && 
                  editedBlock.gridWidth === preset.gridWidth && 
                  editedBlock.gridHeight === preset.gridHeight
                
                return (
                  <button
                    key={preset.name}
                    onClick={() => handleSizeChange(preset)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                      isSelected 
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/20" 
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <SizePreview 
                      width={preset.gridWidth} 
                      height={preset.gridHeight} 
                      isSelected={isSelected}
                    />
                    <div className="text-center">
                      <span className={cn(
                        "text-sm font-medium block",
                        isSelected && "text-primary"
                      )}>
                        {preset.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {preset.gridWidth}×{preset.gridHeight}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Custom Size */}
            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium mb-3">Custom Size</h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted-foreground">Width:</label>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-r-none"
                      onClick={() => handleCustomSizeChange("width", editedBlock.gridWidth - 1)}
                      disabled={editedBlock.gridWidth <= 1}
                    >
                      -
                    </Button>
                    <div className="h-8 w-10 flex items-center justify-center border-y border-border bg-muted/50 text-sm font-medium">
                      {editedBlock.gridWidth}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-l-none"
                      onClick={() => handleCustomSizeChange("width", editedBlock.gridWidth + 1)}
                      disabled={editedBlock.gridWidth >= 4}
                    >
                      +
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted-foreground">Height:</label>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-r-none"
                      onClick={() => handleCustomSizeChange("height", editedBlock.gridHeight - 1)}
                      disabled={editedBlock.gridHeight <= 1}
                    >
                      -
                    </Button>
                    <div className="h-8 w-10 flex items-center justify-center border-y border-border bg-muted/50 text-sm font-medium">
                      {editedBlock.gridHeight}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-l-none"
                      onClick={() => handleCustomSizeChange("height", editedBlock.gridHeight + 1)}
                      disabled={editedBlock.gridHeight >= 4}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Size Preview Info */}
            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <h4 className="text-sm font-medium mb-2">
                {currentPreset?.name || "Custom"} Preview
              </h4>
              <p className="text-xs text-muted-foreground">
                {getEmbedDescription(block.type, editedBlock.gridWidth, editedBlock.gridHeight)}
              </p>
            </div>
          </div>

          {/* Visibility Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
            <div>
              <h4 className="text-sm font-medium">Visibility</h4>
              <p className="text-xs text-muted-foreground">Show this block on your profile</p>
            </div>
            <button
              onClick={() => setEditedBlock({ ...editedBlock, isVisible: !editedBlock.isVisible })}
              className={cn(
                "w-12 h-6 rounded-full transition-colors relative",
                editedBlock.isVisible ? "bg-primary" : "bg-muted"
              )}
            >
              <div className={cn(
                "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
                editedBlock.isVisible ? "translate-x-7" : "translate-x-1"
              )} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onDelete(block.id)
                onClose()
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <div className="flex-1" />
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Check className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper function to describe what will be shown at each size
function getEmbedDescription(type: BlockType, width: number, height: number): string {
  const size = width * height
  
  switch (type) {
    case "YOUTUBE":
      if (size >= 6) return "Full video player with controls and title"
      if (size >= 4) return "Embedded video player"
      if (size >= 2) return "Video thumbnail with play button"
      return "YouTube icon and channel/video title"
    
    case "SPOTIFY":
      if (size >= 6) return "Full player with album art and track list"
      if (size >= 4) return "Embedded player with album art"
      if (size >= 2) return "Compact player with album art"
      return "Spotify icon and track/playlist title"
    
    case "GITHUB":
      if (size >= 4) return "Profile card with avatar, bio, and stats"
      if (size >= 2) return "Profile preview with avatar and name"
      return "GitHub icon and username"
    
    case "TWITTER":
      if (size >= 4) return "Embedded tweet or profile card"
      if (size >= 2) return "Profile preview with avatar"
      return "Twitter icon and handle"
    
    case "INSTAGRAM":
      if (size >= 4) return "Instagram grid preview"
      if (size >= 2) return "Profile preview with avatar"
      return "Instagram icon and username"
    
    case "LINKEDIN":
      if (size >= 4) return "Full profile card with details"
      if (size >= 2) return "Profile preview with photo"
      return "LinkedIn icon and name"
    
    case "MAP":
      if (size >= 4) return "Interactive map with location marker"
      if (size >= 2) return "Static map preview"
      return "Location icon and place name"
    
    case "IMAGE":
      if (size >= 4) return "Large image with caption"
      if (size >= 2) return "Medium image display"
      return "Small thumbnail"
    
    case "TEXT":
      if (size >= 4) return "Full text content with formatting"
      if (size >= 2) return "Text preview with title"
      return "Compact text snippet"
    
    case "LINK":
      if (size >= 4) return "Rich link preview with image and description"
      if (size >= 2) return "Link preview with favicon"
      return "Link icon and title"
    
    default:
      return "Block content"
  }
}
