import { Suspense } from 'react'
import { getStaticDatabase } from '@/lib/static-data'
import { PostCard } from '@/components/blog/PostCard'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, Layers, Search } from 'lucide-react'
import { getDefaultCover, getLocalImagePath } from '@/lib/image-utils'
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
    <main className="relative min-h-screen bg-[#fbfbfa]">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[50vh] bg-accent/5 blur-[120px] rounded-[4rem] rotate-12 pointer-events-none -z-10" />
      
      <div className="container mx-auto px-6 pt-32 pb-40 max-w-7xl">
        <header className="mb-24 text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 mb-10 px-4 py-2 rounded-lg bg-white border border-gray-100 text-sm font-black text-muted-foreground hover:text-accent hover:border-accent/20 transition-all hover:-translate-x-1 shadow-sm"
          >
            <ChevronLeft size={16} />
            Back to Home
          </Link>

          <div className="flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-accent/5 text-accent text-xs font-black uppercase tracking-widest mb-6 border border-accent/10">
              <Layers size={14} />
              Writing & Thoughts
            </div>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-foreground leading-tight text-gradient mb-8">
              Blog Archive.
            </h1>
            <p className="max-w-xl text-xl text-muted-foreground font-medium leading-relaxed">
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
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-[2.5rem] border border-gray-100 bg-white p-6 h-[450px] animate-pulse">
           <div className="aspect-[16/10] w-full rounded-[1.75rem] bg-gray-50 mb-8" />
           <div className="h-6 bg-gray-50 rounded-lg w-3/4 mb-4" />
           <div className="h-4 bg-gray-50 rounded-lg w-full mb-2" />
           <div className="h-4 bg-gray-50 rounded-lg w-5/6" />
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
        <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
          <p className="text-muted-foreground font-black text-2xl mb-4">
            No posts found.
          </p>
          <p className="text-gray-400 font-medium">
            아직 작성된 포스트가 없습니다. 나중에 다시 방문해 주세요!
          </p>
        </div>
      )
    }

    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogData.posts.map((post) => (
          <PostCard
            key={post.id}
            post={{
              ...post,
              coverImage: post.coverImage ? getLocalImagePath(post.coverImage) : getDefaultCover(post.id),
            }}
          />
        ))}
      </div>
    )
  } catch (error) {
    console.error('Error loading posts:', error)
    return (
      <div className="text-center py-20 bg-red-50 rounded-[3rem] border border-red-100">
        <p className="text-red-600 font-black text-xl">
          Error loading posts.
        </p>
        <p className="text-red-400 mt-2 font-medium">
          데이터를 불러오는 중 오류가 발생했습니다.
        </p>
      </div>
    )
  }
}
