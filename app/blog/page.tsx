import { Suspense } from 'react'
import { getStaticDatabase } from '@/lib/static-data'
import { PostCard } from '@/components/blog/PostCard'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { getDefaultCover, getLocalImagePath } from '@/lib/image-utils'
import { formatDateString } from '@/lib/utils'
import { siteConfig } from '@/site.config'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: '기술적인 도전, 배움의 기록, 그리고 일상의 생각들을 공유합니다.',
  openGraph: {
    title: `Blog | ${siteConfig.title}`,
    description: '기술적인 도전, 배움의 기록, 그리고 일상의 생각들을 공유합니다.',
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.title,
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: '/images/og/default.jpg',
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Blog | ${siteConfig.title}`,
    description: '기술적인 도전, 배움의 기록, 그리고 일상의 생각들을 공유합니다.',
    images: ['/images/og/default.jpg'],
  },
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
}

export default async function BlogPage() {
  return (
    <main className="relative min-h-screen">
      <div className="container mx-auto px-6 sm:px-8 pt-24 sm:pt-32 pb-32 max-w-7xl">
        <header className="mb-16 sm:mb-20 glass-panel p-8 sm:p-12 rounded-2xl border border-border/40">
          <Link 
            href="/"
            className="inline-flex items-center gap-1.5 mb-8 text-[11px] font-bold text-muted/60 hover:text-accent transition-colors uppercase tracking-widest"
          >
            <ChevronLeft size={14} />
            Back to Home
          </Link>

          <div className="flex flex-col">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight mb-6">
              Blog Archive
            </h1>
            <div className="h-1 w-12 bg-accent mb-6" />
            <p className="max-w-xl text-[15px] sm:text-[17px] text-muted leading-relaxed font-medium word-keep-all">
              기술적인 도전, 배움의 기록, 그리고 일상의 생각들을 공유합니다.
            </p>
          </div>
        </header>

        <Suspense fallback={<PostListSkeleton />}>
          <PostList />
        </Suspense>
      </div>
    </main>
  )
}

function PostListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-black/[0.02] p-4 h-[400px] animate-pulse">
           <div className="aspect-[16/9] w-full rounded-lg bg-stone-100 mb-6" />
           <div className="h-5 bg-stone-100 rounded-lg w-3/4 mb-4" />
           <div className="h-3 bg-stone-100 rounded-lg w-full mb-2" />
           <div className="h-3 bg-stone-100 rounded-lg w-5/6" />
        </div>
      ))}
    </div>
  )
}

async function PostList() {
  try {
    const blogData = await getStaticDatabase()

    if (blogData.posts.length === 0) {
      return (
        <div className="text-center py-24 glass-panel rounded-2xl border border-border/40">
          <p className="text-muted font-bold text-xl mb-3">
            No posts found.
          </p>
          <p className="text-muted/60 text-sm font-medium">
            아직 작성된 포스트가 없습니다. 나중에 다시 방문해 주세요!
          </p>
        </div>
      )
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogData.posts.map((post) => (
          <PostCard
            key={post.id}
            post={{
              ...post,
              publishedAtLabel: post.publishedAt ? formatDateString(post.publishedAt) : 'Recent',
              coverImage: post.coverImage ? getLocalImagePath(post.coverImage) : getDefaultCover(post.id),
            }}
          />
        ))}
      </div>
    )
  } catch (error) {
    console.error('Error loading posts:', error)
    return (
      <div className="text-center py-20 bg-red-50/50 rounded-2xl border border-red-100">
        <p className="text-red-600 font-bold text-lg">
          Error loading posts.
        </p>
        <p className="text-red-400 mt-2 text-sm font-medium">
          데이터를 불러오는 중 오류가 발생했습니다.
        </p>
      </div>
    )
  }
}
