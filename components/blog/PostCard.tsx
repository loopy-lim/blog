'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight, BookOpen } from 'lucide-react'
import { formatDateString } from '@/lib/utils'

interface PostCardProps {
  post: {
    id: string
    title: string
    slug: string
    description?: string
    publishedAt?: string
    tags?: string[]
    coverImage?: string
  }
}

export function PostCard({ post }: PostCardProps) {
  const coverImage = post.coverImage ?? null

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col rounded-3xl border border-border bg-white p-5 transition-all duration-300 hover:shadow-lg overflow-hidden"
    >
      {/* Cover Image Area */}
      <div className="relative aspect-[16/10] w-full mb-6 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden border border-border group-hover:border-accent/10 transition-colors">
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent pointer-events-none" />
        
        {coverImage ? (
          <img
            src={coverImage}
            alt={post.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-20 transition-all duration-500 group-hover:opacity-40 group-hover:scale-110">
            <img 
              src="/favicon.png" 
              alt="Post Icon" 
              className="w-12 h-12 object-contain"
            />
            <span className="text-[10px] font-black uppercase tracking-widest text-accent">No Cover</span>
          </div>
        )}
        
        {/* Date Badge */}
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-md border border-border text-[10px] font-black text-muted uppercase tracking-widest shadow-xs">
          <Calendar size={10} className="text-accent" />
          {post.publishedAt ? formatDateString(post.publishedAt) : 'Recent'}
        </div>
      </div>

      <div className="flex flex-col flex-1 px-1">
        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-2">
          {post.tags && post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-lg bg-gray-50 px-2 py-0.5 text-[10px] font-bold text-muted uppercase tracking-wider border border-border/50"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title & Description */}
        <div className="flex-1">
          <h3 className="text-xl font-black text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-tight tracking-tight mb-3">
            <Link href={`/blog/${post.slug}`} className="focus:outline-none after:absolute after:inset-0">
              {post.title}
            </Link>
          </h3>
          {post.description && (
            <p className="text-[14px] text-muted line-clamp-2 mb-6 leading-relaxed font-medium">
              {post.description}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-auto border-t border-border/50 flex items-center justify-between">
          <span className="text-[10px] font-black text-accent uppercase tracking-widest flex items-center gap-1.5">
            Read Article <ArrowRight size={12} />
          </span>
          <BookOpen size={14} className="text-muted/30 group-hover:text-accent transition-colors" />
        </div>
      </div>
    </motion.article>
  )
}
