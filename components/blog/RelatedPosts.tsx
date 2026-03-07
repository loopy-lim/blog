import Link from 'next/link'
import { formatDateString } from '@/lib/utils'
import { PostData } from '@/lib/static-data'

interface RelatedPostsProps {
  posts: PostData[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <div className="mt-16 pt-12 border-t border-border/40">
      <h3 className="text-[11px] font-black text-foreground/40 uppercase tracking-[0.2em] mb-8">
        다른 글 둘러보기
      </h3>
      <div className="space-y-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex items-center gap-5 p-4 -mx-4 rounded-2xl transition-all hover:bg-black/[0.02]"
          >
            {/* Thumbnail */}
            <div className="relative w-20 h-14 shrink-0 rounded-xl overflow-hidden bg-black/[0.02] border border-border/40">
              {post.coverImage ? (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="w-4 h-4 rounded-full bg-black" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-[15px] font-bold text-foreground leading-snug tracking-tight group-hover:text-accent transition-colors line-clamp-2">
                {post.title}
              </h4>
              <span className="text-[11px] text-muted/60 font-medium mt-1 block">
                {post.publishedAt ? formatDateString(post.publishedAt) : 'Recent'}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
