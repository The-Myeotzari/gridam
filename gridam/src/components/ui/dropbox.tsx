import DropBoxClient from '@/components/ui/dropbox.client'
import { EllipsisVertical } from 'lucide-react'

type Action<T> = (arg: T) => Promise<void> | void

export default function DropBox({
  id,
  onEdit,
  onDelete,
  className = '',
  editLabel,
  deleteLabel,
}: {
  id: string
  onEdit?: Action<{ id: string }>
  onDelete?: Action<{ id: string }>
  className?: string
  editLabel?: string
  deleteLabel?: string
}) {
  return (
    <DropBoxClient
      id={id}
      onEdit={onEdit}
      onDelete={onDelete}
      className={className}
      editLabel={editLabel}
      deleteLabel={deleteLabel}
      trigger={
        <button
          type="button"
          aria-label="메뉴 열기"
          className="p-2 rounded-full hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/30"
        >
          <EllipsisVertical className="h-4 w-4 text-muted-foreground" />
        </button>
      }
    />
  )
}
