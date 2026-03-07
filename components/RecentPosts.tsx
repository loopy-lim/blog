'use client'

import Link from 'next/link'
import { Calendar, ArrowRight, Layers, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'

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
    <section className="relative py-24 sm:py-32 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/5 text-accent text-[12px] font-bold uppercase tracking-widest mb-6 border border-accent/10"
            >
              <Layers size={14} />
              Recent Writing
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-black tracking-tight text-foreground sm:text-7xl"
            >
              Featured <span className="text-accent">Posts.</span>
            </motion.h2 >
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-8 text-lg sm:text-xl text-muted font-medium max-w-lg leading-relaxed"
            >
              생각을 정리하고, 배운 것을 기록하며 성장의 발자취를 남깁니다.
            </motion.p>
          </div>
          <Link
            href="/blog"
            className="group relative inline-flex items-center justify-center rounded-2xl bg-white border border-border px-10 py-4 text-sm font-black text-foreground transition-all hover:border-accent/30 hover:shadow-xl hover:shadow-black/[0.02] w-full sm:w-auto"
          >
            모든 포스트 보기
            <ArrowRight size={18} className="ml-3 text-muted transition-transform group-hover:translate-x-2 group-hover:text-accent" />
          </Link>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => {
            const coverImage = post.coverImage ?? null
            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative flex flex-col rounded-3xl border border-border bg-white p-6 transition-all duration-500 hover:border-accent/20 hover:shadow-2xl hover:shadow-black/[0.02] overflow-hidden"
              >
                {/* Cover Image Area */}
                <div className="relative aspect-[16/10] w-full mb-8 rounded-2xl bg-stone-50 flex items-center justify-center overflow-hidden border border-border group-hover:scale-[1.02] transition-transform duration-700">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center transition-all duration-700 group-hover:scale-125 group-hover:bg-black/10">
                      <div className="w-8 h-8 rounded-full bg-black relative overflow-hidden">
                        <div className="w-2.5 h-2.5 rounded-full bg-white absolute bottom-1 right-1" />
                      </div>
                    </div>
                  )}
                  
                  {/* Date Badge */}
                  <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-border text-[10px] font-black text-muted uppercase tracking-widest shadow-sm">
                    <Calendar size={12} className="text-accent" />
                    {post.publishedAtLabel || 'Recent'}
                  </div>
                </div>

                <div className="flex flex-col flex-1 px-2">
                  <div className="mb-4 flex flex-wrap gap-2">
                    {post.tags && post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-stone-50 px-3 py-1 text-[10px] font-bold text-muted uppercase tracking-wider border border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-foreground group-hover:text-accent mb-4 transition-colors line-clamp-2 leading-tight tracking-tight">
                      <Link href={`/blog/${post.slug}`} className="focus:outline-none after:absolute after:inset-0">
                        {post.title}
                      </Link>
                    </h3>
                    {post.description && (
                      <p className="text-[15px] text-muted line-clamp-2 mb-8 leading-relaxed font-medium">
                        {post.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-6 mt-auto border-t border-border/50 flex items-center justify-between">
                    <span className="text-[11px] font-black text-accent uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5">
                      Read Article <ArrowRight size={14} />
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-stone-50 flex items-center justify-center text-stone-300 group-hover:bg-accent/10 group-hover:text-accent transition-all duration-500">
                      <BookOpen size={14} />
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  )
}
