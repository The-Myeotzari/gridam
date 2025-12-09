'use client'

import React, { useRef } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import MarkdownToolbar from './markdown-toolbar'

type Props = {
  value: string
  onChange: (value: string) => void
}

const markdownComponents: Components = {
  h1: ({ node, ...props }) => <h1 className="mb-3 text-2xl font-bold text-foreground" {...props} />,
  h2: ({ node, ...props }) => (
    <h2 className="mb-2 mt-4 text-xl font-semibold text-foreground" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="mb-2 mt-3 text-lg font-semibold text-foreground" {...props} />
  ),
  p: ({ node, ...props }) => (
    <p className="mb-2 text-sm leading-relaxed text-foreground whitespace-pre-wrap" {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul className="mb-2 list-disc space-y-1 pl-5 text-sm text-foreground" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="mb-2 list-decimal space-y-1 pl-5 text-sm text-foreground" {...props} />
  ),
  li: ({ node, ...props }) => <li className="text-sm leading-relaxed" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-semibold text-foreground" {...props} />,
  em: ({ node, ...props }) => <em className="text-foreground" {...props} />,
  blockquote: ({ node, ...props }) => (
    <blockquote
      className="mb-3 border-l-4 border-accent-soft pl-3 text-sm text-muted-foreground whitespace-pre-wrap"
      {...props}
    />
  ),
  code(props) {
    const { inline, className, children, ...rest } = props as {
      inline?: boolean
      className?: string
      children?: React.ReactNode
      [key: string]: unknown
    }

    if (inline) {
      return (
        <code
          className={'rounded bg-muted px-1.5 py-0.5 text-xs font-mono ' + (className ?? '')}
          {...rest}
        >
          {children}
        </code>
      )
    }

    return (
      <pre className="mb-3 overflow-x-auto rounded-md bg-muted p-3 text-xs text-foreground">
        <code className={className} {...rest}>
          {children}
        </code>
      </pre>
    )
  },
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
