import { getPageBlocks } from '@/lib/notion'
import { BlockRenderer } from './BlockRenderer'
import type { BlockObjectResponse } from '@notionhq/client'

interface NotionContentProps {
  pageId: string
}

export async function NotionContent({ pageId }: NotionContentProps) {
  const blocks = await getPageBlocks(pageId)

  return (
    <div className="notion-content prose prose-neutral max-w-none">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block as BlockObjectResponse} />
      ))}
    </div>
  )
}