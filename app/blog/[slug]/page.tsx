import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getStaticPostBySlug, getStaticAllPostSlugs } from '@/lib/static-data'
import { NotionContent } from '@/components/blog/NotionContent'
import { BlogPostingJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { ReadingProgress } from '@/components/blog/ReadingProgress'
import { TableOfContents } from '@/components/blog/TableOfContents'
import Link from 'next/link'
import { formatDateString } from '@/lib/utils'
import { getLocalImagePath, getDefaultCover } from '@/lib/image-utils'
import { siteConfig } from '@/site.config'
import { ChevronLeft } from 'lucide-react'

function toAbsoluteSiteUrl(urlOrPath: string): string {
  try {
    return new URL(urlOrPath, siteConfig.url).toString()
  } catch {
    return `${siteConfig.url}${urlOrPath.startsWith('/') ? '' : '/'}${urlOrPath}`
  }
}

function safeGetLocalImagePath(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null
  try {
    return getLocalImagePath(imageUrl)
  } catch (error) {
    console.error('Error resolving cover image path:', imageUrl, error)
    return null
  }
}

export async function generateStaticParams() {
  try {
    return await getStaticAllPostSlugs()
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const post = await getStaticPostBySlug(slug)
    if (!post) return {}

    const title = post.title || 'Untitled'
    const description = post.description || ''
    const ogImageUrl = `${siteConfig.url}/images/og/${slug}.jpg`

    return {
      title,
      description,
      authors: [{ name: siteConfig.author }],
      keywords: post.tags?.join(', '),
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime: post.publishedAt,
        tags: post.tags,
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImageUrl],
      },
      alternates: {
        canonical: `${siteConfig.url}/blog/${slug}`,
      },
    }
  } catch (error) {
    return {}
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  try {
    const { slug } = await params
    const post = await getStaticPostBySlug(slug)
    if (!post) notFound()

    const title = post.title || 'Untitled'
    const publishedAt = post.publishedAt
    const tags = post.tags || []
    const coverUrl = post.coverImage
    const localCoverImage = safeGetLocalImagePath(coverUrl)
    const bgImage = localCoverImage ?? getDefaultCover(post.id)
    const jsonLdImage = localCoverImage ? toAbsoluteSiteUrl(localCoverImage) : null

    const jsonLdData = {
      title,
      description: post.description || '',
      publishedAt: publishedAt || new Date().toISOString(),
      author: siteConfig.author,
      images: jsonLdImage ? [jsonLdImage] : [],
      url: `${siteConfig.url}/blog/${slug}`,
    }

    const breadcrumbData = [
      { name: 'Home', url: siteConfig.url },
      { name: 'Blog', url: `${siteConfig.url}/blog` },
      { name: title, url: `${siteConfig.url}/blog/${slug}` },
    ]

    return (
      <div className="min-h-screen">
        <BlogPostingJsonLd {...jsonLdData} />
        <BreadcrumbJsonLd items={breadcrumbData} />
        <ReadingProgress />
        
        <main className="relative pt-24 sm:pt-36 pb-32">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-12 sm:gap-16 justify-center items-start">
              
              {/* Main Article "Card" Container */}
              <article className="w-full max-w-4xl flex flex-col min-w-0 bg-white shadow-sm border border-border/60 rounded-2xl overflow-hidden">
                
                {/* Back Link Overlay */}
                <div className="p-8 pb-0">
                   <Link 
                    href="/blog"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-muted/40 hover:text-accent transition-colors uppercase tracking-widest"
                  >
                    <ChevronLeft size={14} />
                    Back to Archive
                  </Link>
                </div>

                {/* Article Header */}
                <header className="px-8 sm:px-16 pt-8 pb-12 sm:pb-16 text-center border-b border-border/40">
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold text-accent uppercase tracking-widest px-2 py-0.5 bg-accent/5 rounded border border-accent/10">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-8 leading-[1.2] word-keep-all">
                    {title}
                  </h1>

                  <div className="flex items-center justify-center gap-4 text-[11px] font-bold text-muted/30 uppercase tracking-[0.2em] tabular-nums">
                    {publishedAt ? formatDateString(publishedAt) : 'Recent'}
                    <span className="w-1 h-1 rounded-full bg-border" />
                    Article
                  </div>
                </header>

                {/* Cover Image inside Card */}
                {bgImage && (
                  <div className="w-full border-b border-border/40 bg-black/[0.02] aspect-[21/9] overflow-hidden">
                    <img src={bgImage} alt="" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Article Content */}
                <div className="px-8 sm:px-20 py-16 sm:py-24 prose prose-stone prose-lg max-w-none break-keep leading-relaxed">
                  <Suspense fallback={<PostSkeleton />}>
                    <NotionContent pageId={post.id} />
                  </Suspense>
                </div>
              </article>

              {/* Sidebar / TOC */}
              <aside className="hidden xl:block w-64 shrink-0 sticky top-32 self-start">
                <div className="pl-8 border-l border-border/40">
                  <h4 className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] mb-6">On this page</h4>
                  <TableOfContents />
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    )
  } catch (error) {
    notFound()
  }
}

function PostSkeleton() {
  return (
    <div className="space-y-10 animate-pulse w-full">
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-4 bg-black/[0.03] rounded-md w-full"></div>
        ))}
      </div>
      <div className="h-64 bg-black/[0.03] rounded-xl w-full"></div>
    </div>
  )
}
