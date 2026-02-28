import fs from 'fs/promises'
import fsSync from 'fs'
import path from 'path'
import { siteConfig } from '../site.config'

// Load environment
function loadEnvFile(filePath: string) {
  if (!fsSync.existsSync(filePath)) return
  const content = fsSync.readFileSync(filePath, 'utf-8')
  const lines = content.split(/\r?\n/)
  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const equalsIndex = line.indexOf('=')
    if (equalsIndex <= 0) continue
    const key = line.slice(0, equalsIndex).trim()
    const value = line.slice(equalsIndex + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

loadEnvFile(path.join(process.cwd(), '.env'))
loadEnvFile(path.join(process.cwd(), '.env.local'))

// Constants
const DATA_FILE = path.join(process.cwd(), 'data/blog.json')
const OUTPUT_FILE = path.join(process.cwd(), 'public/feed.xml')

interface PostData {
  id: string
  title: string
  slug: string
  description: string
  publishedAt: string
  tags: string[]
  coverImage?: string
}

interface BlogData {
  posts: PostData[]
  lastUpdated: string
}

// Escape XML special characters
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Format date for RSS
function formatRfc822Date(dateString: string): string {
  const date = new Date(dateString)
  return date.toUTCString()
}

// Generate RSS 2.0 XML
function generateRSSFeed(blogData: BlogData): string {
  const { posts } = blogData
  const buildDate = new Date().toUTCString()

  const itemsXml = posts
    .map((post) => {
      const postUrl = `${siteConfig.url}/blog/${post.slug}`
      const ogImageUrl = `${siteConfig.url}/images/og/${post.slug}.jpg`
      const description = post.description || `Read ${post.title} on ${siteConfig.title}`
      const categories = post.tags
        .map((tag) => `    <category>${escapeXml(tag)}</category>`)
        .join('\n')

      return `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${postUrl}</link>
    <guid isPermaLink="true">${postUrl}</guid>
    <description>${escapeXml(description)}</description>
    <pubDate>${formatRfc822Date(post.publishedAt)}</pubDate>
    <author>${escapeXml(siteConfig.author)}</author>
${categories}
    <enclosure url="${ogImageUrl}" type="image/jpeg" length="0"/>
  </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(siteConfig.title)}</title>
    <link>${siteConfig.url}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>ko-KR</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteConfig.url}/images/og/default.jpg</url>
      <title>${escapeXml(siteConfig.title)}</title>
      <link>${siteConfig.url}</link>
    </image>
${itemsXml}
  </channel>
</rss>`
}

// Main function
async function generateRSS() {
  console.log('📡 Generating RSS feed...')

  // Read blog data
  let blogData: BlogData
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8')
    blogData = JSON.parse(data)
  } catch {
    console.error('❌ Error reading blog data. Run `bun run build-data` first.')
    process.exit(1)
  }

  // Generate RSS XML
  const rssXml = generateRSSFeed(blogData)

  // Write to file
  await fs.writeFile(OUTPUT_FILE, rssXml, 'utf-8')

  console.log(`✅ RSS feed generated: ${OUTPUT_FILE}`)
  console.log(`   ${blogData.posts.length} posts included`)
}

// Run
generateRSS().catch(console.error)
