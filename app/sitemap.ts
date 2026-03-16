import { MetadataRoute } from 'next'
import { getStaticDatabase } from '@/lib/static-data'
import { siteConfig } from '@/site.config'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogData = await getStaticDatabase()
  const lastUpdated = blogData.lastUpdated || new Date().toISOString()

  const staticPages = [
    {
      url: siteConfig.url,
      lastModified: lastUpdated,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: lastUpdated,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: lastUpdated,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}/projects`,
      lastModified: lastUpdated,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/experience`,
      lastModified: lastUpdated,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]

  const blogPages = blogData.posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: post.publishedAt || lastUpdated,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...blogPages]
}
