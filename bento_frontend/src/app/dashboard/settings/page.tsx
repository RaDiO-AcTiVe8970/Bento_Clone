"use client"

import { useState, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Save, Loader2, Upload as UploadIcon, X } from "lucide-react"

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    username: session?.user?.username || "",
    bio: session?.user?.bio || "",
    image: session?.user?.image || "",
  })

  const user = session?.user
  const initials = user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?"

  const resizeImage = (dataUrl: string, maxWidth: number = 400, maxHeight: number = 400): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }

        // Create canvas and draw resized image
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Failed to get canvas context"))
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL("image/jpeg", 0.85))
      }
      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = dataUrl
    })
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 5MB before resize)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB")
      return
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    setUploadingImage(true)
    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string
        const resizedBase64 = await resizeImage(dataUrl, 400, 400)
        setPreviewImage(resizedBase64)
        setFormData({ ...formData, image: resizedBase64 })
        setUploadingImage(false)
      }
      reader.onerror = () => {
        setUploadingImage(false)
        alert("Failed to read file")
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error processing image:", error)
      alert("Failed to process image")
      setUploadingImage(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: "" })
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await update()
        router.refresh()
      }
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    router.push("/login")
    return null
  }

  return (
    <main className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <span className="font-semibold">Settings</span>
          </div>
          
          <Avatar className="w-9 h-9">
            <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Update your profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={previewImage || formData.image || user?.image || ""} alt={user?.name || ""} />
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-2">Profile Photo</p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <UploadIcon className="w-4 h-4 mr-1" />
                          Upload
                        </>
                      )}
                    </Button>
                    {formData.image && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveImage}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {formData.image ? "Custom photo selected" : "No custom photo set"}
                  </p>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Display Name
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                />
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-1">bentoportfolio.me/</span>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      username: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "") 
                    })}
                    placeholder="username"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Only lowercase letters, numbers, hyphens, and underscores
                </p>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell people about yourself..."
                  className="flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {formData.bio.length}/160
                </p>
              </div>

              {/* Submit */}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </main>
  )
}
