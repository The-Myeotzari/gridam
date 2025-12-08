'use client'

import { useEffect, useRef, useState } from 'react'

type Options = {
  minDuration?: number // 최소 노출 시간(ms)
}

/**
 * 연출용 로딩 훅 (업그레이드 버전)
 *
 * - 인자로는 "원본 로딩 상태"만 넘긴다: active = true/false
 * - 내부에서:
 *   - progress(0~100) 부드럽게 증가
 *   - 최소 노출시간(minDuration) 보장
 *   - 카드 open 여부까지 함께 관리
 *
 * 사용 예)
 *   const { open, progress } = useSmoothProgress(loading)
 *   <LoadingOverlay open={open} progress={progress} ... />
 */
export function useSmoothProgress(active: boolean, options: Options = {}) {
  const { minDuration = 700 } = options

  const [progress, setProgress] = useState(0)
  const [open, setOpen] = useState(false)
  const startTimeRef = useRef<number | null>(null)
  const intervalRef = useRef<number | null>(null)
  const timeoutRef = useRef<number | null>(null)

  // 공통 정리 함수
  const clearTimers = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  useEffect(() => {
    // active=true : 로딩 시작
    if (active) {
      clearTimers()

      startTimeRef.current = performance.now()
      setOpen(true) // 카드 열기
      setProgress(0)

      // 0.1초마다 10%씩 90까지 증가
      const id = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return 90
          return prev + 10
        })
      }, 100)
      intervalRef.current = id

      return () => {
        clearTimers()
      }
    }

    // active=false : 로딩 종료 요청
    if (!active) {
      // 로딩 한 번도 안 켜졌으면 무시
      if (!open) return

      clearTimers()

      const start = startTimeRef.current
      const elapsed = start ? performance.now() - start : 0
      const remain = Math.max(0, minDuration - elapsed)

      // 먼저 100%로 채우고,
      setProgress(100)

      // 최소 노출시간 + 0.7초 정도 더 보여준 뒤 닫기
      const id = window.setTimeout(() => {
        setOpen(false)
        setProgress(0)
        startTimeRef.current = null
      }, remain + 700)
      timeoutRef.current = id

      return () => {
        clearTimers()
      }
    }
  }, [active, minDuration, open])

  useEffect(() => {
    return () => {
      clearTimers()
    }
  }, [])

  return { open, progress }
}
