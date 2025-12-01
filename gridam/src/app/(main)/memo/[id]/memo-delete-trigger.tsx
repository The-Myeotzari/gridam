'use client'

import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import Button from '@/shared/ui/button'
import { deleteMemoAction } from '@/features/memo/api/memo.action'
import { toast } from '@/store/toast-store'
import { MESSAGES } from '@/shared/constants/messages'

export default function MemoDeleteTrigger({ id }: { id: string }) {
  const router = useRouter()

  async function handleDelete() {
    const result = await deleteMemoAction(id)

    if (!result.ok) {
      toast.error(result.message ?? MESSAGES.MEMO.ERROR.DELETE)
      return
    }

    toast.success(MESSAGES.MEMO.SUCCESS.DELETE)
    router.push('/memo')
  }

  return (
    <div onClick={handleDelete}>
      <Button
        type="button"
        variant="roundedRed"
        size="sm"
        label={
          <span className="flex items-center gap-1">
            <Trash2 className="h-4 w-4" />
            <span>삭제</span>
          </span>
        }
      />
    </div>
  )
}
