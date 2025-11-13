'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import DropBoxLabels, { type DropBoxItem } from '@/components/ui/dropbox-labels'
import { SquarePen, Trash2 } from 'lucide-react'

type Action<T> = (arg: T) => Promise<void> | void

export default function DropBoxClient({
  id,
  onEdit,
  onDelete,
  className = '',
  editLabel = '수정하기',
  deleteLabel = '삭제하기',
  trigger,
}: {
  id: string
  onEdit?: Action<{ id: string }>
  onDelete?: Action<{ id: string }>
  className?: string
  editLabel?: string
  deleteLabel?: string
  trigger: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => !rootRef.current?.contains(e.target as Node) && setOpen(false)
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  const run = (fn?: Action<{ id: string }>) => {
    if (!fn) return
    startTransition(async () => {
      await fn({ id })
      setOpen(false)
    })
  }

  const items: DropBoxItem<{ id: string }>[] = [
    onEdit && {
      key: 'edit',
      label: editLabel,
      icon: <SquarePen className="h-4 w-4" />,
      tone: 'secondary',
      onSelect: onEdit,
    },
    onDelete && {
      key: 'delete',
      label: deleteLabel,
      icon: <Trash2 className="h-4 w-4" />,
      tone: 'destructive',
      onSelect: onDelete,
    },
  ].filter(Boolean) as DropBoxItem<{ id: string }>[]

  return (
    <div ref={rootRef} className={`relative inline-block ${className}`}>
      <div onClick={() => setOpen((v) => !v)} aria-busy={isPending}>
        {trigger}
      </div>

      {open && (
        <div className="absolute right-0 top-[calc(100%+4px)] z-50">
          <DropBoxLabels items={items} onPick={(item) => run(item.onSelect)} />
        </div>
      )}
    </div>
  )
}
