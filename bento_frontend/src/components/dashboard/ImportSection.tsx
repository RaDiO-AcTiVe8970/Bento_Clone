"use client"

import { BentoImport } from "@/components/import/BentoImport"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload } from "lucide-react"
import { ParsedBentoData } from "@/lib/bento-parser"

export function ImportSection() {
  const handleImport = async (data: ParsedBentoData) => {
    try {
      // Create blocks via API
      const response = await fetch("/api/blocks/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to import blocks")
      }

      // Reload the page to see imported blocks
      window.location.reload()
    } catch (error) {
      console.error("Import error:", error)
      throw error
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow h-full">
      <CardHeader>
        <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
          <Upload className="w-6 h-6 text-orange-600" />
        </div>
        <CardTitle>Import from Bento</CardTitle>
        <CardDescription className="mb-4">
          Import your existing Bento.me profile
        </CardDescription>
        <BentoImport onImport={handleImport} />
      </CardHeader>
    </Card>
  )
}
