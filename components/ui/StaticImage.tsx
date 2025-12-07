import Image from 'next/image'
import { useState } from 'react'

interface StaticImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export function StaticImage({
  src,
  alt,
  width = 800,
  height = 400,
  className = '',
  priority = false
}: StaticImageProps) {
  const [error, setError] = useState(false)

  // 이미지 로드 실패 시 fallback
  if (error) {
    return (
      <div
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
        style={{ aspectRatio: `${width}/${height}` }}
      >
        <span className="text-gray-500 text-sm">Image</span>
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={() => setError(true)}
      unoptimized // 정적 호스팅을 위해 항상 unoptimized
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}
