import DropBoxClient from '@/components/ui/dropbox.client'
import { EllipsisVertical } from 'lucide-react'

type Action<T> = (arg: T) => Promise<void> | void

export default function DropBox({
  id,
  onDelete,
  onEdit,
  className = '',
  editLabel = '수정하기',
  deleteLabel = '삭제하기',
}: {
  id: string
  onDelete?: Action<{ id: string }>
  onEdit?: Action<{ id: string }>
  className?: string
  editLabel?: string
  deleteLabel?: string
}) {
  return (
    <DropBoxClient
      className={className}
      onDelete={onDelete}
      onEdit={onEdit}
      id={id}
      trigger={
        <button
          type="button"
          aria-label="메뉴 열기"
          className="p-2 rounded-full hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/30"
        >
          <EllipsisVertical className="h-4 w-4 text-muted-foreground" />
        </button>
      }
      editLabel={editLabel}
      deleteLabel={deleteLabel}
    />
  )
}
