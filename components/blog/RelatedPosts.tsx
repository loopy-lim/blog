'use client'

import Link from 'next/link'
import { formatDateString } from '@/lib/utils'
import { PostData } from '@/lib/static-data'

interface RelatedPostsProps {
  posts: PostData[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <div className="mt-20 pt-16 border-t border-border/40">
      <h3 className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] mb-10">
        Related Articles
      </h3>
      <div className="grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex flex-col gap-4 p-4 rounded-xl border border-transparent transition-all hover:bg-black/[0.02] hover:border-border/40"
          >
            {/* Compact Thumbnail */}
            <div className="relative aspect-[21/9] w-full shrink-0 rounded-lg overflow-hidden bg-black/[0.02] border border-border/20">
              {post.coverImage ? (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-10 grayscale">
                   <div className="w-6 h-6 rounded-full bg-black" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
               <div className="text-[11px] font-bold text-muted/40 tabular-nums mb-1 uppercase tracking-wider">
                {post.publishedAt ? formatDateString(post.publishedAt) : 'Recent'}
              </div>
              <h4 className="text-[15px] font-bold text-foreground leading-snug tracking-tight transition-opacity group-hover:opacity-70 break-keep line-clamp-2">
                {post.title}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
