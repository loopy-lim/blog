import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getPostBySlug, getAllPostSlugs } from '@/lib/notion'
import { NotionContent } from '@/components/blog/NotionContent'
import { BlogPostingJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { ReadingProgress } from '@/components/blog/ReadingProgress'
import { TableOfContents } from '@/components/blog/TableOfContents'
import Link from 'next/link'
import { formatDateString } from '@/lib/utils'
import { getLocalImagePath, getDefaultCover } from '@/lib/image-utils'
import { siteConfig } from '@/site.config'

// 정적 사이트로 변경 - revalidate 제거

// 정적 경로 생성
export async function generateStaticParams() {
  try {
    const posts = await getAllPostSlugs()
    return posts
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// 페이지별 Metadata 생성
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const post = await getPostBySlug(slug)

    if (!post) return {}

    const title = post.properties.title.title[0]?.plain_text || 'Untitled'
    const description = post.properties.description?.rich_text[0]?.plain_text || ''
    const publishedAt = post.properties.publishAt?.date?.start
    const tags = post.properties.tags?.multi_select?.map((tag) => tag.name) || []

    // 커버 이미지 URL 추출
    const coverUrl = post.cover?.type === 'external'
      ? post.cover.external?.url
      : post.cover?.file?.url

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
        images: coverUrl ? [{
          url: coverUrl,
          width: 1200,
          height: 630,
          alt: title,
        }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: coverUrl ? [coverUrl] : [],
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
    const post = await getPostBySlug(slug)

    if (!post) {
      notFound()
    }

    const title = post.properties.title.title[0]?.plain_text || 'Untitled'
    const publishedAt = post.properties.publishAt?.date?.start
    const tags = post.properties.tags?.multi_select?.map((tag) => tag.name) || []

    const coverUrl = post.cover?.type === 'external'
      ? post.cover.external?.url
      : post.cover?.file?.url

    // 로컬 이미지 경로 (또는 원본 URL) -> 없으면 랜덤 디폴트 이미지
    const bgImage = coverUrl ? getLocalImagePath(coverUrl) : getDefaultCover(post.id)

    // JSON-LD용 데이터
    const jsonLdData = {
      title,
      description: post.properties.description?.rich_text[0]?.plain_text || '',
      publishedAt: publishedAt || new Date().toISOString(),
      author: siteConfig.author,
      images: coverUrl ? [coverUrl] : [],
      url: `${siteConfig.url}/blog/${slug}`,
    }

    const breadcrumbData = [
      { name: '홈', url: siteConfig.url },
      { name: '블로그', url: `${siteConfig.url}/blog` },
      { name: title, url: `${siteConfig.url}/blog/${slug}` },
    ]

    return (
      <>
        <BlogPostingJsonLd {...jsonLdData} />
        <BreadcrumbJsonLd items={breadcrumbData} />
        <ReadingProgress />
        <main className="relative min-h-screen pb-20">
        {/* Header / Cover Image Area */}
        <div className="absolute top-0 left-0 w-full z-0">
          <div className="relative pt-6 px-4 sm:px-6">
             <div className="max-w-7xl mx-auto transform scale-95 sm:scale-90 transition-transform">
               <div
                 className="relative h-[400px] sm:h-[600px] w-full rounded-[2rem] sm:rounded-[2.5rem] bg-cover bg-center overflow-hidden select-none"
                 style={{ backgroundImage: bgImage ? `url(${bgImage})` : undefined }}
               >
                 {/* Glassmorphism Overlay */}
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-md"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/50"></div>

                 {/* Back Button with glass effect */}
                  <Link
                    href="/blog"
                    className="absolute bottom-6 left-6 inline-flex items-center justify-center rounded-full glass p-3 text-gray-700 transition-all hover:-translate-x-1 hover:text-gray-900 hover-glow"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </Link>
               </div>
             </div>

             {/* Title with enhanced styling */}
             <div className="absolute top-1/2 left-1/2 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 text-center px-4 pointer-events-none">
               <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 drop-shadow-lg break-keep leading-tight animate-fade-in-up">
                 {title}
               </h1>
             </div>
          </div>
        </div>

        {/* Spacer for the absolute header */}
        <div className="h-[450px] sm:h-[650px]"></div>

        {/* Content with sticky TOC */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex gap-8 justify-center">
            {/* Main Article */}
            <article className="max-w-4xl w-full bg-transparent">
              <header className="mb-12 text-center">
                <div className="flex flex-wrap items-center justify-center gap-4 text-gray-600">
                  {publishedAt && (
                    <time dateTime={publishedAt} className="text-sm font-medium glass px-4 py-2 rounded-full">
                      {formatDateString(publishedAt)}
                    </time>
                  )}

                  {tags.length > 0 && (
                    <div className="flex gap-2">
                      {tags.map(tag => (
                        <span
                          key={tag}
                          className="tag-pill px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </header>

              <Suspense fallback={<PostSkeleton />}>
                <NotionContent pageId={post.id} />
              </Suspense>
            </article>

            {/* Sticky TOC */}
            <TableOfContents />
          </div>
        </div>
      </main>
      </>
    )
  } catch (error) {
    console.error('Error loading post:', error)
    notFound()
  }
}

function PostSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        <div className="h-64 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  )
}
