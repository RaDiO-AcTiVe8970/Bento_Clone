"use client"

import { useEffect, useState } from "react"
import { CopyLinkButton } from "./CopyLinkButton"

interface ProfileLinkDisplayProps {
  username: string
}

export function ProfileLinkDisplay({ username }: ProfileLinkDisplayProps) {
  const [origin, setOrigin] = useState("bento.me")

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  return (
    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
      <code className="flex-1 text-sm">
        {origin}/{username}
      </code>
      <CopyLinkButton username={username} />
    </div>
  )
}
