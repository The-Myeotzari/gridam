import { type DropBoxItem } from '@/shared/ui/dropbox-labels'
import DropBoxClient from '@/shared/ui/dropbox.client'
import { EllipsisVertical, SquarePen, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'

type Action<T> = (arg: T) => Promise<void> | void

export type DropBoxActionItem = DropBoxItem<{ id: string }>

type Props = {
  id: string
  className?: string
  trigger?: ReactNode

  // 완전 커스텀용
  items?: DropBoxActionItem[]

  // 기본값(수정/삭제)용
  onEdit?: Action<{ id: string }>
  onDelete?: Action<{ id: string }>
  editLabel?: string
  deleteLabel?: string
  editKey?: DropBoxActionItem['key']
  deleteKey?: DropBoxActionItem['key']
  editIcon?: ReactNode
  deleteIcon?: ReactNode
}

export default function DropBox({
  id,
  className = '',
  trigger,
  items,
  onEdit,
  onDelete,
  editLabel = '수정하기',
  deleteLabel = '삭제하기',
  editKey = 'edit',
  deleteKey = 'delete',
  editIcon,
  deleteIcon,
}: Props) {
  // 기본값은 수정, 삭제 아이템 있으면 부모가 커스텀
  const finalItems: DropBoxActionItem[] =
    items && items.length > 0
      ? items
      : ([
          onEdit && {
            key: editKey,
            label: editLabel,
            icon: editIcon ?? <SquarePen className="h-4 w-4" />,
            tone: 'secondary',
            onSelect: onEdit,
          },
          onDelete && {
            key: deleteKey,
            label: deleteLabel,
            icon: deleteIcon ?? <Trash2 className="h-4 w-4" />,
            tone: 'destructive',
            onSelect: onDelete,
          },
        ].filter(Boolean) as DropBoxActionItem[])

  return (
    <DropBoxClient
      id={id}
      items={finalItems}
      className={className}
      trigger={
        trigger ?? (
          <button
            type="button"
            aria-label="메뉴 열기"
            className="p-2 rounded-full hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            <EllipsisVertical className="h-4 w-4 text-muted-foreground" />
          </button>
        )
      }
    />
  )
}
