// NOTE: 파일명 date.ts로 수정후 날짜 포맷 종류별로 배치 필요
export function getFormatDate(date?: string) {
  const target = date ? new Date(date) : new Date()

  return target.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
}
