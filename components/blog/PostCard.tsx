import Link from 'next/link'
import Image from 'next/image'
import { formatDateString } from '@/lib/utils'
import { getDefaultCover, getLocalImagePath } from '@/lib/image-utils'

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
  const coverImage = post.coverImage
    ? getLocalImagePath(post.coverImage)
    : getDefaultCover(post.id)

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block group glass-card rounded-2xl overflow-hidden"
    >
      <div className="aspect-video overflow-hidden relative">
        <Image
          src={coverImage}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
          {post.title}
        </h3>

        {post.description && (
          <p className="text-gray-600 mb-4 line-clamp-2">
            {post.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          {post.publishedAt && (
            <time dateTime={post.publishedAt} className="font-medium">
              {formatDateString(post.publishedAt)}
            </time>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2">
              {post.tags.slice(0, 2).map(tag => (
                <span
                  key={tag}
                  className="tag-pill px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
