'use client'

import Textarea from '@/components/ui/textarea'
import { usePostDiary } from '@/features/write/api/queries/use-post-diary'
import CanvasContainer from '@/features/write/components/canvas/canvas-container'
import WriteButtons from '@/features/write/components/write-buttons'
import { useCanvasStore } from '@/features/write/store/canvas-store'
import { useSetDate, useSetText, useWriteStore } from '@/features/write/store/write-store'
import { useEffect } from 'react'

type props = {
  today: string
  dateValue: string
  weather: string
}

export default function WriteForm({ today, dateValue, weather }: props) {
  const setDate = useSetDate()
  const setText = useSetText()

  const { mutate: createDiary, isPending } = usePostDiary()

  useEffect(() => {
    if (today) {
      setDate(today)
    }
  }, [today])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const textState = useWriteStore.getState()
    const canvasState = useCanvasStore.getState()

    createDiary({
      content: textState.text,
      date: dateValue,
      imageUrl: canvasState.canvas,
      emoji: weather,
      meta: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    })
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
