import { PrismaClient } from '@prisma/client'

// Determine which database URL to use based on DB_USE_DOCKER flag
function getDatabaseUrl(): string {
  const useDocker = process.env.DB_USE_DOCKER === 'true'
  
  if (useDocker) {
    const dockerUrl = process.env.DATABASE_URL_DOCKER
    if (!dockerUrl) {
      throw new Error('DATABASE_URL_DOCKER is not set in environment variables')
    }
    return dockerUrl
  } else {
    const remoteUrl = process.env.DATABASE_URL_REMOTE
    if (!remoteUrl) {
      throw new Error('DATABASE_URL_REMOTE is not set in environment variables')
    }
    return remoteUrl
  }
}

// Set DATABASE_URL for Prisma to use
const databaseUrl = getDatabaseUrl()
process.env.DATABASE_URL = databaseUrl

// Log which database is being used (only once during startup)
if (typeof globalThis !== 'undefined' && !(globalThis as Record<string, unknown>).__dbLogged) {
  const isDocker = process.env.DB_USE_DOCKER === 'true'
  console.log(isDocker ? '🐳 Using Docker database' : '🌐 Using Remote database')
  ;(globalThis as Record<string, unknown>).__dbLogged = true
}

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
