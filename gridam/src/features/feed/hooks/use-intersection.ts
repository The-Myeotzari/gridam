import { useEffect, useRef } from 'react'

type Options = {
  rootMargin?: string
  threshold?: number
}

// infinite cursor 관찰 전용
export function useIntersection(
  onIntersect: () => void,
  options?: Options // IntersectionObserver init setting
) {
  const ref = useRef<HTMLDivElement | null>(null)

  const optionsRef = useRef<Options>({
    rootMargin: '600px 0px',
    threshold: 0.01,
    ...options,
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver((entries) => {
      // 관찰 대상이 현재 뷰포트 안에 들어오면, fetchNextPage()(=onIntersect) 호출
      if (entries.some((e) => e.isIntersecting)) onIntersect()
    }, optionsRef.current)

    io.observe(el)
    return () => io.disconnect()
  }, [onIntersect])

  return ref
}
