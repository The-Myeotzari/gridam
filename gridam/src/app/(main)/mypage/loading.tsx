'use client'

import { useSmoothProgress } from "@/shared/hooks/use-smooth-progress"
import LoadingOverlay from "@/shared/ui/three/loading-overlay"

export default function MyPageLoading() {
  const { open, progress } = useSmoothProgress(true)
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-10 space-y-10">
      <div className="flex flex-col items-center gap-2 pt-6">
        <LoadingOverlay open={open} label="마이페이지 불러오는 중…" progress={progress} />
      </div>
    </div>
  )
}