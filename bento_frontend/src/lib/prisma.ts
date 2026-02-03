import { PrismaClient } from '@prisma/client'

// Determine which database URL to use based on DB_SOURCE flag
function getDatabaseUrl(): string {
  const dbSource = process.env.DB_SOURCE?.toLowerCase() || 'render'
  
  switch (dbSource) {
    case 'docker': {
      const dockerUrl = process.env.DATABASE_URL_DOCKER
      if (!dockerUrl) {
        throw new Error('DATABASE_URL_DOCKER is not set in environment variables')
      }
      return dockerUrl
    }
    case 'remote': {
      const remoteUrl = process.env.DATABASE_URL_REMOTE
      if (!remoteUrl) {
        throw new Error('DATABASE_URL_REMOTE is not set in environment variables')
      }
      return remoteUrl
    }
    case 'render': {
      const renderUrl = process.env.DATABASE_URL_RENDER
      if (!renderUrl) {
        throw new Error('DATABASE_URL_RENDER is not set in environment variables')
      }
      return renderUrl
    }
    default: {
      // Fallback to DATABASE_URL if set
      const fallbackUrl = process.env.DATABASE_URL
      if (fallbackUrl) {
        return fallbackUrl
      }
      throw new Error(`Unknown DB_SOURCE: ${dbSource}. Use "docker", "remote", or "render"`)
    }
  }
}

// Set DATABASE_URL for Prisma to use
const databaseUrl = getDatabaseUrl()
process.env.DATABASE_URL = databaseUrl

// Log which database is being used (only once during startup)
if (typeof globalThis !== 'undefined' && !(globalThis as Record<string, unknown>).__dbLogged) {
  const dbSource = process.env.DB_SOURCE?.toLowerCase() || 'render'
  const icons: Record<string, string> = {
    docker: '🐳 Using Docker database',
    remote: '🌐 Using Remote database (Bangladesh)',
    render: '☁️  Using Render.com database',
  }
  console.log(icons[dbSource] || `📦 Using database: ${dbSource}`)
  ;(globalThis as Record<string, unknown>).__dbLogged = true
}

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
