/**
 * getFormatDate
 * - 주어진 날짜(문자열)를 한국어 로케일 형식(연/월/일/요일)으로 변환합니다.
 * - date가 없으면 오늘 날짜를 기준으로 포맷합니다.
 *
 * @param date ISO 문자열 등 Date 생성이 가능한 날짜 문자열
 * @returns 예) "2025년 12월 3일 수요일"
 */
export function getFormatDate(date?: string) {
  const target = date ? new Date(date) : new Date()

  return target.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
}

/**
 * getTodayISODate
 * - Date 객체를 ISO 문자열(UTC 기준)에서 "YYYY-MM-DD" 형태로 잘라 반환합니다.
 * - baseDate를 주입할 수 있어 테스트/재사용이 쉽습니다.
 *
 * 주의) toISOString()은 UTC 기준이므로, 로컬 자정 근처에서는 날짜가 다르게 보일 수 있습니다.
 *
 * @param baseDate
 * @returns "YYYY-MM-DD"
 */
export const getTodayISODate = (baseDate: Date = new Date()): string =>
  baseDate.toISOString().slice(0, 10)

/**
 * getDateParts
 * - params에 값이 없으면 baseDate(기본: 오늘 날짜) 기준으로 year/month/day를 채웁니다.
 * - month는 Date.getMonth()가 0~11이므로, 반환값은 1~12 기준입니다.
 * - baseDate를 주입할 수 있어 테스트/재사용이 쉽습니다.
 *
 * @param params 부분적으로 전달할 날짜 값({ year, month, day })
 * @param baseDate 기본값: new Date()
 * @returns { year, month, day }
 */
type DatePartsParams = {
  year?: number
  month?: number // 1~12
  day?: number
}
type DateParts = {
  year: number
  month: number
  day: number
}
export function getDateParts(params: DatePartsParams = {}, baseDate: Date = new Date()): DateParts {
  return {
    year: params.year ?? baseDate.getFullYear(),
    month: params.month ?? baseDate.getMonth() + 1,
    day: params.day ?? baseDate.getDate(),
  }
}
