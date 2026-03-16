import { NextRequest, NextResponse } from "next/server"

/**
 * Steam Web API Response Types
 * Typing for the Steam GetPlayerSummaries API response
 */
interface SteamPlayerSummary {
  steamid: string
  communityvisibilitystate: number
  profilestate: number
  personaname: string
  profileurl: string
  avatar: string
  avatarmedium: string
  avatarfull: string
  personastate: number
  personastateflags?: number
  realname?: string
  primaryclanid?: string
  timecreated?: number
  lastlogoff?: number
  commentpermission?: number
  gameid?: string
  gameserverip?: string
  gameextrainfo?: string
}

interface SteamAPIResponse {
  response: {
    players: SteamPlayerSummary[]
  }
}

/**
 * Application Response Type
 * Clean, minimal player data returned to frontend
 */
interface PlayerResponse {
  steamId: string
  personaName: string
  profileUrl: string
  avatar: string
  personaState: number
  gameExtraInfo: string | null
  realName: string | null
}

/**
 * Environment validation
 * Ensures required configuration is present
 */
function validateConfig(): string {
  const apiKey = process.env.STEAM_API_KEY
  if (!apiKey) {
    throw new Error("STEAM_API_KEY environment variable is not configured")
  }
  return apiKey
}

/**
 * Validates and normalizes Steam ID
 * Accepts 64-bit numeric IDs and returns them as-is
 */
function validateSteamId(steamId: string): string {
  const trimmed = steamId.trim()
  
  // Check if it's a valid 64-bit Steam ID (numeric, 17 digits)
  if (!/^\d{17}$/.test(trimmed)) {
    throw new Error(
      `Invalid Steam ID format. Expected 17-digit numeric ID, got: ${trimmed}`
    )
  }
  
  return trimmed
}

/**
 * Fetches player data from Steam Web API
 * 
 * @param steamId - 64-bit Steam ID
 * @param apiKey - Steam Web API key
 * @returns Promise<SteamPlayerSummary> Player data from Steam
 */
async function fetchFromSteamAPI(
  steamId: string,
  apiKey: string
): Promise<SteamPlayerSummary> {
  const steamApiUrl = new URL(
    "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/"
  )
  steamApiUrl.searchParams.append("key", apiKey)
  steamApiUrl.searchParams.append("steamids", steamId)

  const response = await fetch(steamApiUrl.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 3600 }, // Cache for 1 hour
  })

  if (!response.ok) {
    throw new Error(
      `Steam API returned ${response.status}: ${response.statusText}`
    )
  }

  const data: SteamAPIResponse = await response.json()

  if (!data.response?.players?.[0]) {
    throw new Error("Player not found on Steam")
  }

  return data.response.players[0]
}

/**
 * Transforms Steam API response to application response
 * Filters to only necessary fields and applies defaults
 */
function transformPlayerData(player: SteamPlayerSummary): PlayerResponse {
  return {
    steamId: player.steamid,
    personaName: player.personaname,
    profileUrl: player.profileurl,
    avatar: player.avatarfull,
    personaState: player.personastate,
    gameExtraInfo: player.gameextrainfo || null,
    realName: player.realname || null,
  }
}

/**
 * GET /api/steam
 * 
 * Fetches Steam player data and returns formatted response
 * 
 * Query Parameters:
 *   - steamId (required): 64-bit Steam ID
 * 
 * Responses:
 *   - 200: Player data successfully fetched
 *   - 400: Missing or invalid steamId parameter
 *   - 404: Player not found
 *   - 500: Configuration or API error
 * 
 * @example
 * ```
 * GET /api/steam?steamId=76561198286509394
 * ```
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Extract and validate query parameters
    const { searchParams } = new URL(request.url)
    const steamId = searchParams.get("steamId")

    if (!steamId) {
      return NextResponse.json(
        { error: "Steam ID is required", code: "MISSING_STEAM_ID" },
        { status: 400 }
      )
    }

    // Validate configuration
    const apiKey = validateConfig()

    // Validate and normalize Steam ID
    const validatedSteamId = validateSteamId(steamId)

    // Fetch from Steam API
    const playerData = await fetchFromSteamAPI(validatedSteamId, apiKey)

    // Transform to response format
    const response = transformPlayerData(playerData)

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    // Log error for debugging
    console.error("[Steam API Error]", error)

    // Determine error response
    if (error instanceof Error) {
      if (error.message.includes("Invalid Steam ID")) {
        return NextResponse.json(
          { error: error.message, code: "INVALID_STEAM_ID" },
          { status: 400 }
        )
      }

      if (error.message.includes("not found")) {
        return NextResponse.json(
          { error: error.message, code: "PLAYER_NOT_FOUND" },
          { status: 404 }
        )
      }

      if (error.message.includes("not configured")) {
        return NextResponse.json(
          { error: "Server configuration error", code: "CONFIG_ERROR" },
          { status: 500 }
        )
      }
    }

    // Generic error response
    return NextResponse.json(
      {
        error: "Failed to fetch Steam player data",
        code: "UNKNOWN_ERROR",
      },
      { status: 500 }
    )
  }
}
