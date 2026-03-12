import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getStaticPostBySlug, getStaticAllPostSlugs, getRelatedPosts } from '@/lib/static-data'
import { NotionContent } from '@/components/blog/NotionContent'
import { BlogPostingJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { ReadingProgress } from '@/components/blog/ReadingProgress'
import { TableOfContents } from '@/components/blog/TableOfContents'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import Link from 'next/link'
import { formatDateString } from '@/lib/utils'
import { getLocalImagePath, getDefaultCover } from '@/lib/image-utils'
import { siteConfig } from '@/site.config'
import { ChevronLeft, Calendar, Clock } from 'lucide-react'

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

    const relatedPosts = (await getRelatedPosts(slug, tags, 4)).map((relatedPost) => ({
      ...relatedPost,
      coverImage: relatedPost.coverImage
        ? safeGetLocalImagePath(relatedPost.coverImage) ?? getDefaultCover(relatedPost.id)
        : getDefaultCover(relatedPost.id),
    }))

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
        
        <main className="relative">
          {/* Immersive Hero Header */}
          <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center overflow-hidden bg-black group">
            {/* Background Image - Scale effect removed */}
            <div className="absolute inset-0 z-0">
              {bgImage ? (
                <>
                  <img
                    src={bgImage} 
                    alt="" 
                    className="w-full h-full object-cover opacity-60" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background" />
                </>
              ) : (
                <div className="w-full h-full bg-accent/[0.05]" />
              )}
            </div>

            {/* Back Button Container - Aligned with content max-width */}
            <div className="absolute top-32 inset-x-0 z-20 pointer-events-none">
              <div className="container mx-auto px-6 max-w-5xl flex justify-start">
                <Link 
                  href="/blog"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-[12px] font-bold text-white transition-all shadow-lg pointer-events-auto"
                >
                  <ChevronLeft size={14} />
                  Archive
                </Link>
              </div>
            </div>

            {/* Centered Content */}
            <div className="relative z-10 container mx-auto px-6 max-w-5xl flex flex-col items-center text-center">
              <div className="mb-10 flex flex-wrap justify-center gap-3">
                {tags.map(tag => (
                  <span key={tag} className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-widest border border-white/20">
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-12 leading-[1.15] break-keep max-w-4xl px-2">
                {title}
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-8 text-[12px] font-bold text-white/60 uppercase tracking-[0.2em] tabular-nums">
                <div className="flex items-center gap-2.5">
                   <Calendar size={16} className="text-accent" />
                   {publishedAt ? formatDateString(publishedAt) : 'Recent'}
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <div className="flex items-center gap-2.5">
                   <Clock size={16} className="text-accent" />
                   Story
                </div>
              </div>
            </div>
          </section>

          {/* Article Content Area */}
          <div className="container mx-auto px-6 max-w-7xl -mt-20 relative z-20 pb-32">
            <div className="flex flex-col lg:flex-row gap-12 sm:gap-16 justify-center items-start">
              
              {/* Clean Article Container */}
              <article className="w-full max-w-4xl flex flex-col min-w-0 bg-white shadow-2xl shadow-black/[0.03] border border-border/40 rounded-[2.5rem] overflow-hidden">
                <div className="px-8 sm:px-20 py-16 sm:py-24 prose prose-stone prose-lg max-w-none break-keep leading-relaxed border-b border-border/20">
                  <Suspense fallback={<PostSkeleton />}>
                    <NotionContent pageId={post.id} />
                  </Suspense>
                </div>

                {/* Related Posts */}
                <div className="px-8 sm:px-20 pb-20">
                  <RelatedPosts posts={relatedPosts} />
                </div>
              </article>

              {/* Sidebar TOC */}
              <aside className="hidden xl:block w-64 shrink-0 sticky top-32 self-start">
                <div className="pl-10 border-l border-border/40">
                  <h4 className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] mb-8">On this page</h4>
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
