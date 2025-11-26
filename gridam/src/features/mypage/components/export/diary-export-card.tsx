'use client'

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from '@/shared/ui/card'
import Button from '@/shared/ui/button'
import { Label } from '@/shared/ui/label'
import cn from '@/shared/utils/cn'
import { ChevronLeft, ChevronRight, FileDown } from 'lucide-react'

type DiaryExportCardProps = {
  year: number
  month: number // 1 ~ 12
  diaryCount: number
  isLoading?: boolean
  onPrevYear?: () => void
  onNextYear?: () => void
  onSelectMonth?: (month: number) => void
  onPreview?: () => void
}

const MONTH_LABELS: string[] = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

export default function DiaryExportCard({
  year,
  month,
  diaryCount,
  isLoading = false,
  onPrevYear,
  onNextYear,
  onSelectMonth,
  onPreview,
}: DiaryExportCardProps) {
  const hasDiaries = diaryCount > 0
  const exportDisabled = !hasDiaries || isLoading

  return (
    <Card className="w-full">
      <CardHeader
        cardImage={<FileDown />}
        cardTitle={<span className='text-lg sm:text-xl text-center'>월별 일기 내보내기</span>}
        cardDescription={<span className='text-sm'>선택한 달의 일기를 한 번에 PDF로 저장할 수 있어요.</span>}
      />

      <CardBody className="space-y-3 sm:space-y-4">
        {/* 연/월 선택 영역 */}
        <section className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label className="text-xs sm:text-sm text-muted-foreground">
              내보낼 기간
            </Label>

            {/* 연도 선택 바 */}
            <div className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2.5 py-1">
              <button
                type="button"
                onClick={onPrevYear}
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs text-muted-foreground transition-colors',
                  onPrevYear && 'hover:bg-muted',
                  !onPrevYear && 'opacity-40 cursor-default',
                )}
                disabled={!onPrevYear}
                aria-label="이전 연도"
              >
                <ChevronLeft className='size-4' />
              </button>
              <span className="px-1 text-xs sm:text-sm font-medium">
                {year}년
              </span>
              <button
                type="button"
                onClick={onNextYear}
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs text-muted-foreground transition-colors',
                  onNextYear && 'hover:bg-muted',
                  !onNextYear && 'opacity-40 cursor-default',
                )}
                disabled={!onNextYear}
                aria-label="다음 연도"
              >
                <ChevronRight className='size-4' />
              </button>
            </div>
          </div>

          {/* 월 그리드 */}
          <div className="rounded-lg border border-border bg-muted/30 p-2 sm:p-3">
            <div className="grid grid-cols-4 gap-2">
              {MONTH_LABELS.map((label, index) => {
                const value = index + 1
                const isSelected = value === month

                return (
                  <span
                    key={value}
                    onClick={() => onSelectMonth?.(value)}
                    className={cn(
                      'h-8 sm:h-9 rounded-md border text-xs sm:text-sm transition-colors',
                    )}
                  >
                    <Button
                      type="button"
                      className={cn(
                        'w-full',
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground shadow-sm hover:bg-primary' 
                          : 'border-border bg-background text-foreground hover:bg-muted',
                        !onSelectMonth && 'cursor-default hover:bg-background',
                      )}
                      disabled={!onSelectMonth}
                      aria-pressed={isSelected}
                      label={label}
                    />
                  </span>
                )
              })}
            </div>

            <p className="mt-4 text-[11px] sm:text-xs text-muted-foreground">
              연도를 바꾸고, 내보낼 달을 선택해 주세요.
            </p>
          </div>
        </section>
      </CardBody>

      <CardFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="w-full text-[11px] sm:text-xs text-muted-foreground">
          {hasDiaries ? (
            <>
              {year}년 {month}월에 작성된 일기{' '}
              <span className="font-medium">{diaryCount}개</span>가 PDF에 포함됩니다.
            </>
          ) : (
            <>
              {year}년 {month}월에는 작성된 일기가 없어요.
            </>
          )}
        </p>
        <span onClick={onPreview} className={exportDisabled ? 'pointer-events-none opacity-50' : ''}>
          <Button
            type="button"
            className="h-9 sm:h-10 w-full sm:w-auto px-4"
            disabled={exportDisabled}
            label={isLoading ? '불러오는 중…' : 'PDF 미리보기'}
          />
        </span>
      </CardFooter>
    </Card>
  )
}