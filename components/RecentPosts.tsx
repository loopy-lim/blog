'use client'

import Link from 'next/link'
import { Calendar, ArrowRight, BookOpen, Layers } from 'lucide-react'
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
    <section className="relative py-32 bg-[#fbfbfa]/50">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-accent/5 text-accent text-xs font-black uppercase tracking-widest mb-4 border border-accent/10"
            >
              <Layers size={14} />
              Recent Writing
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl font-black tracking-tight text-foreground sm:text-6xl"
            >
              Featured <span className="text-gradient">Posts.</span>
            </motion.h2 >
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-xl text-muted-foreground font-medium max-w-lg leading-relaxed"
            >
              생각을 정리하고, 배운 것을 기록하며 성장의 발자취를 남깁니다.
            </motion.p>
          </div>
          <Link
            href="/blog"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-white border border-gray-200 px-8 py-4 text-sm font-black text-foreground transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            모든 포스트 보기
            <ArrowRight size={18} className="ml-3 text-muted-foreground transition-transform group-hover:translate-x-2 group-hover:text-accent" />
          </Link>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => {
            const coverImage = post.coverImage ?? null
            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative flex flex-col rounded-[2.5rem] border border-gray-100 bg-white p-6 transition-all duration-500 hover:border-accent/20 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden"
              >
                {/* Cover Image Area */}
                <div className="relative aspect-[16/10] w-full mb-8 rounded-[1.75rem] bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-50 group-hover:scale-[1.02] transition-transform duration-700">
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent pointer-events-none" />
                  
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <img 
                      src="/favicon.png" 
                      alt="Post Icon" 
                      className="w-16 h-16 object-contain opacity-20 transition-all duration-700 group-hover:scale-125 group-hover:opacity-40 group-hover:rotate-12"
                    />
                  )}
                  
                  {/* Date Badge */}
                  <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 backdrop-blur-md border border-white/50 text-[10px] font-black text-muted-foreground uppercase tracking-widest shadow-sm">
                    <Calendar size={12} className="text-accent" />
                    {post.publishedAtLabel || 'Recent'}
                  </div>
                </div>

                <div className="flex flex-col flex-1 px-2">
                  <div className="mb-4 flex flex-wrap gap-2">
                    {post.tags && post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-lg bg-gray-50 px-2.5 py-1 text-[10px] font-black text-muted-foreground uppercase tracking-wider group-hover:bg-accent/5 group-hover:text-accent transition-colors duration-300"
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
                      <p className="text-[15px] text-muted-foreground line-clamp-3 mb-8 leading-relaxed font-medium">
                        {post.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-6 mt-auto border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[11px] font-black text-accent uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5">
                      Read Article <ArrowRight size={14} />
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-accent/10 group-hover:text-accent transition-all duration-500">
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
