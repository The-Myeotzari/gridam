'use client'

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from '@/shared/ui/card'
import { Label } from '@/shared/ui/label'
import cn from '@/shared/utils/cn'
import { ChevronLeft, ChevronRight, FileDown, RefreshCcw } from 'lucide-react'
import ClientButton from '@/shared/ui/client-button'

interface DiaryExportCardProps {
  year: number
  month: number
  diaryCount: number
  isLoading?: boolean
  isError?: boolean
  onPrevYear?: () => void
  onNextYear?: () => void
  onSelectMonth?: (month: number) => void
  onPreview?: () => void
  onRetry?: () => void
}

interface ErrorBannerProps {
  onRetry?: () => void
}

const MONTH_LABELS: string[] = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

function renderFooterText(params: {
  isLoading: boolean
  isError: boolean
  hasDiaries: boolean
  year: number
  month: number
  diaryCount: number
}) {
  const { isLoading, isError, hasDiaries, year, month, diaryCount } = params

  if (isLoading) {
    return <>선택한 기간의 일기를 불러오는 중입니다…</>
  }

  if (isError) {
    return <>월별 일기를 다시 불러온 뒤 PDF를 미리보기 할 수 있어요.</>
  }

  if (hasDiaries) {
    return (
      <>
        {year}년 {month}월에 작성된 일기{' '}
        <span className="font-medium">{diaryCount}개</span>가 PDF에 포함됩니다.
      </>
    )
  }

  return (
    <>
      {year}년 {month}월에는 작성된 일기가 없어요.
    </>
  )
}

function DiaryExportErrorBanner({ onRetry }: ErrorBannerProps) {

  return (
    <div className="mt-3 flex items-center justify-between rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2">
      <p className="text-[11px] sm:text-xs text-destructive">
        월별 일기를 불러오는 중 오류가 발생했어요. 다시 시도해 주세요.
      </p>
      {onRetry && (
        <ClientButton
          type="button"
          label={
            <div className="flex items-center gap-1">
              <RefreshCcw className="w-3 h-3" />
              <span className="text-[11px] sm:text-xs font-medium">다시 시도</span>
            </div>
          }
          onClick={onRetry}
          variant="basic"
          className="h-7 px-2"
        />
      )}
    </div>
  )
}

export default function DiaryExportCard({
  year,
  month,
  diaryCount,
  isLoading = false,
  isError = false,
  onPrevYear,
  onNextYear,
  onSelectMonth,
  onPreview,
  onRetry,
}: DiaryExportCardProps) {
  const hasDiaries = diaryCount > 0
  const exportDisabled = !hasDiaries || isLoading || isError

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
                  <ClientButton
                    key={value}
                    onClick={() => onSelectMonth?.(value)}
                    type="button"
                    className={cn(
                      'h-8 sm:h-9 rounded-md border text-xs sm:text-sm transition-colors',
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground shadow-sm hover:bg-primary'
                        : 'border-border bg-background text-foreground hover:bg-muted',
                      !onSelectMonth && 'cursor-default hover:bg-background',
                    )}
                    disabled={!onSelectMonth}
                    aria-pressed={isSelected}
                    label={label}
                  />
                )
              })}
            </div>

            <p className="mt-4 text-[11px] sm:text-xs text-muted-foreground">
              연도를 바꾸고, 내보낼 달을 선택해 주세요.
            </p>

            {isError && <DiaryExportErrorBanner onRetry={onRetry} />}
          </div>
        </section>
      </CardBody>

      <CardFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="w-full text-[11px] sm:text-xs text-muted-foreground">
          {renderFooterText({ isLoading, isError, hasDiaries, year, month, diaryCount })}
        </p>
        <ClientButton
          type="button"
          className={`h-9 sm:h-10 w-full sm:w-auto px-4 ${exportDisabled && 'pointer-events-none opacity-50'}`}
          disabled={exportDisabled}
          label={isLoading ? '불러오는 중…' : 'PDF 미리보기'}
          onClick={onPreview}
        />
      </CardFooter>
    </Card>
  )
}