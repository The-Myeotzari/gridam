'use client'

import Textarea from '@/components/ui/textarea'
import CanvasContainer from '@/features/write/components/canvas/canvas-container'
import WriteButtons from '@/features/write/components/write-buttons'
import { useSetDate, useSetText, useWriteStore } from '@/features/write/store/write-store'
import { useEffect } from 'react'

export default function WriteForm({ today }: { today: string }) {
  const setDate = useSetDate()
  const setText = useSetText()

  useEffect(() => {
    if (today) {
      setDate(today)
    }
  }, [today])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const state = useWriteStore.getState()

    // store에 저장된 상태 출력
    console.log('date:', state.date)
    console.log('text:', state.text)

    console.log('저장 완료!')
  }

  return (
    <form onSubmit={handleSubmit}>
      <CanvasContainer />

      <section className="p-5">
        <Textarea onChange={(v) => setText(v)} />
      </section>

      <WriteButtons />
    </form>
  )
}
