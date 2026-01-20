import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Verified } from "lucide-react"

interface ProfileHeaderProps {
  name: string
  username: string
  bio?: string
  location?: string
  avatarUrl?: string
  isOwner?: boolean
  isVerified?: boolean
}

export function ProfileHeader({
  name,
  username,
  bio,
  location,
  avatarUrl,
  isOwner = false,
  isVerified = false,
}: ProfileHeaderProps) {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || username?.slice(0, 2).toUpperCase() || "?"

  return (
    <div className="flex flex-col items-center text-center mb-12 animate-fade-in">
      {/* Avatar with glow effect */}
      <div className="relative mb-6 group">
        {/* Glow ring */}
        <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity animate-pulse-slow" />
        
        {/* Avatar */}
        <Avatar className="relative w-28 h-28 md:w-32 md:h-32 ring-4 ring-background shadow-2xl">
          <AvatarImage src={avatarUrl} alt={name || username} className="object-cover" />
          <AvatarFallback className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
      
      {/* Name with optional verified badge */}
      <div className="flex items-center gap-2 mb-1 animate-slide-up">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          {name || username}
        </h1>
        {isVerified && (
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <Verified className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
      
      {/* Username */}
      <p className="text-muted-foreground mb-3 text-lg animate-slide-up animation-delay-200">
        @{username}
      </p>
      
      {/* Bio */}
      {bio && (
        <p className="text-base md:text-lg max-w-lg text-muted-foreground/90 mb-4 leading-relaxed animate-slide-up animation-delay-400">
          {bio}
        </p>
      )}
      
      {/* Location */}
      {location && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full animate-slide-up animation-delay-600">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
      )}
    </div>
  )
}
