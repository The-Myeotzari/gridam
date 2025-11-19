'use client'

import { useState } from 'react'
import Button from '@/shared/ui/button'
import { ModalHeader, ModalBody } from '@/shared/ui/modal/modal'
import { Diary } from '@/features/feed/types/feed'
import Textarea from '@/shared/ui/textarea'

type DiaryExportPreviewModalProps = {
  year: number
  month: number
  diaries: Diary[]
  onClose: () => void
}

export function DiaryExportPreviewModal({
  year,
  month,
  diaries,
  onClose,
}: DiaryExportPreviewModalProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  return (
    <>
      <ModalHeader
        align='horizontal'
        cardTitle={<span className='text-base sm:text-xl'>{year}년 {month}월 일기 미리보기</span>}
        cardDescription={<span className='text-sm sm:text-base'>PDF로 저장하기 전에 내용을 확인할 수 있어요.</span>}
      />
      <ModalBody className="max-w-3xl max-h-[70vh] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mt-2 border rounded-md p-3 bg-muted/30">
          {diaries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              이 달에는 작성된 일기가 없어요.
            </p>
          ) : (
            diaries.map((diary) => (
              <article
                key={diary.id}
                className="rounded-md bg-background p-3 border border-border space-y-2"
              >
                <header className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="font-medium">
                    {diary.date}
                  </span>
                </header>
                <Textarea value={diary.content}/>
              </article>
            ))
          )}
        </div>

        <div className="mt-3 flex justify-between items-center">
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            총 {diaries.length}개의 일기가 포함됩니다.
          </p>
          <div className="flex gap-2">
            <span onClick={onClose}>
              <Button
                variant='roundedRed'
                type="button"
                label='닫기'
              />
            </span>
            <span
              onClick={() => {}}>
              <Button
                type="button"
                variant='roundedBasic'
                label={isDownloading ? 'PDF 생성 중…' : 'PDF 다운로드'}
                disabled={isDownloading || diaries.length === 0}
              />
            </span>
          </div>
        </div>
      </ModalBody >
    </>
  )
}