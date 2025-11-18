import DropBox, { type DropBoxActionItem } from '@/components/ui/dropbox'
import { SquarePen, Trash2 } from 'lucide-react'

export default async function Page() {
  async function deletePostAction({ id }: { id: string }) {
    'use server'
    // 삭제 로직
  }

  async function editPostAction({ id }: { id: string }) {
    'use server'
    // 편집 진입 로직
  }

  const items: DropBoxActionItem[] = [
    {
      key: 'edit',
      label: '변경하기',
      icon: <SquarePen className="h-4 w-4" />,
      tone: 'secondary',
      onSelect: editPostAction,
    },
    {
      key: 'delete',
      label: '개발하기',
      icon: <Trash2 className="h-4 w-4" />,
      tone: 'destructive',
      onSelect: deletePostAction,
    },
  ]

  return (
    <div className="pl-10">
      <DropBox id="test" items={items} />
    </div>
  )
}
