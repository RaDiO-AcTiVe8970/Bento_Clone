"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { 
  Link, 
  FileText, 
  Image as ImageIcon, 
  MapPin, 
  Music, 
  Youtube, 
  Github, 
  Twitter, 
  Instagram, 
  Linkedin,
  GripVertical,
  MoreHorizontal,
  Settings
} from "lucide-react"

export type BlockType = 
  | "LINK" 
  | "TEXT" 
  | "IMAGE" 
  | "MAP" 
  | "SPOTIFY" 
  | "YOUTUBE" 
  | "GITHUB" 
  | "TWITTER" 
  | "INSTAGRAM" 
  | "LINKEDIN" 
  | "CUSTOM"

export interface BlockData {
  id: string
  type: BlockType
  title?: string
  content?: Record<string, unknown>
  url?: string
  imageUrl?: string
  gridX: number
  gridY: number
  gridWidth: number
  gridHeight: number
  backgroundColor?: string
  textColor?: string
  borderRadius?: number
  isVisible: boolean
}

interface BentoBlockProps {
  block: BlockData
  isEditing?: boolean
  onEdit?: (block: BlockData) => void
  onDelete?: (id: string) => void
}

const blockIcons: Record<BlockType, React.ReactNode> = {
  LINK: <Link className="w-5 h-5" />,
  TEXT: <FileText className="w-5 h-5" />,
  IMAGE: <ImageIcon className="w-5 h-5" />,
  MAP: <MapPin className="w-5 h-5" />,
  SPOTIFY: <Music className="w-5 h-5 text-green-500" />,
  YOUTUBE: <Youtube className="w-5 h-5 text-red-500" />,
  GITHUB: <Github className="w-5 h-5" />,
  TWITTER: <Twitter className="w-5 h-5 text-blue-400" />,
  INSTAGRAM: <Instagram className="w-5 h-5 text-pink-500" />,
  LINKEDIN: <Linkedin className="w-5 h-5 text-blue-600" />,
  CUSTOM: <Settings className="w-5 h-5" />,
}

export function BentoBlock({ block, isEditing = false, onEdit, onDelete }: BentoBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: block.id,
    disabled: !isEditing,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    gridColumn: `span ${block.gridWidth}`,
    gridRow: `span ${block.gridHeight}`,
    backgroundColor: block.backgroundColor || undefined,
    color: block.textColor || undefined,
    borderRadius: block.borderRadius ? `${block.borderRadius}px` : undefined,
  }

  const renderBlockContent = () => {
    switch (block.type) {
      case "LINK":
        return (
          <a 
            href={block.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center h-full p-4 hover:scale-[1.02] transition-transform"
          >
            {block.imageUrl && (
              <img 
                src={block.imageUrl} 
                alt={block.title || "Link"} 
                className="w-12 h-12 rounded-lg mb-2 object-cover"
                loading="lazy"
              />
            )}
            <span className="font-medium text-center">{block.title || "Link"}</span>
          </a>
        )
      
      case "TEXT":
        return (
          <div className="p-4 h-full flex flex-col justify-center">
            {block.title && <h3 className="font-bold text-lg mb-2">{block.title}</h3>}
            <p className="text-sm opacity-80">{String(block.content?.text || "")}</p>
          </div>
        )
      
      case "IMAGE":
        return (
          <div className="h-full w-full overflow-hidden rounded-xl">
            <img 
              src={block.imageUrl || "/placeholder.png"} 
              alt={block.title || "Image"} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        )
      
      case "SPOTIFY":
        return (
          <div className="h-full w-full p-2">
            {block.url ? (
              <iframe
                src={`https://open.spotify.com/embed${new URL(block.url).pathname}`}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="encrypted-media"
                loading="lazy"
                className="rounded-lg"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Music className="w-8 h-8 text-green-500" />
              </div>
            )}
          </div>
        )
      
      case "YOUTUBE":
        return (
          <div className="h-full w-full p-2">
            {block.url ? (
              <iframe
                src={block.url.replace("watch?v=", "embed/")}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="rounded-lg"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Youtube className="w-8 h-8 text-red-500" />
              </div>
            )}
          </div>
        )
      
      case "GITHUB":
      case "TWITTER":
      case "INSTAGRAM":
      case "LINKEDIN":
        return (
          <a 
            href={block.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center h-full p-4 hover:scale-[1.02] transition-transform"
          >
            {blockIcons[block.type]}
            <span className="mt-2 font-medium">{block.title || block.type}</span>
          </a>
        )
      
      case "MAP":
        return (
          <div className="h-full w-full p-2">
            {block.content?.location ? (
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(String(block.content.location))}&output=embed`}
                width="100%"
                height="100%"
                frameBorder="0"
                loading="lazy"
                className="rounded-lg"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <MapPin className="w-8 h-8" />
              </div>
            )}
          </div>
        )
      
      default:
        return (
          <div className="flex items-center justify-center h-full p-4">
            {blockIcons[block.type] || <Settings className="w-8 h-8" />}
          </div>
        )
    }
  }

  if (!block.isVisible && !isEditing) return null

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative overflow-hidden min-h-[120px] bg-card hover:shadow-lg transition-all duration-200",
        isDragging && "opacity-50 shadow-2xl z-50",
        !block.isVisible && "opacity-50",
        isEditing && "cursor-move ring-2 ring-primary/20"
      )}
    >
      {isEditing && (
        <div className="absolute top-2 right-2 z-10 flex gap-1">
          <button
            {...attributes}
            {...listeners}
            className="p-1.5 rounded-md bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => onEdit?.(block)}
            className="p-1.5 rounded-md bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          >
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      )}
      
      {renderBlockContent()}
    </Card>
  )
}
