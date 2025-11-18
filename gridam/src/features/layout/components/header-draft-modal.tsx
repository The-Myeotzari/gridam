'use client'

import { X } from 'lucide-react'

export function HeaderDraftModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="bg-white rounded-2xl p-6 w-[360px] sm:w-[420px] shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">임시 저장 목록</h2>
        <button onClick={onClose}>
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <p className="text-sm text-muted-foreground mb-6">작성 중이던 일기를 불러올 수 있어요</p>

      <div className="flex flex-col gap-3">
        <p className="text-center text-sm text-muted-foreground py-6">임시 저장된 글이 없습니다.</p>
      </div>
    </div>
  )
}
