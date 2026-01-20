"use client"

import { BentoImport } from "@/components/import/BentoImport"
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

  return <BentoImport onImport={handleImport} />
}
