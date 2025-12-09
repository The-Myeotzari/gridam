'use client'

import { Search } from 'lucide-react'
import ClientInput from '@/shared/ui/input.client'
import type { ChangeEvent } from 'react'

type Props = {
  value: string
  onChange: (value: string) => void
}

export default function MemoSearch({ value, onChange }: Props) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <ClientInput
        value={value}
        onChange={handleChange}
        placeholder="메모 제목으로 검색해보세요."
        className="w-full rounded-full pl-9"
      />
    </div>
  )
}
