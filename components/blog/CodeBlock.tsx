'use client'

import React, { useState } from 'react'
import { Check, Copy } from 'lucide-react'

interface CodeBlockProps {
  html: string
  code: string
  language: string
}

export function CodeBlock({ html, code, language }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy!', err)
    }
  }

  return (
    <div className="group relative my-8 rounded-lg border border-border bg-stone-50 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-2.5 bg-white border-b border-border text-[10px] font-bold text-muted uppercase tracking-[0.2em]">
        <span>{language}</span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 hover:text-accent transition-colors"
        >
          {isCopied ? (
            <>
              <Check size={12} className="text-accent" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div 
        className="text-[13px] sm:text-[14px] leading-relaxed overflow-x-auto p-6 shiki-container"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
