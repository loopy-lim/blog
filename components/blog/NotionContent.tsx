import { getPageBlocks } from '@/lib/notion'
import { BlockRenderer } from './BlockRenderer'
import type { BlockObjectResponse } from '@notionhq/client'

interface NotionContentProps {
  pageId: string
}

export async function NotionContent({ pageId }: NotionContentProps) {
  const blocks = await getPageBlocks(pageId)
  const notionBlocks = blocks as BlockObjectResponse[]
  let numberedIndex = 0

  return (
    <div className="notion-content prose prose-neutral max-w-none">
      {notionBlocks.map((block, index) => {
        let currentNumberedIndex: number | undefined

        if (block.type === 'numbered_list_item') {
          const prev = notionBlocks[index - 1]
          numberedIndex = prev?.type === 'numbered_list_item' ? numberedIndex + 1 : 1
          currentNumberedIndex = numberedIndex
        } else {
          numberedIndex = 0
        }

        return (
          <BlockRenderer key={block.id} block={block} numberedIndex={currentNumberedIndex} />
        )
      })}
    </div>
  )
}
