import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bentoportfolio.me'
  
  // Get all public user profiles
  const users = await prisma.user.findMany({
    where: { 
      username: { not: null } 
    },
    select: { 
      username: true, 
      updatedAt: true 
    },
  })

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Dynamic user profile pages
  const userPages: MetadataRoute.Sitemap = users.map((user: { username: string | null; updatedAt: Date }) => ({
    url: `${baseUrl}/${user.username}`,
    lastModified: user.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...userPages]
}
