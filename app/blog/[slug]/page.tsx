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
import { Calendar, ChevronLeft, Clock } from 'lucide-react'

function toAbsoluteSiteUrl(urlOrPath: string): string {
  try {
    return new URL(urlOrPath, siteConfig.url).toString()
  } catch {
    return `${siteConfig.url}${urlOrPath.startsWith('/') ? '' : '/'}${urlOrPath}`
  }
}

function safeGetLocalImagePath(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) {
    return null
  }

  try {
    return getLocalImagePath(imageUrl)
  } catch (error) {
    console.error('Error resolving cover image path:', imageUrl, error)
    return null
  }
}

export async function generateStaticParams() {
  try {
    const posts = await getStaticAllPostSlugs()
    return posts
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
    const publishedAt = post.publishedAt
    const tags = post.tags || []

    // Use generated OG image for this post
    const ogImageUrl = `${siteConfig.url}/images/og/${slug}.jpg`

    return {
      title,
      description,
      authors: [{ name: siteConfig.author }],
      keywords: tags.join(', '),
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime: publishedAt,
        tags,
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
    console.error('Error generating metadata:', error)
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
          <div className="bg-background min-h-screen">
            <BlogPostingJsonLd {...jsonLdData} />
            <BreadcrumbJsonLd items={breadcrumbData} />
            <ReadingProgress />
            
            <main className="relative pb-16">
              {/* Header Section: Edge-to-edge on mobile, Containerized on Desktop */}
              <div className="w-full sm:container sm:mx-auto sm:max-w-5xl sm:pt-32 sm:px-6">
                {/* Contrast-Fixed Premium Post Card */}
                <div className={`relative sm:rounded-[3rem] overflow-hidden border-b sm:border border-border shadow-2xl shadow-black/3 group min-h-screen sm:min-h-150 flex flex-col ${!bgImage ? 'bg-foreground' : 'bg-white'}`}>
                  
                  {/* Cover Background */}
                  <div className="absolute inset-0 z-0">
                    {bgImage ? (
                      <>
                        <img
                          src={bgImage} 
                          alt="" 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
                        <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 via-40% to-transparent" />
                      </>
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-gray-900 via-black to-gray-800 opacity-90" />
                    )}
                  </div>
    
                  {/* Back Button */}
                  <div className="relative z-20 p-8 pt-32 sm:pt-8">
                    <Link 
                      href="/blog"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-[13px] font-black text-white transition-all hover:-translate-x-1 shadow-sm"
                    >
                      <ChevronLeft size={14} />
                      Back
                    </Link>
                  </div>
    
                  {/* Title & Info Section */}
                  <div className="relative z-10 mt-auto p-8 sm:p-20 flex flex-col items-center text-center pb-20 sm:pb-20">                <div className="mb-8 flex flex-wrap justify-center gap-3">
                  {tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/20">
                      {tag}
                    </span>
                  ))}
                </div>

                <h1 className="text-3xl sm:text-6xl font-black text-white tracking-tight mb-8 sm:mb-10 leading-[1.1] drop-shadow-2xl break-keep max-w-4xl px-2">
                  {title}
                </h1>

                <div className="flex flex-wrap items-center justify-center gap-6 text-[12px] font-black text-white/80 uppercase tracking-widest">
                  <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                     <Calendar size={14} className="text-accent" />
                     {publishedAt ? formatDateString(publishedAt) : 'Recent'}
                  </div>
                  <div className="w-1.5 h-1.5 rounded-sm bg-white/30 rotate-45" />
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xs">
                     <Clock size={14} className="text-accent" />
                     Article
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Article Body Area - Adjusted Max Width & Sidebar Alignment */}
          <div className="container mx-auto px-6 max-w-7xl pt-16 pb-40">
            <div className="flex flex-col lg:flex-row gap-12 justify-center items-start">
              {/* Main Content */}
              <article className="max-w-3xl w-full flex flex-col min-w-0">
                <Suspense fallback={<PostSkeleton />}>
                  <NotionContent pageId={post.id} />
                </Suspense>
              </article>

              {/* Improved TOC Sidebar */}
              <aside className="hidden lg:block w-64 shrink-0 sticky top-32 self-start">
                <div className="pl-8 border-l border-border">
                  <h4 className="text-[11px] font-black text-foreground uppercase tracking-[0.2em] mb-8">On this page</h4>
                  <TableOfContents />
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    )
  } catch (error) {
    console.error('Error loading post:', error)
    notFound()
  }
}

function PostSkeleton() {
  return (
    <div className="space-y-12 animate-pulse w-full">
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-100 rounded-lg w-full"></div>
        ))}
      </div>
      <div className="h-96 bg-gray-100 rounded-3xl w-full"></div>
    </div>
  )
}
