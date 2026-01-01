import { createHighlighter } from 'shiki'

let highlighterPromise: ReturnType<typeof createHighlighter> | null = null

export async function getCachedHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: ['javascript', 'typescript', 'tsx', 'jsx', 'json', 'css', 'html', 'python', 'bash', 'shell', 'yaml', 'markdown', 'sql']
    })
  }
  return highlighterPromise
}

export async function highlightCode(code: string, lang: string) {
  const highlighter = await getCachedHighlighter()
  // Notion uses standard language names, often matching shiki
  // Fallback to text if not supported or generic
  const validLang = highlighter.getLoadedLanguages().includes(lang) ? lang : 'text'
  
  return highlighter.codeToHtml(code, {
    lang: validLang,
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    }
  })
}
