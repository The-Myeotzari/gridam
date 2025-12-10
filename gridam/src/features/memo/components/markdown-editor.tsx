'use client'

import { useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import MarkdownToolbar from './markdown-toolbar'
import { markdownComponents } from './markdown-components'

type Props = {
  value: string
  onChange: (value: string) => void
}

export default function MarkdownEditor({ value, onChange }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-[2fr_2fr] md:gap-6">
      <div className="flex flex-col">
        <span className="mb-2 text-xs font-medium text-muted-foreground">메모 작성</span>

        <div
          className="
          flex flex-col
          rounded-2xl border border-border bg-white shadow-sm
          focus-within:ring-2 focus-within:ring-primary
          min-h-[220px] 
          md:min-h-[520px] 
        "
        >
          <MarkdownToolbar textareaRef={textareaRef} onChange={onChange} />

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="
            flex-1 w-full resize-none
            bg-transparent px-4 py-3 text-sm text-foreground outline-none
            overflow-y-auto
          "
            placeholder="메모를 자유롭게 기록해보세요..."
          />
        </div>
      </div>

      <div className="flex flex-col">
        <span className="mb-2 text-xs font-medium text-muted-foreground">미리보기</span>

        <div
          className="
          rounded-2xl bg-white p-4 shadow-sm
          min-h-[220px] max-h-[220px] overflow-y-auto
          md:min-h-[520px]
        "
        >
          {value.trim().length === 0 ? (
            <p className="text-sm text-muted-foreground">
              작성 중인 메모가 여기에 실시간으로 표시됩니다.
            </p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={markdownComponents}
            >
              {value}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  )
}
