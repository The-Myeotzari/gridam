'use client'

import { useEffect, useRef, useState } from 'react'
import { EllipsisVertical, SquarePen, Trash2 } from 'lucide-react'

type Props = {
  onEdit?: () => void
  onDelete?: () => void
  className?: string
  editLabel?: string
  deleteLabel?: string
}

export default function DropBox({
  onEdit,
  onDelete,
  className = '',
  editLabel = '수정하기',
  deleteLabel = '삭제하기',
}: Props) {
  const [open, setOpen] = useState(false)

  // DropBox 전체 컨테이너를 가리킴, 메뉴 외부 클릭 감지용 (바깥 클릭 시 닫기)
  const rootRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 / ESC 키 입력 시 메뉴 닫기
  useEffect(() => {
    if (!open) return

    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onEsc)

    // cleanup
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  return (
    <div ref={rootRef} className={`relative inline-block ${className}`}>
      {/* 메뉴 열기 버튼 */}
      <button
        type="button"
        aria-label="메뉴 열기"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex p-2 rounded-full hover:bg-muted transition"
      >
        <EllipsisVertical className="w-4 h-4 text-muted-foreground" />
      </button>

      {/* 메뉴 영역 */}
      {open && (
        <div
          className="
            absolute right-0 top-[calc(100%+4px)] z-50
            min-w-[8rem] overflow-hidden
            rounded-lg border bg-popover p-1 text-popover-foreground shadow-md
          "
        >
          {/* 수정 버튼 */}
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onEdit?.()
            }}
            className="
              flex w-full items-center gap-2
              rounded-lg px-2 py-1.5 text-sm transition-colors
              hover:bg-accent focus:bg-accent focus:text-accent-foreground
            "
          >
            <SquarePen className="w-4 h-4" />
            <span className="font-medium">{editLabel}</span>
          </button>

          {/* 삭제 버튼 */}
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              onDelete?.()
            }}
            className="
              flex w-full items-center gap-2
              rounded-lg px-2 py-1.5 text-sm text-destructive transition-colors
              hover:bg-secondary focus:bg-secondary
            "
          >
            <Trash2 className="w-4 h-4" />
            <span className="font-medium">{deleteLabel}</span>
          </button>
        </div>
      )}
    </div>
  )
}
