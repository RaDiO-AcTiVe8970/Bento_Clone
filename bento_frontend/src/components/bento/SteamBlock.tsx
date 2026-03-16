"use client"

import { useState, useEffect } from "react"
import { Gamepad2 } from "lucide-react"

/**
 * Steam Player Data Interface
 * Represents the essential player information from Steam API
 */
interface SteamPlayerData {
  steamId: string
  personaName: string
  profileUrl: string
  avatar: string
  personaState: number
  gameExtraInfo: string | null
  realName: string | null
}

/**
 * Steam Block Component Props
 * Controls rendering behavior and block size
 */
interface SteamBlockProps {
  steamId?: string
  title?: string
  isLarge?: boolean
  isMedium?: boolean
  isWide?: boolean
  isTall?: boolean
}

/**
 * Maps Steam persona state numbers to human-readable status strings
 */
const PERSONA_STATE_MAP: Record<number, string> = {
  0: "Offline",
  1: "Online",
  2: "Busy",
  3: "Away",
  4: "Snooze",
  5: "Looking to trade",
  6: "Looking to play",
}

/**
 * Reusable CSS class constants for consistent styling
 */
const STYLES = {
  container: "w-full h-full flex items-center justify-center",
  loadingBg: "bg-gradient-to-br from-slate-700 to-slate-900",
  hoverBg: "hover:from-slate-600 hover:to-slate-800",
  transition: "transition-all duration-300",
  profileLink: "no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
} as const

/**
 * Fetches Steam player data from the server API
 * @param steamId - Steam ID (64-bit numeric ID)
 * @returns Promise resolving to SteamPlayerData or null
 */
async function fetchSteamPlayer(steamId: string): Promise<SteamPlayerData | null> {
  try {
    const response = await fetch(`/api/steam?steamId=${encodeURIComponent(steamId)}`)
    
    if (!response.ok) {
      throw new Error(`Steam API error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error("Failed to fetch Steam player data:", error)
    return null
  }
}

/**
 * Loading State Component
 * Displays during data fetching
 */
function LoadingState() {
  return (
    <div className={`${STYLES.container} ${STYLES.loadingBg}`}>
      <div className="text-center">
        <Gamepad2 className="w-8 h-8 text-white/50 mx-auto mb-2 animate-pulse" />
        <p className="text-white/50 text-xs">Loading...</p>
      </div>
    </div>
  )
}

/**
 * Error State Component
 * Displays when data fetch fails
 */
function ErrorState({ message }: { message: string }) {
  return (
    <div className={`${STYLES.container} ${STYLES.loadingBg}`}>
      <div className="text-center">
        <Gamepad2 className="w-8 h-8 text-white/50 mx-auto mb-2" />
        <p className="text-white/50 text-xs">{message}</p>
      </div>
    </div>
  )
}

/**
 * Online Status Indicator
 * Shows colored dot based on player state
 */
function StatusIndicator({ personaState }: { personaState: number }) {
  const isOnline = personaState === 1
  return (
    <span
      className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-slate-500"}`}
      aria-label={PERSONA_STATE_MAP[personaState] || "Unknown"}
    ></span>
  )
}

/**
 * Large Steam Profile Card (3x2 or bigger)
 * Full profile display with all details
 */
function LargeProfile({ player }: { player: SteamPlayerData }) {
  return (
    <a
      href={player.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-full h-full flex flex-col bg-gradient-to-br from-slate-700 to-slate-900 ${STYLES.hoverBg} ${STYLES.transition} overflow-hidden group ${STYLES.profileLink}`}
    >
      {/* Decorative Header */}
      <div className="w-full h-1/3 bg-gradient-to-r from-amber-600 to-slate-800"></div>

      {/* Profile Content */}
      <div className="flex-1 flex flex-col p-6 relative -mt-12">
        {/* Avatar */}
        <div className="mb-4">
          <img
            src={player.avatar}
            alt={player.personaName}
            className="w-24 h-24 rounded-xl border-4 border-slate-800 shadow-lg object-cover group-hover:scale-105 transition-transform"
            loading="lazy"
          />
        </div>

        {/* Info Section */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
            {player.personaName}
          </h3>
          {player.realName && (
            <p className="text-sm text-white/70 mb-3">{player.realName}</p>
          )}

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 mb-4">
            <StatusIndicator personaState={player.personaState} />
            <span className="text-xs text-white/70">
              {PERSONA_STATE_MAP[player.personaState] || "Unknown"}
            </span>
          </div>

          {/* Currently Playing */}
          {player.gameExtraInfo && (
            <p className="text-sm text-amber-300 font-medium">
              Playing: {player.gameExtraInfo}
            </p>
          )}
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-2 text-amber-400 group-hover:text-amber-300 transition-colors mt-4">
          <Gamepad2 className="w-4 h-4" />
          <span className="text-sm font-medium">View Profile</span>
        </div>
      </div>
    </a>
  )
}

/**
 * Medium/Wide Steam Profile Card (2x1 or 2x2)
 * Horizontal layout with essential info
 */
function MediumProfile({ player }: { player: SteamPlayerData }) {
  return (
    <a
      href={player.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-full h-full flex items-center gap-4 p-4 bg-gradient-to-br from-slate-700 to-slate-900 ${STYLES.hoverBg} ${STYLES.transition} group ${STYLES.profileLink}`}
    >
      {/* Avatar */}
      <img
        src={player.avatar}
        alt={player.personaName}
        className="w-16 h-16 rounded-lg shadow-lg object-cover flex-shrink-0 group-hover:scale-110 transition-transform"
        loading="lazy"
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-white truncate group-hover:text-amber-400 transition-colors">
          {player.personaName}
        </h3>
        <p className="text-xs text-white/70">
          {PERSONA_STATE_MAP[player.personaState] || "Unknown"}
        </p>
        {player.gameExtraInfo && (
          <p className="text-xs text-amber-300 truncate mt-1">
            {player.gameExtraInfo}
          </p>
        )}
      </div>

      {/* Icon */}
      <Gamepad2 className="w-5 h-5 text-amber-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  )
}

/**
 * Small Steam Profile Card (1x1)
 * Compact display with avatar and name
 */
function SmallProfile({ player }: { player: SteamPlayerData }) {
  return (
    <a
      href={player.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-full h-full flex flex-col items-center justify-center p-3 bg-gradient-to-br from-slate-700 to-slate-900 ${STYLES.hoverBg} ${STYLES.transition} group ${STYLES.profileLink}`}
    >
      <img
        src={player.avatar}
        alt={player.personaName}
        className="w-10 h-10 rounded-lg shadow-lg object-cover mb-2 group-hover:scale-110 transition-transform"
        loading="lazy"
      />
      <span className="text-xs font-medium text-white text-center truncate w-full group-hover:text-amber-400 transition-colors">
        {player.personaName}
      </span>
    </a>
  )
}

/**
 * Steam Block Component
 * 
 * Main component that displays a Steam player profile with responsive sizing.
 * Automatically fetches player data from Steam API and renders based on block size.
 * 
 * @component
 * @example
 * ```tsx
 * <SteamBlock 
 *   steamId="76561198286509394" 
 *   isLarge={true}
 *   title="My Steam Profile"
 * />
 * ```
 */
export function SteamBlock({
  steamId,
  title,
  isLarge = false,
  isMedium = false,
  isWide = false,
  isTall = false,
}: SteamBlockProps) {
  const [playerData, setPlayerData] = useState<SteamPlayerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Validate and fetch data
  useEffect(() => {
    if (!steamId) {
      setError("Steam ID is required")
      setLoading(false)
      return
    }

    const loadPlayerData = async () => {
      try {
        setLoading(true)
        const data = await fetchSteamPlayer(steamId)
        
        if (!data) {
          setError("Failed to load Steam profile")
        } else {
          setPlayerData(data)
          setError(null)
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unable to load Steam profile"
        )
        setPlayerData(null)
      } finally {
        setLoading(false)
      }
    }

    loadPlayerData()
  }, [steamId])

  // Render states
  if (loading) return <LoadingState />
  if (error || !playerData) return <ErrorState message={error || "Unable to load profile"} />

  // Responsive rendering based on block size
  if (isLarge) {
    return <LargeProfile player={playerData} />
  }

  if (isMedium || isWide) {
    return <MediumProfile player={playerData} />
  }

  return <SmallProfile player={playerData} />
}
