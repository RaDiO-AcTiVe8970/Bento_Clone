// Bento.me Export Parser
// This handles importing data from Bento.me ZIP exports

import JSZip from 'jszip'

export interface BentoExportBlock {
  id?: string
  type: string
  title?: string
  subtitle?: string
  link?: string
  image?: string
  content?: string
  position?: {
    x: number
    y: number
    w: number
    h: number
  }
  style?: {
    backgroundColor?: string
    textColor?: string
    borderRadius?: number
  }
}

export interface BentoExport {
  version?: string
  profile?: {
    name?: string
    username?: string
    bio?: string
    avatar?: string
    location?: string
  }
  blocks?: BentoExportBlock[]
  theme?: {
    background?: string
    primaryColor?: string
    textColor?: string
  }
  // Alternative structures that Bento might use
  items?: BentoExportBlock[]
  widgets?: BentoExportBlock[]
  links?: Array<{
    title?: string
    url?: string
    icon?: string
  }>
}

// Map Bento.me block types to our internal types
const blockTypeMap: Record<string, string> = {
  'link': 'LINK',
  'url': 'LINK',
  'text': 'TEXT',
  'note': 'TEXT',
  'image': 'IMAGE',
  'photo': 'IMAGE',
  'map': 'MAP',
  'location': 'MAP',
  'spotify': 'SPOTIFY',
  'music': 'SPOTIFY',
  'youtube': 'YOUTUBE',
  'video': 'YOUTUBE',
  'github': 'GITHUB',
  'twitter': 'TWITTER',
  'x': 'TWITTER',
  'instagram': 'INSTAGRAM',
  'linkedin': 'LINKEDIN',
  'social': 'LINK',
  'custom': 'CUSTOM',
  'embed': 'CUSTOM',
}

export interface ParsedBlock {
  type: string
  title?: string
  content?: Record<string, unknown>
  url?: string
  imageUrl?: string
  gridX: number
  gridY: number
  gridWidth: number
  gridHeight: number
  backgroundColor?: string
  textColor?: string
  borderRadius?: number
}

export interface ParsedBentoData {
  profile: {
    name?: string
    username?: string
    bio?: string
    avatar?: string
    location?: string
  }
  blocks: ParsedBlock[]
  theme?: {
    background?: string
    primaryColor?: string
    textColor?: string
  }
}

function normalizeBlockType(type: string): string {
  const normalized = type.toLowerCase().trim()
  return blockTypeMap[normalized] || 'CUSTOM'
}

function parseBlock(block: BentoExportBlock, index: number): ParsedBlock {
  const type = normalizeBlockType(block.type || 'link')
  
  // Default grid positioning if not provided
  const gridX = block.position?.x ?? (index % 4)
  const gridY = block.position?.y ?? Math.floor(index / 4)
  const gridWidth = block.position?.w ?? 1
  const gridHeight = block.position?.h ?? 1

  return {
    type,
    title: block.title || block.subtitle,
    content: block.content ? { text: block.content } : undefined,
    url: block.link,
    imageUrl: block.image,
    gridX,
    gridY,
    gridWidth,
    gridHeight,
    backgroundColor: block.style?.backgroundColor,
    textColor: block.style?.textColor,
    borderRadius: block.style?.borderRadius,
  }
}

export function parseBentoExport(data: unknown): ParsedBentoData {
  const exportData = data as BentoExport

  // Extract blocks from various possible structures
  let blocks: BentoExportBlock[] = []
  
  if (Array.isArray(exportData.blocks)) {
    blocks = exportData.blocks
  } else if (Array.isArray(exportData.items)) {
    blocks = exportData.items
  } else if (Array.isArray(exportData.widgets)) {
    blocks = exportData.widgets
  } else if (Array.isArray(exportData.links)) {
    // Convert simple links to blocks
    blocks = exportData.links.map((link) => ({
      type: 'link',
      title: link.title,
      link: link.url,
      image: link.icon,
    }))
  } else if (Array.isArray(data)) {
    // If the export is just an array of blocks
    blocks = data as BentoExportBlock[]
  }

  // Parse each block
  const parsedBlocks = blocks.map((block, index) => parseBlock(block, index))

  // Extract profile data
  const profile = {
    name: exportData.profile?.name,
    username: exportData.profile?.username,
    bio: exportData.profile?.bio,
    avatar: exportData.profile?.avatar,
    location: exportData.profile?.location,
  }

  return {
    profile,
    blocks: parsedBlocks,
    theme: exportData.theme,
  }
}

export function validateBentoExport(data: unknown): { valid: boolean; error?: string } {
  if (!data) {
    return { valid: false, error: 'No data provided' }
  }

  if (typeof data !== 'object') {
    return { valid: false, error: 'Invalid data format - expected JSON object' }
  }

  const exportData = data as BentoExport

  // Check if it has any recognizable structure
  const hasBlocks = Array.isArray(exportData.blocks)
  const hasItems = Array.isArray(exportData.items)
  const hasWidgets = Array.isArray(exportData.widgets)
  const hasLinks = Array.isArray(exportData.links)
  const isArray = Array.isArray(data)

  if (!hasBlocks && !hasItems && !hasWidgets && !hasLinks && !isArray) {
    return { 
      valid: false, 
      error: 'Could not find blocks, items, widgets, or links in the export file' 
    }
  }

  return { valid: true }
}

// Parse from file content (handles both ZIP and JSON)
export async function parseBentoFile(file: File): Promise<ParsedBentoData> {
  const isZip = file.type === 'application/zip' || 
                file.type === 'application/x-zip-compressed' ||
                file.name.endsWith('.zip')
  
  if (isZip) {
    return parseZipFile(file)
  }
  
  // Handle JSON file directly
  const text = await file.text()
  return parseJsonContent(text)
}

// Parse ZIP file from Bento.me export
async function parseZipFile(file: File): Promise<ParsedBentoData> {
  try {
    const zip = await JSZip.loadAsync(file)
    
    // Look for JSON files in the ZIP
    const jsonFiles: string[] = []
    const imageFiles: Map<string, string> = new Map()
    
    zip.forEach((relativePath, zipEntry) => {
      if (relativePath.endsWith('.json')) {
        jsonFiles.push(relativePath)
      } else if (/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(relativePath)) {
        imageFiles.set(relativePath, relativePath)
      }
    })
    
    if (jsonFiles.length === 0) {
      throw new Error('No JSON data file found in the ZIP archive')
    }
    
    // Try to find the main data file
    // Common names: data.json, export.json, bento.json, profile.json, or just the first JSON
    const priorityNames = ['data.json', 'export.json', 'bento.json', 'profile.json', 'backup.json']
    let mainJsonFile = jsonFiles[0]
    
    for (const name of priorityNames) {
      const found = jsonFiles.find(f => f.toLowerCase().endsWith(name))
      if (found) {
        mainJsonFile = found
        break
      }
    }
    
    const jsonContent = await zip.file(mainJsonFile)?.async('string')
    
    if (!jsonContent) {
      throw new Error('Could not read the data file from ZIP archive')
    }
    
    const parsedData = parseJsonContent(jsonContent)
    
    // Process embedded images from ZIP
    // Convert image paths to base64 data URLs for blocks that reference local images
    for (const block of parsedData.blocks) {
      if (block.imageUrl && !block.imageUrl.startsWith('http')) {
        // Try to find the image in the ZIP
        const imagePath = findImageInZip(block.imageUrl, imageFiles)
        if (imagePath) {
          const imageFile = zip.file(imagePath)
          if (imageFile) {
            const imageData = await imageFile.async('base64')
            const extension = imagePath.split('.').pop()?.toLowerCase() || 'png'
            const mimeType = getMimeType(extension)
            block.imageUrl = `data:${mimeType};base64,${imageData}`
          }
        }
      }
    }
    
    // Also handle profile avatar
    if (parsedData.profile.avatar && !parsedData.profile.avatar.startsWith('http')) {
      const avatarPath = findImageInZip(parsedData.profile.avatar, imageFiles)
      if (avatarPath) {
        const avatarFile = zip.file(avatarPath)
        if (avatarFile) {
          const avatarData = await avatarFile.async('base64')
          const extension = avatarPath.split('.').pop()?.toLowerCase() || 'png'
          const mimeType = getMimeType(extension)
          parsedData.profile.avatar = `data:${mimeType};base64,${avatarData}`
        }
      }
    }
    
    return parsedData
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse ZIP file: ${error.message}`)
    }
    throw new Error('Failed to parse ZIP file')
  }
}

function findImageInZip(imagePath: string, imageFiles: Map<string, string>): string | undefined {
  // Direct match
  if (imageFiles.has(imagePath)) {
    return imagePath
  }
  
  // Try without leading slash or path
  const fileName = imagePath.split('/').pop()
  if (fileName) {
    for (const [path] of imageFiles) {
      if (path.endsWith(fileName)) {
        return path
      }
    }
  }
  
  return undefined
}

function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
  }
  return mimeTypes[extension] || 'image/png'
}

function parseJsonContent(text: string): ParsedBentoData {
  try {
    const data = JSON.parse(text)
    const validation = validateBentoExport(data)
    
    if (!validation.valid) {
      throw new Error(validation.error)
    }
    
    return parseBentoExport(data)
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON data. The export file may be corrupted.')
    }
    throw error
  }
}
