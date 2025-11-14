import DropBoxClient from '@/components/ui/dropbox.client'
import { type DropBoxItem } from '@/components/ui/dropbox-labels'
import { EllipsisVertical, SquarePen, Trash2 } from 'lucide-react'

type Action<T> = (arg: T) => Promise<void> | void

export type DropBoxActionItem = DropBoxItem<{ id: string }>

type Props = {
  id: string
  onEdit?: Action<{ id: string }>
  onDelete?: Action<{ id: string }>
  className?: string
  editLabel?: string
  deleteLabel?: string
}

export default function DropBox({
  id,
  onEdit,
  onDelete,
  onEdit,
  className = '',
  editLabel = '수정하기',
  deleteLabel = '삭제하기',
}: Props) {
  const items: DropBoxActionItem[] = [
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
  ].filter(Boolean) as DropBoxActionItem[]

  return (
    <DropBoxClient
      id={id}
      items={items}
      className={className}
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
