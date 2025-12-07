import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getPostBySlug, getAllPostSlugs } from '@/lib/notion'
import { NotionContent } from '@/components/blog/NotionContent'
import { BlogPostingJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd'
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
        <main className="relative min-h-screen pb-20">
        {/* Header / Cover Image Area */}
        <div className="absolute top-0 left-0 w-full z-0">
          <div className="relative pt-6 px-4 sm:px-6">
             <div className="max-w-7xl mx-auto transform scale-95 sm:scale-90 transition-transform">
               <div
                 className="relative h-[400px] sm:h-[600px] w-full rounded-[2rem] sm:rounded-[2.5rem] bg-cover bg-center overflow-hidden select-none"
                 style={{ backgroundImage: bgImage ? `url(${bgImage})` : undefined }}
               >
                 {/* Blur / Overlay */}
                  <div className="absolute inset-0 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm backdrop-brightness-110"></div>

                 {/* Back Button positioned inside the image area like original */}
                  <Link
                    href="/blog"
                    className="absolute bottom-6 left-6 inline-flex items-center justify-center rounded-full bg-white/90 p-3 text-gray-700 transition-transform hover:-translate-x-1 hover:text-gray-900 dark:bg-gray-950/90 dark:text-gray-300 dark:hover:text-white shadow-lg backdrop-blur-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </Link>
               </div>
             </div>

             {/* Title - Centered on top of the image (or slightly below depending on design preference, original was absolute) */}
             <div className="absolute top-1/2 left-1/2 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 text-center px-4 pointer-events-none">
               <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white drop-shadow-lg break-keep leading-tight">
                 {title}
               </h1>
             </div>
          </div>
        </div>

        {/* Spacer for the absolute header */}
        <div className="h-[450px] sm:h-[650px]"></div>

        <article className="container mx-auto px-4 max-w-4xl relative z-10 bg-transparent">
          <header className="mb-12 text-center">
            <div className="flex flex-wrap items-center justify-center gap-4 text-gray-600 dark:text-gray-400">
              {publishedAt && (
                <time dateTime={publishedAt} className="text-sm font-medium">
                  {formatDateString(publishedAt)}
                </time>
              )}

              {tags.length > 0 && (
                <div className="flex gap-2">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium"
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
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    </div>
  )
}
