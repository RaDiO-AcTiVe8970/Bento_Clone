"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Upload, FileArchive, Check, AlertCircle, Loader2 } from "lucide-react"
import { parseBentoFile, ParsedBentoData } from "@/lib/bento-parser"

interface BentoImportProps {
  onImport: (data: ParsedBentoData) => Promise<void>
}

export function BentoImport({ onImport }: BentoImportProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedBentoData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsLoading(true)
    setError(null)
    setParsedData(null)

    try {
      const data = await parseBentoFile(file)
      setParsedData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse file")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/zip": [".zip"],
      "application/x-zip-compressed": [".zip"],
      "application/json": [".json"],
    },
    maxFiles: 1,
  })

  const handleImport = async () => {
    if (!parsedData) return

    setIsImporting(true)
    try {
      await onImport(parsedData)
      setIsOpen(false)
      setParsedData(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import data")
    } finally {
      setIsImporting(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setParsedData(null)
    setError(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Import from Bento.me
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import from Bento.me</DialogTitle>
          <DialogDescription>
            Upload your Bento.me export ZIP file to import your profile and blocks.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-colors duration-200
              ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}
              ${error ? "border-destructive" : ""}
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
              {isLoading ? (
                <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
              ) : (
                <FileArchive className="w-10 h-10 text-muted-foreground" />
              )}
              {isDragActive ? (
                <p className="text-sm text-muted-foreground">Drop the file here...</p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Drag & drop your Bento.me export ZIP file here
                  </p>
                  <p className="text-xs text-muted-foreground">or click to browse (.zip)</p>
                </>
              )}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Preview of parsed data */}
          {parsedData && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  File parsed successfully
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {parsedData.profile.name && (
                  <p><span className="text-muted-foreground">Name:</span> {parsedData.profile.name}</p>
                )}
                {parsedData.profile.username && (
                  <p><span className="text-muted-foreground">Username:</span> @{parsedData.profile.username}</p>
                )}
                {parsedData.profile.bio && (
                  <p><span className="text-muted-foreground">Bio:</span> {parsedData.profile.bio}</p>
                )}
                <p>
                  <span className="text-muted-foreground">Blocks:</span>{" "}
                  {parsedData.blocks.length} block{parsedData.blocks.length !== 1 ? "s" : ""} found
                </p>
                {parsedData.blocks.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {parsedData.blocks.slice(0, 5).map((block, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-muted rounded text-xs"
                      >
                        {block.type}
                      </span>
                    ))}
                    {parsedData.blocks.length > 5 && (
                      <span className="px-2 py-1 bg-muted rounded text-xs">
                        +{parsedData.blocks.length - 5} more
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">How to export from Bento.me:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Go to your Bento.me dashboard</li>
              <li>Click on Settings → Export Data</li>
              <li>Download the JSON file</li>
              <li>Upload it here</li>
            </ol>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!parsedData || isImporting}
          >
            {isImporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Import {parsedData?.blocks.length || 0} Blocks
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
