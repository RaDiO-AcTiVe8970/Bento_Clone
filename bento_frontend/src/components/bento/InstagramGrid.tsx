"use client"

import { Instagram } from "lucide-react"
import { cn } from "@/lib/utils"
import type { InstagramPost } from "@/hooks/useSocialProfile"
import { useState } from "react"

interface InstagramGridProps {
  posts?: InstagramPost[]
  username?: string
  profileUrl?: string
  isSmall?: boolean
  isMedium?: boolean
  isLarge?: boolean
  isWide?: boolean
  isTall?: boolean
}

export function InstagramGrid({
  posts = [],
  username = "",
  profileUrl = "",
  isSmall,
  isMedium,
  isLarge,
  isWide,
  isTall,
}: InstagramGridProps) {
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null)
  const displayPosts: InstagramPost[] = posts.length > 0 ? posts : [...Array(6)].map((_, i) => ({
    id: `placeholder-${i}`,
    caption: `Post ${i + 1}`,
    isPlaceholder: true,
  } as InstagramPost))

  // Determine grid layout based on size
  let gridColsClass = "grid-cols-3"
  let postCount = 6

  if (isLarge || isTall) {
    gridColsClass = "grid-cols-3"
    postCount = 9
  } else if (isWide) {
    gridColsClass = "grid-cols-4"
    postCount = 8
  }

  const visiblePosts = displayPosts.slice(0, postCount)

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 grid gap-1 auto-rows-max" style={{ gridTemplateColumns: `repeat(${gridColsClass.match(/\d+/)?.[0]}, minmax(0, 1fr))` }}>
        {visiblePosts.map((post, i) => (
          <a
            key={post.id}
            href={post.permalink || profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (post.permalink) {
                e.preventDefault()
                setSelectedPost(post)
              }
            }}
            className="group relative aspect-square rounded overflow-hidden hover:opacity-80 transition-all hover:scale-105 cursor-pointer"
          >
            {post.imageUrl && !post.isPlaceholder ? (
              <>
                <img 
                  src={post.imageUrl} 
                  alt={post.caption || `Instagram post`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="text-center">
                    <Instagram className="w-6 h-6 text-white mb-2 mx-auto" />
                    {post.caption && (
                      <p className="text-white text-xs px-2 line-clamp-2">
                        {post.caption}
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className={cn(
                "w-full h-full flex items-center justify-center animate-pulse",
                i % 3 === 0 ? "bg-gradient-to-br from-pink-500/50 to-purple-500/50" : 
                i % 2 === 0 ? "bg-gradient-to-br from-purple-500/50 to-orange-400/50" : 
                "bg-gradient-to-br from-orange-400/50 to-pink-500/50"
              )}>
                <Instagram className="w-6 h-6 text-white/40" />
              </div>
            )}
          </a>
        ))}
      </div>

      {/* Modal for full post view */}
      {selectedPost && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPost(null)}
        >
          <div 
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-4 flex-col md:flex-row">
              {selectedPost.imageUrl && (
                <div className="md:w-1/2 bg-black flex items-center justify-center min-h-[300px]">
                  <img 
                    src={selectedPost.imageUrl} 
                    alt={selectedPost.caption || "Instagram post"}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="flex-1 p-4 flex flex-col">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <Instagram className="w-6 h-6 text-pink-500" />
                  <div>
                    <p className="font-semibold text-sm">@{username}</p>
                    {selectedPost.timestamp && (
                      <p className="text-xs text-gray-500">
                        {new Date(selectedPost.timestamp).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {selectedPost.caption && (
                  <p className="mt-4 text-sm text-gray-700 flex-1">
                    {selectedPost.caption}
                  </p>
                )}

                <div className="mt-4 pt-4 border-t">
                  <a
                    href={selectedPost.permalink || profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors"
                  >
                    View on Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
