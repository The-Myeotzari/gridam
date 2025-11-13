'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { SquarePen, Trash2 } from 'lucide-react'

type Action<T> = (arg: T) => Promise<void> | void

export default function DropBoxClient({
  id,
  onDelete,
  onEdit,
  trigger,
  className = '',
  editLabel = '',
  deleteLabel = '',
}: {
  id: string
  onDelete?: Action<{ id: string }>
  onEdit?: Action<{ id: string }>
  trigger: React.ReactNode
  className?: string
  editLabel?: string
  deleteLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const rootRef = useRef<HTMLDivElement>(null)

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
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  const handleDelete = () => {
    if (!onDelete) return
    startTransition(async () => {
      await onDelete({ id })
      setOpen(false)
    })
  }

  const handleEdit = () => {
    if (!onEdit) return
    startTransition(async () => {
      await onEdit({ id })
      setOpen(false)
    })
  }

  return (
    <div ref={rootRef} className={`relative size-8 inline-block ${className}`}>
      <div onClick={() => setOpen(v => !v)} aria-busy={isPending}>
        {trigger}
      </div>
      {open && (
        <div className="absolute right-0 top-[calc(100%+4px)] z-50">
          <div className="min-w-32 rounded-lg border bg-popover p-1 text-popover-foreground shadow-md">
            {onEdit &&
            <button
              type="button"
              onClick={handleEdit}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-accent"
            >
              <SquarePen className="h-4 w-4" />
              <span className="font-medium">{editLabel}</span>
            </button>
            }
            {onDelete &&
            <button
              type="button"
              onClick={handleDelete}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-secondary text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="font-medium">{deleteLabel}</span>
            </button>
            }
          </div>
        </div>
      )}
    </div>
  )
}
