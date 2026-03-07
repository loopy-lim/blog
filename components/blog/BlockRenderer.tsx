import type { BlockObjectResponse } from '@notionhq/client'
import { getLocalImagePath } from '@/lib/image-utils'
import { highlightCode } from '@/lib/highlight'
import { CodeBlock } from './CodeBlock'
import { ZoomableImage } from './ZoomableImage'
import { renderMediaBlock } from './MediaBlockRenderer'
import { Info } from 'lucide-react'
import type { ReactNode } from 'react'

interface BlockRendererProps {
  block: BlockObjectResponse
  numberedIndex?: number
}

type RichTextList = Extract<BlockObjectResponse, { type: 'paragraph' }>['paragraph']['rich_text']
type BlockWithChildren = BlockObjectResponse & { children?: BlockObjectResponse[] }

const getChildBlocks = (block: BlockWithChildren): BlockObjectResponse[] => {
  if (Array.isArray(block.children)) {
    return block.children as BlockObjectResponse[]
  }

  const blockRecord = block as Record<string, unknown>
  const blockContent = blockRecord[block.type] as { children?: unknown } | undefined
  if (blockContent && Array.isArray(blockContent.children)) {
    return blockContent.children as BlockObjectResponse[]
  }

  return []
}

const renderChildBlocks = (children: BlockObjectResponse[], className: string) => {
  if (!children.length) {
    return null
  }

  const grouped: ReactNode[] = []
  let index = 0

  while (index < children.length) {
    const child = children[index]

    if (child.type === 'bulleted_list_item') {
      const items: BlockObjectResponse[] = []

      while (index < children.length && children[index].type === 'bulleted_list_item') {
        items.push(children[index])
        index += 1
      }

      grouped.push(
        <ul key={`child-ul-${items[0].id}`} className="list-none m-0 p-0">
          {items.map((item) => (
            <BlockRenderer key={item.id} block={item} />
          ))}
        </ul>
      )
      continue
    }

    if (child.type === 'numbered_list_item') {
      const items: BlockObjectResponse[] = []

      while (index < children.length && children[index].type === 'numbered_list_item') {
        items.push(children[index])
        index += 1
      }

      grouped.push(
        <ol key={`child-ol-${items[0].id}`} className="list-none m-0 p-0">
          {items.map((item, itemIndex) => (
            <BlockRenderer key={item.id} block={item} numberedIndex={itemIndex + 1} />
          ))}
        </ol>
      )
      continue
    }

    grouped.push(<BlockRenderer key={child.id} block={child} />)
    index += 1
  }

  return <div className={`${className} pl-2 sm:pl-3 border-l border-border/40 ml-0 sm:ml-1 mt-4 space-y-4`}>{grouped}</div>
}

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
        <code key={index} className="bg-stone-100 rounded px-1.5 py-0.5 text-[13px] font-bold font-mono text-accent border border-border">
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

export async function BlockRenderer({ block, numberedIndex }: BlockRendererProps) {
  const blockWithChildren = block as BlockWithChildren

  switch (block.type) {
    case 'paragraph':
      return (
        <p className="mb-6 leading-relaxed text-[16px] sm:text-[18px] font-medium text-foreground/80 break-keep">
          {renderRichText(block.paragraph.rich_text)}
        </p>
      )

    case 'heading_1':
      return (
        <h1 id={block.id} className="text-3xl sm:text-4xl font-black mb-8 mt-20 tracking-tight text-foreground border-b border-border pb-4 break-keep">
          {renderRichText(block.heading_1.rich_text)}
        </h1>
      )

    case 'heading_2':
      return (
        <h2 id={block.id} className="text-2xl sm:text-3xl font-black mb-6 mt-16 tracking-tight text-foreground break-keep">
          {renderRichText(block.heading_2.rich_text)}
        </h2>
      )

    case 'heading_3':
      return (
        <h3 id={block.id} className="text-xl sm:text-2xl font-black mb-4 mt-12 tracking-tight text-foreground break-keep">
          {renderRichText(block.heading_3.rich_text)}
        </h3>
      )

    case 'image':
      const originalImageUrl = block.image.type === 'external'
        ? block.image.external.url
        : block.image.file.url
      const caption = block.image.caption[0]?.plain_text
      let imageUrl: string

      try {
        imageUrl = getLocalImagePath(originalImageUrl)
      } catch (error) {
        console.error('Error resolving local image path:', originalImageUrl, error)
        return (
          <figure className="my-10 sm:my-16 space-y-4">
            <div className="rounded-lg border border-border bg-stone-50 p-8 text-sm font-bold text-muted">
              Image unavailable.
            </div>
            {caption && (
              <figcaption className="text-center text-[12px] font-bold text-muted uppercase tracking-[0.15em] italic opacity-60">
                {caption}
              </figcaption>
            )}
          </figure>
        )
      }

      return (
        <figure className="my-10 sm:my-16 space-y-4 group/img">
          <ZoomableImage 
            src={imageUrl} 
            alt={caption || 'Content image'} 
            caption={caption} 
          />
          {caption && (
            <figcaption className="text-center text-[12px] font-bold text-muted uppercase tracking-[0.15em] italic opacity-60">
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
        <div className="my-8 sm:my-10">
          <CodeBlock 
            html={highlightedHtml} 
            code={code} 
            language={language} 
          />
        </div>
      )

    case 'quote':
      return (
        <blockquote className="border-l-2 border-accent pl-8 py-2 my-10 sm:my-12 bg-accent/[0.02]">
          <p className="text-lg sm:text-2xl font-black italic text-foreground leading-snug tracking-tight">
            {renderRichText(block.quote.rich_text)}
          </p>
        </blockquote>
      )

    case 'callout':
      const calloutChildren = getChildBlocks(blockWithChildren)

      return (
        <div className="my-8 sm:my-10 flex gap-4 p-6 rounded-lg bg-stone-50 border border-border transition-all hover:border-accent/20">
          <div className="flex-shrink-0 text-accent pt-0.5">
            <Info size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[16px] font-bold text-foreground leading-relaxed">
              {renderRichText(block.callout.rich_text)}
            </div>
            {renderChildBlocks(calloutChildren, 'mt-4 space-y-3')}
          </div>
        </div>
      )

    case 'video':
    case 'embed':
    case 'bookmark':
      return renderMediaBlock({ block, renderRichText })

    case 'divider':
      return <hr className="my-16 border-border" />

    case 'bulleted_list_item':
      const bulletedChildren = getChildBlocks(blockWithChildren)

      return (
        <li className="ml-0 list-none mb-6 group/item">
          <div className="flex items-start gap-4">
            <div className="mt-2.5 h-1.5 w-1.5 rounded-full bg-border group-hover/item:bg-accent shrink-0 transition-colors" />
            <span className="text-[16px] sm:text-[18px] font-medium text-foreground/80 leading-relaxed break-keep">
              {renderRichText(block.bulleted_list_item.rich_text)}
            </span>
          </div>
          {renderChildBlocks(bulletedChildren, '')}
        </li>
      )

    case 'numbered_list_item':
      const numberedChildren = getChildBlocks(blockWithChildren)
      const marker = numberedIndex ?? 1

      return (
        <li className="ml-0 list-none mb-6 group/item">
          <div className="flex items-start gap-4">
            <span className="text-accent/40 group-hover/item:text-accent font-black text-sm mt-1 min-w-[1rem] text-right transition-colors">
              {marker}.
            </span>
            <span className="text-[16px] sm:text-[18px] font-medium text-foreground/80 leading-relaxed break-keep">
              {renderRichText(block.numbered_list_item.rich_text)}
            </span>
          </div>
          {renderChildBlocks(numberedChildren, '')}
        </li>
      )

    case 'table':
      const tableRows = getChildBlocks(blockWithChildren).filter(
        (child): child is Extract<BlockObjectResponse, { type: 'table_row' }> => child.type === 'table_row'
      )

      if (!tableRows.length) {
        return null
      }

      const tableWidth =
        block.table.table_width || Math.max(...tableRows.map((row) => row.table_row.cells.length), 0)
      const hasColumnHeader = block.table.has_column_header
      const hasRowHeader = block.table.has_row_header
      const headerRow = hasColumnHeader ? tableRows[0] : null
      const bodyRows = hasColumnHeader ? tableRows.slice(1) : tableRows

      const normalizeCells = (cells: Array<RichTextList>) => {
        if (!tableWidth) return cells
        return Array.from({ length: tableWidth }, (_, index) => cells[index] || [])
      }

      return (
        <div className="my-12 overflow-x-auto rounded-xl border border-border shadow-sm bg-white">
          <table className="w-full min-w-[560px] border-collapse text-left text-[14px]">
            {headerRow && (
              <thead className="bg-stone-50 border-b border-border">
                <tr>
                  {normalizeCells(headerRow.table_row.cells as Array<RichTextList>).map((cell, cellIndex) => (
                    <th
                      key={`${headerRow.id}-h-${cellIndex}`}
                      scope="col"
                      className="px-6 py-4 font-black text-foreground uppercase tracking-widest text-[11px]"
                    >
                      {renderRichText(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {bodyRows.map((row) => (
                <tr key={row.id} className="odd:bg-white even:bg-stone-50/50 border-b border-border last:border-0">
                  {normalizeCells(row.table_row.cells as Array<RichTextList>).map((cell, cellIndex) => {
                    const isRowHeader = hasRowHeader && cellIndex === 0

                    if (isRowHeader) {
                      return (
                        <th
                          key={`${row.id}-r-${cellIndex}`}
                          scope="row"
                          className="px-6 py-4 font-bold text-foreground bg-stone-50/30"
                        >
                          {renderRichText(cell)}
                        </th>
                      )
                    }

                    return (
                      <td key={`${row.id}-d-${cellIndex}`} className="px-6 py-4 text-foreground/85">
                        {renderRichText(cell)}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    default:
      return null
  }
}
