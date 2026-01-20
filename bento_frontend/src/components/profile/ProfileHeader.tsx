import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin } from "lucide-react"

interface ProfileHeaderProps {
  name: string
  username: string
  bio?: string
  location?: string
  avatarUrl?: string
  isOwner?: boolean
}

export function ProfileHeader({
  name,
  username,
  bio,
  location,
  avatarUrl,
  isOwner = false,
}: ProfileHeaderProps) {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || username?.slice(0, 2).toUpperCase() || "?"

  return (
    <div className="flex flex-col items-center text-center mb-8 animate-fade-in">
      <Avatar className="w-24 h-24 mb-4 ring-4 ring-background shadow-xl">
        <AvatarImage src={avatarUrl} alt={name || username} />
        <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-purple-500 to-pink-500 text-white">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      <h1 className="text-2xl md:text-3xl font-bold mb-1">{name || username}</h1>
      
      <p className="text-muted-foreground mb-2">@{username}</p>
      
      {bio && (
        <p className="text-sm md:text-base max-w-md text-muted-foreground mb-2">
          {bio}
        </p>
      )}
      
      {location && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
      )}
    </div>
  )
}
