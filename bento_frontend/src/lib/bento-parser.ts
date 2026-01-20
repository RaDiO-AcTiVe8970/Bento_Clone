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
// Bento.me exports contain: profile.txt and images/ folder
async function parseZipFile(file: File): Promise<ParsedBentoData> {
  try {
    const zip = await JSZip.loadAsync(file)
    
    // Collect all files in the ZIP
    const textFiles: string[] = []
    const jsonFiles: string[] = []
    const imageFiles: Map<string, string> = new Map()
    
    zip.forEach((relativePath, zipEntry) => {
      const lowerPath = relativePath.toLowerCase()
      if (lowerPath.endsWith('.txt')) {
        textFiles.push(relativePath)
      } else if (lowerPath.endsWith('.json')) {
        jsonFiles.push(relativePath)
      } else if (/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(relativePath)) {
        imageFiles.set(relativePath, relativePath)
      }
    })
    
    // Look for profile.txt first (Bento.me's actual export format)
    const profileTxt = textFiles.find(f => f.toLowerCase().includes('profile'))
    
    if (profileTxt) {
      const textContent = await zip.file(profileTxt)?.async('string')
      if (textContent) {
        return parseProfileTxt(textContent, zip, imageFiles)
      }
    }
    
    // Fallback to JSON if no profile.txt found
    if (jsonFiles.length > 0) {
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
      if (jsonContent) {
        const parsedData = parseJsonContent(jsonContent)
        await processImagesInData(parsedData, zip, imageFiles)
        return parsedData
      }
    }
    
    throw new Error('No profile.txt or JSON data file found in the ZIP archive')
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse ZIP file: ${error.message}`)
    }
    throw new Error('Failed to parse ZIP file')
  }
}

// Parse Bento.me's profile.txt format
// Format:
// Section Name ↯
// ==============
// Text: Some text content
// https://url.com
async function parseProfileTxt(
  content: string, 
  zip: JSZip, 
  imageFiles: Map<string, string>
): Promise<ParsedBentoData> {
  const lines = content.split('\n')
  
  const profile: ParsedBentoData['profile'] = {}
  const blocks: ParsedBlock[] = []
  
  let currentSection = ''
  let blockIndex = 0
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Skip empty lines
    if (!line) continue
    
    // Check for section headers (e.g., "Intro ↯" followed by "=======")
    // Section header has ↯ symbol or next line is all = or -
    if (line.includes('↯') || (lines[i + 1] && /^[=\-]+$/.test(lines[i + 1]?.trim()))) {
      // Extract section name (remove ↯ symbol)
      currentSection = line.replace('↯', '').trim().toLowerCase()
      // Skip the === line if present
      if (lines[i + 1] && /^[=\-]+$/.test(lines[i + 1]?.trim())) {
        i++
      }
      continue
    }
    
    // Skip separator lines
    if (/^[=\-]+$/.test(line)) continue
    
    // Check for "Text:" content
    if (line.startsWith('Text:')) {
      const textContent = line.slice(5).trim()
      if (textContent) {
        blocks.push({
          type: 'TEXT',
          title: getSectionTitle(currentSection),
          content: { text: textContent },
          url: undefined,
          imageUrl: undefined,
          gridX: blockIndex % 4,
          gridY: Math.floor(blockIndex / 4),
          gridWidth: 2, // Text blocks are wider
          gridHeight: 1,
        })
        blockIndex++
      }
      continue
    }
    
    // Check for URLs (http:// or https://)
    if (line.startsWith('http://') || line.startsWith('https://')) {
      const url = line.trim()
      const { type, title } = detectTypeAndTitleFromUrl(url, currentSection)
      
      blocks.push({
        type,
        title,
        content: undefined,
        url,
        imageUrl: undefined,
        gridX: blockIndex % 4,
        gridY: Math.floor(blockIndex / 4),
        gridWidth: 1,
        gridHeight: 1,
      })
      blockIndex++
      continue
    }
  }
  
  // Process images from ZIP
  const parsedData: ParsedBentoData = { profile, blocks }
  await processImagesInData(parsedData, zip, imageFiles)
  
  return parsedData
}

// Get a nice title for text blocks based on section
function getSectionTitle(section: string): string {
  const titles: Record<string, string> = {
    'intro': 'About Me',
    'skills': 'Skills',
    'social media': 'Social',
    'for you': 'For You',
    'photo exhibit': 'Gallery',
    'outro': 'Contact',
  }
  return titles[section] || 'Info'
}

// Detect block type and generate title from URL
function detectTypeAndTitleFromUrl(url: string, section: string): { type: string; title: string } {
  const lowerUrl = url.toLowerCase()
  
  // GitHub
  if (lowerUrl.includes('github.com')) {
    const match = url.match(/github\.com\/([^\/\?]+)/)
    return { type: 'GITHUB', title: match ? `GitHub - ${match[1]}` : 'GitHub' }
  }
  
  // Figma
  if (lowerUrl.includes('figma.com')) {
    return { type: 'LINK', title: 'Figma' }
  }
  
  // YouTube
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    return { type: 'YOUTUBE', title: 'YouTube' }
  }
  
  // Instagram
  if (lowerUrl.includes('instagram.com')) {
    const match = url.match(/instagram\.com\/([^\/\?]+)/)
    return { type: 'INSTAGRAM', title: match ? `@${match[1]}` : 'Instagram' }
  }
  
  // Twitch
  if (lowerUrl.includes('twitch.tv')) {
    const match = url.match(/twitch\.tv\/([^\/\?]+)/)
    return { type: 'LINK', title: match ? `Twitch - ${match[1]}` : 'Twitch' }
  }
  
  // Facebook
  if (lowerUrl.includes('facebook.com')) {
    const match = url.match(/facebook\.com\/(?:profile\.php\?id=)?([^\/\?&]+)/)
    return { type: 'FACEBOOK', title: match ? match[1] : 'Facebook' }
  }
  
  // Twitter/X
  if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
    const match = url.match(/(?:twitter|x)\.com\/([^\/\?]+)/)
    return { type: 'TWITTER', title: match ? `@${match[1]}` : 'Twitter' }
  }
  
  // LinkedIn
  if (lowerUrl.includes('linkedin.com')) {
    return { type: 'LINKEDIN', title: 'LinkedIn' }
  }
  
  // Spotify
  if (lowerUrl.includes('spotify.com')) {
    if (lowerUrl.includes('/playlist/')) {
      return { type: 'SPOTIFY', title: 'Spotify Playlist' }
    }
    return { type: 'SPOTIFY', title: 'Spotify' }
  }
  
  // Steam
  if (lowerUrl.includes('steamcommunity.com')) {
    const idMatch = url.match(/steamcommunity\.com\/id\/([^\/\?]+)/)
    const profileMatch = url.match(/steamcommunity\.com\/profiles\/(\d+)/)
    const username = idMatch ? idMatch[1] : (profileMatch ? profileMatch[1] : null)
    return { type: 'STEAM', title: username || 'Steam' }
  }
  
  // Discord
  if (lowerUrl.includes('discord.com') || lowerUrl.includes('discord.gg')) {
    // Discord invite links: discord.gg/invite or discord.com/invite/code
    const inviteMatch = url.match(/(?:discord\.gg|discord\.com\/invite)\/([^\/\?\s]+)/)
    // Discord user profile: discord.com/users/id
    const userMatch = url.match(/discord\.com\/users\/(\d+)/)
    const id = inviteMatch ? inviteMatch[1] : (userMatch ? userMatch[1] : null)
    return { type: 'DISCORD', title: id || 'Discord' }
  }
  
  // Shutterstock
  if (lowerUrl.includes('shutterstock.com')) {
    return { type: 'LINK', title: 'Shutterstock Portfolio' }
  }
  
  // Google Maps
  if (lowerUrl.includes('google.com/maps') || lowerUrl.includes('maps.google')) {
    return { type: 'MAP', title: 'Location' }
  }
  
  // Default based on section
  const sectionTitles: Record<string, string> = {
    'social media': 'Social Link',
    'skills': 'Portfolio',
    'for you': 'Link',
    'photo exhibit': 'Gallery',
  }
  
  return { type: 'LINK', title: sectionTitles[section] || 'Link' }
}

// Process images in parsed data - convert local paths to base64
async function processImagesInData(
  parsedData: ParsedBentoData,
  zip: JSZip,
  imageFiles: Map<string, string>
): Promise<void> {
  // Process block images
  for (const block of parsedData.blocks) {
    if (block.imageUrl && !block.imageUrl.startsWith('http') && !block.imageUrl.startsWith('data:')) {
      const imageData = await getImageAsBase64(block.imageUrl, zip, imageFiles)
      if (imageData) {
        block.imageUrl = imageData
      }
    }
  }
  
  // Process profile avatar
  if (parsedData.profile.avatar && 
      !parsedData.profile.avatar.startsWith('http') && 
      !parsedData.profile.avatar.startsWith('data:')) {
    const avatarData = await getImageAsBase64(parsedData.profile.avatar, zip, imageFiles)
    if (avatarData) {
      parsedData.profile.avatar = avatarData
    }
  }
}

// Get image from ZIP as base64 data URL
async function getImageAsBase64(
  imagePath: string,
  zip: JSZip,
  imageFiles: Map<string, string>
): Promise<string | null> {
  const foundPath = findImageInZip(imagePath, zip, imageFiles)
  if (!foundPath) return null
  
  const imageFile = zip.file(foundPath)
  if (!imageFile) return null
  
  try {
    const imageData = await imageFile.async('base64')
    const extension = foundPath.split('.').pop()?.toLowerCase() || 'png'
    const mimeType = getMimeType(extension)
    return `data:${mimeType};base64,${imageData}`
  } catch {
    return null
  }
}

function findImageInZip(
  imagePath: string, 
  zip: JSZip,
  imageFiles: Map<string, string>
): string | undefined {
  // Direct match
  if (imageFiles.has(imagePath)) {
    return imagePath
  }
  
  // Try with "images/" prefix (Bento.me export structure)
  const withImagesPrefix = `images/${imagePath}`
  if (imageFiles.has(withImagesPrefix)) {
    return withImagesPrefix
  }
  
  // Try without leading slash or path
  const fileName = imagePath.split('/').pop()
  if (fileName) {
    for (const [path] of imageFiles) {
      if (path.endsWith(fileName) || path.toLowerCase().endsWith(fileName.toLowerCase())) {
        return path
      }
    }
  }
  
  // Try to find any image with similar name in the images folder
  const baseName = fileName?.replace(/\.[^.]+$/, '') // Remove extension
  if (baseName) {
    for (const [path] of imageFiles) {
      const pathBaseName = path.split('/').pop()?.replace(/\.[^.]+$/, '')
      if (pathBaseName?.toLowerCase() === baseName.toLowerCase()) {
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
