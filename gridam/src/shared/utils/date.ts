/**
 * - 주어진 날짜(문자열)를 한국어 로케일 형식(연/월/일/요일)으로 변환합니다.
 * - date가 없으면 오늘 날짜를 기준으로 포맷합니다.
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
 * - Date 객체를 ISO 문자열(UTC 기준)에서 "YYYY-MM-DD" 형태로 잘라 반환합니다.
 * - baseDate를 주입할 수 있어 테스트/재사용이 쉽습니다.
 * 주의) toISOString()은 UTC 기준이므로, 로컬 자정 근처에서는 날짜가 다르게 보일 수 있습니다.
 * @param baseDate
 * @returns "YYYY-MM-DD"
 */
export const getTodayISODate = (baseDate: Date = new Date()): string =>
  baseDate.toISOString().slice(0, 10)

/**
 * - created_at 같은 날짜 문자열을 "YYYY. M. D." 형태(ko-KR 기본)로 포맷합니다.
 * - ko-KR toLocaleDateString 결과에 붙는 공백을 제거(trim)합니다.
 * @param dateString Date 생성이 가능한 날짜 문자열
 * @returns 예) "2025. 12. 3."
 */
export function formatDotDateKR(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ko-KR').trim()
}

/**
 * - Date 객체를 "YYYY년 M월" 형식으로 변환합니다.
 * - getMonth()는 0~11을 반환하므로, 월 표시를 위해 +1 보정합니다.
 * @param date 포맷할 Date 객체
 * @returns 예) "2025년 12월"
 */
export function formatYearMonth(date: Date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월`
}

/**
 * - params에 값이 없으면 baseDate(기본: 오늘 날짜) 기준으로 year/month/day를 채웁니다.
 * - month는 Date.getMonth()가 0~11이므로, 반환값은 1~12 기준입니다.
 * - baseDate를 주입할 수 있어 테스트/재사용이 쉽습니다.
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

/**
 * - searchParams(DiarySearchParams)에서 year/month 값을 파싱해 최종 year/month(문자열)를 결정합니다.
 * - 유효한 값이 없으면 getDateParts를 통해 오늘 날짜 기준 year/month로 기본값을 채웁니다.
 * - 숫자 변환 결과가 NaN인 경우(undefined로 처리) 기본값으로 폴백합니다.
 * @param params year/month가 포함될 수 있는 검색 파라미터
 * @returns { year: string, month: string }
 */
type DiarySearchParams = {
  [key: string]: string | string[] | undefined
  year?: string
  month?: string
}
export const resolveYearMonth = (params: DiarySearchParams) => {
  const parsedYear =
    typeof params.year === 'string' && params.year.trim() !== '' ? Number(params.year) : undefined
  const parsedMonth =
    typeof params.month === 'string' && params.month.trim() !== ''
      ? Number(params.month)
      : undefined
  const { year, month } = getDateParts({
    year: Number.isFinite(parsedYear) ? parsedYear : undefined,
    month: Number.isFinite(parsedMonth) ? parsedMonth : undefined,
  })

  return { year: String(year), month: String(month) }
}

/**
 * - year/month 문자열을 숫자로 파싱해 최종 year/month(숫자)를 결정합니다.
 * - 유효하지 않으면(getDateParts) 오늘 날짜 기준 year/month로 폴백합니다.
 * @param year "2025" 같은 연도 문자열
 * @param month "12" 같은 월 문자열(1~12)
 * @returns { year: number, month: number }
 */
export const resolveYearMonthFromStrings = (year?: string, month?: string) => {
  const parsedYear = typeof year === 'string' && year.trim() !== '' ? Number(year) : undefined
  const parsedMonth = typeof month === 'string' && month.trim() !== '' ? Number(month) : undefined
  const { year: resolvedYear, month: resolvedMonth } = getDateParts({
    year: Number.isFinite(parsedYear) ? parsedYear : undefined,
    month: Number.isFinite(parsedMonth) ? parsedMonth : undefined,
  })
  return { year: resolvedYear, month: resolvedMonth }
}

/**
 * - 기준 year/month에서 monthOffset 만큼 이동한 연/월 정보를 반환합니다.
 * - 반환되는 date는 이동된 월의 1일입니다.
 * @param year 기준 연도
 * @param month 기준 월(1~12)
 * @param monthOffset 이동할 월 오프셋(예: -1, +1)
 */
type AdjacentMonthResult = {
  year: number
  month: number // 1~12
  date: Date // 해당 월의 1일
}
export function getAdjacentMonth(year: number, month: number, offset: number): AdjacentMonthResult {
  const base = new Date(year, month - 1, 1)
  const moved = new Date(base.getFullYear(), base.getMonth() + offset, 1)
  const { year: nextYear, month: nextMonth } = getDateParts(
    { year: moved.getFullYear(), month: moved.getMonth() + 1 },
    moved
  )
  return { year: nextYear, month: nextMonth, date: moved }
}
