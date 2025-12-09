'use client'

import type React from 'react'

export type MarkdownCommand = 'bold' | 'italic' | 'strike' | 'h1' | 'h2' | 'h3' | 'quote' | 'code'

type Props = {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  onChange: (value: string) => void
}

export default function MarkdownToolbar({ textareaRef, onChange }: Props) {
  const baseButton =
    'inline-flex items-center justify-center h-8 px-2 text-xs text-muted-foreground hover:text-foreground transition-colors'

  // 선택 영역 앞뒤에 마크다운 토큰을 감싸는 헬퍼
  function applyWrap(before: string, after: string = before) {
    const textarea = textareaRef.current
    if (!textarea) return

    const { selectionStart, selectionEnd, value: current } = textarea
    const selected = current.slice(selectionStart, selectionEnd)

    const next =
      current.slice(0, selectionStart) + before + selected + after + current.slice(selectionEnd)

    onChange(next)

    const cursor = selectionStart + before.length + selected.length
    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(cursor, cursor)
    })
  }

  // 선택된 줄들의 앞에 prefix를 붙이는 헬퍼 (H1/H2/H3, 인용 등)
  function applyLinePrefix(prefix: string) {
    const textarea = textareaRef.current
    if (!textarea) return

    const { selectionStart, selectionEnd, value: current } = textarea

    const before = current.slice(0, selectionStart)
    const middle = current.slice(selectionStart, selectionEnd)
    const after = current.slice(selectionEnd)

    const lines = middle.split('\n')

    const nextMiddle = lines
      .map((line) => {
        if (!line) return prefix
        if (line.startsWith(prefix)) return line
        return `${prefix}${line}`
      })
      .join('\n')

    const next = before + nextMiddle + after
    const addedLength = nextMiddle.length - middle.length

    onChange(next)

    const nextSelectionStart = selectionStart + prefix.length
    const nextSelectionEnd = selectionEnd + addedLength

    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(nextSelectionStart, nextSelectionEnd)
    })
  }

  function handleCommand(cmd: MarkdownCommand) {
    switch (cmd) {
      case 'bold':
        applyWrap('**')
        break
      case 'italic':
        applyWrap('*')
        break
      case 'strike':
        applyWrap('~~')
        break
      case 'h1':
        applyLinePrefix('# ')
        break
      case 'h2':
        applyLinePrefix('## ')
        break
      case 'h3':
        applyLinePrefix('### ')
        break
      case 'quote':
        applyLinePrefix('> ')
        break
      case 'code':
        applyWrap('\n```ts\n', '\n```\n')
        break
      default:
        break
    }
  }

  return (
    <div className="flex items-center gap-1 border-b border-border bg-muted/40 px-2">
      <button type="button" className={baseButton} onClick={() => handleCommand('h1')}>
        H1
      </button>
      <button type="button" className={baseButton} onClick={() => handleCommand('h2')}>
        H2
      </button>
      <button type="button" className={baseButton} onClick={() => handleCommand('h3')}>
        H3
      </button>

      <div className="mx-1 h-5 w-px bg-border" />

      <button type="button" className={baseButton} onClick={() => handleCommand('bold')}>
        <span className="font-bold">B</span>
      </button>
      <button type="button" className={baseButton} onClick={() => handleCommand('italic')}>
        <span className="italic">I</span>
      </button>
      <button type="button" className={baseButton} onClick={() => handleCommand('strike')}>
        <span className="line-through">S</span>
      </button>

      <div className="mx-1 h-5 w-px bg-border" />

      <button type="button" className={baseButton} onClick={() => handleCommand('quote')}>
        &gt;
      </button>
      <button type="button" className={baseButton} onClick={() => handleCommand('code')}>
        {'</>'}
      </button>
    </div>
  )
}
