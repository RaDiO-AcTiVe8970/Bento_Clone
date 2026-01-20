"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"
import { 
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
  Facebook,
  Gamepad2,
  MessageCircle,
  GripVertical,
  MoreHorizontal,
  Settings,
  ExternalLink,
  Play
} from "lucide-react"
import { SocialBlock } from "./SocialBlock"

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
  | "FACEBOOK"
  | "STEAM"
  | "DISCORD"
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

// Brand colors for social platforms
const brandColors: Partial<Record<BlockType, { bg: string; hover: string; icon: string }>> = {
  SPOTIFY: { bg: "from-green-500 to-green-600", hover: "hover:from-green-400 hover:to-green-500", icon: "text-white" },
  YOUTUBE: { bg: "from-red-500 to-red-600", hover: "hover:from-red-400 hover:to-red-500", icon: "text-white" },
  GITHUB: { bg: "from-gray-700 to-gray-900", hover: "hover:from-gray-600 hover:to-gray-800", icon: "text-white" },
  TWITTER: { bg: "from-black to-gray-900", hover: "hover:from-gray-800 hover:to-gray-900", icon: "text-white" },
  INSTAGRAM: { bg: "from-pink-500 via-purple-500 to-orange-400", hover: "hover:from-pink-400 hover:via-purple-400 hover:to-orange-300", icon: "text-white" },
  LINKEDIN: { bg: "from-blue-600 to-blue-700", hover: "hover:from-blue-500 hover:to-blue-600", icon: "text-white" },
  FACEBOOK: { bg: "from-blue-500 to-blue-700", hover: "hover:from-blue-400 hover:to-blue-600", icon: "text-white" },
  STEAM: { bg: "from-slate-800 to-slate-900", hover: "hover:from-slate-700 hover:to-slate-800", icon: "text-white" },
  DISCORD: { bg: "from-indigo-500 to-indigo-600", hover: "hover:from-indigo-400 hover:to-indigo-500", icon: "text-white" },
}

const blockIcons: Record<BlockType, React.ReactNode> = {
  LINK: <LinkIcon className="w-6 h-6" />,
  TEXT: <FileText className="w-6 h-6" />,
  IMAGE: <ImageIcon className="w-6 h-6" />,
  MAP: <MapPin className="w-6 h-6" />,
  SPOTIFY: <Music className="w-6 h-6" />,
  YOUTUBE: <Youtube className="w-6 h-6" />,
  GITHUB: <Github className="w-6 h-6" />,
  TWITTER: <Twitter className="w-6 h-6" />,
  INSTAGRAM: <Instagram className="w-6 h-6" />,
  LINKEDIN: <Linkedin className="w-6 h-6" />,
  FACEBOOK: <Facebook className="w-6 h-6" />,
  STEAM: <Gamepad2 className="w-6 h-6" />,
  DISCORD: <MessageCircle className="w-6 h-6" />,
  CUSTOM: <Settings className="w-6 h-6" />,
}

// Helper functions to extract IDs from URLs
function extractGitHubUsername(url: string): string | null {
  const match = url.match(/github\.com\/([^\/\?]+)/)
  return match ? match[1] : null
}

function extractTwitterUsername(url: string): string | null {
  const match = url.match(/(?:twitter\.com|x\.com)\/([^\/\?]+)/)
  return match ? match[1] : null
}

function extractInstagramUsername(url: string): string | null {
  const match = url.match(/instagram\.com\/([^\/\?]+)/)
  return match ? match[1] : null
}

function extractLinkedInId(url: string): { type: string; id: string } | null {
  const companyMatch = url.match(/linkedin\.com\/company\/([^\/\?]+)/)
  if (companyMatch) return { type: 'company', id: companyMatch[1] }
  
  const profileMatch = url.match(/linkedin\.com\/in\/([^\/\?]+)/)
  if (profileMatch) return { type: 'profile', id: profileMatch[1] }
  
  return null
}

function extractFacebookUsername(url: string): string | null {
  // Handle various Facebook URL formats
  // facebook.com/profile.php?id=123456
  const idMatch = url.match(/facebook\.com\/profile\.php\?id=([^&]+)/)
  if (idMatch) return idMatch[1]
  
  // facebook.com/username
  const usernameMatch = url.match(/facebook\.com\/([^\/\?]+)/)
  if (usernameMatch && !['pages', 'groups', 'events', 'watch', 'marketplace'].includes(usernameMatch[1])) {
    return usernameMatch[1]
  }
  
  return null
}

function extractSteamId(url: string): { type: 'id' | 'profile'; value: string } | null {
  // steamcommunity.com/id/customurl
  const idMatch = url.match(/steamcommunity\.com\/id\/([^\/\?]+)/)
  if (idMatch) return { type: 'id', value: idMatch[1] }
  
  // steamcommunity.com/profiles/76561198012345678
  const profileMatch = url.match(/steamcommunity\.com\/profiles\/(\d+)/)
  if (profileMatch) return { type: 'profile', value: profileMatch[1] }
  
  return null
}

function extractDiscordId(url: string): { type: 'invite' | 'user'; value: string } | null {
  // discord.gg/invite or discord.com/invite/code
  const inviteMatch = url.match(/(?:discord\.gg|discord\.com\/invite)\/([^\/\?\s]+)/)
  if (inviteMatch) return { type: 'invite', value: inviteMatch[1] }
  
  // discord.com/users/id
  const userMatch = url.match(/discord\.com\/users\/(\d+)/)
  if (userMatch) return { type: 'user', value: userMatch[1] }
  
  return null
}

function extractYouTubeVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/)
  return match ? match[1] : null
}

function extractYouTubeChannelId(url: string): string | null {
  const channelMatch = url.match(/youtube\.com\/channel\/([^\/\?]+)/)
  if (channelMatch) return channelMatch[1]
  
  const userMatch = url.match(/youtube\.com\/@([^\/\?]+)/)
  if (userMatch) return userMatch[1]
  
  return null
}

function extractSpotifyEmbed(url: string): string | null {
  try {
    const urlObj = new URL(url)
    return urlObj.pathname
  } catch {
    return null
  }
}

function extractMapCoordinates(url: string): { lat: number; lng: number } | null {
  // Google Maps URL patterns
  const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/)
  if (atMatch) {
    return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) }
  }
  
  const qMatch = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/)
  if (qMatch) {
    return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) }
  }
  
  return null
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
  }

  const customStyle = {
    backgroundColor: block.backgroundColor || undefined,
    color: block.textColor || undefined,
    borderRadius: block.borderRadius ? `${block.borderRadius}px` : undefined,
  }

  // Calculate block size category
  const blockSize = block.gridWidth * block.gridHeight
  const isSmall = blockSize === 1
  const isMedium = blockSize === 2
  const isLarge = blockSize >= 4
  const isWide = block.gridWidth >= 2 && block.gridHeight === 1
  const isTall = block.gridHeight >= 2 && block.gridWidth === 1

  const renderBlockContent = () => {
    const brand = brandColors[block.type]
    
    switch (block.type) {
      case "LINK":
        // Size-aware LINK rendering
        if (isLarge) {
          // Large: Rich preview with image
          return (
            <a 
              href={block.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex h-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300 overflow-hidden"
              style={customStyle}
            >
              {block.imageUrl && (
                <div className="w-1/2 h-full relative">
                  <img 
                    src={block.imageUrl} 
                    alt={block.title || "Link"} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              )}
              <div className={cn(
                "flex flex-col justify-center p-6",
                block.imageUrl ? "w-1/2" : "w-full items-center"
              )}>
                {!block.imageUrl && (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    <LinkIcon className="w-8 h-8 text-white" />
                  </div>
                )}
                <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">{block.title || "Link"}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">{block.url}</p>
                <div className="mt-4 flex items-center gap-2 text-primary">
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm font-medium">Visit Link</span>
                </div>
              </div>
            </a>
          )
        } else if (isMedium || isWide) {
          // Medium/Wide: Compact horizontal layout
          return (
            <a 
              href={block.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center h-full p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300"
              style={customStyle}
            >
              {block.imageUrl ? (
                <img 
                  src={block.imageUrl} 
                  alt={block.title || "Link"} 
                  className="w-12 h-12 rounded-xl object-cover shadow-lg mr-4 group-hover:scale-110 transition-transform"
                  loading="lazy"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform">
                  <LinkIcon className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span className="font-semibold block truncate group-hover:text-primary transition-colors">{block.title || "Link"}</span>
                <span className="text-xs text-muted-foreground truncate block">{block.url}</span>
              </div>
              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity ml-2 flex-shrink-0" />
            </a>
          )
        } else {
          // Small: Icon only
          return (
            <a 
              href={block.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center h-full p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300"
              style={customStyle}
            >
              {block.imageUrl ? (
                <img 
                  src={block.imageUrl} 
                  alt={block.title || "Link"} 
                  className="w-10 h-10 rounded-lg object-cover shadow-lg group-hover:scale-110 transition-transform"
                  loading="lazy"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <LinkIcon className="w-5 h-5 text-white" />
                </div>
              )}
              <span className="font-medium text-xs mt-2 text-center line-clamp-2">{block.title || "Link"}</span>
            </a>
          )
        }
      
      case "TEXT":
        // Size-aware TEXT rendering
        if (isLarge) {
          return (
            <div 
              className="p-6 h-full flex flex-col bg-gradient-to-br from-gray-500/5 to-gray-500/10"
              style={customStyle}
            >
              {block.title && (
                <h3 className="font-bold text-2xl mb-4 text-gradient">{block.title}</h3>
              )}
              <p className="text-base leading-relaxed text-muted-foreground flex-1">
                {String(block.content?.text || "")}
              </p>
            </div>
          )
        } else if (isMedium || isWide) {
          return (
            <div 
              className="p-4 h-full flex flex-col justify-center bg-gradient-to-br from-gray-500/5 to-gray-500/10"
              style={customStyle}
            >
              {block.title && (
                <h3 className="font-bold text-lg mb-2 text-gradient">{block.title}</h3>
              )}
              <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {String(block.content?.text || "")}
              </p>
            </div>
          )
        } else {
          return (
            <div 
              className="p-3 h-full flex flex-col justify-center bg-gradient-to-br from-gray-500/5 to-gray-500/10"
              style={customStyle}
            >
              {block.title && (
                <h3 className="font-semibold text-sm mb-1 text-gradient truncate">{block.title}</h3>
              )}
              <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
                {String(block.content?.text || "")}
              </p>
            </div>
          )
        }
      
      case "IMAGE":
        return (
          <div className="h-full w-full overflow-hidden group">
            <img 
              src={block.imageUrl || "/placeholder.png"} 
              alt={block.title || "Image"} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            {block.title && (
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white font-medium">{block.title}</p>
              </div>
            )}
          </div>
        )
      
      case "SPOTIFY":
        const spotifyPath = block.url ? extractSpotifyEmbed(block.url) : null
        // Size-aware SPOTIFY rendering
        if (isLarge && spotifyPath) {
          // Large: Full embedded player
          return (
            <div className="h-full w-full">
              <iframe
                src={`https://open.spotify.com/embed${spotifyPath}?utm_source=generator&theme=0`}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-2xl"
                style={{ minHeight: '152px' }}
              />
            </div>
          )
        } else if ((isMedium || isWide) && spotifyPath) {
          // Medium: Compact player
          return (
            <div className="h-full w-full">
              <iframe
                src={`https://open.spotify.com/embed${spotifyPath}?utm_source=generator&theme=0`}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-2xl"
                style={{ minHeight: '80px' }}
              />
            </div>
          )
        } else {
          // Small: Icon with title
          return (
            <a 
              href={block.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group flex flex-col items-center justify-center h-full p-3 bg-gradient-to-br transition-all",
                brand?.bg, brand?.hover
              )}
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-medium text-xs mt-2 text-center line-clamp-1">{block.title || "Spotify"}</span>
            </a>
          )
        }
      
      case "YOUTUBE":
        const videoId = block.url ? extractYouTubeVideoId(block.url) : null
        const channelId = block.url ? extractYouTubeChannelId(block.url) : null
        const isChannel = !videoId && channelId
        
        // Size-aware YOUTUBE rendering
        if (isLarge && videoId) {
          // Large: Full embedded video player
          return (
            <div className="h-full w-full overflow-hidden rounded-2xl">
              <div className="relative w-full h-full">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                  className="absolute inset-0 w-full h-full rounded-2xl"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          )
        } else if ((isMedium || isWide) && videoId) {
          // Medium: Video thumbnail with play overlay
          return (
            <a 
              href={block.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative h-full w-full overflow-hidden rounded-2xl"
            >
              <img 
                src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                alt={block.title || "YouTube video"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Play className="w-7 h-7 text-white ml-1" />
                </div>
              </div>
              {block.title && (
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="text-white font-medium text-sm line-clamp-1">{block.title}</span>
                </div>
              )}
            </a>
          )
        } else if (isTall && videoId) {
          // Tall: Vertical thumbnail with info
          return (
            <a 
              href={block.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-red-600"
            >
              <div className="relative flex-1 min-h-0">
                <img 
                  src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                  alt={block.title || "YouTube video"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600">
                <span className="text-white font-medium text-xs line-clamp-2">{block.title || "YouTube"}</span>
              </div>
            </a>
          )
        } else {
          // Small: Icon with title
          return (
            <a 
              href={block.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group flex flex-col items-center justify-center h-full w-full bg-gradient-to-br transition-all duration-300 p-3",
                brand?.bg, brand?.hover
              )}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {videoId ? (
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  ) : (
                    <Youtube className="w-5 h-5 text-white" />
                  )}
                </div>
              </div>
              <span className="text-white font-medium text-xs mt-2 text-center line-clamp-1">
                {block.title || "YouTube"}
              </span>
            </a>
          )
        }
      
      case "GITHUB":
        const githubUsername = block.url ? extractGitHubUsername(block.url) : null
        return (
          <SocialBlock
            platform="github"
            username={githubUsername || undefined}
            url={block.url || ""}
            title={block.title}
            isLarge={isLarge}
            isMedium={isMedium}
            isWide={isWide}
            isTall={isTall}
          />
        )
      
      case "TWITTER":
        const twitterUsername = block.url ? extractTwitterUsername(block.url) : null
        return (
          <SocialBlock
            platform="twitter"
            username={twitterUsername || undefined}
            url={block.url || ""}
            title={block.title}
            isLarge={isLarge}
            isMedium={isMedium}
            isWide={isWide}
            isTall={isTall}
          />
        )
      
      case "INSTAGRAM":
        const instagramUsername = block.url ? extractInstagramUsername(block.url) : null
        return (
          <SocialBlock
            platform="instagram"
            username={instagramUsername || undefined}
            url={block.url || ""}
            title={block.title}
            isLarge={isLarge}
            isMedium={isMedium}
            isWide={isWide}
            isTall={isTall}
          />
        )
      
      case "LINKEDIN":
        const linkedInInfo = block.url ? extractLinkedInId(block.url) : null
        return (
          <SocialBlock
            platform="linkedin"
            username={linkedInInfo?.id || undefined}
            url={block.url || ""}
            title={block.title}
            isLarge={isLarge}
            isMedium={isMedium}
            isWide={isWide}
            isTall={isTall}
          />
        )
      
      case "FACEBOOK":
        const facebookUsername = block.url ? extractFacebookUsername(block.url) : null
        return (
          <SocialBlock
            platform="facebook"
            username={facebookUsername || undefined}
            url={block.url || ""}
            title={block.title}
            isLarge={isLarge}
            isMedium={isMedium}
            isWide={isWide}
            isTall={isTall}
          />
        )
      
      case "STEAM":
        const steamInfo = block.url ? extractSteamId(block.url) : null
        return (
          <SocialBlock
            platform="steam"
            username={steamInfo?.value || undefined}
            url={block.url || ""}
            title={block.title}
            isLarge={isLarge}
            isMedium={isMedium}
            isWide={isWide}
            isTall={isTall}
          />
        )
      
      case "DISCORD":
        const discordInfo = block.url ? extractDiscordId(block.url) : null
        return (
          <SocialBlock
            platform="discord"
            username={discordInfo?.value || undefined}
            url={block.url || ""}
            title={block.title}
            isLarge={isLarge}
            isMedium={isMedium}
            isWide={isWide}
            isTall={isTall}
          />
        )
      
      case "MAP":
        const coordinates = block.url ? extractMapCoordinates(block.url) : null
        const locationQuery = block.content?.location as string || ""
        const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        
        // Build the embed URL
        let mapEmbedUrl = ""
        if (coordinates) {
          mapEmbedUrl = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000!2d${coordinates.lng}!3d${coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1234567890`
        } else if (locationQuery && mapsApiKey) {
          mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${mapsApiKey}&q=${encodeURIComponent(locationQuery)}`
        } else if (block.url) {
          // Try to use the URL directly with embed format
          mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(block.url)}&output=embed`
        }
        
        // Size-aware MAP rendering
        if (isLarge && mapEmbedUrl) {
          // Large: Full interactive map
          return (
            <div className="h-full w-full overflow-hidden relative group">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-2xl"
                style={{ minHeight: '200px' }}
              />
              <a 
                href={block.url || `https://maps.google.com/?q=${encodeURIComponent(locationQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 bg-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MapPin className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium">Open in Maps</span>
              </a>
            </div>
          )
        } else if ((isMedium || isWide) && mapEmbedUrl) {
          // Medium: Static map preview
          return (
            <a 
              href={block.url || `https://maps.google.com/?q=${encodeURIComponent(locationQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group h-full w-full overflow-hidden relative"
            >
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                loading="lazy"
                className="rounded-2xl pointer-events-none"
                style={{ minHeight: '100px' }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-white rounded-full px-3 py-1.5 shadow-lg flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-red-500" />
                  <span className="text-xs font-medium">View</span>
                </div>
              </div>
            </a>
          )
        } else {
          // Small: Icon with location
          return (
            <a 
              href={block.url || `https://maps.google.com/?q=${encodeURIComponent(locationQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center h-full p-3 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-medium text-xs mt-2 text-center line-clamp-1">{block.title || locationQuery || "Location"}</span>
            </a>
          )
        }
      
      default:
        return (
          <div 
            className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-br from-gray-500/10 to-gray-500/20"
            style={customStyle}
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3">
              {blockIcons[block.type] || <Settings className="w-7 h-7 text-white" />}
            </div>
            {block.title && <span className="font-medium">{block.title}</span>}
          </div>
        )
    }
  }

  if (!block.isVisible && !isEditing) return null

  // Dynamic height based on block type and size
  const getMinHeight = () => {
    // For larger blocks, don't need extra min-height as grid handles it
    if (isLarge) return ""
    
    switch (block.type) {
      case "YOUTUBE":
        return isSmall ? "min-h-[120px]" : "min-h-[180px]"
      case "SPOTIFY":
        return isSmall ? "min-h-[120px]" : "min-h-[152px]"
      case "MAP":
        return isSmall ? "min-h-[120px]" : "min-h-[160px]"
      case "IMAGE":
        return "min-h-[120px]"
      case "TEXT":
        return isSmall ? "min-h-[100px]" : "min-h-[120px]"
      default:
        return "min-h-[120px]"
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-card/80 backdrop-blur-sm border border-white/10 shadow-lg h-full",
        getMinHeight(),
        "hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300",
        isDragging && "opacity-50 shadow-2xl z-50 scale-105",
        !block.isVisible && "opacity-50",
        isEditing && "cursor-move ring-2 ring-primary/30"
      )}
    >
      {isEditing && (
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <button
            {...attributes}
            {...listeners}
            className="p-2 rounded-lg bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
          >
            <GripVertical className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => onEdit?.(block)}
            className="p-2 rounded-lg bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4 text-white" />
          </button>
        </div>
      )}
      
      {renderBlockContent()}
    </div>
  )
}
