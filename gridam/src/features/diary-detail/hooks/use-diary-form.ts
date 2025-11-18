'use client'

import { useCallback, useState } from 'react'

export const useDiaryForm = () => {
  const [date, setDate] = useState('')
  const [text, setText] = useState('')

  const updateDate = useCallback((v: string) => setDate(v), [])
  const updateText = useCallback((v: string) => setText(v), [])

  return {
    date,
    text,
    setDate: updateDate,
    setText: updateText,
  }
}
