import { getPageBlocks } from '@/lib/notion'
import { BlockRenderer } from './BlockRenderer'
import type { BlockObjectResponse } from '@notionhq/client'

interface NotionContentProps {
  pageId: string
}

export async function NotionContent({ pageId }: NotionContentProps) {
  const blocks = await getPageBlocks(pageId)

  return (
    <article className="prose prose-lg dark:prose-invert max-w-none notion-content">
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block as BlockObjectResponse} />
      ))}
    </article>
  )
}