'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { PostCard } from './blog/PostCard'

// 포스트 타입 정의
interface BlogPost {
  id: string
  title: string
  description?: string
  slug: string
  publishedAtLabel?: string
  tags?: string[]
  coverImage?: string
}

interface RecentPostsProps {
  posts: BlogPost[]
}

export function RecentPosts({ posts }: RecentPostsProps) {
  if (posts.length === 0) {
    return null
  }

  return (
    <section className="relative py-24 sm:py-32 border-y border-border/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header Section - Monochrome & Clean */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
                Recent Posts
              </h2>
              <div className="mt-4 h-1 w-12 bg-accent" />
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-[15px] sm:text-[17px] text-muted/80 font-medium leading-relaxed break-keep"
            >
              기술적인 기록과 일상의 생각들을 공유합니다.
            </motion.p>
          </div>
          <Link
            href="/blog"
            className="group relative inline-flex items-center justify-center rounded-lg bg-white border border-border px-8 py-3.5 text-sm font-bold text-foreground transition-all hover:bg-black/[0.02] w-full sm:w-auto"
          >
            All Archive
            <ArrowRight size={16} className="ml-2.5 text-muted/40 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Posts Grid - Using the shared PostCard */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
