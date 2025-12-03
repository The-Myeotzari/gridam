'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/shared/ui/button'
import MemoEditorDialog from './memo-editor-dialog'

export default function MemoCreateButton() {
  const router = useRouter()
  const [editorOpen, setEditorOpen] = useState(false)

  function handleCreate() {
    setEditorOpen(true)
  }

  function handleSuccess() {
    router.refresh()
  }

  return (
    <>
      <div onClick={handleCreate} className="cursor-pointer">
        <Button type="button" variant="blue" size="lg" label="+ 새 메모" />
      </div>

      <MemoEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        initialMemo={null}
        onSuccess={handleSuccess}
      />
    </>
  )
}
