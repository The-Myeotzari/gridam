'use client'

import DropBoxLabels, { type DropBoxItem } from '@/shared/ui/dropbox-labels'
import { useEffect, useRef, useState, useTransition } from 'react'

type DropBoxActionItem = DropBoxItem<{ id: string }>

export default function DropBoxClient({
  id,
  items,
  className = '',
  trigger,
}: {
  id: string
  items: DropBoxActionItem[]
  className?: string
  trigger: React.ReactNode
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

  const handlePick = (item: DropBoxActionItem) => {
    if (!item.onSelect) return

    const fn = item.onSelect

    startTransition(async () => {
      await fn({ id })
      setOpen(false)
    })
  }
  return (
    <div ref={rootRef} className={`relative inline-block ${className}`}>
      <div onClick={() => setOpen((v) => !v)} aria-busy={isPending}>
        {trigger}
      </div>

      {open && (
        <div className="absolute right-0 top-[calc(100%+4px)] z-50">
          <DropBoxLabels items={items} onPick={handlePick} />
        </div>
      )}
    </div>
  )
}
