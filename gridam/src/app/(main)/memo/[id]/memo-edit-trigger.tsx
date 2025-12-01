'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil } from 'lucide-react'
import type { Memo } from '@/features/memo/api/memo.action'
import Button from '@/shared/ui/button'
import MemoEditorDialog from '@/features/memo/components/memo-editor-dialog'

type Props = {
  memo: Memo
}

export default function MemoEditTrigger({ memo }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleSuccess = () => {
    router.refresh()
  }

  return (
    <>
      <div onClick={() => setOpen(true)}>
        <Button
          type="button"
          variant="roundedBasic"
          size="sm"
          label={
            <span className="flex items-center gap-1">
              <Pencil className="h-4 w-4" />
              <span>수정</span>
            </span>
          }
        />
      </div>

      <MemoEditorDialog
        open={open}
        onOpenChange={setOpen}
        initialMemo={memo}
        onSuccess={handleSuccess}
      />
    </>
  )
}
