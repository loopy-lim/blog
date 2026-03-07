'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface PostCardProps {
  post: {
    id: string
    title: string
    slug: string
    description?: string
    publishedAtLabel?: string
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
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col rounded-2xl border border-border/50 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-foreground/10 overflow-hidden"
    >
      <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10 focus:outline-none" />
      
      {/* Defined Card Cover Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border/40">
        {coverImage ? (
          <img
            src={coverImage}
            alt={post.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-50 opacity-40 grayscale">
            <div className="w-10 h-10 rounded-full bg-black relative overflow-hidden">
              <div className="w-2 h-2 rounded-full bg-white absolute bottom-1 right-1" />
            </div>
          </div>
        )}
        
        {/* Subtle Tag Overlay */}
        {post.tags && post.tags.length > 0 && (
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-2 py-1 rounded-md bg-white/80 backdrop-blur-md border border-white/20 text-[10px] font-bold text-accent uppercase tracking-wider">
              {post.tags[0]}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-6 sm:p-7">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold text-muted/40 tabular-nums uppercase tracking-widest">
            {post.publishedAtLabel || 'Recent'}
          </span>
        </div>

        <h3 className="text-xl font-bold text-foreground mb-4 leading-tight tracking-tight word-keep-all transition-opacity group-hover:opacity-70">
          {post.title}
        </h3>

        {post.description && (
          <p className="text-[14px] text-muted/80 line-clamp-2 mb-8 leading-relaxed font-medium word-keep-all">
            {post.description}
          </p>
        )}

        <div className="mt-auto pt-5 border-t border-border/40 flex items-center justify-between">
          <span className="text-[11px] font-bold text-foreground/30 flex items-center gap-1.5 uppercase tracking-widest transition-colors group-hover:text-accent">
            Read Article <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </motion.article>
  )
}
