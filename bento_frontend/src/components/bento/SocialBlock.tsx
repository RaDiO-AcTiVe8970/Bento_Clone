"use client"

import { useSocialProfile, getAvatarFallback } from "@/hooks/useSocialProfile"
import { cn } from "@/lib/utils"
import { InstagramGrid } from "./InstagramGrid"
import { 
  Github, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Facebook,
  Gamepad2,
  MessageCircle,
  Play,
  Loader2,
  Users,
  Star,
  GitFork
} from "lucide-react"
import { useState } from "react"

interface SocialBlockProps {
  platform: "github" | "twitter" | "instagram" | "linkedin" | "youtube" | "facebook" | "steam" | "discord"
  username?: string
  url: string
  title?: string
  isSmall?: boolean
  isMedium?: boolean
  isLarge?: boolean
  isWide?: boolean
  isTall?: boolean
}

const platformIcons: Record<string, any> = {
  github: Github,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  facebook: Facebook,
  steam: Gamepad2,
  discord: MessageCircle,
}

const platformColors: Record<string, { bg: string; hover: string }> = {
  github: {
    bg: "from-gray-700 to-gray-900",
    hover: "hover:from-gray-600 hover:to-gray-800",
  },
  twitter: {
    bg: "from-black to-gray-900",
    hover: "hover:from-gray-800 hover:to-gray-900",
  },
  instagram: {
    bg: "from-pink-500 via-purple-500 to-orange-400",
    hover: "hover:from-pink-400 hover:via-purple-400 hover:to-orange-300",
  },
  linkedin: {
    bg: "from-blue-600 to-blue-700",
    hover: "hover:from-blue-500 hover:to-blue-600",
  },
  youtube: {
    bg: "from-red-500 to-red-600",
    hover: "hover:from-red-400 hover:to-red-500",
  },
  facebook: {
    bg: "from-blue-500 to-blue-700",
    hover: "hover:from-blue-400 hover:to-blue-600",
  },
  steam: {
    bg: "from-slate-800 to-slate-900",
    hover: "hover:from-slate-700 hover:to-slate-800",
  },
  discord: {
    bg: "from-indigo-500 to-indigo-600",
    hover: "hover:from-indigo-400 hover:to-indigo-500",
  },
}

// Avatar component with fallback support
function SocialAvatar({
  src,
  fallbacks = [], 
  alt, 
  className,
  iconFallback,
  onLoad
}: { 
  src?: string | null; 
  fallbacks?: string[]; 
  alt: string; 
  className?: string;
  iconFallback: React.ReactNode;
  onLoad?: () => void;
}) {
  const [currentSrc, setCurrentSrc] = useState<string | null>(src || null)
  const [fallbackIndex, setFallbackIndex] = useState(0)
  const [showIcon, setShowIcon] = useState(!src)
  const [imgLoaded, setImgLoaded] = useState(false)

  // Update when src changes
  useState(() => {
    if (src) {
      setCurrentSrc(src)
      setShowIcon(false)
      setFallbackIndex(0)
    }
  })

  const handleError = () => {
    if (fallbackIndex < fallbacks.length) {
      setCurrentSrc(fallbacks[fallbackIndex])
      setFallbackIndex(prev => prev + 1)
    } else {
      setShowIcon(true)
    }
  }

  const handleLoad = () => {
    setImgLoaded(true)
    onLoad?.()
  }

  if (showIcon || !currentSrc) {
    return <>{iconFallback}</>
  }

  return (
    <img 
      src={currentSrc} 
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
    />
  )
}

export function SocialBlock({ 
  platform, 
  username, 
  url, 
  title, 
  isSmall, 
  isMedium, 
  isLarge, 
  isWide,
  isTall
}: SocialBlockProps) {
  const { profile, loading } = useSocialProfile(platform, username || null)
  
  const Icon = platformIcons[platform] || Github
  const colors = platformColors[platform] || platformColors.github
  const avatarUrl = profile?.avatar || (username ? getAvatarFallback(platform, username) : null)
  const avatarFallbacks = profile?.avatarFallbacks || []
  // Use profile name as the display name (this will be the auto-populated title)
  const displayName = profile?.name || title || formatDisplayName(username || platform)

  // Twitter/X specific rendering
  if (platform === "twitter") {
    return (
      <a 
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "group flex h-full bg-black overflow-hidden transition-all hover:bg-gray-900",
          isSmall ? "flex-col items-center justify-center p-3" : 
          (isMedium || isWide) ? "items-center p-4" : "flex-col"
        )}
      >
        {isLarge ? (
          <>
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="relative mb-4">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={displayName}
                    className="w-20 h-20 rounded-full object-cover border-2 border-white/20 group-hover:scale-110 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                      ;(e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                ) : null}
                <div className={cn("w-20 h-20 rounded-2xl bg-white flex items-center justify-center", avatarUrl && "hidden")}>
                  <svg viewBox="0 0 24 24" className="w-10 h-10 text-black" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
              </div>
              <span className="text-white font-bold text-xl">{displayName}</span>
              <span className="text-gray-400 text-sm mt-1">@{username}</span>
            </div>
            <div className="px-4 pb-4">
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 overflow-hidden">
                    {avatarUrl && <img src={avatarUrl} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="h-2 w-20 bg-white/20 rounded" />
                </div>
                <div className="space-y-1">
                  <div className="h-2 w-full bg-white/10 rounded" />
                  <div className="h-2 w-3/4 bg-white/10 rounded" />
                </div>
              </div>
            </div>
          </>
        ) : (isMedium || isWide) ? (
          <>
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={displayName}
                className="w-12 h-12 rounded-full object-cover mr-4 group-hover:scale-110 transition-transform"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-black" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className="text-white font-bold block truncate">{displayName}</span>
              <span className="text-gray-400 text-sm">@{username}</span>
            </div>
          </>
        ) : (
          <>
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={displayName}
                className="w-10 h-10 rounded-full object-cover group-hover:scale-110 transition-transform"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-black" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
            )}
            <span className="text-white font-medium text-xs mt-2 text-center line-clamp-1">{displayName}</span>
          </>
        )}
      </a>
    )
  }

  // GitHub specific rendering
  if (platform === "github") {
    return (
      <a 
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "group flex h-full bg-gradient-to-br transition-all overflow-hidden",
          colors.bg, colors.hover,
          isSmall ? "flex-col items-center justify-center p-3" : 
          (isMedium || isWide) ? "items-center p-4" : "flex-col"
        )}
      >
        {isLarge ? (
          <>
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="relative mb-4">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={displayName}
                    className="w-20 h-20 rounded-full object-cover border-2 border-white/20 group-hover:scale-110 transition-transform"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20">
                    <Github className="w-10 h-10 text-white" />
                  </div>
                )}
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <span className="text-white font-bold text-xl">{displayName}</span>
              <span className="text-white/70 text-sm mt-1">@{username}</span>
              {profile?.bio && (
                <p className="text-white/60 text-xs mt-2 text-center line-clamp-2 max-w-[200px]">
                  {profile.bio}
                </p>
              )}
            </div>
            {/* Stats and contribution graph */}
            <div className="px-4 pb-4 w-full">
              {profile && (profile.repos !== undefined || profile.followers !== undefined) && (
                <div className="flex justify-center gap-6 mb-3 text-white/80 text-xs">
                  {profile.repos !== undefined && (
                    <div className="flex items-center gap-1">
                      <GitFork className="w-3 h-3" />
                      <span>{profile.repos} repos</span>
                    </div>
                  )}
                  {profile.followers !== undefined && (
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{profile.followers} followers</span>
                    </div>
                  )}
                </div>
              )}
              <div className="flex gap-1 justify-center">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    {[...Array(5)].map((_, j) => (
                      <div 
                        key={j} 
                        className={cn(
                          "w-2 h-2 rounded-sm",
                          Math.random() > 0.5 ? "bg-green-400/80" : 
                          Math.random() > 0.3 ? "bg-green-500/50" : "bg-white/10"
                        )}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (isMedium || isWide) ? (
          <>
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={displayName}
                className="w-12 h-12 rounded-full object-cover mr-4 group-hover:scale-110 transition-transform"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                <Github className="w-6 h-6 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className="text-white font-bold block truncate">{displayName}</span>
              <span className="text-white/70 text-sm">@{username}</span>
            </div>
            <div className="flex gap-0.5 ml-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  {[...Array(3)].map((_, j) => (
                    <div 
                      key={j} 
                      className={cn(
                        "w-1.5 h-1.5 rounded-sm",
                        Math.random() > 0.5 ? "bg-green-400/80" : "bg-white/20"
                      )}
                    />
                  ))}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={displayName}
                className="w-10 h-10 rounded-full object-cover group-hover:scale-110 transition-transform"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Github className="w-5 h-5 text-white" />
              </div>
            )}
            <span className="text-white font-medium text-xs mt-2 text-center line-clamp-1">{displayName}</span>
          </>
        )}
      </a>
    )
  }

  // Generic social block (Instagram, LinkedIn, YouTube)
  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex h-full bg-gradient-to-br transition-all overflow-hidden",
        colors.bg, colors.hover,
        isSmall ? "flex-col items-center justify-center p-3" : 
        (isMedium || isWide) ? "items-center p-4" : "flex-col"
      )}
    >
      {isLarge ? (
        <>
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="relative mb-4">
              <SocialAvatar
                src={avatarUrl}
                fallbacks={avatarFallbacks}
                alt={displayName}
                className={cn(
                  "w-20 h-20 object-cover group-hover:scale-110 transition-transform",
                  platform === "instagram" || platform === "facebook" ? "rounded-2xl" : "rounded-full",
                  "border-2 border-white/20"
                )}
                iconFallback={
                  <div className={cn(
                    "w-20 h-20 bg-white/20 flex items-center justify-center",
                    platform === "instagram" || platform === "facebook" ? "rounded-2xl" : "rounded-full"
                  )}>
                    <Icon className={cn("w-10 h-10", platform === "linkedin" || platform === "facebook" ? "text-white" : "text-white")} />
                  </div>
                }
              />
              {loading && (
                <div className={cn(
                  "absolute inset-0 flex items-center justify-center bg-black/50",
                  platform === "instagram" || platform === "facebook" ? "rounded-2xl" : "rounded-full"
                )}>
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>
            <span className="text-white font-bold text-xl">{displayName}</span>
            <span className="text-white/70 text-sm mt-1">
              {platform === "youtube" ? (profile?.channelId || username) : 
               platform === "facebook" ? username : `@${username}`}
            </span>
            {profile?.description && platform === "youtube" && (
              <p className="text-white/60 text-xs mt-2 text-center line-clamp-2 max-w-[200px]">
                {profile.description}
              </p>
            )}
          </div>
          {platform === "instagram" && (
            <div className="px-4 pb-4 w-full">
              <div className="grid grid-cols-3 gap-1">
                {profile?.posts && profile.posts.length > 0 ? (
                  profile.posts.slice(0, 6).map((post, i) => (
                    <a
                      key={post.id}
                      href={post.permalink || url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative aspect-square rounded overflow-hidden hover:opacity-80 transition-opacity"
                    >
                      {post.imageUrl && !post.isPlaceholder ? (
                        <img 
                          src={post.imageUrl} 
                          alt={post.caption || `Post ${i + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className={cn(
                          "w-full h-full flex items-center justify-center",
                          i % 3 === 0 ? "bg-gradient-to-br from-pink-500 to-purple-500" : 
                          i % 2 === 0 ? "bg-gradient-to-br from-purple-500 to-orange-400" : 
                          "bg-gradient-to-br from-orange-400 to-pink-500"
                        )}>
                          <Instagram className="w-6 h-6 text-white/60" />
                        </div>
                      )}
                      {post.caption && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                          <p className="text-white text-xs text-center px-2 opacity-0 group-hover:opacity-100 transition-opacity line-clamp-3">
                            {post.caption}
                          </p>
                        </div>
                      )}
                    </a>
                  ))
                ) : (
                  [...Array(6)].map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "aspect-square rounded",
                        i % 3 === 0 ? "bg-white/30" : 
                        i % 2 === 0 ? "bg-white/20" : "bg-white/10"
                      )}
                    />
                  ))
                )}
              </div>
            </div>
          )}
          {platform === "facebook" && (
            <div className="px-4 pb-4">
              <div className="bg-white/10 rounded-xl p-3 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-6 h-6 rounded-full bg-white/30 border-2 border-blue-500"
                    />
                  ))}
                </div>
                <span className="text-white/80 text-xs">View on Facebook</span>
              </div>
            </div>
          )}
          {platform === "linkedin" && (
            <div className="px-4 pb-4">
              <div className="bg-white/10 rounded-xl p-3 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-6 h-6 rounded-full bg-white/30 border-2 border-blue-600"
                    />
                  ))}
                </div>
                <span className="text-white/80 text-xs">Connect on LinkedIn</span>
              </div>
            </div>
          )}
          {platform === "youtube" && (
            <div className="px-4 pb-4 w-full">
              {profile?.subscribers && (
                <div className="flex justify-center gap-4 text-white/80 text-xs">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{formatNumber(profile.subscribers)} subscribers</span>
                  </div>
                  {profile.videos && (
                    <div className="flex items-center gap-1">
                      <Play className="w-3 h-3" />
                      <span>{profile.videos} videos</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      ) : (isMedium || isWide) ? (
        <>
          <SocialAvatar
            src={avatarUrl}
            fallbacks={avatarFallbacks}
            alt={displayName}
            className={cn(
              "w-12 h-12 object-cover mr-4 group-hover:scale-110 transition-transform",
              platform === "instagram" || platform === "facebook" ? "rounded-xl" : 
              platform === "linkedin" ? "rounded-xl" : "rounded-full"
            )}
            iconFallback={
              <div className={cn(
                "w-12 h-12 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform",
                platform === "instagram" || platform === "facebook" ? "rounded-xl bg-white/20" : 
                platform === "linkedin" ? "rounded-xl bg-white/20" : "rounded-full bg-white/20"
              )}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            }
          />
          <div className="flex-1 min-w-0">
            <span className="text-white font-bold block truncate">{displayName}</span>
            <span className="text-white/70 text-sm">
              {platform === "youtube" ? "Channel" : 
               platform === "facebook" ? username : `@${username}`}
            </span>
          </div>
        </>
      ) : (
        <>
          <SocialAvatar
            src={avatarUrl}
            fallbacks={avatarFallbacks}
            alt={displayName}
            className={cn(
              "w-10 h-10 object-cover group-hover:scale-110 transition-transform",
              platform === "instagram" || platform === "facebook" ? "rounded-lg" : 
              platform === "linkedin" ? "rounded-lg" : "rounded-full"
            )}
            iconFallback={
              <div className={cn(
                "w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform",
                platform === "instagram" || platform === "facebook" ? "rounded-lg bg-white/20" : 
                platform === "linkedin" ? "rounded-lg bg-white/20" : "rounded-full bg-white/20"
              )}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            }
          />
          <span className="text-white font-medium text-xs mt-2 text-center line-clamp-1">{displayName}</span>
        </>
      )}
    </a>
  )
}

function formatNumber(num: string | number): string {
  const n = typeof num === 'string' ? parseInt(num) : num
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toString()
}

// Helper function to convert username/slug to a display name
function formatDisplayName(username: string): string {
  // Remove common prefixes
  let name = username.replace(/^@/, '')
  
  // Replace hyphens and underscores with spaces
  name = name.replace(/[-_]/g, ' ')
  
  // Capitalize each word
  name = name.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
  
  return name
}
