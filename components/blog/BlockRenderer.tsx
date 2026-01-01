import type { BlockObjectResponse } from '@notionhq/client'
import Image from 'next/image'
import { getLocalImagePath } from '@/lib/image-utils'
import { highlightCode } from '@/lib/highlight'

interface BlockRendererProps {
  block: BlockObjectResponse
}

// ... existing code ...

// YouTube URL에서 ID 추출하는 함수
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
    /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]+)/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
}

type RichTextList = Extract<BlockObjectResponse, { type: 'paragraph' }>['paragraph']['rich_text']

// Helper function for rendering rich text with annotations
const renderRichText = (richText: RichTextList) => {
  return richText.map((text, index) => {
    const content = (
      <span
        key={index}
        className={
          text.annotations.bold ? 'font-bold' :
          text.annotations.italic ? 'italic' :
          text.annotations.strikethrough ? 'line-through' :
          text.annotations.underline ? 'underline' : ''
        }
        style={{
          color: text.annotations.color !== 'default' ?
            `var(--${text.annotations.color})` : 'inherit'
        }}
      >
        {text.plain_text}
      </span>
    )

    return text.annotations.code ? (
      <code key={index} className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 text-sm font-mono text-red-500 dark:text-red-400">
        {content}
      </code>
    ) : content
  })
}

export async function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="mb-4 leading-relaxed">
          {renderRichText(block.paragraph.rich_text)}
        </p>
      )

    case 'heading_1':
      return (
        <h1 id={block.id} className="text-3xl font-bold mb-4 mt-6">
          {renderRichText(block.heading_1.rich_text)}
        </h1>
      )

    case 'heading_2':
      return (
        <h2 id={block.id} className="text-2xl font-bold mb-3 mt-5">
          {renderRichText(block.heading_2.rich_text)}
        </h2>
      )

    case 'heading_3':
      return (
        <h3 id={block.id} className="text-xl font-bold mb-2 mt-4">
          {renderRichText(block.heading_3.rich_text)}
        </h3>
      )

    case 'image':
      // ... image implementation ...
      const originalImageUrl = block.image.type === 'external'
        ? block.image.external.url
        : block.image.file.url
      const imageUrl = getLocalImagePath(originalImageUrl)
      const caption = block.image.caption[0]?.plain_text

      return (
        <div className="my-6 relative w-full h-96">
          <Image
            src={imageUrl}
            alt={caption || 'Content image'}
            fill
            className="object-contain rounded-lg" 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={imageUrl.startsWith('/images/notion/')}
          />
          {caption && (
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
              {caption}
            </p>
          )}
        </div>
      )

    case 'code':
      const code = block.code.rich_text[0]?.plain_text || ''
      const language = block.code.language
      const highlightedHtml = await highlightCode(code, language)

      return (
        <div className="my-6 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800">
           <div 
             className="text-sm overflow-x-auto p-4 shiki-container"
             dangerouslySetInnerHTML={{ __html: highlightedHtml }}
           />
        </div>
      )

    case 'quote':
      return (
        <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4 text-gray-700 dark:text-gray-300">
          {renderRichText(block.quote.rich_text)}
        </blockquote>
      )

    case 'video':
       // ... existing video implementation ...
      const videoUrl = block.video.type === 'external'
        ? block.video.external.url
        : block.video.file?.url

      // YouTube URL 감지 및 임베드
      if (videoUrl && videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        const youtubeId = extractYouTubeId(videoUrl)
        if (youtubeId) {
          return (
            <div className="my-6">
              <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-md">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                />
              </div>
            </div>
          )
        }
      }

      // 일반 비디오
      return (
        <div className="my-6">
          <video
            src={videoUrl}
            controls
            className="w-full rounded-lg shadow-md"
            style={{ maxHeight: '600px' }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )

    case 'divider':
      return <hr className="my-6 border-gray-300 dark:border-gray-600" />

    case 'bulleted_list_item':
      return (
        <li className="ml-6 list-disc mb-2">
          {renderRichText(block.bulleted_list_item.rich_text)}
        </li>
      )

    case 'numbered_list_item':
      return (
        <li className="ml-6 list-decimal mb-2">
          {renderRichText(block.numbered_list_item.rich_text)}
        </li>
      )

    default:
      return null
  }
}
