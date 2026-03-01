import { getPageBlocks } from '@/lib/notion'
import { BlockRenderer } from './BlockRenderer'
import type { BlockObjectResponse } from '@notionhq/client'
import type { ReactNode } from 'react'

interface NotionContentProps {
  pageId: string
}

function renderBlocks(blocks: BlockObjectResponse[]) {
  const grouped: ReactNode[] = []
  let index = 0

  while (index < blocks.length) {
    const block = blocks[index]

    if (block.type === 'bulleted_list_item') {
      const items: BlockObjectResponse[] = []

      while (index < blocks.length && blocks[index].type === 'bulleted_list_item') {
        items.push(blocks[index])
        index += 1
      }

      grouped.push(
        <ul key={`ul-${items[0].id}`} className="list-none m-0 p-0">
          {items.map((item) => (
            <BlockRenderer key={item.id} block={item} />
          ))}
        </ul>
      )
      continue
    }

    if (block.type === 'numbered_list_item') {
      const items: BlockObjectResponse[] = []

      while (index < blocks.length && blocks[index].type === 'numbered_list_item') {
        items.push(blocks[index])
        index += 1
      }

      grouped.push(
        <ol key={`ol-${items[0].id}`} className="list-none m-0 p-0">
          {items.map((item, itemIndex) => (
            <BlockRenderer key={item.id} block={item} numberedIndex={itemIndex + 1} />
          ))}
        </ol>
      )
      continue
    }

    grouped.push(<BlockRenderer key={block.id} block={block} />)
    index += 1
  }

  return grouped
}

export async function NotionContent({ pageId }: NotionContentProps) {
  let notionBlocks: BlockObjectResponse[] = []

  try {
    const blocks = await getPageBlocks(pageId)
    notionBlocks = blocks as BlockObjectResponse[]
  } catch (error) {
    console.error('Error rendering Notion content:', error)
    return (
      <div className="rounded-2xl border border-border bg-gray-50 p-6 text-sm font-bold text-muted-foreground">
        콘텐츠를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
      </div>
    )
  }

  return (
    <div className="notion-content prose prose-neutral max-w-none">
      {renderBlocks(notionBlocks)}
    </div>
  )
}
