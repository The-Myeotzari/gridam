'use client'

import { useState } from 'react'

export function useDiaryForm() {
  const [date, setDate] = useState('')
  const [text, setText] = useState('')

  return {
    date,
    text,
    setDate,
    setText,
  }
}
