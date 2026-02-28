import type { BlockObjectResponse } from '@notionhq/client'
import { getLocalImagePath } from '@/lib/image-utils'
import { highlightCode } from '@/lib/highlight'
import { CodeBlock } from './CodeBlock'
import { Info } from 'lucide-react'

interface BlockRendererProps {
  block: BlockObjectResponse
}

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
          text.annotations.bold ? 'font-black' :
          text.annotations.italic ? 'italic' :
          text.annotations.strikethrough ? 'line-through' :
          text.annotations.underline ? 'underline' : ''
        }
        style={{
          color: text.annotations.color !== 'default' ?
            `var(--notion-bg-${text.annotations.color})` : 'inherit'
        }}
      >
        {text.plain_text}
      </span>
    )

    if (text.annotations.code) {
      return (
        <code key={index} className="bg-gray-100 rounded px-1.5 py-0.5 text-[13px] font-bold font-mono text-accent">
          {text.plain_text}
        </code>
      )
    }

    if (text.href) {
      return (
        <a 
          key={index} 
          href={text.href} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-4 decoration-accent/30 hover:decoration-accent transition-all font-bold"
        >
          {content}
        </a>
      )
    }

    return content
  })
}

export async function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="mb-6 leading-relaxed text-[17px] font-medium text-foreground/80">
          {renderRichText(block.paragraph.rich_text)}
        </p>
      )

    case 'heading_1':
      return (
        <h1 id={block.id} className="text-4xl font-black mb-8 mt-16 tracking-tight text-foreground">
          {renderRichText(block.heading_1.rich_text)}
        </h1>
      )

    case 'heading_2':
      return (
        <h2 id={block.id} className="text-3xl font-black mb-6 mt-12 tracking-tight text-foreground">
          {renderRichText(block.heading_2.rich_text)}
        </h2>
      )

    case 'heading_3':
      return (
        <h3 id={block.id} className="text-2xl font-black mb-4 mt-10 tracking-tight text-foreground">
          {renderRichText(block.heading_3.rich_text)}
        </h3>
      )

    case 'image':
      const originalImageUrl = block.image.type === 'external'
        ? block.image.external.url
        : block.image.file.url
      const imageUrl = getLocalImagePath(originalImageUrl)
      const caption = block.image.caption[0]?.plain_text

      return (
        <figure className="my-12 space-y-3 group/img">
          <div className="relative w-full rounded-2xl overflow-hidden border border-border/40 shadow-sm flex justify-center mx-auto transition-shadow duration-500 hover:shadow-md">
            <img
              src={imageUrl}
              alt={caption || 'Content image'}
              className="max-w-full h-auto object-contain block mx-auto transition-transform duration-700 group-hover/img:scale-[1.01] max-h-[75vh]"
            />
          </div>
          {caption && (
            <figcaption className="text-center text-[11px] font-bold text-muted uppercase tracking-[0.15em] italic opacity-60">
              {caption}
            </figcaption>
          )}
        </figure>
      )

    case 'code':
      const code = block.code.rich_text[0]?.plain_text || ''
      const language = block.code.language
      const highlightedHtml = await highlightCode(code, language)

      return (
        <CodeBlock 
          html={highlightedHtml} 
          code={code} 
          language={language} 
        />
      )

    case 'quote':
      return (
        <blockquote className="border-l-4 border-accent pl-8 py-2 my-10 bg-accent/5 rounded-r-2xl">
          <p className="text-xl font-black italic text-foreground/90 leading-relaxed">
            {renderRichText(block.quote.rich_text)}
          </p>
        </blockquote>
      )

    case 'callout':
      return (
        <div className="my-8 flex gap-4 p-6 rounded-2xl bg-gray-50 border border-border shadow-xs transition-all hover:bg-white hover:shadow-md">
          <div className="flex-shrink-0 text-accent">
             <Info size={24} />
          </div>
          <div className="text-[16px] font-bold text-foreground leading-relaxed">
            {renderRichText(block.callout.rich_text)}
          </div>
        </div>
      )

    case 'divider':
      return <hr className="my-12 border-border" />

    case 'bulleted_list_item':
      return (
        <li className="ml-6 list-none mb-4 flex items-start gap-3">
          <div className="mt-2.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
          <span className="text-[17px] font-medium text-foreground/80 leading-relaxed">
            {renderRichText(block.bulleted_list_item.rich_text)}
          </span>
        </li>
      )

    case 'numbered_list_item':
      return (
        <li className="ml-6 list-none mb-4 flex items-start gap-3">
          <span className="text-accent font-black text-sm mt-1">
             •
          </span>
          <span className="text-[17px] font-medium text-foreground/80 leading-relaxed">
            {renderRichText(block.numbered_list_item.rich_text)}
          </span>
        </li>
      )

    default:
      return null
  }
}
