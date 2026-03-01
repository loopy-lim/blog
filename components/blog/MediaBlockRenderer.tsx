import type { BlockObjectResponse } from '@notionhq/client'
import type { ReactNode } from 'react'

type RichTextList = Extract<BlockObjectResponse, { type: 'paragraph' }>['paragraph']['rich_text']
type MediaBlock = Extract<BlockObjectResponse, { type: 'video' | 'embed' | 'bookmark' }>

interface RenderMediaBlockOptions {
  block: MediaBlock
  renderRichText: (richText: RichTextList) => ReactNode
}

const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtu.be',
  'www.youtu.be',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
])

const parseYouTubeStart = (value: string | null): number | null => {
  if (!value) return null

  if (/^\d+$/.test(value)) {
    return Number(value)
  }

  const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i)
  if (!match) return null

  const hours = Number(match[1] || 0)
  const minutes = Number(match[2] || 0)
  const seconds = Number(match[3] || 0)
  const total = hours * 3600 + minutes * 60 + seconds

  return total > 0 ? total : null
}

const toYouTubeEmbedUrl = (rawUrl: string): string | null => {
  try {
    const url = new URL(rawUrl)
    const host = url.hostname.toLowerCase()

    if (!YOUTUBE_HOSTS.has(host)) {
      return null
    }

    let videoId: string | null = null

    if (host.includes('youtu.be')) {
      const shortId = url.pathname.slice(1).split('/')[0]
      videoId = shortId || null
    } else if (url.pathname === '/watch') {
      videoId = url.searchParams.get('v')
    } else if (url.pathname.startsWith('/embed/')) {
      videoId = url.pathname.split('/')[2] || null
    } else if (url.pathname.startsWith('/shorts/')) {
      videoId = url.pathname.split('/')[2] || null
    } else if (url.pathname.startsWith('/live/')) {
      videoId = url.pathname.split('/')[2] || null
    }

    if (!videoId) {
      return null
    }

    const params = new URLSearchParams()
    const start =
      parseYouTubeStart(url.searchParams.get('start')) ??
      parseYouTubeStart(url.searchParams.get('t'))

    if (start) {
      params.set('start', String(start))
    }
    params.set('rel', '0')

    const query = params.toString()
    return `https://www.youtube.com/embed/${videoId}${query ? `?${query}` : ''}`
  } catch {
    return null
  }
}

const isDirectVideoFile = (rawUrl: string): boolean => {
  try {
    const pathname = new URL(rawUrl).pathname.toLowerCase()
    return ['.mp4', '.webm', '.ogg', '.mov', '.m4v'].some((ext) => pathname.endsWith(ext))
  } catch {
    return false
  }
}

const getHostLabel = (rawUrl: string): string => {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, '')
  } catch {
    return rawUrl
  }
}

const renderMediaCaption = (caption: RichTextList | undefined, renderRichText: (richText: RichTextList) => ReactNode) => {
  if (!caption?.length) {
    return null
  }

  return (
    <figcaption className="text-center text-[11px] font-bold text-muted uppercase tracking-[0.15em] italic opacity-60">
      {renderRichText(caption)}
    </figcaption>
  )
}

export const renderMediaBlock = ({ block, renderRichText }: RenderMediaBlockOptions): ReactNode => {
  if (block.type === 'video') {
    const caption = block.video.caption as RichTextList

    if (block.video.type === 'file') {
      return (
        <figure className="my-12 space-y-3">
          <div className="overflow-hidden rounded-2xl border border-border bg-black/5">
            <video
              className="w-full"
              controls
              preload="metadata"
              src={block.video.file.url}
            />
          </div>
          {renderMediaCaption(caption, renderRichText)}
        </figure>
      )
    }

    const externalUrl = block.video.external.url
    const youtubeEmbedUrl = toYouTubeEmbedUrl(externalUrl)

    if (youtubeEmbedUrl) {
      return (
        <figure className="my-12 space-y-3">
          <div className="aspect-video overflow-hidden rounded-2xl border border-border bg-black/5">
            <iframe
              src={youtubeEmbedUrl}
              title="YouTube video"
              className="h-full w-full"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          {renderMediaCaption(caption, renderRichText)}
        </figure>
      )
    }

    if (isDirectVideoFile(externalUrl)) {
      return (
        <figure className="my-12 space-y-3">
          <div className="overflow-hidden rounded-2xl border border-border bg-black/5">
            <video className="w-full" controls preload="metadata" src={externalUrl} />
          </div>
          {renderMediaCaption(caption, renderRichText)}
        </figure>
      )
    }

    return (
      <figure className="my-12 space-y-3">
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl border border-border bg-gray-50 p-5 transition-colors hover:bg-gray-100"
        >
          <p className="text-[11px] font-black uppercase tracking-[0.15em] text-muted">{getHostLabel(externalUrl)}</p>
          <p className="mt-2 break-all text-sm font-bold text-foreground">{externalUrl}</p>
        </a>
        {renderMediaCaption(caption, renderRichText)}
      </figure>
    )
  }

  if (block.type === 'embed') {
    const embedUrl = block.embed.url
    const iframeSrc = toYouTubeEmbedUrl(embedUrl) ?? embedUrl

    return (
      <figure className="my-12 space-y-3">
        <div className="aspect-video overflow-hidden rounded-2xl border border-border bg-black/5">
          <iframe
            src={iframeSrc}
            title="Embedded content"
            className="h-full w-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <a
          href={embedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex text-[12px] font-bold text-accent underline underline-offset-4 decoration-accent/30 hover:decoration-accent"
        >
          원본 링크 열기
        </a>
      </figure>
    )
  }

  const bookmarkUrl = block.bookmark.url
  const caption = block.bookmark.caption as RichTextList
  const youtubeEmbedUrl = toYouTubeEmbedUrl(bookmarkUrl)

  if (youtubeEmbedUrl) {
    return (
      <figure className="my-12 space-y-3">
        <div className="aspect-video overflow-hidden rounded-2xl border border-border bg-black/5">
          <iframe
            src={youtubeEmbedUrl}
            title="Bookmarked YouTube video"
            className="h-full w-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        {renderMediaCaption(caption, renderRichText)}
      </figure>
    )
  }

  return (
    <figure className="my-12 space-y-3">
      <a
        href={bookmarkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-2xl border border-border bg-gray-50 p-5 transition-colors hover:bg-gray-100"
      >
        <p className="text-[11px] font-black uppercase tracking-[0.15em] text-muted">{getHostLabel(bookmarkUrl)}</p>
        <p className="mt-2 break-all text-sm font-bold text-foreground">{bookmarkUrl}</p>
      </a>
      {renderMediaCaption(caption, renderRichText)}
    </figure>
  )
}
