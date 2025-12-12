'use client'

import { deleteMemoAction } from '@/features/memo/api/memo.action'
import { MESSAGES } from '@/shared/constants/messages'
import { URL_CONSTANTS } from '@/shared/constants/url.constants'
import Button from '@/shared/ui/button'
import { toast } from '@/store/toast-store'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function MemoDeleteTrigger({ id }: { id: string }) {
  const router = useRouter()

  async function handleDelete() {
    const result = await deleteMemoAction(id)

    if (!result.ok) {
      toast.error(result.message ?? MESSAGES.MEMO.ERROR.DELETE)
      return
    }

    toast.success(MESSAGES.MEMO.SUCCESS.DELETE)
    router.push(URL_CONSTANTS.MEMO.BASE)
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
