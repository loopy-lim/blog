import Link from 'next/link'
import Image from 'next/image'
import { formatDateString } from '@/lib/utils'
import { getDefaultCover } from '@/lib/image-utils'

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
  const coverImage = post.coverImage || getDefaultCover(post.id)

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-video overflow-hidden relative">
        <Image
          src={coverImage}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {post.title}
        </h3>

        {post.description && (
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {post.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {formatDateString(post.publishedAt)}
            </time>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2">
              {post.tags.slice(0, 2).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs"
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
