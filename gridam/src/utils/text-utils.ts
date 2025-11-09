// 개행·탭 문자를 공백으로 치환 (한 줄 입력 전용)
export const sanitize = (s: string) => s.replace(/[\r\n\t]+/g, ' ')

// 문자열을 그래핌(조합문자 포함) 단위로 분리, Intl.Segmenter 미지원 시 Array.from() 사용
export function splitGraphemes(input: string): string[] {
  type SegCtor = new (
    l?: string,
    o?: { granularity?: 'grapheme' }
  ) => { segment(s: string): Iterable<{ segment: string }> }

  const Seg = (Intl as unknown as { Segmenter?: SegCtor }).Segmenter
  if (typeof Intl !== 'undefined' && Seg) {
    const seg = new Seg('ko', { granularity: 'grapheme' })
    const out: string[] = []
    for (const s of seg.segment(input)) out.push(s.segment)
    return out
  }
  return Array.from(input)
}

// 텍스트를 그래핌 기준 max 길이로 잘라냄
export const clamp = (text: string, max: number) => {
  const g = splitGraphemes(text)
  return g.length <= max ? text : g.slice(0, max).join('')
}

// graphemeFromUtf16Index() UTF-16 인덱스를 그래핌 인덱스로 변환 caret 위치 계산용
export const graphemeFromUtf16Index = (g: string[], utf16: number) => {
  let acc = 0
  for (let i = 0; i < g.length; i++) {
    acc += g[i].length
    if (utf16 <= acc) return i + 1
  }
  return g.length
}
