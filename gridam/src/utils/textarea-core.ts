// 입력값을 정규화하고, 그래핌 단위로 셀(격자) 데이터를 생성하는 유틸

import { clamp, sanitize, splitGraphemes } from '@/utils/text-utils'

// 원시 문자열을 정제(sanitize)하고 최대 길이(max)만큼 잘라 정규화
export function normalizeValue(raw: string, max: number) {
  return clamp(sanitize(raw ?? ''), max)
}

// 최대 글자 수(max)와 열 개수(cols)로 필요한 행(row) 수 계산
export function computeRows(max: number, cols: number) {
  return Math.ceil(max / cols)
}

// 현재 입력(view)을 그래핌 단위로 나누고, 원고지 셀 배열(cells)로 변환
// - filled: 실제 문자 셀
// - blanks: 남은 칸을 빈 문자열로 채움
export function buildCells(view: string, max: number, cols: number) {
  const graphemes = splitGraphemes(view) // 문자열을 그래핌 단위 배열로 분리
  const totalRows = computeRows(max, cols) // 총 행 수 계산
  const totalCells = totalRows * cols // 전체 셀 수 계산

  const filled = graphemes.slice(0, totalCells) // 실제 입력된 문자
  const blanks = Math.max(0, totalCells - filled.length) // 부족한 셀 개수 계산
  const cells = [...filled, ...Array.from({ length: blanks }, () => '')] // 셀 배열 완성

  return { graphemes, totalRows, cells }
}
