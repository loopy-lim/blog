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
    <div className="group relative my-6 rounded-lg border border-[#edece9] bg-[#fbfbfa] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50/50 border-b border-[#edece9] text-[11px] font-medium text-gray-500 uppercase tracking-wider">
        <span>{language}</span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"
        >
          {isCopied ? (
            <>
              <Check size={12} className="text-green-500" />
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
        className="text-[13px] leading-relaxed overflow-x-auto p-4 shiki-container"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
