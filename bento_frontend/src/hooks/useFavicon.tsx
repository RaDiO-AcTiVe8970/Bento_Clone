"use client"

import { useState, useEffect } from "react"

interface FaviconData {
  favicon: string | null
  loading: boolean
  error: boolean
}

// Get favicon URL from a website URL
export function getFaviconUrl(url: string): string[] {
  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname
    
    // Return multiple favicon sources to try (in order of preference)
    return [
      // Google's favicon service (most reliable)
      `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      // DuckDuckGo favicon service
      `https://icons.duckduckgo.com/ip3/${domain}.ico`,
      // Direct favicon from website
      `${urlObj.origin}/favicon.ico`,
      // Apple touch icon (usually higher quality)
      `${urlObj.origin}/apple-touch-icon.png`,
      // Favicon.ico fallback
      `https://favicon.ico/${domain}`,
    ]
  } catch {
    return []
  }
}

// Extract domain name from URL for display
export function getDomainName(url: string): string {
  try {
    const urlObj = new URL(url)
    // Remove 'www.' prefix if present
    return urlObj.hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

// Custom hook to fetch and manage favicon
export function useFavicon(url: string | undefined): FaviconData {
  const [favicon, setFavicon] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!url) {
      setLoading(false)
      setError(true)
      return
    }

    const faviconUrls = getFaviconUrl(url)
    if (faviconUrls.length === 0) {
      setLoading(false)
      setError(true)
      return
    }

    // Try the first favicon URL (Google's service is most reliable)
    setFavicon(faviconUrls[0])
    setLoading(false)
    setError(false)
  }, [url])

  return { favicon, loading, error }
}

// Favicon image component with fallback
interface FaviconImageProps {
  url: string | undefined
  size?: number
  className?: string
  fallback?: React.ReactNode
}

export function FaviconImage({ url, size = 32, className = "", fallback }: FaviconImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [imgError, setImgError] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const faviconUrls = url ? getFaviconUrl(url) : []

  useEffect(() => {
    if (faviconUrls.length > 0) {
      setImgSrc(faviconUrls[0])
      setCurrentIndex(0)
      setImgError(false)
    }
  }, [url])

  const handleError = () => {
    // Try next favicon source
    const nextIndex = currentIndex + 1
    if (nextIndex < faviconUrls.length) {
      setCurrentIndex(nextIndex)
      setImgSrc(faviconUrls[nextIndex])
    } else {
      setImgError(true)
    }
  }

  if (!url || imgError || !imgSrc) {
    return <>{fallback}</>
  }

  return (
    <img
      src={imgSrc}
      alt="Website favicon"
      width={size}
      height={size}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  )
}
