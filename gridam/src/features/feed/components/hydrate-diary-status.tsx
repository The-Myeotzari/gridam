'use client'

import { Status, useDiaryStatusStore } from '@/features/feed/store/diary-status-store'
import { useEffect } from 'react'

export default function HydrateDiaryStatus({ status }: { status: Status }) {
  const setStatus = useDiaryStatusStore((s) => s.setStatus)

  useEffect(() => {
    setStatus(status)
  }, [status, setStatus])

  return null
}
