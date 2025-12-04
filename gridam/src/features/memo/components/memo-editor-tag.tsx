'use client'

import { useRef, type KeyboardEvent } from 'react'
import Button from '@/shared/ui/button'
import Input from '@/shared/ui/input'
import Label from '@/shared/ui/label'
import TagBadge from '@/shared/ui/tagbadge'

type MemoTagFieldProps = {
  tags: string[]
  onChange: (next: string[]) => void
}

export default function MemoTagField({ tags, onChange }: MemoTagFieldProps) {
  const tagInputRef = useRef<HTMLInputElement | null>(null)

  function addTag() {
    const raw = tagInputRef.current?.value
    if (!raw) return

    const parts = raw
      .split(',')
      .map((part) => part.trim())
      .filter((part) => part.length > 0)

    if (parts.length === 0) {
      if (tagInputRef.current) {
        tagInputRef.current.value = ''
      }
      return
    }

    const nextSet = new Set(tags)
    parts.forEach((tag) => nextSet.add(tag))

    onChange(Array.from(nextSet))

    if (tagInputRef.current) {
      tagInputRef.current.value = ''
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) return

    if (event.key === 'Enter') {
      event.preventDefault()
      addTag()
    }
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag))
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="tag-input">태그 입력</Label>

      <div className="flex gap-2" onKeyDown={handleKeyDown}>
        <Input id="tag-input" ref={tagInputRef} placeholder="예: 공부, 운동" className="flex-1" />
        <div onClick={addTag}>
          <Button type="button" label="추가" variant="roundedBasic" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <TagBadge key={tag}>
            <span>{tag}</span>

            <span
              className="ml-2 rounded-full px-1 text-[10px]"
              onClick={(e) => {
                e.stopPropagation()
                removeTag(tag)
              }}
            >
              x
            </span>
          </TagBadge>
        ))}
      </div>
    </div>
  )
}
