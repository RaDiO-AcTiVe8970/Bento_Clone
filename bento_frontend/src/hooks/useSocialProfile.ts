"use client"

import { useState, useEffect } from "react"

export interface SocialProfile {
  platform: string
  username?: string
  channelId?: string
  name: string
  avatar?: string
  avatarFallbacks?: string[]
  bio?: string
  description?: string
  followers?: number
  following?: number
  repos?: number
  subscribers?: string
  videos?: string
  url: string
}

// In-memory cache for client-side
const clientCache = new Map<string, { data: SocialProfile; timestamp: number }>()
const CLIENT_CACHE_DURATION = 1000 * 60 * 30 // 30 minutes

export function useSocialProfile(platform: string | null, username: string | null) {
  const [profile, setProfile] = useState<SocialProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!platform || !username) {
      setProfile(null)
      return
    }

    const cacheKey = `${platform}:${username}`
    const cached = clientCache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < CLIENT_CACHE_DURATION) {
      setProfile(cached.data)
      return
    }

    const fetchProfile = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `/api/social?platform=${encodeURIComponent(platform)}&username=${encodeURIComponent(username)}`
        )

        if (!response.ok) {
          throw new Error("Failed to fetch profile")
        }

        const data = await response.json()
        
        if (data.error) {
          setError(data.error)
          setProfile(null)
        } else {
          setProfile(data)
          clientCache.set(cacheKey, { data, timestamp: Date.now() })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [platform, username])

  return { profile, loading, error }
}

// Helper to get avatar URL directly (for immediate display before API call)
export function getAvatarFallback(platform: string, username: string): string {
  switch (platform) {
    case "github":
      return `https://github.com/${username}.png`
    case "twitter":
      return `https://unavatar.io/twitter/${username}`
    case "instagram":
      // Use multiple fallback approaches for Instagram
      return `https://unavatar.io/instagram/${username}`
    case "linkedin":
      return `https://unavatar.io/linkedin/${username}`
    case "youtube":
      return `https://unavatar.io/youtube/${username.replace('@', '')}`
    case "facebook":
      // Facebook Graph API allows direct profile picture access
      return `https://graph.facebook.com/${username}/picture?type=large&redirect=true&width=200&height=200`
    case "steam":
      // Steam needs API key for avatars, return empty for fallback to icon
      return ""
    case "discord":
      // Discord doesn't expose avatars publicly
      return ""
    default:
      return ""
  }
}
