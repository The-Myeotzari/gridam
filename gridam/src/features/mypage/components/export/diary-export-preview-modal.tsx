'use client'

import { useState } from 'react'
import Button from '@/shared/ui/button'
import { ModalHeader, ModalBody } from '@/shared/ui/modal/modal'
import { Diary } from '@/features/mypage/types/mypage'
import Textarea from '@/shared/ui/textarea'
import Image from 'next/image'
import { getFormatDate } from '@/shared/utils/get-format-date'
import { toast } from '@/store/toast-store'

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

  const handleDownload = async () => {
    try {
      setIsDownloading(true)

      const res = await fetch(
        `/apis/diaries/export?year=${year}&month=${month}`,
        { method: 'GET' },
      )

      if (!res.ok) {
        // TODO: 토스트 에러 처리
        toast.error('')
        return
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Diaries(${year}-${String(month).padStart(2, '0')}).pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      toast.success('성공')
    } catch (err) {
      const message = err instanceof Error ? err.message : '예상치 못한 오류가 발생했습니다'
      toast.error(message)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <>
      <ModalHeader
        align='horizontal'
        cardTitle={<span className='text-base sm:text-xl'>{year}년 {month}월 일기 미리보기</span>}
        cardDescription={<span className='text-sm sm:text-base'>PDF로 저장하기 전에 내용을 확인할 수 있어요.</span>}
      />
      <ModalBody className="max-w-3xl max-h-[70vh] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mt-2 rounded-md p-2">
          {
            diaries.map((diary) => {
              const formattedDate = getFormatDate(diary.date)
              return (
                <article
                  key={diary.id}
                  className="rounded-md bg-white p-3 border border-border space-y-2"
                >
                  <header className="flex justify-between items-center text-xs sm:text-sm">
                    <span className='text-base sm:text-lg'>{formattedDate}</span>
                    {diary.emoji && <Image src={diary.emoji} alt='날씨' width={40} height={40} />}
                  </header>
                  <section className='bg-white border'>
                    {diary.image_url && <Image src={diary.image_url} alt='그림' width={40} height={40} className='w-full' />}
                  </section>
                  <section>
                    <Textarea value={diary.content} />
                  </section>
                </article>
              )
            })
          }
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
              onClick={handleDownload}
              className={isDownloading ? 'pointer-events-none opacity-50' : ''}
            >
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