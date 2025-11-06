'use client'

import { useEffect, useState } from 'react'

export default function Page() {
  const [diaries, setDiaries] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/diaries')
      const data = await res.json()
      console.log('data', data)
      if (data.ok) setDiaries(data.data)
    }
    load()
  }, [])

  return (
    <div>
      <h1>📔 내 일기 목록</h1>
      <ul>
        {diaries.map((d) => (
          <li key={d.id}>
            {d.date} - {d.content} ({d.status})
          </li>
        ))}
      </ul>
    </div>
  )
}
