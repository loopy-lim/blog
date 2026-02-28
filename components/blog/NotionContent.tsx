import { getPageBlocks } from '@/lib/notion'
import { BlockRenderer } from './BlockRenderer'
import type { BlockObjectResponse } from '@notionhq/client'

interface NotionContentProps {
  pageId: string
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
