import { useEffect, useRef } from 'react'

// infinite cursor 관찰 전용
export function useIntersection(
  onIntersect: () => void,
  options?: { rootMargin: '600px 0px'; threshold: 0.01 } // IntersectionObserver init setting
) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver((entries) => {
      // 관찰 대상이 현재 뷰포트 안에 들어오면, fetchNextPage()(=onIntersect) 호출
      if (entries.some((e) => e.isIntersecting)) onIntersect()
    }, options)

    io.observe(el)
    return () => io.disconnect()
  }, [onIntersect])

  return ref
}
