'use client'

import { useEffect, useRef, useState } from 'react'
import { EllipsisVertical, SquarePen, Trash2 } from 'lucide-react'
import Button from '@/components/ui/button'

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
      <Button
        onClick={() => setOpen((v) => !v)}
        isActive={false}
        aria-label="메뉴 열기"
        label={<EllipsisVertical className="w-4 h-4 text-muted-foreground" />}
        size="icon"
        className="
          p-2 rounded-full bg-transparent border-0 shadow-none
         hover:bg-muted transition focus-visible:ring-2 focus-visible:ring-ring/30"
      ></Button>

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
          <div
            className="
            flex w-full items-center gap-2
            rounded-lg px-2 py-1.5 text-sm transition-colors
            hover:bg-accent focus-within:bg-accent
          "
          >
            <SquarePen className="w-4 h-4" />
            <Button
              size="sm"
              isActive={false}
              onClick={() => {
                setOpen(false)
                onEdit?.()
              }}
              className="w-full justify-start h-auto px-0 py-0 bg-transparent border-0 text-sm font-medium hover:bg-transparent"
              label={editLabel}
            />
          </div>

          {/* 삭제 버튼 */}
          <div
            className="
            flex w-full items-center gap-2
            rounded-lg px-2 py-1.5 text-sm transition-colors
            hover:bg-secondary  focus-within:bg-secondary  
          "
          >
            <Trash2 className="w-4 h-4 text-destructive" />
            <Button
              size="sm"
              isActive={false}
              onClick={() => {
                setOpen(false)
                onDelete?.()
              }}
              className="w-full justify-start h-auto px-0 py-0 bg-transparent border-0
                         text-sm font-medium text-destructive hover:bg-transparent"
              label={deleteLabel}
            />
          </div>
        </div>
      )}
    </div>
  )
}
