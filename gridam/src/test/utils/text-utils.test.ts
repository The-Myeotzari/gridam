import { clamp, graphemeFromUtf16Index, sanitize, splitGraphemes } from '@/utils/text-utils'

describe('sanitize', () => {
  test('replaces CR/LF/TAB with single spaces and collapses runs', () => {
    const input = 'a\tb\rc\nd\t\te'
    expect(sanitize(input)).toBe('a b c d e')
  })
})

describe('splitGraphemes (with Intl.Segmenter if available)', () => {
  const hasSegmenter = typeof Intl !== 'undefined' && (Intl as any).Segmenter !== undefined

  test('splits simple Korean text by grapheme', () => {
    const input = '안녕하세요'
    const out = splitGraphemes(input)
    expect(out).toEqual(['안', '녕', '하', '세', '요'])
  })

  test('treats emoji with skin tone modifier as one grapheme if Segmenter exists', () => {
    const emoji = '👍🏽' // U+1F44D + U+1F3FD
    const out = splitGraphemes(emoji)
    if (hasSegmenter) {
      expect(out.length).toBe(1)
      expect(out[0]).toBe(emoji)
    } else {
      // Fallback: Array.from splits by code point
      // 👍 (2 UTF-16 units) + 🏽 (2 units) → 2 code points
      expect(out.length).toBe(2)
    }
  })

  test('ZWJ sequence should be one grapheme with Segmenter', () => {
    const family = '👨‍👩‍👧‍👦' // family emoji using ZWJ
    const out = splitGraphemes(family)
    if (hasSegmenter) {
      expect(out).toEqual([family])
    } else {
      // Fallback: Array.from splits by code points (will be >1)
      expect(out.length).toBeGreaterThan(1)
    }
  })
})

describe('splitGraphemes (forced fallback when Intl.Segmenter is unavailable)', () => {
  const originalSegmenter = (Intl as any).Segmenter

  beforeAll(() => {
    // Force fallback path
    ;(Intl as any).Segmenter = undefined
  })

  afterAll(() => {
    ;(Intl as any).Segmenter = originalSegmenter
  })

  test('Array.from fallback splits emoji+modifier into 2 code points', () => {
    const emoji = '👍🏽'
    const out = splitGraphemes(emoji)
    expect(out.length).toBe(2)
    expect(out.join('')).toBe(emoji)
  })
})

describe('clamp', () => {
  test('clamps by grapheme count (Korean)', () => {
    const input = '안녕하세요'
    expect(clamp(input, 3)).toBe('안녕하')
    expect(clamp(input, 5)).toBe('안녕하세요')
    expect(clamp(input, 6)).toBe('안녕하세요')
  })

  test('grapheme-aware with complex emoji', () => {
    const family = '👨‍👩‍👧‍👦'
    // Regardless of UTF-16 length, grapheme count is 1 (with Segmenter)
    const out = clamp(family + '!!', 1)
    // If no Segmenter, fallback may slice by code point and return partial,
    // but our clamp uses splitGraphemes so this asserts behavior accordingly.
    const parts = splitGraphemes(family + '!!')
    const expected = parts.slice(0, 1).join('')
    expect(out).toBe(expected)
  })
})

describe('graphemeFromUtf16Index', () => {
  test('maps UTF-16 caret to grapheme index with multi-unit grapheme', () => {
    const text = 'A👍🏽B'
    const g = splitGraphemes(text)
    // Sanity: expected graphemes are ["A", "👍🏽", "B"] if Segmenter exists.
    // In fallback they may be more, so compute lengths directly.
    const lens = g.map((x) => x.length) // UTF-16 code unit lengths per grapheme
    const total = lens.reduce((a, b) => a + b, 0)
    expect(total).toBe(text.length)

    // Build cumulative sums to know the boundary
    const boundaries: number[] = []
    let acc = 0
    for (const L of lens) {
      acc += L
      boundaries.push(acc)
    }

    // Check several UTF-16 positions (1-based as function expects <= acc)
    // 1) After 'A'
    expect(graphemeFromUtf16Index(g, 1)).toBe(1)

    // 2) Inside the emoji cluster region → should map to index of that grapheme
    const afterA = boundaries[0] // end of first grapheme
    const insideEmoji = Math.min(afterA + 1, total) // somewhere within
    const idxInsideEmoji = graphemeFromUtf16Index(g, insideEmoji)
    // Must be at least the second grapheme (or later in fallback)
    expect(idxInsideEmoji).toBeGreaterThanOrEqual(2)

    // 3) At end of string → last grapheme index
    expect(graphemeFromUtf16Index(g, total)).toBe(g.length)
  })

  test('clamps beyond end to last grapheme', () => {
    const g = ['안', '녕', '하']
    // utf16 index far beyond length (e.g., 999) → returns g.length
    expect(graphemeFromUtf16Index(g, 999)).toBe(3)
  })
})
