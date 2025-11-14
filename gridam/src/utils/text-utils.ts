// 개행·탭 문자를 공백으로 치환 (한 줄 입력 전용)
export const sanitize = (text: string) => text.replace(/[\r\n\t]+/g, ' ')

// 문자열을 그래핌(조합문자 포함) 단위로 분리, Intl.Segmenter 미지원 시 Array.from() 사용
export function splitGraphemes(input: string): string[] {
  if (typeof Intl?.Segmenter !== 'undefined') {
    const segmenter = new Intl.Segmenter('ko', { granularity: 'grapheme' })
    return Array.from(segmenter.segment(input), (item) => item.segment)
  }
  return Array.from(input)
}

// 텍스트를 그래핌 기준 max 길이로 잘라냄
export const clamp = (text: string, maxLength: number) => {
  const graphemes = splitGraphemes(text)
  return graphemes.length <= maxLength ? text : graphemes.slice(0, maxLength).join('')
}

// graphemeFromUtf16Index() UTF-16 인덱스를 그래핌 인덱스로 변환 caret 위치 계산용
export function graphemeFromUtf16Index(graphemes: string[], utf16Index: number) {
  let accumulatedLength = 0
  for (let i = 0; i < graphemes.length; i++) {
    accumulatedLength += graphemes[i].length
    if (utf16Index <= accumulatedLength) return i + 1
  }
  return graphemes.length
}
