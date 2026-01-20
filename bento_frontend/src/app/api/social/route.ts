import { NextRequest, NextResponse } from "next/server"

// Cache for social profile data to avoid rate limiting
const profileCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 1000 * 60 * 60 // 1 hour

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const platform = searchParams.get("platform")
  const username = searchParams.get("username")

  if (!platform || !username) {
    return NextResponse.json({ error: "Missing platform or username" }, { status: 400 })
  }

  const cacheKey = `${platform}:${username}`
  const cached = profileCache.get(cacheKey)
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json(cached.data)
  }

  try {
    let profileData: any = null

    switch (platform) {
      case "github":
        profileData = await fetchGitHubProfile(username)
        break
      case "twitter":
        profileData = await fetchTwitterProfile(username)
        break
      case "instagram":
        profileData = await fetchInstagramProfile(username)
        break
      case "linkedin":
        profileData = await fetchLinkedInProfile(username)
        break
      case "youtube":
        profileData = await fetchYouTubeProfile(username)
        break
      case "facebook":
        profileData = await fetchFacebookProfile(username)
        break
      case "steam":
        profileData = await fetchSteamProfile(username)
        break
      case "discord":
        profileData = await fetchDiscordProfile(username)
        break
      default:
        return NextResponse.json({ error: "Unknown platform" }, { status: 400 })
    }

    if (profileData) {
      profileCache.set(cacheKey, { data: profileData, timestamp: Date.now() })
    }

    return NextResponse.json(profileData || { error: "Profile not found" })
  } catch (error) {
    console.error(`Error fetching ${platform} profile:`, error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

async function fetchGitHubProfile(username: string) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        "Accept": "application/vnd.github.v3+json",
        // Add GitHub token if available for higher rate limits
        ...(process.env.GITHUB_TOKEN && {
          "Authorization": `token ${process.env.GITHUB_TOKEN}`
        })
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!response.ok) return null

    const data = await response.json()
    return {
      platform: "github",
      username: data.login,
      name: data.name || data.login,
      avatar: data.avatar_url,
      bio: data.bio,
      followers: data.followers,
      following: data.following,
      repos: data.public_repos,
      url: data.html_url,
    }
  } catch (error) {
    console.error("GitHub API error:", error)
    return null
  }
}

async function fetchTwitterProfile(username: string) {
  // Twitter API requires authentication, so we'll use a fallback approach
  // Using unavatar.io as a proxy for profile pictures
  try {
    return {
      platform: "twitter",
      username: username,
      name: username,
      avatar: `https://unavatar.io/twitter/${username}`,
      url: `https://twitter.com/${username}`,
    }
  } catch (error) {
    console.error("Twitter profile error:", error)
    return null
  }
}

async function fetchInstagramProfile(username: string) {
  // Instagram API is restricted - use multiple fallback approaches
  try {
    // Primary: use unavatar which aggregates multiple sources
    // Fallbacks include direct profile pic attempts
    return {
      platform: "instagram",
      username: username,
      name: formatDisplayName(username),
      // unavatar tries multiple sources including Gravatar, social, etc
      avatar: `https://unavatar.io/instagram/${username}?fallback=false`,
      avatarFallbacks: [
        `https://i.pravatar.cc/150?u=${username}@instagram`, // Consistent avatar based on username
      ],
      url: `https://instagram.com/${username}`,
    }
  } catch (error) {
    console.error("Instagram profile error:", error)
    return null
  }
}

async function fetchLinkedInProfile(username: string) {
  // LinkedIn API requires OAuth - profile pictures are not publicly accessible
  try {
    return {
      platform: "linkedin",
      username: username,
      name: formatDisplayName(username),
      // unavatar sometimes works for LinkedIn
      avatar: `https://unavatar.io/linkedin/${username}?fallback=false`,
      avatarFallbacks: [
        `https://i.pravatar.cc/150?u=${username}@linkedin`, // Consistent avatar based on username
      ],
      url: `https://linkedin.com/in/${username}`,
    }
  } catch (error) {
    console.error("LinkedIn profile error:", error)
    return null
  }
}

async function fetchFacebookProfile(username: string) {
  // Facebook Graph API for profile info
  try {
    // Facebook profile pictures can be accessed via graph API without auth for public profiles
    const avatar = `https://graph.facebook.com/${username}/picture?type=large&redirect=true&width=200&height=200`
    
    return {
      platform: "facebook",
      username: username,
      name: formatDisplayName(username),
      avatar: avatar,
      avatarFallbacks: [
        `https://unavatar.io/facebook/${username}`,
        `https://www.google.com/s2/favicons?domain=facebook.com&sz=128`,
      ],
      url: `https://facebook.com/${username}`,
    }
  } catch (error) {
    console.error("Facebook profile error:", error)
    return null
  }
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

async function fetchYouTubeProfile(channelId: string) {
  // YouTube Data API for channel info
  try {
    // If it's a handle (@username), we need to resolve it first
    const isHandle = channelId.startsWith('@') || !channelId.startsWith('UC')
    
    if (process.env.YOUTUBE_API_KEY) {
      const searchParam = isHandle 
        ? `forHandle=${channelId.replace('@', '')}`
        : `id=${channelId}`
      
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&${searchParam}&key=${process.env.YOUTUBE_API_KEY}`,
        { next: { revalidate: 3600 } }
      )

      if (response.ok) {
        const data = await response.json()
        if (data.items && data.items.length > 0) {
          const channel = data.items[0]
          return {
            platform: "youtube",
            channelId: channel.id,
            name: channel.snippet.title,
            avatar: channel.snippet.thumbnails?.high?.url || channel.snippet.thumbnails?.default?.url,
            description: channel.snippet.description,
            subscribers: channel.statistics?.subscriberCount,
            videos: channel.statistics?.videoCount,
            url: `https://youtube.com/channel/${channel.id}`,
          }
        }
      }
    }

    // Fallback without API key
    return {
      platform: "youtube",
      channelId: channelId,
      name: channelId.startsWith('@') ? channelId : "YouTube Channel",
      avatar: `https://unavatar.io/youtube/${channelId.replace('@', '')}`,
      url: `https://youtube.com/${channelId.startsWith('@') ? channelId : `channel/${channelId}`}`,
    }
  } catch (error) {
    console.error("YouTube API error:", error)
    return null
  }
}

async function fetchSteamProfile(steamId: string) {
  // Steam Web API for profile info
  try {
    // Check if it's a numeric Steam64 ID or a vanity URL
    const isNumericId = /^\d+$/.test(steamId)
    
    if (process.env.STEAM_API_KEY) {
      let steam64Id = steamId
      
      // If it's a vanity URL, resolve it first
      if (!isNumericId) {
        const resolveResponse = await fetch(
          `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${process.env.STEAM_API_KEY}&vanityurl=${steamId}`,
          { next: { revalidate: 3600 } }
        )
        
        if (resolveResponse.ok) {
          const resolveData = await resolveResponse.json()
          if (resolveData.response?.success === 1) {
            steam64Id = resolveData.response.steamid
          }
        }
      }
      
      // Get player summary
      const summaryResponse = await fetch(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${steam64Id}`,
        { next: { revalidate: 3600 } }
      )
      
      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json()
        if (summaryData.response?.players?.length > 0) {
          const player = summaryData.response.players[0]
          return {
            platform: "steam",
            username: steamId,
            steamId: steam64Id,
            name: player.personaname,
            avatar: player.avatarfull || player.avatarmedium || player.avatar,
            profileState: player.personastate, // 0-6: Offline, Online, Busy, Away, Snooze, Looking to trade, Looking to play
            url: player.profileurl || `https://steamcommunity.com/id/${steamId}`,
          }
        }
      }
    }
    
    // Fallback without API key - use Steam's public avatar CDN
    return {
      platform: "steam",
      username: steamId,
      name: formatDisplayName(steamId),
      // Steam doesn't have a public avatar endpoint without API key
      avatar: null,
      avatarFallbacks: [
        `https://i.pravatar.cc/150?u=${steamId}@steam`,
      ],
      url: `https://steamcommunity.com/id/${steamId}`,
    }
  } catch (error) {
    console.error("Steam API error:", error)
    return null
  }
}

async function fetchDiscordProfile(discordId: string) {
  // Discord doesn't have a public API for user info without OAuth
  // We'll display the ID/invite code with the Discord branding
  try {
    return {
      platform: "discord",
      username: discordId,
      name: discordId, // Discord IDs or invite codes are displayed as-is
      avatar: null, // No public avatar access
      avatarFallbacks: [],
      url: discordId.match(/^\d+$/) 
        ? `https://discord.com/users/${discordId}`
        : `https://discord.gg/${discordId}`,
    }
  } catch (error) {
    console.error("Discord profile error:", error)
    return null
  }
}
